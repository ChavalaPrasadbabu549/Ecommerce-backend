const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide review title"],
            maxlength: 100,
        },
        rating: {
            type: String,
            min: 1,
            max: 5,
            required: [true, "Please provide rating"],
        },
        picture: {
            type: String, // URL or path to the Product image
            required: false, // Optional field
        },
        comment: {
            type: String,
            required: [false, "Please provide review text"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to Product
            ref: 'Product',
            required: true,
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;