const express = require('express');
const router = express.Router();

// Importing the Admin and Products routers
const superadminRoutes = require('../routes/Superadmin'); // Assuming your admin routes are in adminRoutes.js
const vendorRoutes = require('../routes/Vendors'); // Assuming your admin routes are in vendorRoutes.js
const categoryRoutes = require('../routes/Category'); // Assuming your admin routes are in categoryRoutes.js
const subcategoryRoutes = require('../routes/Subcategory'); // Assuming your admin routes are in subcategoryRoutes.js
const productRoutes = require('../routes/Product'); // Assuming your admin routes are in productRoutes.js
const cartRoutes = require('../routes/Cart'); // Assuming your admin routes are in cartRoutes.js
const userRoutes = require('../routes/User'); // Assuming your admin routes are in userRoutes.js
const addressRoutes = require('../routes/Address'); // Assuming your admin routes are in addressRoutes.js

// SuperAdmin routes
router.use('/SuperAdmin', superadminRoutes);
//vendor  Routes
router.use('/Vendor', vendorRoutes);
//Category  Routes
router.use('/Category', categoryRoutes);
//SubCategory  Routes
router.use('/SubCategory', subcategoryRoutes);
//Product  Routes
router.use('/Product', productRoutes);
//user  Routes
router.use('/User', userRoutes);
//Cart  Routes
router.use('/Cart', cartRoutes);
//Address Routes
router.use('/Address', addressRoutes);

module.exports = router;
