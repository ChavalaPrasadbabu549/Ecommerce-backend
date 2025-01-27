const express = require('express');
const router = express.Router();

// Importing the Admin and Products routers
const superadminRoutes = require('../routes/Superadmin'); // Assuming your admin routes are in adminRoutes.js


// SuperAdmin routes
router.use('/SuperAdmin', superadminRoutes);


module.exports = router;
