const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Address = require('../models/Address');
const Cart = require('../models/Cart');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


const OrderController = {
    async createOrder(req, res) {
        const { cart_id, address_id } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        try {
            // Validate user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Only users can create orders
            if (userRole !== 'User') {
                return res.status(403).json({ success: false, message: 'Only users can create orders' });
            }

            // Validate cart
            const cart = await Cart.findById(cart_id);
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty or invalid' });
            }

            // Validate address
            const address = await Address.findById(address_id);
            if (!address) {
                return res.status(400).json({ success: false, message: 'Address not found' });
            }

            // Calculate total amount
            const totalAmount = cart.items.reduce((total, item) => {
                return total + (Number(item.amount) * Number(item.quantity));
            }, 0);

            // Create Razorpay Order
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert to paise
                currency: "INR",
                receipt: `order_rcptid_${Date.now()}`,
                payment_capture: 1 // Auto-capture payment
            });
            user.password = null;
            // Store the full cart & address details in the order
            const order = new Order({
                user: user,
                razorpay_order_id: razorpayOrder.id,
                status: "pending",
                payment_status: "pending",
                cart: cart,
                address: address
            });
            await order.save();

            // Return order details
            return res.status(200).json({
                success: true,
                message: "Razorpay order created",
                razorpay_order_id: razorpayOrder.id,
                amount: totalAmount
            });
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        /**
       #swagger.tags = ['Order']
       */
    },


    async verifyPayment(req, res) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        try {
            // Validate Razorpay signature
            const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");

            if (generatedSignature !== razorpay_signature) {
                return res.status(400).json({ success: false, message: "Invalid payment signature" });
            }

            // Retrieve stored order details
            const order = await Order.findOne({ razorpay_order_id });
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Update order status
            order.status = "paid";
            order.payment_status = "successful";
            order.razorpay_payment_id = razorpay_payment_id;
            order.razorpay_signature = razorpay_signature;
            await order.save();

            // Empty the user's cart after successful payment
            const cart = await Cart.findOne({ user_id: order.user });
            if (cart) {
                cart.items = [];
                await cart.save();
            }

            return res.status(201).json({ success: true, message: `Thank you, ${req.user.name}! Your order has been successfully placed.`, data: order });
        } catch (error) {
            console.error('Error verifying payment:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        /**
       #swagger.tags = ['Order']
       */
    },

    // Fetch Orders for a User
    async getOrders(req, res) {
        const userId = req.user.id; // Authenticated user ID
        const userRole = req.user.role; // Role of the authenticated user
        console.log(userRole)

        try {
            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            let orders = [];
            if (userRole === "Superadmin") {
                // Superadmin: Fetch all orders
                orders = await Order.find()
                    .populate("user", "name")
                    .populate("cart.items.product_id")
            } else {
                // Normal User: Fetch only their own orders
                orders = await Order.find({ user: userId })
            }
            // If no orders found
            if (orders.length === 0) {
                return res.status(404).json({ success: false, message: 'No orders found' });
            }

            // Return the list of orders
            return res.status(200).json({ success: true, orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        /**
        #swagger.tags = ['Order']
        */
    },
};

module.exports = OrderController;
