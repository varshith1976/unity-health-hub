@echo off
echo ========================================
echo Fixing Netlify Publish Path
echo ========================================
echo.

echo Adding netlify.toml fix...
git add netlify.toml
echo.

echo Creating commit...
git commit -m "Fix: Corrected Netlify publish path from 'frontend/build' to 'build'"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo DONE!
echo ========================================
echo.
echo Netlify publish path fixed!
echo Changed from: frontend/build
echo Changed to: build (relative to base directory)
echo.
echo Netlify will automatically redeploy.
echo Your site should be live in 2-3 minutes!
echo.
pause
