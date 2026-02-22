const Prescription = require('../models/Prescription');
const DoctorProfile = require('../models/DoctorProfile');

exports.createPrescription = async (req, res) => {
  try {
    const {
      consultationId, patientId, doctorId, appointmentId,
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    } = req.body;

    // Validate required fields
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: 'At least one medicine is required' });
    }

    const prescription = await Prescription.create({
      consultationId, patientId, doctorId, appointmentId,
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    });

    // Increment doctor's consultation count
    if (doctorId) {
      await DoctorProfile.incrementConsultations(doctorId);
    }

    res.status(201).json({ success: true, prescription });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const {
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    } = req.body;

    const prescription = await Prescription.update(prescriptionId, {
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ error: 'Failed to get prescription' });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;
    const prescriptions = await Prescription.findByPatient(patientId);

    res.json(prescriptions);
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ error: 'Failed to get prescriptions' });
  }
};

exports.getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorProfileId = req.user.doctorProfileId;
    const prescriptions = await Prescription.findByDoctor(doctorProfileId);

    res.json(prescriptions);
  } catch (error) {
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json({ error: 'Failed to get prescriptions' });
  }
};

exports.getConsultationPrescription = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const prescription = await Prescription.findByConsultation(consultationId);

    res.json(prescription || null);
  } catch (error) {
    console.error('Get consultation prescription error:', error);
    res.status(500).json({ error: 'Failed to get prescription' });
  }
};

exports.getLatestPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { limit } = req.query;
    const prescriptions = await Prescription.getLatestByPatient(patientId, limit || 10);

    res.json(prescriptions);
  } catch (error) {
    console.error('Get latest prescriptions error:', error);
    res.status(500).json({ error: 'Failed to get prescriptions' });
  }
};
