const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specializationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' },
  specialization: { type: String },
  qualifications: { type: String },
  experienceYears: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 500 },
  emergencyFee: { type: Number, default: 1000 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  hospitalName: { type: String },
  hospitalAddress: { type: String },
  isAvailable: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false },
  bio: { type: String },
  languages: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for searching
doctorSchema.index({ specialization: 1, isAvailable: 1 });
doctorSchema.index({ rating: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
