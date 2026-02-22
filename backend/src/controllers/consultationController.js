const Consultation = require('../models/mongodb/Consultation');

exports.saveConsultation = async (req, res) => {
  try {
    const {
      doctorName,
      specialization,
      conversationHistory,
      prescription,
      consultationFee
    } = req.body;

    const consultation = await Consultation.create({
      patientId: req.user?.id || null,
      doctorName: doctorName || 'Dr. Sarah Johnson',
      specialization: specialization || 'General Physician',
      conversationHistory,
      prescription,
      consultationFee: consultationFee || 200,
      totalAmount: consultationFee || 200,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      consultation,
      consultationId: consultation._id
    });
  } catch (error) {
    console.error('Save consultation error:', error);
    res.status(500).json({ error: 'Failed to save consultation' });
  }
};

exports.getConsultationHistory = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      patientId: req.user?.id
    }).sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    console.error('Get consultation history error:', error);
    res.status(500).json({ error: 'Failed to get consultation history' });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    // For demo purposes, return all consultations if no user
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(consultations);
  } catch (error) {
    console.error('Get all consultations error:', error);
    res.status(500).json({ error: 'Failed to get consultations' });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { consultationId, rating, comment } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      consultationId,
      {
        feedback: {
          rating,
          comment,
          submittedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

module.exports = exports;
