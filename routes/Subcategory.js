const express = require('express');
const { createSubcategory, getSubcategories, updateSubcategory, changeSubcategoryStatus, upload } = require('../controllers/Subcategory');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (addcategory)
router.post('/addSubcategory', verifyToken, Authentication, upload.single('picture'), createSubcategory); //createSubcategory
router.get('/subcategories', verifyToken, Authentication, getSubcategories); //getSubcategories
router.put('/updatesubcategory', verifyToken, Authentication, upload.single('picture'), updateSubcategory); //updateSubcategory
router.patch('/changestatus/:subcategory_Id', verifyToken, Authentication, changeSubcategoryStatus); //changeSubcategoryStatus


module.exports = router;