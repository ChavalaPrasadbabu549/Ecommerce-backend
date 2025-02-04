const express = require('express');
const { createUser, login, updateUser, getAllUsers, getUserById, ChangeStatus, upload } = require('../controllers/User');
const router = express.Router();
const verifyToken = require('../middlewares/VerifyToken'); // Middleware for token authentication
const Authentication = require('../middlewares/Authentication'); //authentication for user

// Public Route (Customer)
router.post('/signup', upload.single('profile_pic'), createUser); //createCustomer
router.post('/login', login); //Login
router.put('/updateUser', verifyToken, Authentication, upload.single('profile_pic'), updateUser); //Login
router.get('/getAllUsers', verifyToken, Authentication, getAllUsers); //getAllCustomers
router.get('/getUserById/:userId', verifyToken, Authentication, getUserById); //getCustomerById
router.patch('/ChangeStatus/:userId', verifyToken, Authentication, ChangeStatus); //ChangeStatus


module.exports = router;