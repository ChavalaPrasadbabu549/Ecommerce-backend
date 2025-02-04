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
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
