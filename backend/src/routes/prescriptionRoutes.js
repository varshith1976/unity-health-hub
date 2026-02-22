const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { auth, doctorAuth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Prescription routes
router.post('/', doctorAuth, prescriptionController.createPrescription);
router.put('/:prescriptionId', doctorAuth, prescriptionController.updatePrescription);
router.get('/:prescriptionId', prescriptionController.getPrescription);
router.get('/patient/my-prescriptions', prescriptionController.getPatientPrescriptions);
router.get('/doctor/my-prescriptions', doctorAuth, prescriptionController.getDoctorPrescriptions);
router.get('/consultation/:consultationId', prescriptionController.getConsultationPrescription);
router.get('/patient/latest', prescriptionController.getLatestPrescriptions);

module.exports = router;
