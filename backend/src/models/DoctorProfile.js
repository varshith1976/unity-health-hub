const pool = require('../config/database');

class DoctorProfile {
  static async create(profileData) {
    const {
      userId, specializationId, licenseNumber, qualifications, experienceYears,
      consultationFee, emergencyFee, hospitalName, hospitalAddress, bio,
      languagesSpoken, availableDays, availableStartTime, availableEndTime
    } = profileData;

    const result = await pool.query(
      `INSERT INTO doctor_profiles (
        user_id, specialization_id, license_number, qualifications, experience_years,
        consultation_fee, emergency_fee, hospital_name, hospital_address, bio,
        languages_spoken, available_days, available_start_time, available_end_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [userId, specializationId, licenseNumber, qualifications, experienceYears,
        consultationFee, emergencyFee, hospitalName, hospitalAddress, bio,
        languagesSpoken, availableDays, availableStartTime, availableEndTime]
    );

    return result.rows[0];
  }

  static async update(profileId, profileData) {
    const {
      specializationId, licenseNumber, qualifications, experienceYears,
      consultationFee, emergencyFee, hospitalName, hospitalAddress, bio,
      languagesSpoken, availableDays, availableStartTime, availableEndTime,
      isAvailable
    } = profileData;

    const result = await pool.query(
      `UPDATE doctor_profiles 
       SET specialization_id = COALESCE($1, specialization_id),
           license_number = COALESCE($2, license_number),
           qualifications = COALESCE($3, qualifications),
           experience_years = COALESCE($4, experience_years),
           consultation_fee = COALESCE($5, consultation_fee),
           emergency_fee = COALESCE($6, emergency_fee),
           hospital_name = COALESCE($7, hospital_name),
           hospital_address = COALESCE($8, hospital_address),
           bio = COALESCE($9, bio),
           languages_spoken = COALESCE($10, languages_spoken),
           available_days = COALESCE($11, available_days),
           available_start_time = COALESCE($12, available_start_time),
           available_end_time = COALESCE($13, available_end_time),
           is_available = COALESCE($14, is_available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15 RETURNING *`,
      [specializationId, licenseNumber, qualifications, experienceYears,
        consultationFee, emergencyFee, hospitalName, hospitalAddress, bio,
        languagesSpoken, availableDays, availableStartTime, availableEndTime,
        isAvailable, profileId]
    );

    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT dp.*, u.email, u.full_name, u.phone, s.name as specialization
       FROM doctor_profiles dp
       JOIN users u ON dp.user_id = u.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE dp.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async findById(profileId) {
    const result = await pool.query(
      `SELECT dp.*, u.email, u.full_name, u.phone, u.profile_image, s.name as specialization
       FROM doctor_profiles dp
       JOIN users u ON dp.user_id = u.id
       LEFT JOIN specializations s ON dp.specialization_id = s.id
       WHERE dp.id = $1`,
      [profileId]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT dp.*, u.email, u.full_name, u.phone, u.profile_image, s.name as specialization
      FROM doctor_profiles dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN specializations s ON dp.specialization_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.specializationId) {
      query += ` AND dp.specialization_id = $${paramIndex}`;
      params.push(filters.specializationId);
      paramIndex++;
    }

    if (filters.isAvailable !== undefined) {
      query += ` AND dp.is_available = $${paramIndex}`;
      params.push(filters.isAvailable);
      paramIndex++;
    }

    if (filters.minExperience) {
      query += ` AND dp.experience_years >= $${paramIndex}`;
      params.push(filters.minExperience);
      paramIndex++;
    }

    if (filters.maxFee) {
      query += ` AND dp.consultation_fee <= $${paramIndex}`;
      params.push(filters.maxFee);
      paramIndex++;
    }

    if (filters.minRating) {
      query += ` AND dp.rating >= $${paramIndex}`;
      params.push(filters.minRating);
      paramIndex++;
    }

    query += ' ORDER BY dp.rating DESC, dp.total_consultations DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateOnlineStatus(profileId, isOnline) {
    const result = await pool.query(
      `UPDATE doctor_profiles SET is_online = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [isOnline, profileId]
    );
    return result.rows[0];
  }

  static async incrementConsultations(profileId) {
    const result = await pool.query(
      `UPDATE doctor_profiles SET total_consultations = total_consultations + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [profileId]
    );
    return result.rows[0];
  }

  static async getDashboardStats(doctorProfileId) {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND status = 'completed') as total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = $1 AND appointment_date = CURRENT_DATE) as today_appointments,
        (SELECT COUNT(*) FROM feedback WHERE doctor_id = $1) as total_feedback,
        (SELECT AVG(rating) FROM feedback WHERE doctor_id = $1) as average_rating`,
      [doctorProfileId]
    );
    return result.rows[0];
  }
}

module.exports = DoctorProfile;
