# Deployment Guide

This guide explains how to deploy the Spotify Track Predictor to Vercel (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- Git repository pushed to GitHub

## Backend Deployment (Railway)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `HitOrMiss` repository
5. Railway will auto-detect the Python app

### Step 3: Configure Environment Variables

In Railway dashboard, add these environment variables:

```
FLASK_ENV=production
API_PORT=5000
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### Step 4: Configure Root Directory

1. In Railway project settings, set **Root Directory** to: `backend`
2. Railway will automatically use `requirements.txt` and `Procfile`

### Step 5: Get Backend URL

After deployment, Railway will provide a URL like:
```
https://your-app.up.railway.app
```

Save this URL - you'll need it for the frontend!

## Frontend Deployment (Vercel)

### Step 1: Update API URL

Before deploying, update the frontend to use your Railway backend URL:

1. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-app.up.railway.app/api
```

2. Update `frontend/src/services/api.ts` to use environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Configure Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-app.up.railway.app/api
```

### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy your frontend!

## Post-Deployment

### Update CORS in Backend

After getting your Vercel URL, update the Railway environment variable:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Then redeploy the backend in Railway.

### Test the Deployment

1. Visit your Vercel URL
2. Navigate to the EDA tab - should load dataset statistics
3. Navigate to Prediction tab - enter sample values and test predictions
4. Check that similar tracks are returned

## Troubleshooting

### Backend Issues

- **500 Error**: Check Railway logs for Python errors
- **CORS Error**: Verify CORS_ORIGINS includes your Vercel URL
- **Model Not Found**: Ensure `.pkl` files are committed to git

### Frontend Issues

- **Blank Page**: Check browser console for errors
- **API Connection Failed**: Verify VITE_API_URL is correct
- **Build Failed**: Check that all dependencies are in package.json

### Common Fixes

1. **Large Files**: If git rejects large files (models/dataset):
   - Use Git LFS: `git lfs track "*.pkl" "*.csv"`
   - Or reduce dataset size for demo

2. **Environment Variables**: Always redeploy after changing env vars

3. **CORS Issues**: Make sure Railway backend allows your Vercel domain

## File Sizes

Current file sizes:
- `backend/data/dataset.csv`: ~1.2 MB
- `backend/models/*.pkl`: ~500 KB total

These should be fine for Railway/Vercel free tiers.

## Monitoring

- **Railway**: Check logs in Railway dashboard
- **Vercel**: Check deployment logs and runtime logs
- **Analytics**: Both platforms provide basic analytics

## Costs

- **Railway Free Tier**: $5 credit/month, ~500 hours
- **Vercel Free Tier**: Unlimited deployments, 100 GB bandwidth

Both should be sufficient for a demo/portfolio project!

## URLs

After deployment, you'll have:
- Frontend: `https://hit-or-miss.vercel.app` (or similar)
- Backend: `https://hit-or-miss.up.railway.app` (or similar)

Share the Vercel URL - it's your public-facing application! 🚀
