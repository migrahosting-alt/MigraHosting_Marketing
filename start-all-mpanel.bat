@echo off
REM ============================================================================
REM Start All Services - mPanel + AFM Guardian Integration
REM ============================================================================

echo.
echo ========================================
echo  MigraHosting Full Stack Startup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/5] Starting AFM Guardian services...
docker-compose -f docker-compose.afm.yml up -d
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start AFM services
    pause
    exit /b 1
)

echo.
echo [2/5] Waiting for services to be healthy...
timeout /t 5 /nobreak >nul

echo.
echo [3/5] Starting mPanel backend (port 3002)...
start "mPanel Backend" cmd /k "cd mpanel-main && npm run dev"

echo.
echo [4/5] Starting mPanel frontend (port 3001)...
timeout /t 2 /nobreak >nul
start "mPanel Frontend" cmd /k "cd mpanel-main\frontend && npm run dev"

echo.
echo [5/5] Starting marketing site (port 5173)...
timeout /t 2 /nobreak >nul
start "Marketing Site" cmd /k "cd apps\website && npm run dev"

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo  AFM Guardian Gateway: http://localhost:8080
echo  AFM Orchestrator:     http://localhost:8090
echo  AFM Adapters:         http://localhost:8095
echo.
echo  mPanel Frontend:      http://localhost:3001 (with Abigail chat)
echo  mPanel Backend:       http://localhost:3002
echo.
echo  Marketing Site:       http://localhost:5173 (with Abigail chat)
echo.
echo ========================================
echo.
echo Press any key to view logs (or close to keep running)...
pause >nul

REM Open logs in browser
start http://localhost:8080/health
start http://localhost:3001
