@echo off
echo ====================================
echo Starting MigraHosting Development
echo ====================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Starting AFM Guardian services (Abigail AI Chat)...
docker-compose -f docker-compose.afm.yml up -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start AFM Guardian services
    pause
    exit /b 1
)

echo.
echo [2/4] Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo [3/4] Checking service health...
curl -s http://localhost:8080/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: AFM Gateway may not be ready yet
    echo You can check logs with: docker-compose -f docker-compose.afm.yml logs -f
)

echo.
echo [4/4] Starting Marketing Site...
echo.
echo Opening new terminal for Vite dev server...
start "Marketing Site - Vite" cmd /k "cd apps\website && npm run dev"

echo.
echo ====================================
echo All Services Started!
echo ====================================
echo.
echo Services:
echo   - AFM Gateway:    http://localhost:8080
echo   - Orchestrator:   http://localhost:8090
echo   - Adapters:       http://localhost:8095
echo   - Marketing Site: http://localhost:5173
echo.
echo Press Ctrl+C in the Vite terminal to stop the marketing site
echo Run 'stop-all-dev.bat' to stop AFM services
echo.
pause
