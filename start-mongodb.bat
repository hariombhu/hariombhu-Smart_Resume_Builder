@echo off
cls
echo.
echo ========================================
echo   MongoDB Service Starter
echo ========================================
echo.
echo Checking MongoDB status...
echo.

sc query MongoDB | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is already running!
    goto :end
)

echo MongoDB is not running. Attempting to start...
echo.
echo This requires Administrator privileges.
echo If you see "Access Denied", right-click this file
echo and select "Run as Administrator"
echo.

net start MongoDB

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ SUCCESS!
    echo ========================================
    echo   MongoDB started successfully!
    echo   You can now start your backend.
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ❌ FAILED!
    echo ========================================
    echo   Could not start MongoDB.
    echo.
    echo   Try one of these:
    echo   1. Right-click this file -^> Run as Administrator
    echo   2. Open services.msc and start MongoDB manually
    echo   3. Use MongoDB Atlas (cloud) instead
    echo.
    echo   See MONGODB_START_FAILED.md for details
    echo ========================================
)

:end
echo.
pause
