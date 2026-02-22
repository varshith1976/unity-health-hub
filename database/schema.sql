-- Healthcare Appointment System Database Schema

-- Users Table (Patients, Doctors, Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specializations Table
CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- Doctors Table
CREATE TABLE doctors (
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
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Slots Table
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_emergency_slot BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, slot_date, slot_time)
);

-- Appointments Table
CREATE TABLE appointments (
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
);

-- Payments Table
CREATE TABLE payments (
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
);

-- Insert Default Specializations (20 Specializations)
INSERT INTO specializations (name, description, icon) VALUES
('Cardiologist', 'Heart and cardiovascular system specialist', '❤️'),
('Nephrologist', 'Kidney and urinary system specialist', '🫘'),
('Ophthalmologist', 'Eye and vision specialist', '👁️'),
('Dermatologist', 'Skin, hair and nail specialist', '🧴'),
('Neurologist', 'Brain and nervous system specialist', '🧠'),
('Orthopedic Surgeon', 'Bones, joints and muscles specialist', '🦴'),
('Pediatrician', 'Child and infant healthcare specialist', '👶'),
('General Physician', 'Primary care and general health', '🩺'),
('Gastroenterologist', 'Digestive system specialist', '🍽️'),
('Pulmonologist', 'Lungs and respiratory system', '🫁'),
('Endocrinologist', 'Hormone and metabolic specialist', '💉'),
('Psychiatrist', 'Mental health and behavioral specialist', '🧘'),
('Gynecologist', 'Women health and pregnancy specialist', '🌸'),
('Urologist', 'Urinary tract and male reproductive specialist', '🔬'),
('Oncologist', 'Cancer diagnosis and treatment specialist', '🎗️'),
('ENT Specialist', 'Ear, nose and throat specialist', '👂'),
('Dentist', 'Dental and oral health specialist', '🦷'),
('Rheumatologist', 'Arthritis and joint disorders specialist', '💪'),
('Vascular Surgeon', 'Blood vessels and circulation specialist', '🩸'),
('Dietitian', 'Nutrition and diet planning specialist', '🥗');

-- Create Indexes for Performance
CREATE INDEX idx_doctors_specialization ON doctors(specialization_id);
CREATE INDEX idx_doctors_available ON doctors(is_available);
CREATE INDEX idx_time_slots_doctor_date ON time_slots(doctor_id, slot_date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_booking_id ON appointments(booking_id);
