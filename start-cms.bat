@echo off
echo Starting MigraHosting CMS Stack...
echo.

echo Starting CMS Backend...
cd cms\backend
if not exist .env copy .env.example .env
start /B cmd /c "npm install && node index.js"

echo Starting CMS Admin Panel...
cd ..\admin
start /B cmd /c "npm install && npm run dev"

echo.
echo ========================================
echo    MigraHosting CMS Running!
echo ========================================
echo.
echo CMS Backend API: http://localhost:4243
echo Admin Panel:     http://localhost:4244
echo.
echo Press Ctrl+C to stop services
echo.

pause
