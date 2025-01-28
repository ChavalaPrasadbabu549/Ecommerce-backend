const express = require('express');
const { createCategory, updateCategory, GetAllCategory, ChangeStatus, upload } = require('../controllers/Category');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (addcategory)
router.post('/addcategory', verifyToken, Authentication, upload.single('picture'), createCategory); //createCategory
// all category
router.get('/getallcategories', verifyToken, Authentication, GetAllCategory);
// Update category
router.put('/updatecategory', verifyToken, Authentication, upload.single('picture'), updateCategory);
//change status
router.patch('/changestatus/:category_Id', verifyToken, Authentication, ChangeStatus);



module.exports = router;