const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/', appointmentController.createAppointment);
router.post('/payment/create-order', appointmentController.createPaymentOrder);
router.post('/payment/verify', appointmentController.verifyPayment);
router.get('/:bookingId', appointmentController.getAppointmentDetails);

module.exports = router;
