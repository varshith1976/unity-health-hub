const pool = require('../config/database');

class Hospital {
  static async findNearby(latitude, longitude, specialization = null, limit = 5) {
    // Haversine formula for distance calculation
    let query = `
      SELECT *, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
        sin(radians(latitude)))) AS distance
      FROM hospitals
      WHERE emergency_available = true
    `;
    
    const params = [latitude, longitude];
    
    if (specialization) {
      query += ` AND $3 = ANY(specializations)`;
      params.push(specialization);
    }
    
    query += ` ORDER BY distance ASC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM hospitals WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search(filters) {
    const { city, specialization, minRating } = filters;
    let query = 'SELECT * FROM hospitals WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (city) {
      query += ` AND LOWER(city) = LOWER($${paramCount})`;
      params.push(city);
      paramCount++;
    }

    if (specialization) {
      query += ` AND $${paramCount} = ANY(specializations)`;
      params.push(specialization);
      paramCount++;
    }

    if (minRating) {
      query += ` AND rating >= $${paramCount}`;
      params.push(minRating);
      paramCount++;
    }

    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async createReferral(referralData) {
    const {
      consultationId,
      patientId,
      hospitalId,
      reason,
      urgencyLevel,
      specializationRequired
    } = referralData;

    const query = `
      INSERT INTO hospital_referrals (
        consultation_id, patient_id, hospital_id, referral_reason,
        urgency_level, specialization_required
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(query, [
      consultationId,
      patientId,
      hospitalId,
      reason,
      urgencyLevel,
      specializationRequired
    ]);

    return result.rows[0];
  }

  static async getReferralsByPatient(patientId) {
    const query = `
      SELECT hr.*, h.name as hospital_name, h.address, h.phone, h.rating
      FROM hospital_referrals hr
      JOIN hospitals h ON hr.hospital_id = h.id
      WHERE hr.patient_id = $1
      ORDER BY hr.created_at DESC
    `;
    const result = await pool.query(query, [patientId]);
    return result.rows;
  }
}

module.exports = Hospital;
