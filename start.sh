#!/bin/bash

# Script to start both Backend and Frontend

echo ""
echo "========================================"
echo "  Library Application - Start Script"
echo "========================================"
echo ""

# Start Backend
echo "Starting Backend (localhost:5000)..."
cd backend
dotnet run &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend (localhost:5173)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Both applications started!"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both applications"
echo "========================================"
echo ""

# Wait for both processes
wait

