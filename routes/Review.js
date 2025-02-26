const express = require('express');
const { createReview, GetReviews, DeleteReview, GetReviewById, upload } = require('../controllers/Review');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (product)
router.post('/createReview', verifyToken, Authentication, upload.single('picture'), createReview); //createReview
router.get('/getReview', verifyToken, Authentication, GetReviews); //GetReviews
router.delete('/removeReview/:review_id', verifyToken, Authentication, DeleteReview); //DeleteReview
router.get('/getReviewById/:review_id', verifyToken, Authentication, GetReviewById); //GetReviewById


module.exports = router;