# 🚀 Unity Health Hub - Appointment Scheduling System
## Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Razorpay Account** (for payment integration) - [Sign up](https://razorpay.com/)

---

## 🗄️ Step 1: Database Setup

### 1.1 Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE healthcare_db;
```

### 1.2 Run Schema

Navigate to the project directory and execute:

```bash
psql -U postgres -d healthcare_db -f database/schema.sql
```

Or manually copy and paste the contents of `database/schema.sql` into your PostgreSQL client.

---

## ⚙️ Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Slot Lock Duration (minutes)
SLOT_LOCK_DURATION=5
```

### 2.4 Seed Sample Data

```bash
node src/utils/seed.js
```

This will create:
- 8 sample doctors across all specializations
- Time slots for the next 7 days
- Test credentials

### 2.5 Start Backend Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend will run on: **http://localhost:5000**

---

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

Open a new terminal and run:

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment

The `.env` file is already created with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Server

```bash
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 🔑 Step 4: Razorpay Setup

### 4.1 Create Razorpay Account

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a free account
3. Complete KYC verification (for production)

### 4.2 Get API Keys

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** for development
4. Copy **Key ID** and **Key Secret**
5. Add them to `backend/.env`

### 4.3 Test Mode

For testing, use Razorpay's test mode:
- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## 🧪 Step 5: Testing the Application

### 5.1 Access the Application

Open your browser and go to: **http://localhost:3000**

### 5.2 Test Workflow

1. **Search Doctors**
   - Select a specialization (e.g., Cardiologist)
   - Apply filters (experience, fee, rating)
   - Click "Search Doctors"

2. **View Doctor Profiles**
   - Browse available doctors
   - Check ratings, experience, and fees
   - Click "Book Appointment"

3. **Book Appointment**
   - Choose appointment type (Normal/Emergency)
   - For Normal: Select date and time slot
   - For Emergency: System auto-assigns nearest slot
   - Fill patient details form
   - Click "Proceed to Payment"

4. **Complete Payment**
   - Review appointment summary
   - Click "Pay" button
   - Use Razorpay test credentials
   - Complete payment

5. **View Confirmation**
   - See booking ID and appointment details
   - Download receipt
   - Note the appointment information

---

## 📊 Database Structure

### Tables Created:
- `users` - User accounts (patients, doctors, admins)
- `specializations` - Medical specializations
- `doctors` - Doctor profiles and details
- `time_slots` - Available appointment slots
- `appointments` - Booking records
- `payments` - Payment transactions

### Sample Data:
- **8 Doctors** across all specializations
- **Time Slots** for next 7 days (9 AM - 5 PM)
- **Specializations**: Cardiologist, Nephrologist, Ophthalmologist, Dermatologist, Neurologist, Orthopedic Surgeon, Pediatrician, General Physician

---

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify credentials in .env file
# Ensure database exists
psql -U postgres -l
```

**Port Already in Use:**
```bash
# Change PORT in backend/.env
PORT=5001
```

### Frontend Issues

**API Connection Error:**
```bash
# Verify backend is running
# Check REACT_APP_API_URL in frontend/.env
# Ensure CORS is enabled in backend
```

**Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Payment Issues

**Razorpay Not Loading:**
- Check internet connection
- Verify Razorpay keys in backend/.env
- Use test mode keys for development
- Check browser console for errors

---

## 🚀 Production Deployment

### Backend Deployment (AWS/Heroku/DigitalOcean)

1. Set `NODE_ENV=production`
2. Use production database credentials
3. Enable HTTPS
4. Set strong JWT_SECRET
5. Use production Razorpay keys
6. Configure proper CORS origins

### Frontend Deployment (Vercel/Netlify)

1. Build the app: `npm run build`
2. Update `REACT_APP_API_URL` to production backend URL
3. Deploy the `build` folder
4. Configure environment variables in hosting platform

### Database (AWS RDS/Heroku Postgres)

1. Create production database
2. Run schema.sql
3. Update backend DB credentials
4. Enable SSL connections
5. Set up automated backups

---

## 📱 Features Implemented

✅ Specialization-based doctor search
✅ Advanced filtering (experience, fee, rating, availability)
✅ Real-time slot availability
✅ Normal and Emergency appointments
✅ Slot locking mechanism (5-minute hold)
✅ Comprehensive patient form
✅ Razorpay payment integration
✅ Payment verification
✅ Appointment confirmation
✅ Downloadable receipt
✅ Responsive design
✅ Professional UI/UX
✅ Error handling
✅ Security features (JWT, Helmet, Rate limiting)

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **SQL Injection Protection** - Parameterized queries
- **Rate Limiting** - Prevent API abuse
- **Helmet.js** - Security headers
- **CORS** - Controlled cross-origin requests
- **Input Validation** - Server-side validation
- **Payment Verification** - Signature validation

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review error logs in terminal
- Verify all environment variables
- Ensure all services are running

---

## 🎉 Success!

Your Unity Health Hub Appointment Scheduling System is now ready!

**Test Credentials:**
- Doctor Email: dr.sharma@healthcare.com
- Password: doctor123

**Next Steps:**
1. Customize the UI with your branding
2. Add email notifications
3. Implement SMS alerts
4. Add patient dashboard
5. Create admin panel
6. Add appointment history
7. Implement cancellation feature

---

**Built with ❤️ for Unity Health Hub**
*Professional Healthcare Management Platform*
