const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, role, fullName, phone } = userData;
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, full_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, full_name, phone, created_at`,
      [email, passwordHash, role || 'patient', fullName, phone]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, full_name, phone, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updateProfile(id, userData) {
    const { fullName, phone } = userData;
    
    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name), 
           phone = COALESCE($2, phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, role, full_name, phone, created_at`,
      [fullName, phone, id]
    );
    
    return result.rows[0];
  }

  static async comparePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  static async getAllPatients() {
    const result = await pool.query(
      `SELECT id, email, full_name, phone, created_at 
       FROM users 
       WHERE role = 'patient' 
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  static async getPatientAppointments(patientId) {
    const result = await pool.query(
      `SELECT a.*, d.full_name as doctor_name, s.name as specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN specializations s ON d.specialization_id = s.id
       WHERE a.patient_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );
    return result.rows;
  }
}

module.exports = User;
