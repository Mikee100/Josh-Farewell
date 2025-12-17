# Quick Start Guide

## 🚀 Running the Frontend and Backend

### Prerequisites
- Node.js 18+ installed
- npm installed

---

## Step 1: Install Dependencies

### Install Frontend Dependencies
```bash
# From the project root directory
npm install
```

### Install Backend Dependencies
```bash
# Navigate to server directory
cd server
npm install
cd ..
```

---

## Step 2: Set Up Backend Environment (First Time Only)

1. **Create `.env` file** in the `server/` directory:
   ```bash
   cd server
   # Create .env file (see below for content)
   ```

2. **Add Cloudinary credentials** to `server/.env`:
   ```env
   PORT=3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   > **Note:** Get these from https://cloudinary.com/console (sign up for free account first)

3. **If you don't have Cloudinary yet**, you can still run the backend, but image uploads won't work. The API will still serve images from the JSON file.

---

## Step 3: Run the Backend

### Option A: Development Mode (with auto-reload)
```bash
cd server
npm run dev
```

### Option B: Production Mode
```bash
cd server
npm start
```

**Backend will run on:** `http://localhost:3000`

**Test it:** Open `http://localhost:3000/api/health` in your browser

---

## Step 4: Run the Frontend

**Open a NEW terminal window** (keep backend running in the first one)

```bash
# From the project root directory
npm run dev
```

**Frontend will run on:** `http://localhost:5000` (or the next available port)

---

## Running Both Together

You need **TWO terminal windows**:

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

Then:
- **Backend API:** http://localhost:3000
- **Frontend:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

---

## Quick Commands Reference

### Backend Commands
```bash
cd server
npm install          # Install dependencies (first time)
npm run dev          # Run in development mode
npm start            # Run in production mode
```

### Frontend Commands
```bash
npm install          # Install dependencies (first time)
npm run dev          # Run development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Troubleshooting

### "Cannot find module" errors
- Make sure you ran `npm install` in both directories
- Check that you're in the correct directory

### Backend won't start
- Check that `server/.env` file exists and has correct values
- Make sure port 3000 is not already in use

### Frontend can't connect to backend
- Make sure backend is running on port 3000
- Check browser console for CORS errors
- Verify API URL in frontend (defaults to `http://localhost:3000/api`)

### Port already in use
- Backend: Change `PORT` in `server/.env`
- Frontend: Vite will automatically use the next available port

---

## What Each Server Does

### Backend (Port 3000)
- Serves API endpoints (`/api/images`, `/api/upload`)
- Handles image uploads to Cloudinary
- Stores image metadata
- Serves admin panel at `/admin`

### Frontend (Port 5000)
- Serves the memorial website
- Fetches images from backend API
- Hot-reloads on file changes (development)

---

## Production Build

To build everything for production:

```bash
# Build frontend
npm run build

# The built files will be in the 'dist' folder
# The backend will serve these files automatically
```

Then run the backend:
```bash
cd server
npm start
```

The backend will serve the built frontend at `http://localhost:3000`
