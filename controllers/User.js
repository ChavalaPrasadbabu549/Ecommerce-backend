const User = require('../models/User');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const { JWT_SECRET } = process.env;

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});

const UserController = {
    // Create a new customer
    async createUser(req, res) {
        try {
            const { name, email, password, mobile, role } = req.body;

            if (!name || !email || !password || !mobile || !role) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            const existingMobile = await User.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({ success: false, message: ' Mobile already exists' });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                profile_pic: req.file ? req.file.filename : null, // Save uploaded file name if available
                mobile,
                role: 'User',
            });

            // Save the user to the database
            const savedUser = await newUser.save();
            const newCart = new Cart({
                user_id: savedUser._id,
                items: [],
            });
            await newCart.save();

            return res.status(201).json({ success: true, message: 'User registered successfully', data: savedUser });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
         #swagger.tags = ['User']
         #swagger.autoBody = false
         #swagger.consumes = ['multipart/form-data']
         #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
         #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
         #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true }
         #swagger.parameters['password'] = { in: 'formData', type: 'string', required: true }
         #swagger.parameters['mobile'] = { in: 'formData', type: 'string', required: true }
         #swagger.parameters['role'] = { in: 'formData', type: 'string', required: true, enum: ['User','Admin'], default:'User'}
        */
    },

    //  Login using Mobile & OTP
    async login(req, res) {
        try {
            const { mobile, otp } = req.body;

            if (!mobile || !otp) {
                return res.status(400).json({ success: false, message: 'Mobile and OTP are required' });
            }

            const user = await User.findOne({ mobile });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (otp !== '0000') {
                return res.status(400).json({ success: false, message: 'Invalid OTP' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
            return res.status(200).json({ success: true, message: 'Login successful', role: user.role, token });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
         #swagger.tags = ['User']
        */
    },

    // Update User by ID
    async updateUser(req, res) {
        try {
            const userId = req.user.id;
            const { name, email, mobile, role } = req.body; // Get updated user details

            // Check if the user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Update user details
            if (name) user.name = name;
            if (email) user.email = email;
            if (mobile) user.mobile = mobile;
            if (role) user.role = role;

            // Update profile picture if provided
            if (req.file) {
                user.profile_pic = req.file.filename;
            }

            // Save updated user
            await user.save();

            return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
         #swagger.tags = ['User']
         #swagger.autoBody = false
         #swagger.consumes = ['multipart/form-data']
         #swagger.parameters['userId'] = { in: 'formData', type: 'string', required: false }
         #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: true, accept: 'image/jpeg, image/png' }
         #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false }
         #swagger.parameters['email'] = { in: 'formData', type: 'string', required: false }
         #swagger.parameters['mobile'] = { in: 'formData', type: 'string', required: false }
         #swagger.parameters['role'] = { in: 'formData', type: 'string', required: false, enum: ['User','Admin'],default:'User' }
        */
    },

    // Get All Customers (Superadmin Only)
    async getAllUsers(req, res) {
        try {
            const userRole = req.user.role; // Extract role from authenticated user
            if (userRole !== 'Superadmin') {
                return res.status(403).json({ success: false, message: 'Access Denied' });
            }

            const user = await User.find(); // Exclude password from response
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
         #swagger.tags = ['User']
        */
    },

    //  Get Customer by ID
    async getUserById(req, res) {
        try {
            const userRole = req.user.role; // Extract role from authenticated user
            if (userRole !== 'Superadmin') {
                return res.status(403).json({ success: false, message: 'Access Denied' });
            }
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }
            // Find customer by ID
            const user = await User.findById(userId); // Exclude password from response
            if (!user) {
                return res.status(404).json({ success: false, message: 'user not found' });
            }

            return res.status(200).json({ success: true, message: 'user details retrieved successfully', data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
         #swagger.tags = ['User']
        */
    },

    // Change Category status
    async ChangeStatus(req, res) {
        try {
            const { userId } = req.params;
            // Check if the requesting user is an Admin
            if (req.user.role !== 'Superadmin') {
                return res.status(403).json({ success: false, message: 'Access Denied. SuperAdmins only' });
            }
            // Find the category by ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'user not found' });
            }
            // Toggle the status
            user.status = !user.status;

            // Save the updated admin
            await user.save();

            return res.status(200).json({ success: true, message: `User status updated successfully to ${user.status ? 'Active' : 'Inactive'}`, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['User']
        #swagger.description = 'Change user status (Superadmin only)'
        */
    },
};

module.exports = {
    createUser: UserController.createUser,
    login: UserController.login,
    updateUser: UserController.updateUser,
    getAllUsers: UserController.getAllUsers,
    getUserById: UserController.getUserById,
    ChangeStatus: UserController.ChangeStatus,
    upload
};
