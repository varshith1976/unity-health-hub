const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  try {
    const {
      consultationId, patientId, doctorId, appointmentId,
      rating, feedbackText, isAnonymous
    } = req.body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = await Feedback.create({
      consultationId, patientId, doctorId, appointmentId,
      rating, feedbackText, isAnonymous
    });

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

exports.getPatientFeedback = async (req, res) => {
  try {
    const patientId = req.user.id;
    const feedback = await Feedback.findByPatient(patientId);

    res.json(feedback);
  } catch (error) {
    console.error('Get patient feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

exports.getDoctorFeedback = async (req, res) => {
  try {
    const doctorProfileId = req.user.doctorProfileId;
    const feedback = await Feedback.findByDoctor(doctorProfileId);

    res.json(feedback);
  } catch (error) {
    console.error('Get doctor feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

exports.getDoctorFeedbackRecent = async (req, res) => {
  try {
    const doctorProfileId = req.user.doctorProfileId;
    const { limit } = req.query;
    const feedback = await Feedback.findByDoctorRecent(doctorProfileId, limit || 10);

    res.json(feedback);
  } catch (error) {
    console.error('Get recent feedback error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
};

exports.getDoctorRatingSummary = async (req, res) => {
  try {
    const doctorProfileId = req.user.doctorProfileId;
    const summary = await Feedback.getDoctorRatingSummary(doctorProfileId);

    res.json(summary);
  } catch (error) {
    console.error('Get rating summary error:', error);
    res.status(500).json({ error: 'Failed to get rating summary' });
  }
};
