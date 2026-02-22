const pool = require('../config/database');

class Medication {
  static async create(medicationData) {
    const {
      patient_id,
      prescription_id,
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
    } = medicationData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const medicationResult = await client.query(
        `INSERT INTO medications 
        (patient_id, prescription_id, medicine_name, dosage, dosage_type, quantity, 
         frequency, meal_instruction, start_date, end_date, treatment_duration)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [patient_id, prescription_id, medicine_name, dosage, dosage_type, quantity,
         frequency, meal_instruction, start_date, end_date, treatment_duration]
      );

      const medication = medicationResult.rows[0];

      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          await client.query(
            `INSERT INTO medication_schedules (medication_id, scheduled_time, time_period)
             VALUES ($1, $2, $3)`,
            [medication.id, schedule.time, schedule.period]
          );
        }
      }

      await client.query('COMMIT');
      return medication;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByPatientId(patientId) {
    const result = await pool.query(
      `SELECT m.*, 
       json_agg(json_build_object('time', ms.scheduled_time, 'period', ms.time_period)) as schedules
       FROM medications m
       LEFT JOIN medication_schedules ms ON m.id = ms.medication_id
       WHERE m.patient_id = $1 AND m.is_active = true
       GROUP BY m.id
       ORDER BY m.created_at DESC`,
      [patientId]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT m.*, 
       json_agg(json_build_object('time', ms.scheduled_time, 'period', ms.time_period)) as schedules
       FROM medications m
       LEFT JOIN medication_schedules ms ON m.id = ms.medication_id
       WHERE m.id = $1
       GROUP BY m.id`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    
    const result = await pool.query(
      `UPDATE medications SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('UPDATE medications SET is_active = false WHERE id = $1', [id]);
  }

  static async recordDose(doseData) {
    const { medication_id, patient_id, scheduled_time, actual_time, status, notes } = doseData;
    
    const result = await pool.query(
      `INSERT INTO dose_history (medication_id, patient_id, scheduled_time, actual_time, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [medication_id, patient_id, scheduled_time, actual_time, status, notes]
    );
    return result.rows[0];
  }

  static async getDoseHistory(patientId, startDate, endDate) {
    const result = await pool.query(
      `SELECT dh.*, m.medicine_name, m.dosage
       FROM dose_history dh
       JOIN medications m ON dh.medication_id = m.id
       WHERE dh.patient_id = $1 AND dh.scheduled_time BETWEEN $2 AND $3
       ORDER BY dh.scheduled_time DESC`,
      [patientId, startDate, endDate]
    );
    return result.rows;
  }

  static async getAdherenceStats(patientId, days = 7) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_doses,
        COUNT(CASE WHEN status = 'taken' THEN 1 END) as taken_doses,
        COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_doses,
        COUNT(CASE WHEN status = 'skipped' THEN 1 END) as skipped_doses,
        ROUND(COUNT(CASE WHEN status = 'taken' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as adherence_percentage
       FROM dose_history
       WHERE patient_id = $1 AND scheduled_time >= CURRENT_DATE - INTERVAL '${days} days'`,
      [patientId]
    );
    return result.rows[0];
  }

  static async getTodaySchedule(patientId) {
    const result = await pool.query(
      `SELECT m.*, ms.scheduled_time, ms.time_period,
       COALESCE(dh.status, 'pending') as dose_status
       FROM medications m
       JOIN medication_schedules ms ON m.id = ms.medication_id
       LEFT JOIN dose_history dh ON dh.medication_id = m.id 
         AND DATE(dh.scheduled_time) = CURRENT_DATE
         AND TIME(dh.scheduled_time) = ms.scheduled_time
       WHERE m.patient_id = $1 AND m.is_active = true
       ORDER BY ms.scheduled_time`,
      [patientId]
    );
    return result.rows;
  }
}

module.exports = Medication;
