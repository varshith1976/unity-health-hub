const pool = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const {
      consultationId, patientId, doctorId, appointmentId,
      rating, feedbackText, isAnonymous
    } = feedbackData;

    const result = await pool.query(
      `INSERT INTO feedback (consultation_id, patient_id, doctor_id, appointment_id, rating, feedback_text, is_anonymous)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [consultationId, patientId, doctorId, appointmentId, rating, feedbackText, isAnonymous]
    );

    // Update doctor rating
    await this.updateDoctorRating(doctorId);

    return result.rows[0];
  }

  static async updateDoctorRating(doctorId) {
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings 
       FROM feedback WHERE doctor_id = $1`,
      [doctorId]
    );

    if (result.rows[0]) {
      await pool.query(
        `UPDATE doctor_profiles 
         SET rating = COALESCE($1, 0), total_ratings = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [result.rows[0].avg_rating, result.rows[0].total_ratings, doctorId]
      );
    }
  }

  static async findById(feedbackId) {
    const result = await pool.query(
      `SELECT f.*, 
        u.full_name as patient_name,
        dp.hospital_name as doctor_hospital,
        doc_user.full_name as doctor_name
       FROM feedback f
       LEFT JOIN users u ON f.patient_id = u.id
       LEFT JOIN doctor_profiles dp ON f.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       WHERE f.id = $1`,
      [feedbackId]
    );
    return result.rows[0];
  }

  static async findByPatient(patientId) {
    const result = await pool.query(
      `SELECT f.*, 
        dp.hospital_name as doctor_hospital,
        doc_user.full_name as doctor_name
       FROM feedback f
       LEFT JOIN doctor_profiles dp ON f.doctor_id = dp.id
       LEFT JOIN users doc_user ON dp.user_id = doc_user.id
       WHERE f.patient_id = $1
       ORDER BY f.created_at DESC`,
      [patientId]
    );
    return result.rows;
  }

  static async findByDoctor(doctorId) {
    const result = await pool.query(
      `SELECT f.*, 
        u.full_name as patient_name
       FROM feedback f
       LEFT JOIN users u ON f.patient_id = u.id
       WHERE f.doctor_id = $1
       ORDER BY f.created_at DESC`,
      [doctorId]
    );
    return result.rows;
  }

  static async findByDoctorRecent(doctorId, limit = 10) {
    const result = await pool.query(
      `SELECT f.*, 
        u.full_name as patient_name
       FROM feedback f
       LEFT JOIN users u ON f.patient_id = u.id
       WHERE f.doctor_id = $1
       ORDER BY f.created_at DESC
       LIMIT $2`,
      [doctorId, limit]
    );
    return result.rows;
  }

  static async getDoctorRatingSummary(doctorId) {
    const result = await pool.query(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM feedback WHERE doctor_id = $1`,
      [doctorId]
    );
    return result.rows[0];
  }
}

module.exports = Feedback;
