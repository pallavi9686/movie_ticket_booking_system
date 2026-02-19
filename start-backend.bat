@echo off
echo ========================================
echo Starting Cinema Booking Backend Server
echo ========================================
echo.

echo Checking MySQL service...
net start | findstr /i "mysql" >nul
if errorlevel 1 (
    echo MySQL is not running. Attempting to start...
    net start MySQL80
    if errorlevel 1 (
        echo Failed to start MySQL80. Trying MySQL...
        net start MySQL
    )
) else (
    echo MySQL is already running.
)
echo.

echo Navigating to server directory...
cd /d "%~dp0server"
echo.

echo Starting backend server on port 5002...
echo.
node server.js

pause
