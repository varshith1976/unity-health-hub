const mongoose = require('mongoose');

const medicationDoseSchema = new mongoose.Schema({
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledTime: { type: Date, required: true },
  actualTime: { type: Date },
  status: { type: String, enum: ['pending', 'taken', 'missed', 'skipped'], default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Index for user dose tracking
medicationDoseSchema.index({ userId: 1, scheduledTime: 1 });
medicationDoseSchema.index({ medicationId: 1, scheduledTime: 1 });

module.exports = mongoose.model('MedicationDose', medicationDoseSchema);
