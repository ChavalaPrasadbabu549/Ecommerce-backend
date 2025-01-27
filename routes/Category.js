const express = require('express');
const { createCategory, updateCategory, GetAllCategory, ChangeStatus, upload } = require('../controllers/Category');
const router = express.Router();

// Public Route (addcategory)
router.post('/addcategory', upload.single('picture'), createCategory); //createCategory
// all category
router.get('/getallcategories', GetAllCategory);
// Update category
router.put('/updatecategory', upload.single('picture'), updateCategory);
//change status
router.patch('/changestatus/:category_Id', ChangeStatus);



module.exports = router;