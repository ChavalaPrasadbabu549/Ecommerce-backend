const express = require('express');
const router = express.Router();

// Importing the Admin and Products routers
const superadminRoutes = require('../routes/Superadmin'); // Assuming your admin routes are in adminRoutes.js
const vendorRoutes = require('../routes/Vendors'); // Assuming your admin routes are in vendorRoutes.js
const categoryRoutes = require('../routes/Category'); // Assuming your admin routes are in categoryRoutes.js


// SuperAdmin routes
router.use('/SuperAdmin', superadminRoutes);
//vendor  Routes
router.use('/Vendor', vendorRoutes);
//Category  Routes
router.use('/Category', categoryRoutes);

module.exports = router;
