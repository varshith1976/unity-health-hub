@echo off
echo ========================================
echo Pushing ESLint Fixes to GitHub
echo ========================================
echo.

echo Adding all files...
git add .
echo.

echo Creating commit...
git commit -m "Fix: Resolved all ESLint errors for Netlify deployment"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo DONE!
echo ========================================
echo.
echo Your fixes have been pushed to GitHub.
echo Netlify will automatically redeploy your site.
echo.
echo Check your Netlify dashboard for deployment status.
echo.
pause
