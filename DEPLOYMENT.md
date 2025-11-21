# Deployment Guide

## Step 1: Push to GitHub

1. Create a new repository on GitHub: https://github.com/new
   - Name it: `nano-banana-pro`
   - Keep it public or private
   - **Don't** initialize with README (we already have one)

2. Add GitHub as remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/nano-banana-pro.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Firebase Hosting

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google account

### Steps

1. **Login to Firebase**:
```bash
firebase login
```

2. **Initialize Firebase** (if not already done):
```bash
firebase init hosting
```
   - Select "Use an existing project" or "Create a new project"
   - For "public directory", enter: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub?: `No` (optional - you can set this up later)

3. **Build the production bundle**:
```bash
npm run build
```

4. **Deploy to Firebase**:
```bash
firebase deploy
```

5. Your app will be live at: `https://YOUR-PROJECT.web.app`

### Environment Variables for Production

⚠️ **Important**: Before deploying, you need to set the API key as an environment variable.

**Option 1**: Build-time environment variables (Recommended)
- Create a `.env.production` file (this will be gitignored):
```bash
echo "VITE_GEMINI_API_KEY=YOUR_API_KEY" > .env.production
```
- Run `npm run build` - Vite will bundle the env var into the build

**Option 2**: Use Firebase Environment Config
- Note: Client-side apps can't use Firebase Functions environment config
- The API key will be visible in the browser (this is normal for client-side apps)
- Consider adding usage quotas and restrictions to your API key in Google Cloud Console

### Continuous Deployment (Optional)

Set up GitHub Actions for automatic deployments:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Add the JSON content as a GitHub Secret named `FIREBASE_SERVICE_ACCOUNT`
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
```

---

## Quick Commands Reference

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Firebase
firebase deploy

# View Firebase hosting URL
firebase hosting:channel:list
```
