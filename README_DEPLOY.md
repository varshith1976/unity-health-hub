# 🏥 Unity Health Hub - Healthcare Appointment System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/unity-health-hub)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/unity-health-hub)

A full-stack Healthcare Appointment Scheduling System with **AI Doctor** and **Telemedicine** capabilities.

## 🌟 Live Demo

- **Frontend**: [Your Vercel/Netlify URL]
- **Backend**: [Your Render/Railway URL]

## ✨ Features

### Core Features
- 🔍 Search doctors by specialization
- 📅 Book appointments (normal and emergency)
- 🔒 Slot locking mechanism
- 💳 Razorpay payment integration
- 📧 Email notifications
- 👤 User authentication (patient/doctor roles)
- 📱 Responsive modern UI

### 🤖 AI Doctor Features
- 🎤 **Voice Input** - Speak your symptoms
- 🤖 **AI Responses** - Powered by Groq AI (Llama 3.1)
- 💊 **Smart Prescriptions** - Automatic prescription generation
- 📋 **Medicine Reminders** - Add medicines to reminder system
- ⚠️ **Emergency Detection** - Automatic critical condition alerts
- 💳 **Consultation Fee** - ₹200 per consultation

### 🎥 Telemedicine Features
- 🎥 Video/Audio consultations
- 🎤 Speech-to-text transcription
- 🏥 Hospital referral system
- 📊 Patient dashboard

### 💊 Medicine Reminder
- 📅 Smart scheduling
- ⏰ Intelligent reminders
- 📊 Adherence tracking

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v12+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/unity-health-hub.git
cd unity-health-hub
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run setup
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📦 Tech Stack

### Frontend
- React.js 18
- React Router v6
- Axios
- React Toastify
- React Icons
- Socket.io Client

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Razorpay Payment Gateway
- Nodemailer

### AI Integration
- Groq AI API (Llama 3.1-70B)
- Web Speech API

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Quick Deploy to Netlify

```bash
cd frontend
npm run build
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
PORT=5000
```

## 🧪 Test Credentials

- **Patient**: patient@test.com / patient123
- **Doctor**: dr.sharma@healthcare.com / doctor123

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Telemedicine Features](TELEMEDICINE_README.md)
- [Medicine Reminder Guide](MEDICINE_REMINDER_GUIDE.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Legal Disclaimer](LEGAL_DISCLAIMER.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is a demonstration project. Not intended for production medical use without proper licensing and compliance.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Groq AI for AI capabilities
- React community
- Open source contributors

---

**Built with ❤️ for Unity Health Hub**

*Empowering healthcare through intelligent technology*
