const Superadmin = require('../models/Superadmin');
const Vendor = require('../models/Vendor');

const Authentication = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in req.user.id

        // Check if the user is a Superadmin
        const superadmin = await Superadmin.findById(userId);
        if (superadmin && superadmin.role === 'Superadmin') {
            req.user.role = 'Superadmin'; // Attach role to req.user for later use
            return next();
        }

        // Check if the user is a Vendor
        const vendor = await Vendor.findById(userId);
        if (vendor && vendor.role === 'Vendor') {
            req.user.role = 'Vendor'; // Attach role to req.user for later use
            return next();
        }

        // If the user is neither a Superadmin nor a Vendor, deny access
        res.status(403).json({ message: "Access Denied, Superadmin or Vendor only Access!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = Authentication;