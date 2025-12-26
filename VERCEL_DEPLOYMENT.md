# 🚀 Deploy Client to Vercel

Step-by-step guide to deploy your React frontend to Vercel.

## 📋 Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- GitHub account (recommended for automatic deployments)
- Backend API deployed and accessible

## 🚀 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Prepare Your Code**
   - Ensure all changes are committed to Git
   - Push to GitHub repository

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select the repository containing your project

3. **Configure Project Settings**
   - **Root Directory**: Select `client` folder
     - Click **Edit** next to Root Directory
     - Enter: `client`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variables**
   - Go to **Environment Variables** section
   - Add your backend API URL:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.com
     ```
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

5. **Deploy**
   - Click **Deploy**
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Client Directory**
   ```bash
   cd client
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow Prompts**
   - Link to existing project or create new
   - Set root directory (if needed)
   - Confirm settings

6. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter your backend URL when prompted.

7. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## ⚙️ Configuration

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your backend API URL | `https://your-backend.railway.app` |

**Important**: 
- Do NOT include `/api` in the URL - it's added automatically
- Use HTTPS URLs only
- Set for all environments (Production, Preview, Development)

### Vercel Configuration File

The `vercel.json` file is already configured with:
- ✅ SPA routing (all routes → index.html)
- ✅ Build settings
- ✅ Cache headers for assets

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Push to main branch** → Deploys to production
- **Push to other branches** → Creates preview deployment
- **Pull requests** → Creates preview deployment

## 🐛 Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on failed deployment → View logs

2. **Common Issues**:
   - **Missing dependencies**: Ensure `package.json` has all dependencies
   - **Build command error**: Check `package.json` scripts
   - **Node version**: Vercel auto-detects, but you can specify in `package.json`:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

### API Requests Failing

1. **Check Environment Variables**
   - Verify `VITE_API_URL` is set correctly
   - Ensure it doesn't include `/api` suffix
   - Check it's set for the correct environment

2. **CORS Issues**
   - Ensure backend allows requests from your Vercel domain
   - Add Vercel URL to backend CORS configuration

3. **Check Network Tab**
   - Open browser DevTools → Network
   - Verify API requests are going to correct URL

### Routes Not Working (404)

- The `vercel.json` already includes SPA rewrites
- If issues persist, verify `vercel.json` is in the `client/` directory
- Check that all routes redirect to `index.html`

### Images Not Loading

- Ensure backend is deployed and accessible
- Check `/uploads` proxy configuration
- Verify image URLs are correct

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] Backend API URL configured
- [ ] Test login/register functionality
- [ ] Test API calls (browse cats, shop products)
- [ ] Test image loading
- [ ] Verify all routes work (no 404s)
- [ ] Check mobile responsiveness
- [ ] Test payment flow (if Stripe configured)

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

## 🎯 Next Steps

After deploying frontend:
1. Update backend CORS to allow your Vercel domain
2. Test the full application flow
3. Set up custom domain (optional)
4. Configure analytics (optional)

---

**Your app is now live on Vercel!** 🎉

