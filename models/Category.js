const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Makes the name field mandatory
            trim: true, // Trims whitespace from the input
        },
        picture: {
            type: String, // URL or path to the category image
            required: true, // Optional field
        },
        status: {
            type: Boolean,
            default: true, // Default status is active
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Vendor model
            ref: 'Vendor',
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create and export Category model
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
