const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  doctorName: {
    type: String,
    default: 'Dr. Sarah Johnson'
  },
  specialization: {
    type: String,
    default: 'General Physician'
  },
  conversationHistory: [{
    speaker: String,
    message: String,
    timestamp: String
  }],
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      timing: {
        morning: String,
        afternoon: String,
        evening: String,
        night: String
      },
      instructions: String
    }],
    advice: [String],
    lifestyle: [String]
  },
  totalAmount: {
    type: Number,
    default: 200
  },
  consultationFee: {
    type: Number,
    default: 200
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled'],
    default: 'completed'
  },
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);
