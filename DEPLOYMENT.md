# KINKIN - Vercel Deployment Guide

**Status:** Code ready, awaiting Vercel deployment

---

## Quick Deploy (Manual - Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select GitHub account: `YBOT8AI`
   - Find and select: `Kinkin`
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bmltshasmxhninedbedr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG…PYCk
   DATABASE_URL=postgresql://postgres:bikhyM-7pokqe-sikpeb@db.bmltshasmxhninedbedr.supabase.co:5432/postgres
   NEXTAUTH_URL=https://kinkin.vercel.app
   NEXTAUTH_SECRET=dDtboV…lrI=
   STRIPE_SECRET_KEY=sk_test_***
   STRIPE_PUBLISHABLE_KEY=pk_test_***
   NEXT_PUBLIC_APP_NAME=KINKIN
   NEXT_PUBLIC_MINIMUM_HOURLY_RATE=10
   NEXT_PUBLIC_BASE_SERVICE_RADIUS=0.5
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait ~2-5 minutes for build
   - You'll get a URL like: `https://kinkin-xxx.vercel.app`

6. **Update NEXTAUTH_URL**
   - After first deploy, go to Vercel Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual Vercel domain
   - Redeploy (automatic on push)

---

## CLI Deploy (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
cd /root/.openclaw/workspace/kinkin
vercel login

# Link project
vercel link --repo

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] Website loads at Vercel URL
- [ ] Sign in page works
- [ ] Database connection verified
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Add custom domain (optional)
- [ ] Configure Stripe production keys
- [ ] Test full user flow

---

## Troubleshooting

### Build Fails
- Check "Activity" tab in Vercel for build logs
- Common issues: missing env vars, TypeScript errors

### Page Shows 404
- Verify `app/page.tsx` exists
- Check Next.js 14 App Router compatibility

### Auth Not Working
- Ensure `NEXTAUTH_URL` matches your Vercel domain exactly
- Verify `NEXTAUTH_SECRET` is set

---

**Files Prepared:**
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.production.example` - Environment template
- ✅ This deployment guide

**Next Step:** Complete manual deployment in Vercel dashboard
