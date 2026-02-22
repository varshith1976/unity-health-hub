const pool = require('../config/database');

class Prescription {
  static async create(prescriptionData) {
    const {
      consultationId, patientId, doctorId, appointmentId,
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    } = prescriptionData;

    const result = await pool.query(
      `INSERT INTO prescriptions (
        consultation_id, patient_id, doctor_id, appointment_id,
        medicines, precautions, lifestyle_recommendations,
        diagnostic_tests, referral_notes, follow_up_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        consultationId, patientId, doctorId, appointmentId,
        JSON.stringify(medicines), precautions, lifestyleRecommendations,
        diagnosticTests, referralNotes, followUpDate
      ]
    );

    return result.rows[0];
  }

  static async update(prescriptionId, prescriptionData) {
    const {
      medicines, precautions, lifestyleRecommendations,
      diagnosticTests, referralNotes, followUpDate
    } = prescriptionData;

    const result = await pool.query(
      `UPDATE prescriptions 
       SET medicines = $1, precautions = $2, lifestyle_recommendations = $3,
           diagnostic_tests = $4, referral_notes = $5, follow_up_date = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [
        JSON.stringify(medicines), precautions, lifestyleRecommendations,
        diagnosticTests, referralNotes, followUpDate, prescriptionId
      ]
    );

    return result.rows[0];
  }

  static async findById(prescriptionId) {
    const result = await pool.query(
      `SELECT p.*, 
        u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone,
        dp.hospital_name as doctor_hospital, s.name as specialization,
        doc_user.full_name as doctor_name
       FROM prescriptions p
       LEFT JOIN users u ON p.patient_id = u.id
       LEFT JOIN doctor_profiles dp ON p.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE p.id = $1`,
      [prescriptionId]
    );
    return result.rows[0];
  }

  static async findByPatient(patientId) {
    const result = await pool.query(
      `SELECT p.*, 
        dp.hospital_name as doctor_hospital, s.name as specialization,
        doc_user.full_name as doctor_name
       FROM prescriptions p
       LEFT JOIN doctor_profiles dp ON p.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE p.patient_id = $1
       ORDER BY p.created_at DESC`,
      [patientId]
    );
    return result.rows;
  }

  static async findByDoctor(doctorId) {
    const result = await pool.query(
      `SELECT p.*, 
        u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone
       FROM prescriptions p
       LEFT JOIN users u ON p.patient_id = u.id
       WHERE p.doctor_id = $1
       ORDER BY p.created_at DESC`,
      [doctorId]
    );
    return result.rows;
  }

  static async findByConsultation(consultationId) {
    const result = await pool.query(
      `SELECT p.*, 
        u.full_name as patient_name, u.email as patient_email,
        doc_user.full_name as doctor_name
       FROM prescriptions p
       LEFT JOIN users u ON p.patient_id = u.id
       LEFT JOIN doctor_profiles dp ON p.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       WHERE p.consultation_id = $1`,
      [consultationId]
    );
    return result.rows[0];
  }

  static async getLatestByPatient(patientId, limit = 10) {
    const result = await pool.query(
      `SELECT p.*, 
        dp.hospital_name as doctor_hospital, s.name as specialization,
        doc_user.full_name as doctor_name
       FROM prescriptions p
       LEFT JOIN doctor_profiles dp ON p.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE p.patient_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2`,
      [patientId, limit]
    );
    return result.rows;
  }
}

module.exports = Prescription;
