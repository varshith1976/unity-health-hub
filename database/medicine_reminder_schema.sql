-- Medicine Reminder Module Schema

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE SET NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    dosage_type VARCHAR(50) DEFAULT 'tablet',
    quantity INTEGER NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    meal_instruction VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    treatment_duration INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication schedules table
CREATE TABLE IF NOT EXISTS medication_schedules (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    scheduled_time TIME NOT NULL,
    time_period VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dose history table
CREATE TABLE IF NOT EXISTS dose_history (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP NOT NULL,
    actual_time TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication reminders table
CREATE TABLE IF NOT EXISTS medication_reminders (
    id SERIAL PRIMARY KEY,
    medication_id INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    snooze_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_medication_schedules_medication ON medication_schedules(medication_id);
CREATE INDEX idx_dose_history_patient ON dose_history(patient_id);
CREATE INDEX idx_dose_history_medication ON dose_history(medication_id);
CREATE INDEX idx_medication_reminders_patient ON medication_reminders(patient_id);
CREATE INDEX idx_medication_reminders_time ON medication_reminders(reminder_time);
