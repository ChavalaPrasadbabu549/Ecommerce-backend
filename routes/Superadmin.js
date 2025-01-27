const express = require('express');
const { Signup, Login, GetAllSuperadmins, ChangeStatus } = require('../controllers/Superadmin');
const router = express.Router();

// Public Route (Signup login)
router.post('/signup', Signup); // Create new Signup
router.post('/login', Login); // Login
router.get('/getallsuperadmins', GetAllSuperadmins); // GetAllSuperadmins
router.patch('/superadminstatus/:superadmin_id', ChangeStatus); // ChangeStatus

module.exports = router;