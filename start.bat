@echo off
echo.
echo ========================================
echo API Docs: http://localhost:5000/openapi/v1.json
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Both applications started!
echo ========================================
echo.

start "Frontend - React" cmd /k "cd frontend && npm run dev"
echo Starting Frontend (localhost:5173)...
REM Start Frontend in new window

timeout /t 3 /nobreak
REM Wait a moment for backend to start

start "Backend - .NET API" cmd /k "cd backend && dotnet run"
echo Starting Backend (localhost:5000)...
REM Start Backend in new window

echo.
echo ========================================
echo   Library Application - Start Script
echo ========================================
echo.

REM Script to start both Backend and Frontend

