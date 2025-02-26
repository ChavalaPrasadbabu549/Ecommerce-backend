// CartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Assuming you have a Product model
// const Vendor = require('../models/Vendor');

const CartController = {

    async addToCart(req, res) {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // Extract authenticated user ID (from token or middleware)

        try {
            // Validate input
            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ success: false, message: 'User ID, Product ID, and valid quantity are required', });
            }

            // Check if the product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Check if the vendor exists
            // const vendor = await Vendor.findById(vendorId);
            // if (!vendor) {
            //     return res.status(404).json({ success: false, message: 'vendor not found' });
            // }

            // console.log(product)

            // Calculate total price based on quantity
            const itemPrice = Number(product?.price);
            const totalPrice = itemPrice * quantity;

            // Find or create a cart for the user
            let cart = await Cart.findOne({ user_id: userId });
            if (!cart) {
                cart = new Cart({ user_id: userId, items: [] });
            }

            // Check if the product already exists in the cart
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingItemIndex >= 0) {
                // Update quantity and total price if product already exists in the cart
                cart.items[existingItemIndex].quantity += Number(quantity);
                cart.items[existingItemIndex].totalPrice += totalPrice;
            } else {
                // Add new product to the cart
                cart.items.push({
                    product: product,
                    quantity,
                    amount: itemPrice,
                    totalPrice,
                });
            }

            // Save the cart
            await cart.save();

            return res.status(200).json({ success: true, message: 'Item added to cart successfully', data: cart });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Cart']
        */
    },

    async getCartDetails(req, res) {
        try {
            const userId = req.user.id; // Extract authenticated user ID (from token or middleware)
            const cart = await Cart.findOne({ user_id: userId })
                .populate('items.product_id', 'name description price picture');

            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }

            return res.status(200).json({ success: true, message: 'Cart details retrieved successfully', data: cart });
        } catch (error) {
            console.error("Error fetching cart details:", error);
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Cart']
         */
    },

    // Update quantity of an item in the cart
    async updateItemQuantity(req, res) {
        try {

            const userId = req.user.id; // Extract authenticated user ID (from token or middleware)
            const { productId, quantity, } = req.query;

            // Validate required fields
            if (!productId || !quantity) {
                return res.status(400).json({ success: false, message: 'Customer ID and Quantity are required' });
            }

            // Ensure the quantity is a positive number
            if (quantity <= 0) {
                return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
            }

            // Find the customer's cart
            let cart = await Cart.findOne({ user_id: userId });

            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }

            // Find the item in the cart by matching itemId
            const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === productId);

            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: 'Item not found in the cart' });
            }

            // Update the quantity of the found item
            cart.items[itemIndex].quantity += Number(quantity);

            // Save the updated cart
            await cart.save();

            return res.status(200).json({ success: true, message: 'Item quantity updated successfully', data: cart });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Cart']
        */
    },

    // Remove an item from the cart
    async removeFromCart(req, res) {
        try {
            const userId = req.user.id; // Extract authenticated user ID (from token or middleware)
            const { productId } = req.query;

            // Validate required fields
            if (!productId) {
                return res.status(400).json({ success: false, message: "Product ID is required" });
            }

            // Find the user's cart
            let cart = await Cart.findOne({ user_id: userId });

            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found" });
            }

            // Check if the product exists in the cart
            const itemIndex = cart.items.findIndex(item => item.product_id.toString() === productId);

            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: "Product not found in the cart" });
            }

            // Remove the item from the cart
            cart.items.splice(itemIndex, 1);

            // Save the updated cart
            await cart.save();

            return res.status(200).json({ success: true, message: "Product removed from cart successfully", data: cart });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
        #swagger.tags = ['Cart']
        */
    },

    // Get Cart by ID
    async getCartById(req, res) {
        const userId = req.user.id; // Get logged-in user ID
        try {
            const { cart_id } = req.params; // Get cart ID from URL params

            // Find Cart by ID and ensure it belongs to the user
            const cart = await Cart.findOne({ _id: cart_id, user: userId });

            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found" });
            }

            return res.status(200).json({ success: true, message: "Cart retrieved successfully", data: cart });

        } catch (error) {
            console.error("Error fetching cart:", error);
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }

        /**
        #swagger.tags = ['Cart']
        */
    }

}


module.exports = {
    addToCart: CartController.addToCart,
    getCartDetails: CartController.getCartDetails,
    updateItemQuantity: CartController.updateItemQuantity,
    removeFromCart: CartController.removeFromCart,
    getCartById: CartController.getCartById,
}