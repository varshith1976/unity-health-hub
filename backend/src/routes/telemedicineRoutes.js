const express = require('express');
const router = express.Router();
const telemedicineController = require('../controllers/telemedicineController');
const { authMiddleware } = require('../middleware/auth');

// Start consultation
router.post('/consultations/start', authMiddleware, telemedicineController.startConsultation);

// Get consultation details
router.get('/consultations/:consultationId', authMiddleware, telemedicineController.getConsultation);

// Add transcript
router.post('/consultations/:consultationId/transcript', authMiddleware, telemedicineController.addTranscript);

// Get transcripts
router.get('/consultations/:consultationId/transcripts', authMiddleware, telemedicineController.getTranscripts);

// End consultation
router.post('/consultations/:consultationId/end', authMiddleware, telemedicineController.endConsultation);

// Get clinical analysis
router.get('/consultations/:consultationId/analysis', authMiddleware, telemedicineController.getClinicalAnalysis);

// Find nearby hospitals
router.get('/hospitals/nearby', authMiddleware, telemedicineController.findNearbyHospitals);

// Create hospital referral
router.post('/referrals', authMiddleware, telemedicineController.createReferral);

// Get patient referrals
router.get('/referrals/patient/:patientId', authMiddleware, telemedicineController.getPatientReferrals);

module.exports = router;
