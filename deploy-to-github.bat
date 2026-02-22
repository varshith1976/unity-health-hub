@echo off
echo ========================================
echo Unity Health Hub - GitHub Push Script
echo ========================================
echo.

echo Step 1: Initializing Git...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Creating commit...
git commit -m "Initial commit - Unity Health Hub with AI Doctor"
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Create a new repository on GitHub:
echo    https://github.com/new
echo.
echo 2. Copy and run these commands:
echo    git remote add origin https://github.com/YOUR_USERNAME/unity-health-hub.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to https://vercel.com/
echo    - Import your GitHub repository
echo    - Set Root Directory to: frontend
echo    - Click Deploy
echo.
echo ========================================
pause
