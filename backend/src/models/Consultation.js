const pool = require('../config/database');

class Consultation {
  static async create(consultationData) {
    const {
      appointmentId, patientId, doctorId, consultationType, startTime
    } = consultationData;

    const result = await pool.query(
      `INSERT INTO consultations (appointment_id, patient_id, doctor_id, consultation_type, start_time, status)
       VALUES ($1, $2, $3, $4, $5, 'in_progress')
       RETURNING *`,
      [appointmentId, patientId, doctorId, consultationType, startTime]
    );

    return result.rows[0];
  }

  static async updateTranscript(consultationId, transcript) {
    const result = await pool.query(
      `UPDATE consultations SET transcript = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [transcript, consultationId]
    );
    return result.rows[0];
  }

  static async updateAIAnalysis(consultationId, aiAnalysis) {
    const result = await pool.query(
      `UPDATE consultations SET ai_analysis = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [JSON.stringify(aiAnalysis), consultationId]
    );
    return result.rows[0];
  }

  static async endConsultation(consultationId, endTime, durationMinutes) {
    const result = await pool.query(
      `UPDATE consultations 
       SET end_time = $1, duration_minutes = $2, status = 'completed', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
      [endTime, durationMinutes, consultationId]
    );
    return result.rows[0];
  }

  static async findById(consultationId) {
    const result = await pool.query(
      `SELECT c.*, 
        u.full_name as patient_name, u.email as patient_email,
        dp.qualifications as doctor_qualifications, dp.hospital_name,
        s.name as specialization
       FROM consultations c
       LEFT JOIN users u ON c.patient_id = u.id
       LEFT JOIN doctor_profiles dp ON c.doctor_id = dp.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE c.id = $1`,
      [consultationId]
    );
    return result.rows[0];
  }

  static async findByPatient(patientId) {
    const result = await pool.query(
      `SELECT c.*, 
        dp.qualifications as doctor_qualifications, dp.hospital_name,
        u.full_name as doctor_name, s.name as specialization
       FROM consultations c
       LEFT JOIN doctor_profiles dp ON c.doctor_id = dp.id
       LEFT JOIN users u ON dp.user_id = u.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE c.patient_id = $1
       ORDER BY c.start_time DESC`,
      [patientId]
    );
    return result.rows;
  }

  static async findByDoctor(doctorId) {
    const result = await pool.query(
      `SELECT c.*, 
        u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone,
        u.date_of_birth, u.gender, u.medical_history, u.allergies, u.current_medications
       FROM consultations c
       LEFT JOIN users u ON c.patient_id = u.id
       WHERE c.doctor_id = $1
       ORDER BY c.start_time DESC`,
      [doctorId]
    );
    return result.rows;
  }

  static async getActiveConsultation(doctorId) {
    const result = await pool.query(
      `SELECT c.*, 
        u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone,
        u.date_of_birth, u.gender, u.medical_history, u.allergies, u.current_medications
       FROM consultations c
       LEFT JOIN users u ON c.patient_id = u.id
       WHERE c.doctor_id = $1 AND c.status = 'in_progress'
       ORDER BY c.start_time DESC
       LIMIT 1`,
      [doctorId]
    );
    return result.rows[0];
  }
}

module.exports = Consultation;
