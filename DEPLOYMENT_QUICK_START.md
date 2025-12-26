# ⚡ Quick Start: Deploy to Vercel

## 🚀 Fastest Way (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Important**: Set **Root Directory** to `client`
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com` (your deployed backend)
5. Click **Deploy**

### 3. Done! 🎉
Your app will be live at `https://your-project.vercel.app`

## 📝 Before Deploying

Make sure you have:
- ✅ Backend deployed and accessible
- ✅ Backend URL ready (Railway, Render, etc.)
- ✅ Code pushed to GitHub

## 🔧 Environment Variable

**Required**: `VITE_API_URL`
- Example: `https://your-app.railway.app`
- **Do NOT** include `/api` - it's added automatically
- Set in Vercel Dashboard → Settings → Environment Variables

## 📚 Full Guide

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

