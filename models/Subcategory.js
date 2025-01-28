const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Makes the name field mandatory
            trim: true, // Trims whitespace from the input
        },
        picture: {
            type: String, // URL or path to the Subcategory image
            required: true, // Optional field
        },
        status: {
            type: Boolean,
            default: true, // Default status is active
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',  // Reference to Category collection
            required: true
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Create and export Subcategory model
const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
module.exports = Subcategory;
