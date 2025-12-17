# Deploying to Render - Step by Step Guide

This guide will walk you through deploying your Josh Farewell backend to Render.

## Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Render Account** - Sign up at https://render.com (free tier available)
3. **Cloudinary Account** - Already set up ✅

---

## Step 1: Push Your Code to GitHub

### If you haven't already:

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with backend"
   ```

2. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `josh-farewell`)
   - **Don't** initialize with README (you already have files)

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/josh-farewell.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended - Automatic Setup)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository**
4. **Render will automatically detect `render.yaml`** and configure everything
5. **Add Environment Variables** (see Step 3 below)
6. **Click "Apply"** and wait for deployment

### Option B: Manual Setup

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `josh-farewell-backend` (or any name you like)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid if you prefer)

5. **Click "Create Web Service"**

---

## Step 3: Add Environment Variables

**Important**: You must add your Cloudinary credentials!

1. In your Render service dashboard, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add these three variables:

   ```
   CLOUDINARY_CLOUD_NAME = dh9jadlh2
   CLOUDINARY_API_KEY = 919362566653835
   CLOUDINARY_API_SECRET = waweru
   ```

   ⚠️ **Replace with your actual values from your `.env` file!**

4. **Save** the environment variables

---

## Step 4: Deploy!

1. Render will automatically start building and deploying
2. Watch the build logs - you should see:
   ```
   cd server && npm install
   cd server && npm start
   ```
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your backend will be live at: `https://your-app-name.onrender.com`

---

## Step 5: Update Frontend API URL

After deployment, update your frontend to use the Render URL:

1. **Create `.env` file** in the project root:
   ```env
   VITE_API_URL=https://your-app-name.onrender.com/api
   ```

2. **Rebuild frontend**:
   ```bash
   npm run build
   ```

3. **Deploy frontend** (or serve from backend):
   - Option 1: Deploy `dist` folder to Render as static site
   - Option 2: Let backend serve the frontend (already configured!)

---

## Step 6: Test Your Deployment

1. **Health Check**: `https://your-app-name.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Images API**: `https://your-app-name.onrender.com/api/images`
   - Should return your images JSON

3. **Admin Panel**: `https://your-app-name.onrender.com/admin`
   - Should show the upload interface

---

## Important Notes

### Free Tier Limitations

- **Spins down after 15 minutes of inactivity**
- First request after spin-down takes ~30 seconds (cold start)
- **25GB bandwidth/month** (usually enough for a memorial site)

### Production Considerations

1. **Environment Variables**: Never commit `.env` to GitHub
2. **Database**: `images.json` is fine for now, but consider a real database for production
3. **CORS**: Already configured to allow all origins (you can restrict this later)
4. **HTTPS**: Render provides free SSL certificates automatically

### Updating Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Render will automatically redeploy** (if auto-deploy is enabled)

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `server/package.json` has all dependencies
- Verify Node.js version (Render uses latest LTS)

### Environment Variables Not Working
- Double-check variable names (case-sensitive!)
- Make sure there are no extra spaces
- Redeploy after adding variables

### Images Not Loading
- Check Cloudinary credentials are correct
- Verify CORS is enabled
- Check browser console for errors

### 502 Bad Gateway
- Service might be spinning up (wait 30 seconds)
- Check service logs in Render dashboard
- Verify start command is correct

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Environment variables added (Cloudinary credentials)
- [ ] Build successful
- [ ] Health check endpoint works
- [ ] Frontend API URL updated
- [ ] Tested image upload
- [ ] Tested image fetching

---

## Your Render URLs

After deployment, you'll have:
- **Backend API**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin`
- **API Health**: `https://your-app-name.onrender.com/api/health`
- **Images API**: `https://your-app-name.onrender.com/api/images`

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: Available in dashboard
- **Check logs**: Render dashboard → Your service → Logs tab

Good luck with your deployment! 🚀
