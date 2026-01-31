@echo off
echo ========================================
echo   Resume Planner - Backend Server
echo ========================================
echo.
cd /d "%~dp0backend"
echo Starting backend server on http://localhost:5000...
echo.
npm run dev
