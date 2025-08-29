#!/bin/bash

# Quick Start Script for Backend Integration Testing
# Run this script to start both frontend and backend simultaneously

echo "🚀 Starting E-commerce Backend Integration Test"
echo "=============================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Start backend in background
echo "📦 Starting Backend Server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating default .env file for backend..."
    cat > .env << EOL
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOL
    echo "✅ Created .env file. Please update with your actual configuration."
fi

npm start &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:5000 (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🎯 Frontend will start on http://localhost:4200"
echo "🧪 API Test Dashboard: http://localhost:4200/api-test"
echo ""
echo "🔴 To stop both servers: Ctrl+C (this will stop both processes)"
echo ""

# Start frontend (this will run in foreground)
npm start

# Clean up background process when script exits
trap "echo '🛑 Stopping backend server...'; kill $BACKEND_PID 2>/dev/null" EXIT