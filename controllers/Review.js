const Review = require('../models/Review');
const multer = require('multer');


// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});


const ReviewController = {
    //create Review 
    async createReview(req, res) {
        const userId = req.user.id; // Extract authenticated user ID

        try {
            const { title, rating, comment, product_id } = req.body;

            // Validate required fields
            if (!title || !rating || !comment || !product_id) {
                return res.status(400).json({ success: false, message: 'All required fields must be filled' });
            }

            // // Validate picture
            // if (!req.file) {
            //     return res.status(400).json({ success: false, message: 'Product picture is required' });
            // }

            // Optional image
            const picture = req.file ? req.file.filename : null;
            const newReview = new Review({
                title,
                rating,
                comment,
                product: product_id,
                picture,
                user_id: userId,
            });

            await newReview.save();
            return res.status(201).json({ success: true, message: 'Review created successfully', data: newReview });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
       #swagger.tags = ['Review']
      */
    },

    // Get All Review API
    async GetReviews(req, res) {
        const userId = req.user.id;  // Extract user ID
        const userRole = req.user.role;  // Extract role
        try {
            let reviews;
            if (userRole === 'Superadmin') {
                reviews = await Review.find().populate('product'); // Superadmin sees all reviews
            } else if (userRole === 'Vendor') {
                reviews = await Review.find().populate('product');
                // Filter reviews where the product's vendorId matches the userId
                reviews = reviews.filter(review => review.product?.vendorId?.toString() === userId);
            } else if (userRole === 'User') {
                reviews = await Review.find({ user_id: userId }).populate('product');
            } else {
                return res.status(403).json({ success: false, message: 'Access Denied' });
            }

            return res.status(200).json({ success: true, data: reviews });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
        #swagger.tags = ['Review']
        */
    },

    //  Delete a Review (Only by the user who wrote it)
    async DeleteReview(req, res) {
        const userId = req.user.id;
        try {
            const { review_id } = req.params;

            // Validate review_id
            if (!review_id) {
                return res.status(400).json({ success: false, message: "Review ID is required" });
            }

            // Check if the review exists and belongs to the user
            const review = await Review.findOne({ _id: review_id, user_id: userId });

            if (!review) {
                return res.status(404).json({ success: false, message: "Review not found!" });
            }

            // Delete the review
            await Review.deleteOne({ _id: review_id });

            return res.status(200).json({ success: true, message: "Review deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
       #swagger.tags = ['Review']
       */
    },

    // Get Review by ID
    async GetReviewById(req, res) {
        try {
            const { review_id } = req.params;

            if (!review_id) {
                return res.status(400).json({ success: false, message: "Review ID is required" });
            }

            // Find the review by ID and populate the product details
            const review = await Review.findById(review_id).populate('product');

            if (!review) {
                return res.status(404).json({ success: false, message: "Review not found" });
            }

            return res.status(200).json({ success: true, data: review });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
       #swagger.tags = ['Review']
    */
    }




};

module.exports = {
    createReview: ReviewController.createReview,
    GetReviews: ReviewController.GetReviews,
    DeleteReview: ReviewController.DeleteReview,
    GetReviewById: ReviewController.GetReviewById,
    upload,
};