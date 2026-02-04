# KrishiSevak - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- API Keys ready

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `krishisevak-app`)
   - Don't initialize with README (we already have code)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/krishisevak-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**: 
   - Click "Import Project"
   - Select your GitHub repository
3. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   VITE_AGROMONITORING_API_KEY=your_actual_key
   VITE_OPENAI_API_KEY=your_actual_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
5. **Deploy**: Click "Deploy"

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Add Environment Variables**:
```bash
vercel env add VITE_AGROMONITORING_API_KEY
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

5. **Redeploy with Environment Variables**:
```bash
vercel --prod
```

## Step 3: Post-Deployment

1. **Test Your Deployment**:
   - Visit your Vercel URL (e.g., `https://krishisevak-app.vercel.app`)
   - Test voice features (requires internet connection)
   - Verify all features work

2. **Custom Domain** (Optional):
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain

## Important Notes

### Voice Features
- ✅ **Works**: Voice recognition and text-to-speech
- ⚠️ **Requires**: Internet connection (uses browser's Web Speech API)
- 🌐 **Best on**: Chrome, Edge, Safari (latest versions)

### API Keys
- Never commit `.env` file to Git
- Add all keys in Vercel Dashboard under Environment Variables
- Keys are encrypted and secure in Vercel

### Continuous Deployment
- Every push to `main` branch auto-deploys to Vercel
- Preview deployments created for pull requests

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build
```

### Environment Variables Not Working
- Ensure all variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel Dashboard → Settings → Environment Variables

### Voice Not Working
- Check browser console for errors
- Ensure HTTPS (Vercel provides this automatically)
- Grant microphone permissions when prompted

## Support
For issues, check:
- Vercel Deployment Logs
- Browser Console (F12)
- Network Tab for API errors
