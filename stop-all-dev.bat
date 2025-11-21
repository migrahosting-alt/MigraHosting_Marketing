@echo off
echo ====================================
echo Stopping MigraHosting Development
echo ====================================
echo.

echo Stopping AFM Guardian services...
docker-compose -f docker-compose.afm.yml down

echo.
echo ====================================
echo Services Stopped
echo ====================================
echo.
echo Note: Marketing site (Vite) must be stopped manually in its terminal (Ctrl+C)
echo.
pause
