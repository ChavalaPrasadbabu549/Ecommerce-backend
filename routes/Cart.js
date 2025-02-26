const express = require('express');
const { addToCart, getCartDetails, updateItemQuantity, removeFromCart, getCartById } = require('../controllers/Cart');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (addToCart)
router.post('/addtocart', verifyToken, Authentication, addToCart); //createProduct
router.get('/getcartdetails', verifyToken, Authentication, getCartDetails); //getCartDetails
router.put('/updateItemQuantity', verifyToken, Authentication, updateItemQuantity); //updateItemQuantity
router.delete('/removeFromCart', verifyToken, Authentication, removeFromCart); //removeFromCart
router.get('/getcartById/:cart_id', verifyToken, Authentication, getCartById); //getCartById


module.exports = router;