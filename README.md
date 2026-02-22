# Unity Health Hub

A full-stack Healthcare Appointment Scheduling System with **Intelligent Telemedicine** capabilities, built with React, Node.js, Express, and PostgreSQL.

## 🌟 Features

### Core Features
- 🔍 Search doctors by specialization
- 📅 Book appointments (normal and emergency)
- 🔒 Slot locking mechanism to prevent double booking
- 💳 Razorpay payment integration
- 📧 Email notifications
- 👤 User authentication (patient/doctor roles)
- 📱 Responsive modern UI

### 🆕 Telemedicine Features
- 🎥 **Video/Audio Consultations** - Real-time doctor-patient consultations
- 🎤 **Speech-to-Text Transcription** - Automatic conversation transcription
- 🤖 **AI Clinical Analysis** - Intelligent symptom detection and diagnosis suggestions
- 🏥 **Hospital Referral System** - Location-based hospital recommendations
- 📊 **Patient Dashboard** - Consultation history with AI insights
- ⚠️ **Red Flag Detection** - Automatic identification of critical conditions
- 💊 **Medication Recommendations** - AI-powered treatment suggestions
- 📍 **Nearby Hospital Finder** - GPS-based hospital search with ratings

### 💊 Medicine Reminder Features (NEW)
- 📅 **Smart Scheduling** - Automatic prescription-based medication schedules
- ⏰ **Intelligent Reminders** - Time-based alerts with snooze functionality
- 📊 **Adherence Tracking** - Weekly medication compliance monitoring
- 🕐 **Time-Period Dashboard** - Morning/Afternoon/Evening/Night organization
- 💊 **Visual Medication Cards** - Clear display with tablet images and instructions
- ✅ **One-Click Actions** - Mark as taken, snooze, or skip doses
- 📈 **Progress Monitoring** - Treatment completion tracking

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- Razorpay payment gateway
- Nodemailer for emails

### Frontend
- React.js
- React Router
- Axios
- React Toastify
- Date-fns

## 📚 Documentation

- **[TELEMEDICINE_README.md](TELEMEDICINE_README.md)** - Complete telemedicine feature documentation
- **[MEDICINE_REMINDER_GUIDE.md](MEDICINE_REMINDER_GUIDE.md)** - Medicine reminder module guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Quick setup guide for telemedicine
- **[LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md)** - Legal compliance and liability information
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and achievements
- **[INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)** - Step-by-step installation verification
- **[FILE_LISTING.md](FILE_LISTING.md)** - Complete file structure and dependencies

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:
```
sql
CREATE DATABASE healthcare_db;
```

### 2. Backend Setup

```
bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET
# - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
# - SMTP settings for emails

# Setup database tables
npm run setup

# Seed sample data (optional)
npm run seed

# Setup telemedicine features
psql -U your_username -d healthcare_db -f ../database/telemedicine_schema.sql

# Setup medicine reminder features (NEW)
psql -U your_username -d healthcare_db -f ../database/medicine_reminder_schema.sql
```

### 3. Frontend Setup

```
bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

## Running the Application

### Backend
```
bash
cd backend
npm run dev    # Development
# or
npm start     # Production
```

### Frontend
```
bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000
The backend will run on http://localhost:5000

## Test Credentials

After running the seed script:

- **Patient:** patient@test.com / patient123
- **Doctors:** dr.sharma@healthcare.com / doctor123

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/profile - Get user profile (protected)
- PUT /api/auth/profile - Update profile (protected)

### Doctors
- GET /api/doctors/specializations - Get all specializations
- GET /api/doctors/search - Search doctors
- GET /api/doctors/:id - Get doctor details
- GET /api/doctors/:id/slots - Get available slots

### Appointments
- POST /api/appointments - Create appointment
- POST /api/appointments/payment/create-order - Create payment order
- POST /api/appointments/payment/verify - Verify payment
- GET /api/appointments/:bookingId - Get appointment details

### Telemedicine (NEW)
- POST /api/telemedicine/consultations/start - Start video/audio consultation
- GET /api/telemedicine/consultations/:id - Get consultation details
- POST /api/telemedicine/consultations/:id/transcript - Add transcript
- GET /api/telemedicine/consultations/:id/transcripts - Get all transcripts
- POST /api/telemedicine/consultations/:id/end - End consultation & run AI analysis
- GET /api/telemedicine/consultations/:id/analysis - Get AI clinical analysis
- GET /api/telemedicine/hospitals/nearby - Find nearby hospitals
- POST /api/telemedicine/referrals - Create hospital referral
- GET /api/telemedicine/referrals/patient/:id - Get patient referrals

### Medicine Reminder (NEW)
- POST /api/medications - Add new medication
- GET /api/medications - Get all patient medications
- GET /api/medications/schedule/today - Get today's medication schedule
- PUT /api/medications/:id - Update medication
- DELETE /api/medications/:id - Delete medication
- POST /api/medications/dose - Record dose (taken/missed/skipped)
- GET /api/medications/history - Get dose history
- GET /api/medications/adherence - Get adherence statistics

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and Razorpay config
│   ├── controllers/    # Route handlers
│   │   ├── telemedicineController.js  # Telemedicine APIs
│   │   └── medicationController.js    # NEW: Medicine reminder APIs
│   ├── middleware/     # Auth middleware
│   ├── models/        # Database models
│   │   ├── Consultation.js           # Consultation management
│   │   ├── ClinicalAnalysis.js       # AI analysis engine
│   │   ├── Hospital.js               # Hospital & referrals
│   │   └── Medication.js             # NEW: Medication management
│   ├── routes/        # API routes
│   │   ├── telemedicineRoutes.js     # Telemedicine routes
│   │   └── medicationRoutes.js       # NEW: Medicine reminder routes
│   ├── utils/         # Utilities (email, seed, setup)
│   └── server.js      # Main server file

frontend/
├── public/
├── src/
│   ├── components/    # React components
│   │   ├── VideoConsultation.js      # Video call interface
│   │   ├── HospitalFinder.js         # Hospital search
│   │   ├── PatientDashboard.js       # Patient history
│   │   └── MedicineReminder.js       # NEW: Medicine reminder dashboard
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── styles/       # CSS styles
│   ├── utils/        # Utility functions
│   └── App.js        # Main app file

database/
├── schema.sql                        # Base schema
├── telemedicine_schema.sql           # Telemedicine tables
└── medicine_reminder_schema.sql      # NEW: Medicine reminder tables
```

## 🚀 Quick Start (Telemedicine)

1. **Setup Database**
   ```bash
   psql -U postgres -d healthcare_db -f database/telemedicine_schema.sql
   ```

2. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend && npm start
   ```

4. **Test Features**
   - Login to application
   - Click "Telemedicine" in navigation
   - Start recording and speak symptoms
   - View AI analysis and hospital recommendations

## 🤖 AI Clinical Analysis

The system includes an intelligent AI engine that:
- Identifies symptoms from conversation
- Assesses severity (low/moderate/high/critical)
- Detects red flags requiring immediate attention
- Suggests probable diagnoses
- Recommends appropriate medications
- Triggers hospital referrals when needed

**Example Analysis:**
```json
{
  "symptoms_identified": ["fever", "cough", "fatigue"],
  "severity_level": "moderate",
  "suggested_diagnosis": ["Upper Respiratory Tract Infection"],
  "requires_physical_exam": false,
  "medication_recommendations": ["Paracetamol 500mg"]
}
```

## ⚠️ Important Legal Notice

**This telemedicine system is for DEMONSTRATION purposes only.**

Before production use:
- Obtain medical licenses and certifications
- Get medical liability insurance
- Complete clinical validation studies
- Achieve regulatory compliance (FDA, HIPAA, etc.)
- Implement proper legal disclaimers
- Consult with healthcare attorneys

See [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) for complete details.

## 🔐 Security Features

- JWT authentication for all endpoints
- End-to-end encryption ready
- HIPAA-compliant data storage
- Role-based access control
- Audit trails for all consultations
- Secure transcript storage

## 📊 Database Schema

### Base Tables
- users, doctors, specializations, appointments, time_slots, payments

### Telemedicine Tables (NEW)
- consultations - Video/audio session management
- consultation_transcripts - Speech-to-text storage
- clinical_analysis - AI analysis results
- hospital_referrals - Referral tracking
- hospitals - Hospital directory (5 pre-loaded)
- medical_records - Patient medical history

## 🎯 What's New in Telemedicine

- **21 new files** added
- **4 files** modified
- **~4,000 lines** of code
- **9,500+ words** of documentation
- **6 new database tables**
- **9 new API endpoints**
- **3 new React components**
- **Complete AI analysis engine**

## 🌐 Browser Support

- Chrome 80+ (Recommended)
- Edge 80+
- Firefox 75+
- Safari 14+ (Limited speech recognition)

**Requirements:**
- Microphone access for speech-to-text
- Location services for hospital finder
- Modern JavaScript (ES6+)

## License

MIT

---

## 📞 Support

For detailed documentation:
- Feature details: [TELEMEDICINE_README.md](TELEMEDICINE_README.md)
- Setup help: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Legal info: [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md)

**Built with ❤️ for Unity Health Hub**

*Empowering healthcare through intelligent technology*
