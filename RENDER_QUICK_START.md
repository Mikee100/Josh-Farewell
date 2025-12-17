# Quick Start: Deploy to Render

## 🚀 Fastest Way (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Render

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Blueprint"
3. **Connect**: Your GitHub repository
4. **Render will auto-detect** `render.yaml` ✅
5. **Add Environment Variables**:
   - `CLOUDINARY_CLOUD_NAME` = `dh9jadlh2`
   - `CLOUDINARY_API_KEY` = `919362566653835`
   - `CLOUDINARY_API_SECRET` = `waweru`
6. **Click**: "Apply"
7. **Wait**: 2-5 minutes for deployment

### 3. Done! 🎉

Your backend will be live at: `https://your-app-name.onrender.com`

---

## 📝 Manual Setup (Alternative)

If Blueprint doesn't work:

1. **New +** → **Web Service**
2. **Connect GitHub repo**
3. **Settings**:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
4. **Add Environment Variables** (same as above)
5. **Create Web Service**

---

## ✅ Test After Deployment

Visit: `https://your-app-name.onrender.com/api/health`

Should see: `{"status":"ok","message":"Server is running"}`

---

## 🔄 Update Frontend

After backend is deployed, update frontend `.env`:

```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

Then rebuild: `npm run build`

---

See `DEPLOY_TO_RENDER.md` for detailed instructions!
