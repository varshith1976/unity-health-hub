const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth, doctorAuth } = require('../middleware/auth');

// Public routes
router.get('/specializations', doctorController.getSpecializations);
router.get('/search', doctorController.searchDoctors);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

// Protected routes - require authentication
router.post('/register', doctorController.register);
router.get('/profile/me', auth, doctorController.getProfile);
router.put('/profile/me', auth, doctorAuth, doctorController.updateProfile);
router.put('/online-status', auth, doctorAuth, doctorController.updateOnlineStatus);
router.get('/dashboard/stats', auth, doctorAuth, doctorController.getDashboardStats);

module.exports = router;
