const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

exports.createAppointment = async (req, res) => {
  try {
    const {
      doctorId, slotId, appointmentType, appointmentDate, appointmentTime,
      patientName, patientAge, patientGender, patientPhone, patientEmail,
      symptoms, medicalConditions, previousConsultations
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentType || !patientName || !patientPhone || !patientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let finalSlotId = slotId;
    let finalDate = appointmentDate;
    let finalTime = appointmentTime;
    let consultationFee;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (appointmentType === 'emergency') {
      const emergencySlot = await Doctor.findEmergencySlot(doctor.specialization_id);
      if (!emergencySlot) {
        return res.status(404).json({ error: 'No emergency slots available' });
      }
      finalSlotId = emergencySlot.id;
      finalDate = emergencySlot.slot_date;
      finalTime = emergencySlot.slot_time;
      consultationFee = doctor.emergency_fee;
    } else {
      if (!slotId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ error: 'Slot details required for normal appointment' });
      }
      consultationFee = doctor.consultation_fee;
    }

    // Lock the slot
    const lockResult = await Appointment.lockSlot(finalSlotId);
    if (!lockResult.success) {
      return res.status(409).json({ error: lockResult.message });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user?.id || null,
      doctorId,
      slotId: finalSlotId,
      appointmentType,
      appointmentDate: finalDate,
      appointmentTime: finalTime,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      symptoms,
      medicalConditions,
      previousConsultations,
      consultationFee
    });

    res.status(201).json({
      success: true,
      appointment: {
        id: appointment.id,
        bookingId: appointment.booking_id,
        doctorName: doctor.full_name,
        specialization: doctor.specialization,
        appointmentDate: finalDate,
        appointmentTime: finalTime,
        appointmentType,
        consultationFee,
        lockUntil: appointment.slot_locked_until
      }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `apt_${appointmentId}_${Date.now()}`,
      notes: {
        appointmentId: appointmentId
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpaySignature;

    if (isValid) {
      const appointment = await Appointment.updatePaymentStatus(appointmentId, {
        status: 'completed',
        paymentId: razorpayPaymentId,
        transactionId: razorpayOrderId
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        appointment
      });
    } else {
      await Appointment.updatePaymentStatus(appointmentId, {
        status: 'failed',
        paymentId: razorpayPaymentId,
        transactionId: razorpayOrderId
      });

      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

exports.getAppointmentDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const appointment = await Appointment.findByBookingId(bookingId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to get appointment details' });
  }
};
