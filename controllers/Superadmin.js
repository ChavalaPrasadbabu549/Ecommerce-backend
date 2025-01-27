const Superadmin = require('../models/Superadmin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables
const { JWT_SECRET, SALT_ROUNDS } = process.env;

const Superadmincontroller = {
    async Signup(req, res) {
        try {

            const { name, email, password, role } = req.body;

            // Check if email already exists
            const existingSuperadmin = await Superadmin.findOne({ email });
            if (existingSuperadmin) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS, 10));

            // Create a new Superadmin
            const newSuperadmin = new Superadmin({
                name,
                email,
                password: hashedPassword,
                role,
                status: true, // Default status is active
            });

            await newSuperadmin.save();
            return res.status(201).json({ success: true, message: 'Superadmin created successfully', data: newSuperadmin });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['SuperAdmin']
       */
    },

    // Login API
    async Login(req, res) {
        try {
            const { email, password } = req.body;

            // Find the superadmin by email
            const superadmin = await Superadmin.findOne({ email });
            if (!superadmin) {
                return res.status(404).json({ success: false, message: 'Superadmin not found' });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, superadmin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: superadmin._id, role: superadmin.role }, JWT_SECRET);
            return res.status(200).json({ success: true, message: 'Login successful', role: superadmin.role, token });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
    #swagger.tags = ['SuperAdmin']
     */
    },

    // Get All Superadmins API
    async GetAllSuperadmins(req, res) {
        try {
            const superadmins = await Superadmin.find(); // Exclude password from the response
            return res.status(200).json({ success: true, data: superadmins });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
    #swagger.tags = ['SuperAdmin']
     */
    },

    // Change superadmin status
    async ChangeStatus(req, res) {
        try {
            const { id } = req.params;

            // Find the admin by ID
            const superadmin = await Superadmin.findById(id);

            if (!superadmin) {
                return res.status(404).json({ success: false, message: 'superadmin not found' });
            }
            // Toggle the status
            superadmin.status = !superadmin.status;

            // Save the updated admin
            await superadmin.save();

            return res.status(200).json({ success: true, message: 'Status updated successfully', data: superadmin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
            #swagger.tags = ['SuperAdmin']
             */
    },
};

module.exports = Superadmincontroller;
