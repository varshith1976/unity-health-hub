# 🏥 Unity Health Hub - Telemedicine Extension

## Overview
This extension adds intelligent telemedicine capabilities to Unity Health Hub, enabling real-time video/audio consultations with AI-powered clinical analysis and hospital referral system.

## 🎯 New Features

### 1. **Video/Audio Consultation**
- Real-time video and audio consultations between doctors and patients
- WebRTC-based communication (ready for integration)
- Session management with unique room IDs
- Consultation duration tracking

### 2. **Real-Time Speech-to-Text Transcription**
- Automatic transcription of doctor-patient conversations
- Uses Web Speech API (browser-based)
- Supports medical terminology
- Confidence scoring for each transcript
- Secure storage of consultation transcripts

### 3. **AI-Powered Clinical Analysis**
- **Symptom Identification**: Automatically extracts symptoms from conversation
- **Severity Assessment**: Classifies conditions as low, moderate, high, or critical
- **Risk Factor Detection**: Identifies patient risk factors (diabetes, hypertension, etc.)
- **Diagnosis Suggestions**: Provides probable diagnoses based on symptoms
- **Red Flag Detection**: Alerts for critical conditions requiring immediate attention
- **Medication Recommendations**: Suggests appropriate medications for treatable conditions

### 4. **Intelligent Hospital Referral System**
- Automatic detection when physical examination is required
- Location-based hospital search (nearest hospitals)
- Hospital filtering by specialization
- Distance calculation using Haversine formula
- Hospital ratings and availability information
- Emergency care indicators
- One-click navigation to Google Maps
- Direct call functionality

### 5. **Patient Dashboard**
- Consultation history with complete details
- Access to past transcripts
- View AI analysis for each consultation
- Track symptoms and diagnoses over time
- Medication history
- Follow-up recommendations

## 📁 File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Consultation.js          # Consultation management
│   │   ├── ClinicalAnalysis.js      # AI analysis engine
│   │   └── Hospital.js              # Hospital & referral system
│   ├── controllers/
│   │   └── telemedicineController.js # API endpoints
│   └── routes/
│       └── telemedicineRoutes.js    # Route definitions

frontend/
├── src/
│   └── components/
│       ├── VideoConsultation.js     # Video call interface
│       ├── VideoConsultation.css
│       ├── HospitalFinder.js        # Hospital search & referral
│       ├── HospitalFinder.css
│       ├── PatientDashboard.js      # Patient history dashboard
│       └── PatientDashboard.css

database/
└── telemedicine_schema.sql          # Extended database schema
```

## 🗄️ Database Schema

### New Tables:
1. **consultations** - Video/audio session management
2. **consultation_transcripts** - Real-time transcription storage
3. **clinical_analysis** - AI analysis results
4. **hospital_referrals** - Referral tracking
5. **hospitals** - Hospital directory
6. **medical_records** - Patient medical history

## 🔌 API Endpoints

### Consultation Management
```
POST   /api/telemedicine/consultations/start
GET    /api/telemedicine/consultations/:consultationId
POST   /api/telemedicine/consultations/:consultationId/end
```

### Transcription
```
POST   /api/telemedicine/consultations/:consultationId/transcript
GET    /api/telemedicine/consultations/:consultationId/transcripts
```

### Clinical Analysis
```
GET    /api/telemedicine/consultations/:consultationId/analysis
```

### Hospital & Referrals
```
GET    /api/telemedicine/hospitals/nearby
POST   /api/telemedicine/referrals
GET    /api/telemedicine/referrals/patient/:patientId
```

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Run the telemedicine schema
psql -U your_user -d healthcare_db -f database/telemedicine_schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
# Server already configured - routes auto-loaded
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Components already integrated in App.js
npm start
```

## 🤖 AI Clinical Analysis Engine

### How It Works:
1. **Transcript Collection**: Real-time speech-to-text during consultation
2. **Keyword Extraction**: Identifies medical terms and symptoms
3. **Pattern Matching**: Uses regex patterns for symptom detection
4. **Severity Assessment**: Analyzes symptom combinations and keywords
5. **Risk Evaluation**: Checks for red flags and critical conditions
6. **Diagnosis Generation**: Suggests probable diagnoses
7. **Treatment Recommendations**: Provides medication suggestions

### Analysis Capabilities:
- ✅ Symptom identification (fever, cough, chest pain, etc.)
- ✅ Severity classification (low/moderate/high/critical)
- ✅ Red flag detection (chest pain, severe bleeding, stroke symptoms)
- ✅ Risk factor identification (diabetes, hypertension, smoking)
- ✅ Diagnosis suggestions based on symptom patterns
- ✅ Medication recommendations for treatable conditions
- ✅ Hospital referral triggers

### Example Analysis Output:
```json
{
  "symptoms_identified": ["fever", "cough", "fatigue"],
  "severity_level": "moderate",
  "risk_factors": ["Diabetes", "Hypertension"],
  "suggested_diagnosis": ["Upper Respiratory Tract Infection", "Viral Fever"],
  "diagnosis_confidence": 0.75,
  "medication_recommendations": ["Paracetamol 500mg", "Cough syrup"],
  "requires_physical_exam": false,
  "requires_emergency_care": false,
  "red_flags": [],
  "clinical_keywords": ["fever", "cough", "fatigue"]
}
```

## 🏥 Hospital Referral System

### Features:
- **Location-Based Search**: Finds hospitals within radius
- **Specialization Matching**: Filters by required specialty
- **Distance Calculation**: Shows distance from patient location
- **Rating System**: Displays hospital ratings and reviews
- **Emergency Indicators**: Shows emergency availability
- **Bed Availability**: Real-time bed count
- **Navigation Integration**: Direct Google Maps integration
- **Call Integration**: One-click phone calls

### Sample Hospitals (Pre-loaded):
- Apollo Hospital (Cardiology, Neurology, Oncology)
- Fortis Hospital (Cardiology, Gastroenterology)
- KIMS Hospital (Oncology, Neurology)
- Care Hospital (Cardiology, Pulmonology)
- Yashoda Hospital (Gastroenterology, Nephrology)

## 🔒 Security & Compliance

### Implemented:
- ✅ JWT authentication for all endpoints
- ✅ Encrypted transcript storage
- ✅ HIPAA-compliant data handling
- ✅ Access control (patient can only view own data)
- ✅ Audit trails for all consultations

### Legal Disclaimers:
⚠️ **IMPORTANT**: This is a demonstration system. For production use:
1. Integrate with certified medical AI services
2. Obtain medical liability insurance
3. Implement proper clinical validation
4. Add legal disclaimers for AI recommendations
5. Ensure compliance with local healthcare regulations
6. Get approval from medical regulatory authorities

## 🎨 User Interface

### Video Consultation Screen:
- Video stream display (main + thumbnail)
- Recording controls
- Live transcript display
- End consultation button
- AI analysis modal (post-consultation)

### Hospital Finder:
- Hospital cards with ratings
- Distance indicators
- Specialization badges
- Emergency availability
- Map and call buttons
- Referral creation

### Patient Dashboard:
- Consultation history cards
- Detailed transcript view
- AI analysis display
- Severity indicators
- Medication history
- Recommendations

## 🔧 Customization

### Extend AI Analysis:
Edit `backend/src/models/ClinicalAnalysis.js`:
- Add more symptom patterns
- Customize severity thresholds
- Add new diagnosis rules
- Integrate external AI APIs (OpenAI, AWS Comprehend Medical)

### Add More Hospitals:
```sql
INSERT INTO hospitals (name, address, city, latitude, longitude, specializations, rating)
VALUES ('Hospital Name', 'Address', 'City', lat, lng, ARRAY['Spec1', 'Spec2'], 4.5);
```

### Customize Transcription:
- Modify `VideoConsultation.js` to use different speech recognition services
- Integrate with Google Cloud Speech-to-Text or AWS Transcribe Medical

## 📊 Future Enhancements

### Recommended Additions:
1. **WebRTC Integration**: Replace placeholder with actual video streaming
2. **AI Service Integration**: Connect to AWS Comprehend Medical or Google Healthcare API
3. **Prescription Generation**: Automated e-prescription creation
4. **Lab Test Integration**: Order lab tests directly
5. **Pharmacy Integration**: Send prescriptions to pharmacies
6. **Insurance Claims**: Automated insurance processing
7. **Multi-language Support**: Transcription in multiple languages
8. **Wearable Integration**: Import data from fitness trackers
9. **Appointment Reminders**: SMS/Email notifications
10. **Doctor Notes**: Rich text editor for doctor's notes

## 🧪 Testing

### Test the Features:
1. **Start Consultation**: Click "Telemedicine" in navigation
2. **Enable Microphone**: Allow browser microphone access
3. **Start Recording**: Click recording button
4. **Speak Symptoms**: Say "I have fever and cough"
5. **End Consultation**: View AI analysis
6. **Hospital Referral**: If recommended, find nearby hospitals

### Sample Test Phrases:
- "I have severe chest pain radiating to my left arm" (Critical - triggers referral)
- "I have mild fever and cough for 2 days" (Low severity)
- "I'm experiencing shortness of breath and dizziness" (High severity)

## 📞 Support

For issues or questions:
- Check console logs for errors
- Verify database schema is properly loaded
- Ensure browser supports Web Speech API
- Check microphone permissions

## 📄 License

MIT License - See main README.md

---

**⚠️ Medical Disclaimer**: This system provides AI-assisted suggestions only. All medical decisions must be made by licensed healthcare professionals. The AI analysis is for informational purposes and should not replace professional medical judgment.
