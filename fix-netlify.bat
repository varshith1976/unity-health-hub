@echo off
echo ========================================
echo FIXING NETLIFY BUILD ISSUE
echo ========================================
echo.

cd /d d:\Unity Health Hub

echo Step 1: Removing folder from git cache...
git rm -r --cached medicide-remainder-first-project 2>nul
if %ERRORLEVEL% NEQ 0 echo (No changes to cache - folder may not be tracked)

echo Step 2: Adding .gitignore and committing...
git add .gitignore
git add -A
git commit -m "Remove broken submodule - fix Netlify build"

echo Step 3: Force pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo DONE! The changes have been pushed.
echo.
echo NEXT STEPS:
echo 1. Go to Netlify Dashboard
echo 2. Go to your site - Deploys
echo 3. Click "Clear cache and deploy site"
echo ========================================
pause
