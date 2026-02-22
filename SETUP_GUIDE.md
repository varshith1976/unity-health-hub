# Unity Health Hub - Setup & Execution Guide

## Prerequisites

Before running the application, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (for production) - [Download](https://www.postgresql.org/)

---

## Backend Setup

### 1. Navigate to Backend Directory
```
bash
cd backend
```

### 2. Install Dependencies
```
bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```
env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unity_health_hub
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Razorpay Payment Gateway (Optional - for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Set Up Database

#### Option A: Using SQL Script
```
bash
# Create database
psql -U postgres -c "CREATE DATABASE unity_health_hub;"

# Run schema
psql -U postgres -d unity_health_hub -f ../database/schema.sql
```

#### Option B: Using the Setup Script
```
bash
node src/utils/setupDatabase.js
```

### 5. (Optional) Seed Sample Data
```
bash
node src/utils/seedData.js
```

### 6. Start Backend Server

#### Development Mode (with hot reload)
```
bash
npm run dev
```

#### Production Mode
```
bash
npm start
```

The backend server will start at: **http://localhost:5000**

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```
bash
cd frontend
```

### 2. Install Dependencies
```
bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend` folder:

```
env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server
```
bash
npm start
```

The frontend will open at: **http://localhost:3000**

---

## Running the Full Application

### Terminal 1 - Backend
```
bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```
bash
cd frontend
npm start
```

---

## Application Features to Test

1. **Home Page** - View specializations and features
2. **Find Doctors** - Search by specialization
3. **Book Appointment** - Select doctor and time slot
4. **Payment** - Complete payment (mock/razorpay)
5. **Video Consultation** - Start video call with voice-to-text
6. **Doctor Dashboard** - View stats, appointments, feedback
7. **Prescription** - Create prescriptions for patients
8. **Feedback** - Rate consultation experience

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```
bash
# Find process using port
lsof -i :5000  # or :3000

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

#### 3. Module Not Found Errors
```
bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Errors
- Ensure `FRONTEND_URL` matches your frontend URL exactly
- Check that backend is running on correct port

---

## Project Structure

```
Unity Health Hub/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Razorpay config
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Database models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helper functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── styles/       # CSS styles
│   └── package.json
└── database/
    ├── schema.sql        # Database schema
    └── seedData.js      # Sample data
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/specializations` - Get specializations
- `POST /api/doctors/register` - Register as doctor
- `GET /api/doctors/profile/me` - Get doctor profile
- `PUT /api/doctors/profile/me` - Update doctor profile
- `GET /api/doctors/dashboard/stats` - Get dashboard stats

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Consultations
- `POST /api/consultations/start` - Start consultation
- `POST /api/consultations/:id/transcript` - Update transcript
- `POST /api/consultations/:id/end` - End consultation
- `GET /api/consultations/patient/my-consultations` - Patient consultations
- `GET /api/consultations/doctor/my-consultations` - Doctor consultations

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/patient/my-prescriptions` - Patient prescriptions
- `GET /api/prescriptions/doctor/my-prescriptions` - Doctor prescriptions

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/doctor/my-feedback` - Doctor feedback
- `GET /api/feedback/doctor/summary` - Rating summary

---

## Support

For issues or questions, refer to:
- README.md
- PROJECT_SUMMARY.md
- Check console logs for error details
