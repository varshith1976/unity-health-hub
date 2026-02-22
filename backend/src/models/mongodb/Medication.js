const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: {
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    evening: { type: Boolean, default: false },
    night: { type: Boolean, default: false }
  },
  times: [{
    time: { type: String },
    label: { type: String },
    taken: { type: Boolean, default: false }
  }],
  duration: {
    days: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  instructions: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for user medications
medicationSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Medication', medicationSchema);
