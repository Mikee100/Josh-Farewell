#!/bin/bash
# Bash script to run both frontend and backend
# Usage: ./run-dev.sh

echo "🚀 Starting Josh Farewell Development Servers..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo ""
    echo "⚠️  WARNING: server/.env file not found!"
    echo "   The backend will run but image uploads won't work."
    echo "   Create server/.env with Cloudinary credentials."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit
    fi
fi

echo "✅ Starting servers..."
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5000"
echo "Admin: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd server && npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend (this will block)
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
