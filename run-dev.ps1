# PowerShell script to run both frontend and backend
# Usage: .\run-dev.ps1

Write-Host "🚀 Starting Josh Farewell Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Check if .env exists
if (-not (Test-Path "server/.env")) {
    Write-Host ""
    Write-Host "⚠️  WARNING: server/.env file not found!" -ForegroundColor Yellow
    Write-Host "   The backend will run but image uploads won't work." -ForegroundColor Yellow
    Write-Host "   Create server/.env with Cloudinary credentials." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host "✅ Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Admin: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in current window
npm run dev
