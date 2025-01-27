const Vendor = require('../models/Vendor');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');

// Environment variables
const { JWT_SECRET, SALT_ROUNDS } = process.env;

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

const Vendorcontroller = {
    // Vendor Signup
    async signup(req, res) {
        try {
            const { name, email, password, role, superadminId } = req.body;

            // Check if email already exists
            const existingVendor = await Vendor.findOne({ email });
            if (existingVendor) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new vendor
            const newVendor = new Vendor({
                name,
                email,
                password: hashedPassword,
                profile_pic: req.file ? req.file.filename : null, // Save uploaded file name if available
                role,
                superadminId, // Associate the vendor with the Superadmin
            });

            // Save vendor to the database
            await newVendor.save();

            return res.status(201).json({ success: true, message: 'Vendor signed up successfully', data: newVendor });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Vendor']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['password'] = { in: 'formData', type: 'string', required: true }
        #swagger.parameters['status'] = { in: 'formData', type: 'string', required: true ,enum: ['true','false'],default : 'true'}
        #swagger.parameters['role'] = { in: 'formData', type: 'string', required: true, enum: ['Vendor',], default:'Vendor'}
        #swagger.parameters['superadminId'] = { in: 'formData', type: 'string', required: true }
       */
    },

    // Login API
    async Login(req, res) {
        try {
            const { email, password } = req.body;

            // Find the vendor by email
            const vendor = await Vendor.findOne({ email });
            if (!vendor) {
                return res.status(404).json({ success: false, message: 'Vendor not found' });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, vendor.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: vendor._id, role: vendor.role }, JWT_SECRET);
            return res.status(200).json({ success: true, message: 'Login successful', role: vendor.role, token });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Vendor']
        */
    },

    // Get All Vendor API
    async GetAllvendors(req, res) {
        try {
            const vendor = await Vendor.find(); // Exclude password from the response
            return res.status(200).json({ success: true, data: vendor });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
    #swagger.tags = ['Vendor']
     */
    },

    // Update an Vendor
    async updateVendor(req, res) {
        try {
            const { vendor_Id } = req.body;
            const { name, email, role, status, password } = req.body;

            // Find the vendor by ID
            const vendor = await Vendor.findById(vendor_Id);

            if (!vendor) {
                return res.status(404).json({ success: false, message: 'vendor not found' });
            }
            //update fields dynamically
            if (name) vendor.name = name;
            if (email) vendor.email = email;
            if (role) vendor.role = role;
            if (status) vendor.status = status;
            if (password) vendor.password = password;

            // Add profile picture if uploaded
            if (req.file) {
                vendor.profile_pic = req.file.filename;
            }

            // Save the updated vendor
            await vendor.save();
            return res.status(200).json({ success: true, message: 'Admin updated successfully', data: vendor });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Vendor']
      #swagger.autoBody = false
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['profile_pic'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
      #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['email'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['password'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['status'] = { in: 'formData', type: 'string', required: false ,enum: ['true','false'],default : 'true'}
      #swagger.parameters['role'] = { in: 'formData', type: 'string', required: false, enum: ['Vendor',], default:'Vendor'}
      #swagger.parameters['superadminId'] = { in: 'formData', type: 'string', required: false }
      #swagger.parameters['vendor_Id'] = { in: 'formData', type: 'string', required: true }
     */
    },

    // Change vendor status
    async ChangeStatus(req, res) {
        try {
            const { vendor_Id } = req.params;

            // Find the admin by ID
            const vendor = await Vendor.findById(vendor_Id);

            if (!vendor) {
                return res.status(404).json({ success: false, message: 'vendor not found' });
            }
            // Toggle the status
            vendor.status = !vendor.status;

            // Save the updated admin
            await vendor.save();

            return res.status(200).json({ success: true, message: 'Status updated successfully', data: vendor });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Vendor']
        */
    },

}

module.exports = {
    signup: Vendorcontroller.signup,
    Login: Vendorcontroller.Login,
    GetAllvendors: Vendorcontroller.GetAllvendors,
    updateVendor: Vendorcontroller.updateVendor,
    ChangeStatus: Vendorcontroller.ChangeStatus,
    upload,
};
