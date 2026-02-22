const pool = require('../config/database');

class Doctor {
  static async findBySpecialization(specializationId, filters = {}) {
    let query = `
      SELECT 
        d.id, d.user_id, d.qualifications, d.experience_years,
        d.consultation_fee, d.emergency_fee, d.rating, d.total_reviews,
        d.hospital_name, d.hospital_address, d.image_url,
        u.full_name, u.email, u.phone,
        s.name as specialization, s.description as specialization_description
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN specializations s ON d.specialization_id = s.id
      WHERE d.is_available = true
        AND d.specialization_id = $1
    `;

    const params = [specializationId];
    let paramIndex = 2;

    // Only filter by available slots if no filters applied
    if (Object.keys(filters).length === 0) {
      query += ` AND EXISTS (
        SELECT 1 FROM time_slots ts 
        WHERE ts.doctor_id = d.id 
          AND ts.is_available = true 
          AND ts.slot_date >= CURRENT_DATE
      )`;
    }

    if (filters.minExperience) {
      query += ` AND d.experience_years >= $${paramIndex}`;
      params.push(filters.minExperience);
      paramIndex++;
    }

    if (filters.maxFee) {
      query += ` AND d.consultation_fee <= $${paramIndex}`;
      params.push(filters.maxFee);
      paramIndex++;
    }

    if (filters.minRating) {
      query += ` AND d.rating >= $${paramIndex}`;
      params.push(filters.minRating);
      paramIndex++;
    }

    query += ' ORDER BY d.rating DESC, d.experience_years DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT 
        d.*, u.full_name, u.email, u.phone,
        s.name as specialization, s.description as specialization_description
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN specializations s ON d.specialization_id = s.id
      WHERE d.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async getAvailableSlots(doctorId, startDate, endDate) {
    const result = await pool.query(
      `SELECT id, slot_date, slot_time, is_emergency_slot
       FROM time_slots
       WHERE doctor_id = $1
         AND is_available = true
         AND slot_date BETWEEN $2 AND $3
       ORDER BY slot_date, slot_time`,
      [doctorId, startDate, endDate]
    );
    return result.rows;
  }

  static async findEmergencySlot(specializationId) {
    const result = await pool.query(
      `SELECT ts.id, ts.doctor_id, ts.slot_date, ts.slot_time, d.emergency_fee
       FROM time_slots ts
       JOIN doctors d ON ts.doctor_id = d.id
       WHERE d.specialization_id = $1
         AND ts.is_available = true
         AND ts.slot_date = CURRENT_DATE
         AND ts.slot_time >= CURRENT_TIME
       ORDER BY ts.slot_time
       LIMIT 1`,
      [specializationId]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT 
        d.*, u.full_name, u.email, u.phone,
        s.name as specialization, s.description as specialization_description
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN specializations s ON d.specialization_id = s.id
      WHERE d.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async create(doctorData) {
    const { userId, specializationId, qualifications, experienceYears, 
            consultationFee, emergencyFee, hospitalName, hospitalAddress, imageUrl } = doctorData;
    
    const result = await pool.query(
      `INSERT INTO doctors (
        user_id, specialization_id, qualifications, experience_years,
        consultation_fee, emergency_fee, hospital_name, hospital_address, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, specializationId, qualifications, experienceYears, 
       consultationFee, emergencyFee, hospitalName, hospitalAddress, imageUrl]
    );
    return result.rows[0];
  }

  static async update(id, doctorData) {
    const { qualifications, experienceYears, consultationFee, emergencyFee,
            hospitalName, hospitalAddress, isAvailable, imageUrl } = doctorData;
    
    const result = await pool.query(
      `UPDATE doctors SET
        qualifications = COALESCE($1, qualifications),
        experience_years = COALESCE($2, experience_years),
        consultation_fee = COALESCE($3, consultation_fee),
        emergency_fee = COALESCE($4, emergency_fee),
        hospital_name = COALESCE($5, hospital_name),
        hospital_address = COALESCE($6, hospital_address),
        image_url = COALESCE($7, image_url),
        is_available = COALESCE($8, is_available)
      WHERE id = $9
      RETURNING *`,
      [qualifications, experienceYears, consultationFee, emergencyFee,
       hospitalName, hospitalAddress, imageUrl, isAvailable, id]
    );
    return result.rows[0];
  }

  static async generateTimeSlots(doctorId, startDate, endDate, slotDuration = 30) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const startHour = 9;
      const endHour = 17;

      // Generate all dates from startDate to endDate
      const dates = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      
      while (currentDate <= end) {
        if (currentDate.getDay() !== 0) { // Skip Sundays
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Generate slots for each date
      for (const date of dates) {
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += slotDuration) {
            const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
            
            await client.query(
              `INSERT INTO time_slots (doctor_id, slot_date, slot_time, is_available)
               VALUES ($1, $2, $3, true)
               ON CONFLICT (doctor_id, slot_date, slot_time) DO NOTHING`,
              [doctorId, date.toISOString().split('T')[0], slotTime]
            );
          }
        }
      }

      await client.query('COMMIT');
      return { success: true, message: 'Time slots generated successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllDoctors(filters = {}) {
    let query = `
      SELECT 
        d.id, d.qualifications, d.experience_years,
        d.consultation_fee, d.emergency_fee, d.rating, d.total_reviews,
        d.hospital_name, d.hospital_address, d.image_url, d.is_available,
        u.full_name, u.email, u.phone,
        s.name as specialization
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN specializations s ON d.specialization_id = s.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (filters.specializationId) {
      query += ` AND d.specialization_id = $${paramIndex}`;
      params.push(filters.specializationId);
      paramIndex++;
    }

    if (filters.isAvailable !== undefined) {
      query += ` AND d.is_available = $${paramIndex}`;
      params.push(filters.isAvailable);
      paramIndex++;
    }

    query += ' ORDER BY d.rating DESC, d.experience_years DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Doctor;
