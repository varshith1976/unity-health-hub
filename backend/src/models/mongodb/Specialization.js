const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Seed default specializations
specializationSchema.statics.seedDefaults = async function() {
  const defaults = [
    { name: 'Cardiologist', description: 'Heart specialist', icon: '❤️' },
    { name: 'Nephrologist', description: 'Kidney specialist', icon: '🫘' },
    { name: 'Ophthalmologist', description: 'Eye specialist', icon: '👁️' },
    { name: 'Dermatologist', description: 'Skin specialist', icon: '🧴' },
    { name: 'Neurologist', description: 'Brain & nervous system', icon: '🧠' },
    { name: 'Orthopedic Surgeon', description: 'Bones & joints', icon: '🦴' },
    { name: 'Pediatrician', description: 'Children specialist', icon: '👶' },
    { name: 'General Physician', description: 'Primary care', icon: '🩺' }
  ];
  
  for (const spec of defaults) {
    await this.findOneAndUpdate({ name: spec.name }, spec, { upsert: true, new: true });
  }
  console.log('✅ Default specializations seeded!');
};

module.exports = mongoose.model('Specialization', specializationSchema);
