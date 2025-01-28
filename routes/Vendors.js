const express = require('express');
const { signup, Login, GetAllvendors, updateVendor, ChangeStatus, upload } = require('../controllers/Vendor');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (signupVendor)
router.post('/signup', verifyToken, Authentication, upload.single('profile_pic'), signup); //signupVendor
router.post('/login', Login); //Loginvendor
router.get('/getvendors', verifyToken, Authentication, GetAllvendors);// getvendors
router.put('/updatevendor', verifyToken, Authentication, upload.single('profile_pic'), updateVendor); //updateVendor
router.patch('/vendorstatus/:vendor_Id', verifyToken, Authentication, ChangeStatus); //ChangeStatus


module.exports = router;