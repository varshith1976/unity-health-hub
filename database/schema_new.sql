-- Unity Health Hub - Complete Healthcare Platform Database Schema

-- Users Table (Patients, Doctors, Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specializations Table
CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

-- Doctor Profiles Table (Additional doctor-specific data)
CREATE TABLE doctor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    specialization_id INTEGER REFERENCES specializations(id),
    license_number VARCHAR(100) UNIQUE,
    qualifications TEXT,
    experience_years INTEGER,
    consultation_fee DECIMAL(10, 2),
    emergency_fee DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_consultations INTEGER DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    hospital_name VARCHAR(255),
    hospital_address TEXT,
    bio TEXT,
    languages_spoken TEXT[],
    available_days VARCHAR(50)[],
    available_start_time TIME,
    available_end_time TIME,
    is_available BOOLEAN DEFAULT true,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Slots Table
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id) ON DELETE CASCADE,
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
    doctor_id INTEGER REFERENCES doctor_profiles(id),
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
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no-show')),
    slot_locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultations Table (Video/Audio consultations)
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    consultation_type VARCHAR(20) CHECK (consultation_type IN ('video', 'audio')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    transcript TEXT,
    ai_analysis JSONB,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id),
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    appointment_id INTEGER REFERENCES appointments(id),
    medicines JSONB NOT NULL,
    precautions TEXT,
    lifestyle_recommendations TEXT,
    diagnostic_tests TEXT,
    referral_notes TEXT,
    follow_up_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id),
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    appointment_id INTEGER REFERENCES appointments(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    consultation_id INTEGER REFERENCES consultations(id),
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctor_profiles_specialization ON doctor_profiles(specialization_id);
CREATE INDEX idx_doctor_profiles_available ON doctor_profiles(is_available);
CREATE INDEX idx_time_slots_doctor_date ON time_slots(doctor_id, slot_date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_booking_id ON appointments(booking_id);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX idx_feedback_doctor ON feedback(doctor_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
