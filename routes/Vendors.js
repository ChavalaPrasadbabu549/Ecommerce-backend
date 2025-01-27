const express = require('express');
const { signup, Login, GetAllvendors, updateVendor, ChangeStatus, upload } = require('../controllers/Vendor');
const router = express.Router();

// Public Route (signupVendor)
router.post('/signup', upload.single('profile_pic'), signup); //signupVendor
router.post('/login', Login); //Loginvendor
router.get('/getvendors', GetAllvendors);// getvendors
router.put('/updatevendor', upload.single('profile_pic'), updateVendor); //updateVendor
router.patch('/vendorstatus/:vendor_Id', ChangeStatus); //ChangeStatus


module.exports = router;