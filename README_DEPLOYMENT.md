# 🚀 Deployment Guide Summary

## ✅ What's Been Configured

1. **`vercel.json`** - Vercel configuration for SPA routing
2. **API Service** - Updated to use `VITE_API_URL` environment variable
3. **Image Utils** - Added `getUploadImageUrl()` helper function
4. **Build Config** - Optimized Vite build settings

## 🎯 Quick Deploy Steps

### Option 1: Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import repository
   - **Set Root Directory**: `client`
   - **Add Environment Variable**:
     - Name: `VITE_API_URL`
     - Value: Your backend URL (e.g., `https://your-app.railway.app`)
   - Click **Deploy**

### Option 2: Vercel CLI

```bash
cd client
npm install -g vercel
vercel login
vercel
vercel env add VITE_API_URL  # Enter your backend URL
vercel --prod
```

## ⚙️ Required Configuration

### Environment Variable

**Name**: `VITE_API_URL`  
**Value**: Your deployed backend URL  
**Example**: `https://your-backend.railway.app`

**Important**: 
- Do NOT include `/api` - it's added automatically
- Use HTTPS only
- Set for Production, Preview, and Development

### Backend CORS Setup

Make sure your backend allows requests from your Vercel domain:

```javascript
// In your backend server.js
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

## 📝 Image URLs Update

The codebase currently uses `/uploads/` paths directly. For production, you have two options:

### Option 1: Update Components (Recommended)

Update image references to use the helper function:

```javascript
import { getUploadImageUrl } from '../utils/imageUtils';

// Change from:
src={`/uploads/${product.image}`}

// To:
src={getUploadImageUrl(product.image)}
```

### Option 2: Use Environment Variable in Vite Config

Update `vite.config.js` to proxy uploads in production (more complex).

## 🔍 Testing After Deployment

1. ✅ Check homepage loads
2. ✅ Test API calls (login, register)
3. ✅ Verify images load
4. ✅ Test all routes (no 404s)
5. ✅ Test authentication flow
6. ✅ Test checkout process

## 🐛 Common Issues

### Images Not Loading
- Ensure backend is deployed
- Check `VITE_API_URL` is set correctly
- Verify image paths use `getUploadImageUrl()` helper

### API Calls Failing
- Check `VITE_API_URL` environment variable
- Verify backend CORS allows Vercel domain
- Check browser console for errors

### 404 on Routes
- Verify `vercel.json` is in `client/` directory
- Check SPA rewrite rules are correct

## 📚 Full Documentation

- [Detailed Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Quick Start Guide](./DEPLOYMENT_QUICK_START.md)

---

**Ready to deploy!** 🚀

