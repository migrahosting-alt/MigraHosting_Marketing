@echo off
echo ========================================
echo   MigraHosting - Starting All Services
echo ========================================
echo.

echo [1/4] Starting mPanel Backend (port 3000)...
start "mPanel Backend" cmd /c "k:\MigraHosting\dev\migrahosting-landing\mpanel-main\mpanel-main\start-backend.bat"
timeout /t 2 /nobreak >nul

echo [2/4] Starting mPanel Frontend (port 3001)...
start "mPanel Frontend" cmd /c "k:\MigraHosting\dev\migrahosting-landing\mpanel-main\mpanel-main\frontend\start-frontend.bat"
timeout /t 2 /nobreak >nul

echo [3/4] Starting Marketing Backend (port 4242)...
start "Marketing Backend" cmd /c "k:\MigraHosting\dev\migrahosting-landing\server\start-marketing-backend.bat"
timeout /t 2 /nobreak >nul

echo [4/4] Starting Marketing Frontend (port 5173)...
start "Marketing Frontend" cmd /c "k:\MigraHosting\dev\migrahosting-landing\apps\website\start-marketing-frontend.bat"

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo   mPanel Backend:      http://localhost:3000
echo   mPanel Frontend:     http://localhost:3001
echo   Marketing Backend:   http://localhost:4242
echo   Marketing Frontend:  http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
