const Consultation = require('../models/Consultation');
const ClinicalAnalysis = require('../models/ClinicalAnalysis');
const Hospital = require('../models/Hospital');

// Start a consultation
exports.startConsultation = async (req, res) => {
  try {
    const { appointmentId, consultationType } = req.body;

    if (!['video', 'audio', 'chat'].includes(consultationType)) {
      return res.status(400).json({ error: 'Invalid consultation type' });
    }

    const consultation = await Consultation.create(appointmentId, consultationType);
    
    res.json({
      success: true,
      consultation,
      message: 'Consultation started successfully'
    });
  } catch (error) {
    console.error('Start consultation error:', error);
    res.status(500).json({ error: 'Failed to start consultation' });
  }
};

// Add transcript during consultation
exports.addTranscript = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { speaker, text, confidence } = req.body;

    if (!['doctor', 'patient'].includes(speaker)) {
      return res.status(400).json({ error: 'Invalid speaker type' });
    }

    const transcript = await Consultation.addTranscript(
      consultationId,
      speaker,
      text,
      confidence
    );

    res.json({
      success: true,
      transcript
    });
  } catch (error) {
    console.error('Add transcript error:', error);
    res.status(500).json({ error: 'Failed to add transcript' });
  }
};

// Get consultation transcripts
exports.getTranscripts = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const transcripts = await Consultation.getTranscripts(consultationId);

    res.json({
      success: true,
      transcripts
    });
  } catch (error) {
    console.error('Get transcripts error:', error);
    res.status(500).json({ error: 'Failed to retrieve transcripts' });
  }
};

// End consultation and perform AI analysis
exports.endConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    // Update consultation status
    const consultation = await Consultation.updateStatus(
      consultationId,
      'completed',
      new Date()
    );

    // Get full transcript
    const fullTranscript = await Consultation.getFullTranscript(consultationId);

    // Perform AI analysis
    const analysisResult = await ClinicalAnalysis.analyzeTranscript(fullTranscript);

    // Save analysis to database
    const analysis = await ClinicalAnalysis.create({
      consultationId,
      symptoms: analysisResult.symptoms,
      severityLevel: analysisResult.severityLevel,
      riskFactors: analysisResult.riskFactors,
      suggestedDiagnosis: analysisResult.suggestedDiagnosis,
      diagnosisConfidence: analysisResult.diagnosisConfidence,
      medications: analysisResult.medications,
      requiresPhysicalExam: analysisResult.requiresPhysicalExam,
      requiresEmergencyCare: analysisResult.requiresEmergencyCare,
      redFlags: analysisResult.redFlags,
      clinicalKeywords: analysisResult.clinicalKeywords
    });

    res.json({
      success: true,
      consultation,
      analysis,
      requiresHospitalVisit: analysisResult.requiresPhysicalExam || analysisResult.requiresEmergencyCare
    });
  } catch (error) {
    console.error('End consultation error:', error);
    res.status(500).json({ error: 'Failed to end consultation' });
  }
};

// Get clinical analysis
exports.getClinicalAnalysis = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const analysis = await ClinicalAnalysis.findByConsultationId(consultationId);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
};

// Find nearby hospitals
exports.findNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, specialization } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const hospitals = await Hospital.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      specialization,
      5
    );

    res.json({
      success: true,
      hospitals
    });
  } catch (error) {
    console.error('Find hospitals error:', error);
    res.status(500).json({ error: 'Failed to find hospitals' });
  }
};

// Create hospital referral
exports.createReferral = async (req, res) => {
  try {
    const {
      consultationId,
      patientId,
      hospitalId,
      reason,
      urgencyLevel,
      specializationRequired
    } = req.body;

    const referral = await Hospital.createReferral({
      consultationId,
      patientId,
      hospitalId,
      reason,
      urgencyLevel,
      specializationRequired
    });

    res.json({
      success: true,
      referral,
      message: 'Hospital referral created successfully'
    });
  } catch (error) {
    console.error('Create referral error:', error);
    res.status(500).json({ error: 'Failed to create referral' });
  }
};

// Get patient referrals
exports.getPatientReferrals = async (req, res) => {
  try {
    const { patientId } = req.params;
    const referrals = await Hospital.getReferralsByPatient(patientId);

    res.json({
      success: true,
      referrals
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ error: 'Failed to retrieve referrals' });
  }
};

// Get consultation details
exports.getConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({ error: 'Failed to retrieve consultation' });
  }
};
