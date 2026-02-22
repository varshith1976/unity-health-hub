const pool = require('../config/database');

class Appointment {
  static generateBookingId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `APT-${timestamp}-${random}`.toUpperCase();
  }

  static async lockSlot(slotId, durationMinutes = 5) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkSlot = await client.query(
        'SELECT is_available FROM time_slots WHERE id = $1 FOR UPDATE',
        [slotId]
      );

      if (!checkSlot.rows[0] || !checkSlot.rows[0].is_available) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Slot not available' };
      }

      const lockUntil = new Date(Date.now() + durationMinutes * 60000);

      await client.query(
        'UPDATE time_slots SET is_available = false WHERE id = $1',
        [slotId]
      );

      await client.query('COMMIT');
      return { success: true, lockUntil };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async create(appointmentData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const bookingId = this.generateBookingId();
      const lockUntil = new Date(Date.now() + 5 * 60000);

      const result = await client.query(
        `INSERT INTO appointments (
          booking_id, patient_id, doctor_id, slot_id, appointment_type,
          appointment_date, appointment_time, patient_name, patient_age,
          patient_gender, patient_phone, patient_email, symptoms,
          medical_conditions, previous_consultations, consultation_fee,
          payment_status, slot_locked_until
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [
          bookingId, appointmentData.patientId, appointmentData.doctorId,
          appointmentData.slotId, appointmentData.appointmentType,
          appointmentData.appointmentDate, appointmentData.appointmentTime,
          appointmentData.patientName, appointmentData.patientAge,
          appointmentData.patientGender, appointmentData.patientPhone,
          appointmentData.patientEmail, appointmentData.symptoms,
          appointmentData.medicalConditions, appointmentData.previousConsultations,
          appointmentData.consultationFee, 'pending', lockUntil
        ]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePaymentStatus(appointmentId, paymentData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE appointments 
         SET payment_status = $1, payment_id = $2, transaction_id = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [paymentData.status, paymentData.paymentId, paymentData.transactionId, appointmentId]
      );

      if (paymentData.status === 'completed') {
        await client.query(
          'UPDATE time_slots SET is_available = false WHERE id = $1',
          [result.rows[0].slot_id]
        );
      } else if (paymentData.status === 'failed') {
        await client.query(
          'UPDATE time_slots SET is_available = true WHERE id = $1',
          [result.rows[0].slot_id]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByBookingId(bookingId) {
    const result = await pool.query(
      `SELECT a.*, 
        d.hospital_name, d.hospital_address,
        u.full_name as doctor_name,
        s.name as specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN specializations s ON d.specialization_id = s.id
       WHERE a.booking_id = $1`,
      [bookingId]
    );
    return result.rows[0];
  }

  static async releaseExpiredSlots() {
    await pool.query(
      `UPDATE time_slots ts
       SET is_available = true
       FROM appointments a
       WHERE ts.id = a.slot_id
         AND a.payment_status = 'pending'
         AND a.slot_locked_until < CURRENT_TIMESTAMP`
    );
  }
}

module.exports = Appointment;
