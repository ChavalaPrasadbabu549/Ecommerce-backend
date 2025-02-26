const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cart: {
            type: Object,
            // ref: 'Cart',
            required: true
        },
        address: {
            type: Object,
            // ref: 'Address', // Reference to Address model
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'delivered', 'cancelled', 'paid'],
            default: 'pending'
        },
        razorpay_order_id: {
            type: String
        },
        razorpay_payment_id: {
            type: String
        },
        razorpay_signature: {
            type: String
        },
        payment_status: {
            type: String,
            enum: ['pending', 'successful', 'failed'],
            default: 'pending'
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

// Create and export Order model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
