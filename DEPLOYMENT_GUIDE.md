# 🚀 Deployment Guide - Unity Health Hub

## 📋 Prerequisites
- Git installed on your computer
- GitHub account
- Vercel or Netlify account (free)

---

## 🔧 Step 1: Push to GitHub

### 1.1 Initialize Git Repository
Open terminal in project root (`d:\Unity Health Hub\`) and run:

```bash
git init
git add .
git commit -m "Initial commit - Unity Health Hub with AI Doctor"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `unity-health-hub`
3. Description: `Healthcare Appointment System with AI Doctor`
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README (we already have files)
6. Click "Create repository"

### 1.3 Push to GitHub
Copy the commands from GitHub (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/unity-health-hub.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy Frontend to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**: `unity-health-hub`
5. **Configure Project**:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

6. **Environment Variables** (Add these):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
   (Update this later with your backend URL)

7. **Click "Deploy"**
8. Wait 2-3 minutes ⏳
9. Your site will be live at: `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: unity-health-hub
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🌐 Step 3: Deploy Frontend to Netlify (Alternative)

### Option A: Deploy via Netlify Dashboard

1. **Go to Netlify**: https://app.netlify.com/
2. **Sign up/Login** with GitHub
3. **Click "Add new site" → "Import an existing project"**
4. **Connect to GitHub** and select `unity-health-hub`
5. **Configure Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Node version: `18`

6. **Environment Variables**:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

7. **Click "Deploy site"**
8. Wait 2-3 minutes ⏳
9. Your site will be live at: `https://random-name.netlify.app`
10. You can change the site name in Settings

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build the project
npm run build

# Deploy
netlify deploy

# Follow prompts and select build folder

# Deploy to production
netlify deploy --prod
```

---

## 🖥️ Step 4: Deploy Backend (Optional - for full functionality)

### Option 1: Deploy to Render.com (Free)

1. **Go to Render**: https://render.com/
2. **Sign up/Login**
3. **Click "New +" → "Web Service"**
4. **Connect GitHub repository**
5. **Configure**:
   - Name: `unity-health-hub-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

6. **Environment Variables**:
   ```
   DB_HOST=your_postgres_host
   DB_PORT=5432
   DB_NAME=healthcare_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=5000
   ```

7. **Click "Create Web Service"**
8. Copy the backend URL (e.g., `https://unity-health-hub-backend.onrender.com`)

### Option 2: Deploy to Railway.app (Free)

1. **Go to Railway**: https://railway.app/
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Add PostgreSQL database** (Railway provides free PostgreSQL)
6. **Configure backend service**:
   - Root Directory: `backend`
   - Start Command: `npm start`
7. **Add environment variables** (same as above)
8. **Deploy**

---

## 🔗 Step 5: Connect Frontend to Backend

After backend is deployed:

1. **Update Frontend Environment Variable**:
   - Go to Vercel/Netlify dashboard
   - Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your backend URL
   - Example: `https://unity-health-hub-backend.onrender.com`

2. **Redeploy Frontend**:
   - Vercel: Automatic redeploy on env change
   - Netlify: Trigger redeploy from dashboard

---

## 📝 Important Notes

### ⚠️ Before Deploying:

1. **Remove Sensitive Data**:
   - Check that `.env` files are in `.gitignore`
   - Never commit API keys or passwords

2. **Update CORS Settings** in `backend/src/server.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

3. **Database Setup**:
   - You'll need a PostgreSQL database
   - Free options: Render, Railway, Supabase, ElephantSQL
   - Run schema files to create tables

### 🔒 Security Checklist:

- ✅ `.env` files are gitignored
- ✅ API keys are in environment variables
- ✅ CORS is configured properly
- ✅ JWT secret is strong and unique
- ✅ Database credentials are secure

---

## 🎉 Quick Deploy Commands

### Push to GitHub:
```bash
git add .
git commit -m "Update: Added deployment configs"
git push origin main
```

### Deploy Frontend (Vercel):
```bash
cd frontend
vercel --prod
```

### Deploy Frontend (Netlify):
```bash
cd frontend
npm run build
netlify deploy --prod
```

---

## 🆘 Troubleshooting

### Build Fails:
- Check Node version (use v18)
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### API Not Working:
- Check CORS settings
- Verify backend URL in frontend env
- Check backend logs for errors

### Database Connection Issues:
- Verify database credentials
- Check if database is running
- Ensure database schema is created

---

## 📞 Support

If you face issues:
1. Check deployment logs in Vercel/Netlify dashboard
2. Check browser console for frontend errors
3. Check backend logs for API errors

---

## 🎯 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Backend deployed (optional)
- [ ] Environment variables configured
- [ ] Database connected (if using backend)
- [ ] CORS configured
- [ ] Site is accessible and working

---

**🎊 Congratulations! Your Unity Health Hub is now live!**

Share your deployed link:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

*Built with ❤️ for Unity Health Hub*
