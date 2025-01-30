const Superadmin = require('../models/Superadmin');
const Vendor = require('../models/Vendor');


const Superadmins = async (req, res, next) => {
    try {
        const userId = req.user; // Make sure `req.decode` contains the user ID
        const superadmin = await Superadmin.findById(userId.id); // Find admin in the database
        if (superadmin.role === 'Superadmin') {
            next(); // If the user is an admin, allow the request to continue
        } else {
            res.status(403).json({ message: "Access Denied, Superadmin only Access!" }); // Deny access if not an admin
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" }); // Handle any errors that occur during the process
    }
};

module.exports = Superadmins;

const Vendors = async (req, res, next) => {
    try {
        const userId = req.user; // Make sure `req.decode` contains the user ID
        const vendor = await Vendor.findById(userId.id); // Find Vendor in the database
        if (vendor.role === 'Vendor') {
            next(); // If the user is an Vendor, allow the request to continue
        } else {
            res.status(403).json({ message: "Access Denied, Vendor only Access!" }); // Deny access if not an admin
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" }); // Handle any errors that occur during the process
    }
};

module.exports = Vendors;