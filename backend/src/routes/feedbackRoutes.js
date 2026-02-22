const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth, doctorAuth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Feedback routes
router.post('/', feedbackController.createFeedback);
router.get('/:feedbackId', feedbackController.getFeedback);
router.get('/patient/my-feedback', feedbackController.getPatientFeedback);
router.get('/doctor/my-feedback', doctorAuth, feedbackController.getDoctorFeedback);
router.get('/doctor/recent', doctorAuth, feedbackController.getDoctorFeedbackRecent);
router.get('/doctor/summary', doctorAuth, feedbackController.getDoctorRatingSummary);

module.exports = router;
