# Deployment Checklist ✅

## ✅ Pre-Deployment (COMPLETED)

- [x] Code pushed to GitHub
- [x] `.gitignore` updated to include models and dataset
- [x] Railway configuration files created (`Procfile`, `railway.json`, `runtime.txt`)
- [x] Vercel configuration created (`vercel.json`)
- [x] Environment variable setup for production
- [x] All tests passing (22 backend + 39 frontend)

## 🚂 Railway Backend Deployment

### Step 1: Create Railway Project
1. Go to https://railway.app/
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `VineetLoyer/HitOrMiss`

### Step 2: Configure Railway
1. **Set Root Directory**: `backend`
2. **Add Environment Variables**:
   ```
   FLASK_ENV=production
   API_PORT=5000
   CORS_ORIGINS=*
   ```
   (We'll update CORS_ORIGINS after getting Vercel URL)

### Step 3: Deploy
- Railway will automatically detect Python and use `Procfile`
- Wait for deployment to complete
- **Copy your Railway URL**: `https://your-app.up.railway.app`

## ▲ Vercel Frontend Deployment

### Step 1: Update API URL
Before deploying to Vercel, update `frontend/.env.production`:

```bash
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

Commit and push this change:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

### Step 2: Create Vercel Project
1. Go to https://vercel.com/
2. Sign in with GitHub
3. Click "Add New Project"
4. Import `VineetLoyer/HitOrMiss`

### Step 3: Configure Vercel
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Step 4: Add Environment Variable
In Vercel project settings → Environment Variables:
```
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete
- **Copy your Vercel URL**: `https://your-app.vercel.app`

## 🔄 Post-Deployment Configuration

### Update CORS in Railway
1. Go back to Railway project
2. Update environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

## 🧪 Testing Deployment

Visit your Vercel URL and test:

1. **EDA Tab**:
   - [ ] Visualizations load
   - [ ] Statistics display correctly
   - [ ] No console errors

2. **Prediction Tab**:
   - [ ] Can input track features
   - [ ] Predictions return (Hit/Miss)
   - [ ] Similar tracks display
   - [ ] No CORS errors

### Sample Test Data
Use this to test predictions:
```
tempo: 125.5
energy: 0.64
danceability: 0.32
loudness: -2.1
valence: 0.75
acousticness: 0.41
instrumentalness: 0.016
liveness: 0.30
speechiness: 0.03
duration_ms: 139796
key: 8
mode: 1
time_signature: 4
```

Expected: **HIT** prediction

## 📊 Monitoring

### Railway
- View logs: Railway Dashboard → Your Project → Deployments
- Check metrics: CPU, Memory, Network usage

### Vercel
- View logs: Vercel Dashboard → Your Project → Deployments
- Check analytics: Functions, Bandwidth, Build time

## 🐛 Troubleshooting

### Common Issues

**Backend 500 Error**:
- Check Railway logs for Python errors
- Verify all `.pkl` files are in the repo
- Ensure `dataset.csv` is present

**Frontend Blank Page**:
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check Network tab for failed API calls

**CORS Error**:
- Verify `CORS_ORIGINS` in Railway includes your Vercel URL
- Make sure there are no trailing slashes
- Redeploy Railway after updating

**Build Failed**:
- Check build logs in Vercel/Railway
- Verify all dependencies are in `package.json`/`requirements.txt`
- Check for TypeScript errors

## 🎉 Success!

Once deployed, share your links:
- **Live App**: `https://your-app.vercel.app`
- **API**: `https://your-app.up.railway.app`

Add these to your GitHub README and portfolio! 🚀

## 📝 Optional Enhancements

After successful deployment, consider:
- [ ] Add custom domain to Vercel
- [ ] Set up monitoring/alerts
- [ ] Add Google Analytics
- [ ] Create demo video/GIF
- [ ] Write blog post about the project
