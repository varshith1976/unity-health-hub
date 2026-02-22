-- Telemedicine Extension Schema

-- Consultations Table (Video/Audio/Chat Sessions)
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    consultation_type VARCHAR(20) NOT NULL CHECK (consultation_type IN ('video', 'audio', 'chat')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    room_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Transcripts Table
CREATE TABLE consultation_transcripts (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
    speaker VARCHAR(20) CHECK (speaker IN ('doctor', 'patient')),
    transcript_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence_score DECIMAL(3, 2)
);

-- AI Clinical Analysis Table
CREATE TABLE clinical_analysis (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id) ON DELETE CASCADE,
    symptoms_identified TEXT[],
    severity_level VARCHAR(20) CHECK (severity_level IN ('low', 'moderate', 'high', 'critical')),
    risk_factors TEXT[],
    suggested_diagnosis TEXT[],
    diagnosis_confidence DECIMAL(3, 2),
    medication_recommendations TEXT[],
    requires_physical_exam BOOLEAN DEFAULT false,
    requires_emergency_care BOOLEAN DEFAULT false,
    red_flags TEXT[],
    clinical_keywords TEXT[],
    analysis_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital Referrals Table
CREATE TABLE hospital_referrals (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultations(id),
    patient_id INTEGER REFERENCES users(id),
    hospital_id INTEGER,
    referral_reason TEXT NOT NULL,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('routine', 'urgent', 'emergency')),
    specialization_required VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals Table
CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    specializations TEXT[],
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    emergency_available BOOLEAN DEFAULT true,
    bed_availability INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Medical Records (Enhanced)
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consultation_id INTEGER REFERENCES consultations(id),
    diagnosis TEXT,
    medications_prescribed TEXT[],
    lab_tests_recommended TEXT[],
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_consultations_appointment ON consultations(appointment_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_transcripts_consultation ON consultation_transcripts(consultation_id);
CREATE INDEX idx_clinical_analysis_consultation ON clinical_analysis(consultation_id);
CREATE INDEX idx_hospital_referrals_patient ON hospital_referrals(patient_id);
CREATE INDEX idx_hospitals_location ON hospitals(latitude, longitude);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);

-- Insert Sample Hospitals
INSERT INTO hospitals (name, address, city, state, pincode, latitude, longitude, phone, email, specializations, rating, emergency_available, bed_availability) VALUES
('Apollo Hospital', '123 Medical District, Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 17.4326, 78.4071, '+91-40-23607777', 'info@apollohyd.com', ARRAY['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'], 4.7, true, 45),
('Fortis Hospital', '456 Healthcare Avenue, Banjara Hills', 'Hyderabad', 'Telangana', '500034', 17.4239, 78.4738, '+91-40-44446666', 'contact@fortishyd.com', ARRAY['Cardiology', 'Gastroenterology', 'Nephrology'], 4.5, true, 32),
('KIMS Hospital', '789 Medical Road, Secunderabad', 'Hyderabad', 'Telangana', '500003', 17.4399, 78.4983, '+91-40-44885555', 'info@kimshospitals.com', ARRAY['Oncology', 'Neurology', 'Orthopedics'], 4.6, true, 28),
('Care Hospital', '321 Health Street, Nampally', 'Hyderabad', 'Telangana', '500001', 17.3850, 78.4867, '+91-40-61651234', 'care@carehospitals.com', ARRAY['Cardiology', 'Pulmonology', 'Endocrinology'], 4.4, true, 38),
('Yashoda Hospital', '654 Wellness Lane, Somajiguda', 'Hyderabad', 'Telangana', '500082', 17.4239, 78.4738, '+91-40-23554455', 'info@yashodahospitals.com', ARRAY['Gastroenterology', 'Nephrology', 'Urology'], 4.5, true, 41);
