const pool = require('../config/database');

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create Specializations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS specializations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50)
      )
    `);
    console.log('✓ Specializations table created');

    // Create Doctors Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        specialization_id INTEGER REFERENCES specializations(id),
        qualifications TEXT,
        experience_years INTEGER,
        consultation_fee DECIMAL(10, 2),
        emergency_fee DECIMAL(10, 2),
        rating DECIMAL(3, 2) DEFAULT 0.00,
        total_reviews INTEGER DEFAULT 0,
        hospital_name VARCHAR(255),
        hospital_address TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Doctors table created');

    // Create Time Slots Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        slot_date DATE NOT NULL,
        slot_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT true,
        is_emergency_slot BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(doctor_id, slot_date, slot_time)
      )
    `);
    console.log('✓ Time slots table created');

    // Create Appointments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        patient_id INTEGER REFERENCES users(id),
        doctor_id INTEGER REFERENCES doctors(id),
        slot_id INTEGER REFERENCES time_slots(id),
        appointment_type VARCHAR(20) NOT NULL CHECK (appointment_type IN ('normal', 'emergency')),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        patient_age INTEGER,
        patient_gender VARCHAR(20),
        patient_phone VARCHAR(20),
        patient_email VARCHAR(255),
        symptoms TEXT,
        medical_conditions TEXT,
        previous_consultations TEXT,
        consultation_fee DECIMAL(10, 2),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        payment_id VARCHAR(100),
        transaction_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
        slot_locked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Appointments table created');

    // Create Payments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER REFERENCES appointments(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_gateway VARCHAR(50),
        gateway_payment_id VARCHAR(100),
        gateway_order_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Payments table created');

    // Create Indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_doctors_available ON doctors(is_available)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_time_slots_doctor_date ON time_slots(doctor_id, slot_date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(is_available)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_appointments_booking_id ON appointments(booking_id)');
    console.log('✓ Indexes created');

    // Insert Default Specializations
    await client.query(`
      INSERT INTO specializations (name, description, icon) VALUES
      ('Cardiologist', 'Heart specialist', '❤️'),
      ('Nephrologist', 'Kidney specialist', '🫘'),
      ('Ophthalmologist', 'Eye specialist', '👁️'),
      ('Dermatologist', 'Skin specialist', '🧴'),
      ('Neurologist', 'Brain & nervous system', '🧠'),
      ('Orthopedic Surgeon', 'Bones & joints', '🦴'),
      ('Pediatrician', 'Children specialist', '👶'),
      ('General Physician', 'Primary care', '🩺')
      ON CONFLICT (name) DO NOTHING
    `);
    console.log('✓ Default specializations inserted');

    await client.query('COMMIT');
    console.log('\n✅ Database setup completed successfully!\n');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database setup error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = setupDatabase;
