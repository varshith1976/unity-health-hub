const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slotDate: { type: Date, required: true },
  slotTime: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  isEmergencySlot: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
timeSlotSchema.index({ doctorId: 1, slotDate: 1, slotTime: 1 }, { unique: true });
timeSlotSchema.index({ doctorId: 1, slotDate: 1, isAvailable: 1 });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
