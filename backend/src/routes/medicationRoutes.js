const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const { auth } = require('../middleware/auth');

// Route for adding medication from AI prescription (must be before /:id routes)
router.post('/from-prescription', medicationController.addMedicationFromPrescription);

// Routes with auth
router.post('/', auth, medicationController.addMedication);
router.get('/', auth, medicationController.getMedications);
router.get('/schedule/today', auth, medicationController.getTodaySchedule);
router.post('/dose', auth, medicationController.recordDose);
router.get('/history', auth, medicationController.getDoseHistory);
router.get('/adherence', auth, medicationController.getAdherenceStats);
router.put('/:id', auth, medicationController.updateMedication);
router.delete('/:id', auth, medicationController.deleteMedication);

module.exports = router;

