const Medication = require('../models/Medication');

exports.addMedication = async (req, res) => {
  try {
    const medication = await Medication.create({
      ...req.body,
      patient_id: req.user.id
    });
    res.status(201).json({ success: true, data: medication });
  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({ success: false, message: 'Failed to add medication' });
  }
};

exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.getByPatientId(req.user.id);
    res.json({ success: true, data: medications });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch medications' });
  }
};

exports.getTodaySchedule = async (req, res) => {
  try {
    const schedule = await Medication.getTodaySchedule(req.user.id);
    
    const grouped = {
      morning: schedule.filter(s => s.time_period === 'morning'),
      afternoon: schedule.filter(s => s.time_period === 'afternoon'),
      evening: schedule.filter(s => s.time_period === 'evening'),
      night: schedule.filter(s => s.time_period === 'night')
    };
    
    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

exports.recordDose = async (req, res) => {
  try {
    const { medication_id, scheduled_time, status, notes } = req.body;
    
    const dose = await Medication.recordDose({
      medication_id,
      patient_id: req.user.id,
      scheduled_time,
      actual_time: new Date(),
      status,
      notes
    });
    
    res.json({ success: true, data: dose });
  } catch (error) {
    console.error('Record dose error:', error);
    res.status(500).json({ success: false, message: 'Failed to record dose' });
  }
};

exports.getDoseHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const history = await Medication.getDoseHistory(
      req.user.id,
      startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate || new Date()
    );
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};

exports.getAdherenceStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const stats = await Medication.getAdherenceStats(req.user.id, days);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.update(id, req.body);
    res.json({ success: true, data: medication });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({ success: false, message: 'Failed to update medication' });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    await Medication.delete(id);
    res.json({ success: true, message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete medication' });
  }
};

// Add medication from AI prescription (without auth)
exports.addMedicationFromPrescription = async (req, res) => {
  try {
    const {
      medicine_name,
      dosage,
      dosage_type,
      quantity,
      frequency,
      meal_instruction,
      start_date,
      end_date,
      treatment_duration,
      schedules
    } = req.body;

    // For demo purposes, use a default patient ID
    // In production, this would come from the authenticated user
    const patientId = 1; // Default patient for demo

    // Create the medication with schedules (model handles both)
    const medicationData = {
      patient_id: patientId,
      medicine_name,
      dosage,
      dosage_type: dosage_type || 'tablet',
      quantity: quantity || 7,
      frequency,
      meal_instruction: meal_instruction || 'after food',
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      treatment_duration: treatment_duration || '7 days',
      schedules: schedules || []
    };

    const medication = await Medication.create(medicationData);

    res.status(201).json({ 
      success: true, 
      message: 'Medication added successfully',
      data: medication 
    });
  } catch (error) {
    console.error('Add medication from prescription error:', error);
    res.status(500).json({ success: false, message: 'Failed to add medication' });
  }
};
