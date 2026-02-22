const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  appointmentType: { type: String, enum: ['normal', 'emergency'], default: 'normal' },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  patientGender: { type: String },
  patientPhone: { type: String },
  patientEmail: { type: String },
  symptoms: { type: String },
  medicalConditions: { type: String },
  previousConsultations: { type: String },
  consultationFee: { type: Number },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentId: { type: String },
  transactionId: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  slotLockedUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate booking ID
appointmentSchema.statics.generateBookingId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `APT-${timestamp}-${random}`.toUpperCase();
};

// Indexes
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ bookingId: 1 });
appointmentSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
