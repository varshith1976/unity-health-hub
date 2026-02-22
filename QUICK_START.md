# 🚀 Quick Start Commands

## Database Setup
```bash
# Create database
createdb healthcare_db

# Run schema
psql -U postgres -d healthcare_db -f database/schema.sql
```

## Backend
```bash
cd backend
npm install
node src/utils/seed.js
npm run dev
```

## Frontend
```bash
cd frontend
npm install
npm start
```

## Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Test Credentials
- Doctor: dr.sharma@healthcare.com / doctor123

## Important Files to Configure
1. `backend/.env` - Add Razorpay keys and database credentials
2. `frontend/.env` - Already configured

## Razorpay Test
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Common Issues
- **Port in use:** Change PORT in backend/.env
- **DB connection:** Check credentials in backend/.env
- **Payment error:** Verify Razorpay keys

## Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
NODE_ENV=production npm start
```

---
**That's it! Your professional healthcare appointment system is ready! 🎉**
