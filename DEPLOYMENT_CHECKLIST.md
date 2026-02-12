# Smart Bookmarks - Deployment Checklist

## ✅ BEFORE DEPLOYMENT

### 1. Supabase Setup
- [ ] Create Supabase project at [app.supabase.com](https://app.supabase.com)
- [ ] Get your `NEXT_PUBLIC_SUPABASE_URL` from Settings → API
- [ ] Get your `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Settings → API

### 2. Google OAuth Setup (REQUIRED for login to work)
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project
- [ ] Enable "Google+ API"
- [ ] Create OAuth 2.0 Web Application credentials
- [ ] Add Redirect URIs:
  - `https://[your-supabase-project].supabase.co/auth/v1/callback?provider=google`
  - `http://localhost:3000/auth/v1/callback?provider=google` (for local testing)
- [ ] Copy Client ID and Client Secret
- [ ] Go to Supabase → Authentication → Providers → Google
- [ ] Enable Google and paste Client ID & Secret
- [ ] Save

### 3. Create GitHub Repository (REQUIRED by challenge)
- [ ] Go to [github.com/new](https://github.com/new)
- [ ] Create repository named `smart-bookmarks`
- [ ] Make it **PUBLIC**
- [ ] Do NOT initialize with README (push from V0)

---

## 🚀 DEPLOYMENT TO VERCEL

### Step 1: Deploy from V0
1. Click **"Publish"** button (top right of V0)
2. Wait for deployment to complete
3. You'll get a Vercel URL like: `https://smart-bookmarks-xyz.vercel.app`

### Step 2: Add Environment Variables to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your `smart-bookmarks` project
3. Click **"Settings"** → **"Environment Variables"**
4. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   ```
5. Click **"Save"**
6. Your deployment will automatically redeploy with new variables

### Step 3: Test Your Live App
1. Go to your Vercel URL: `https://smart-bookmarks-xyz.vercel.app`
2. Click "Sign in with Google"
3. Sign in with your Google account
4. Add a test bookmark
5. Verify it appears in the list
6. Open the app in another tab - bookmark should sync in real-time

---

## 📤 PUSH TO GITHUB

### Option A: Using V0 UI (Easiest)
1. Click **GitHub icon** in V0 sidebar
2. Connect your GitHub account (first time only)
3. Select the `smart-bookmarks` repository
4. Your code will automatically push to GitHub

### Option B: Manual Push
```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmarks app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks.git
git push -u origin main
```

---

## 📝 VERIFY YOUR SUBMISSION

Before submitting, make sure you have:

- [ ] **Live Vercel URL** working and accessible
  - Example: `https://smart-bookmarks-abc123.vercel.app`
  - Test by signing in with Google

- [ ] **GitHub Repository** is public
  - All code pushed
  - Includes README.md with problems and solutions
  - Includes this deployment checklist

- [ ] **README.md** includes:
  - What problems you ran into ✓ (Added to README)
  - How you solved them ✓ (Added to README)
  - Features and tech stack ✓
  - Deployment instructions ✓

---

## 🔗 SUBMISSION DETAILS (From Challenge Requirements)

**What to Submit:**
1. **Live Vercel URL**: `https://your-app.vercel.app`
   - They will test by logging in with their own Google account
   - Must have valid Google OAuth setup

2. **GitHub Repository Link**: `https://github.com/YOUR_USERNAME/smart-bookmarks`
   - Must be PUBLIC
   - Must include README.md with problem descriptions and solutions

3. **README Content**: Your README.md should document:
   - Problems encountered during development
   - Solutions implemented
   - How to run locally
   - Feature descriptions
   - Tech stack used

**Time Limit**: 72 hours from challenge start

---

## 🆘 TROUBLESHOOTING

### App shows blank page
- Check browser console (F12) for errors
- Verify environment variables are set in Vercel
- Wait 2-3 minutes for deployment to fully complete

### Google OAuth doesn't work
- Verify Google OAuth credentials are set in Supabase
- Check redirect URIs in Google Cloud Console match Supabase
- Ensure Google provider is enabled in Supabase Authentication

### Bookmarks not syncing across tabs
- Refresh the page (SWR will sync on mount)
- Check browser console for API errors
- Verify database table exists in Supabase

### "Unauthorized" errors
- You need to sign in first
- Try signing in again with Google
- Check if session is expired (sign out and sign in again)

---

## 📞 SUPPORT LINKS

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Google OAuth: [developers.google.com/identity](https://developers.google.com/identity)
