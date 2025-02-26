// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: false
            },
            totalPrice: {
                type: Number,
                required: false
            }
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
