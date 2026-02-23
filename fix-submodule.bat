@echo off
echo ========================================
echo Netlify Submodule Fix Script
echo ========================================
echo.

cd /d "d:\Unity Health Hub"

echo Step 1: Removing the submodule folder...
rmdir /s /q "medicide-remainder-first-project" 2>nul

echo Step 2: Removing from git cache...
git rm -r --cached medicide-remainder-first-project 2>nul

echo Step 3: Committing changes...
git add .gitignore
git commit -m "Remove medicide-remainder-first-project - fix Netlify build"

echo Step 4: Force pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo DONE! The submodule has been removed.
echo.
echo Now go to Netlify:
echo 1. Clear cache (Deploys -> Clear cache)
echo 2. Trigger new deploy
echo ========================================
pause
