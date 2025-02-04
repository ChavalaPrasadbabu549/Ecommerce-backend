const express = require('express');
const { addAddress, editAddress, getAddresses, getAddressById } = require('../controllers/Address');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (addAddress)
router.post('/addAddress', verifyToken, Authentication, addAddress); //addAddress
router.put("/editAddress", verifyToken, Authentication, editAddress);//editAddress
router.get('/getAddresses', verifyToken, Authentication, getAddresses); //getAddresses
router.get('/getAddressById/:address_id', verifyToken, Authentication, getAddressById); //getAddressById


module.exports = router;