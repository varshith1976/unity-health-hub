# 🏥 Unity Health Hub - Appointment Scheduling System

A **professional, scalable, and secure** healthcare appointment scheduling web application with real-time slot management, payment integration, and modern UI/UX.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-v18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-blue)

---

## 🌟 Key Features

### ✅ Core Functionality
- **Specialization-Based Search** - Find doctors by 8 medical specializations
- **Advanced Filtering** - Filter by experience, consultation fee, rating, availability
- **Real-Time Slot Management** - Live availability with automatic updates
- **Dual Appointment Types**:
  - **Normal Appointments** - Choose your preferred date and time
  - **Emergency Appointments** - Auto-assigned to nearest available slot
- **Slot Locking** - 5-minute hold to prevent double booking
- **Secure Payment** - Razorpay integration with verification
- **Instant Confirmation** - Booking ID, receipt, and email notification

### 🔒 Security Features
- JWT authentication
- Password encryption (bcrypt)
- SQL injection protection
- Rate limiting
- CORS configuration
- Helmet.js security headers
- Payment signature verification

### 🎨 Professional UI/UX
- Modern, clean design
- Fully responsive (mobile, tablet, desktop)
- Smooth animations
- Toast notifications
- Loading states
- Error handling
- Professional color scheme

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL database
- JWT authentication
- Razorpay payment gateway
- bcrypt password hashing

**Frontend:**
- React.js 18
- React Router
- Axios for API calls
- React Icons
- React Toastify
- date-fns for date handling

**Database:**
- PostgreSQL with proper indexing
- Relational schema design
- Transaction support
- Optimized queries

---

## 📁 Project Structure

```
Unity Health Hub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # PostgreSQL connection
│   │   │   └── razorpay.js          # Payment gateway config
│   │   ├── controllers/
│   │   │   ├── doctorController.js  # Doctor search & slots
│   │   │   └── appointmentController.js # Booking & payment
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── models/
│   │   │   ├── Doctor.js            # Doctor queries
│   │   │   ├── Appointment.js       # Booking logic
│   │   │   └── Specialization.js    # Specialization data
│   │   ├── routes/
│   │   │   ├── doctorRoutes.js      # Doctor endpoints
│   │   │   └── appointmentRoutes.js # Appointment endpoints
│   │   ├── utils/
│   │   │   └── seed.js              # Database seeding
│   │   └── server.js                # Main server file
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpecializationSearch.js    # Search interface
│   │   │   ├── DoctorList.js              # Doctor cards
│   │   │   ├── AppointmentBooking.js      # Booking form
│   │   │   ├── PaymentGateway.js          # Payment UI
│   │   │   └── AppointmentConfirmation.js # Success page
│   │   ├── services/
│   │   │   └── api.js                     # API service
│   │   ├── styles/
│   │   │   └── App.css                    # Global styles
│   │   ├── App.js                         # Main component
│   │   └── index.js                       # Entry point
│   ├── .env                               # Frontend config
│   └── package.json
│
├── database/
│   └── schema.sql                         # Database schema
│
├── SETUP_INSTRUCTIONS.md                  # Detailed setup guide
└── README.md                              # This file
```

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd "Unity Health Hub"
```

### 2. Database Setup

```bash
# Create database
createdb healthcare_db

# Run schema
psql -U postgres -d healthcare_db -f database/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install

# Configure .env file with your credentials
# Then seed the database
node src/utils/seed.js

# Start server
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 5. Access Application

Open browser: **http://localhost:3000**

---

## 📊 Database Schema

### Tables

**users** - User accounts (patients, doctors, admins)
- id, email, password_hash, role, full_name, phone

**specializations** - Medical specializations (8 types)
- id, name, description, icon

**doctors** - Doctor profiles
- id, user_id, specialization_id, qualifications, experience_years
- consultation_fee, emergency_fee, rating, total_reviews
- hospital_name, hospital_address, is_available

**time_slots** - Available appointment slots
- id, doctor_id, slot_date, slot_time, is_available, is_emergency_slot

**appointments** - Booking records
- id, booking_id, patient_id, doctor_id, slot_id
- appointment_type, appointment_date, appointment_time
- patient details, symptoms, medical_conditions
- payment_status, payment_id, transaction_id

**payments** - Payment transactions
- id, appointment_id, amount, payment_method, status

### Indexes
- Optimized for specialization searches
- Fast slot availability queries
- Efficient appointment lookups

---

## 🔌 API Endpoints

### Doctors

```
GET  /api/doctors/specializations     # Get all specializations
GET  /api/doctors/search              # Search doctors
GET  /api/doctors/:id                 # Get doctor details
GET  /api/doctors/:id/slots           # Get available slots
```

### Appointments

```
POST /api/appointments                      # Create appointment
POST /api/appointments/payment/create-order # Create payment order
POST /api/appointments/payment/verify       # Verify payment
GET  /api/appointments/:bookingId           # Get appointment details
```

---

## 💳 Payment Integration

### Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com/)
2. Get API keys from Dashboard
3. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

### Test Credentials

**Test Card:** 4111 1111 1111 1111  
**CVV:** Any 3 digits  
**Expiry:** Any future date

---

## 🎯 Workflow

1. **Search** → Select specialization and apply filters
2. **Browse** → View doctor profiles with ratings and fees
3. **Select** → Choose doctor and appointment type
4. **Book** → Pick slot (normal) or auto-assign (emergency)
5. **Form** → Fill patient details and symptoms
6. **Pay** → Complete secure payment via Razorpay
7. **Confirm** → Receive booking ID and receipt

---

## 🔐 Security Measures

- **Authentication:** JWT tokens
- **Encryption:** bcrypt password hashing
- **SQL Protection:** Parameterized queries
- **Rate Limiting:** 100 requests per 15 minutes
- **CORS:** Controlled origins
- **Headers:** Helmet.js security
- **Validation:** Input sanitization
- **Payment:** Signature verification

---

## 📱 Responsive Design

- **Desktop:** Full-featured experience
- **Tablet:** Optimized layout
- **Mobile:** Touch-friendly interface
- **Breakpoints:** 768px, 1024px

---

## 🧪 Testing

### Manual Testing

1. Search for doctors in different specializations
2. Apply various filters
3. Book normal appointments
4. Test emergency appointments
5. Complete payment flow
6. Verify confirmation details
7. Test slot locking mechanism

### Test Data

- **8 Sample Doctors** across all specializations
- **Time Slots** for next 7 days
- **Doctor Credentials:** dr.sharma@healthcare.com / doctor123

---

## 🚀 Deployment

### Backend (Heroku/AWS/DigitalOcean)

```bash
# Set environment to production
NODE_ENV=production

# Use production database
# Enable HTTPS
# Set strong JWT secret
# Use production Razorpay keys
```

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy build folder
# Set REACT_APP_API_URL to production backend
```

### Database (AWS RDS/Heroku Postgres)

- Create production database
- Run schema.sql
- Enable SSL
- Set up backups

---

## 📈 Future Enhancements

- [ ] Email/SMS notifications
- [ ] Patient dashboard
- [ ] Doctor dashboard
- [ ] Admin panel
- [ ] Appointment history
- [ ] Cancellation/rescheduling
- [ ] Video consultation
- [ ] Prescription management
- [ ] Medical records
- [ ] Analytics dashboard

---

## 🐛 Troubleshooting

**Database Connection Error:**
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

**Payment Not Working:**
- Verify Razorpay keys
- Check internet connection
- Use test mode for development

**Frontend Not Loading:**
- Ensure backend is running
- Check API URL in .env
- Verify CORS settings

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

## 👨‍💻 Developer

Built with ❤️ for **Unity Health Hub**

**Contact:**
- Email: support@unityhealthhub.com
- Website: www.unityhealthhub.com

---

## 🙏 Acknowledgments

- React.js team
- Node.js community
- PostgreSQL developers
- Razorpay payment gateway
- Open source contributors

---

**⭐ If you find this project useful, please give it a star!**

*Empowering healthcare through intelligent technology*
