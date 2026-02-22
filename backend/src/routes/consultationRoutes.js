const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.post('/save', consultationController.saveConsultation);
router.get('/history', consultationController.getAllConsultations);
router.post('/feedback', consultationController.submitFeedback);

module.exports = router;
