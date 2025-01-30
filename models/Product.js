const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Makes the name field mandatory
            trim: true, // Trims whitespace from the input
        },
        price: {
            type: Number,
            required: true
        },
        picture: {
            type: String, // URL or path to the Product image
            required: true, // Optional field
        },
        description: {
            type: String,
            required: false,
            trim: true, // Trims whitespace from the input
        },
        status: {
            type: Boolean,
            default: true, // Default status is active
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: true
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor', // Reference the Vendors model
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create and export Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
