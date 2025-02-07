const express = require('express');
const { createOrder, verifyPayment, getOrders } = require('../controllers/Order');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (Order)
router.post('/createOrder', verifyToken, Authentication, createOrder); //createOrder
router.post('/verifyPayment', verifyToken, Authentication, verifyPayment); //verifyPayment
router.get('/getOrders', verifyToken, Authentication, getOrders); //getOrders

module.exports = router;