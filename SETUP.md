# 🚀 KINKIN Setup Instructions

## ✅ What's Done

- [x] Next.js 14 project scaffolded
- [x] Database schema created (`lib/database-schema.sql`)
- [x] Gamification system implemented (`lib/gamification.ts`)
- [x] README with full architecture
- [x] Git initialized, ready to push

---

## 📋 Next Steps (TOBY - Do This)

### 1. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `Kinkin`
3. Visibility: **Private** (or Public if you prefer)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

**Option B: Via GitHub CLI (if you have it)**
```bash
gh repo create YBOT8AI/Kinkin --private --source=. --push
```

### 2. Push Code to GitHub

```bash
cd /root/.openclaw/workspace/kinkin

# Add remote (if not already done)
git remote add origin git@github.com:YBOT8AI/Kinkin.git

# Rename branch to main
git branch -m main

# Push
git push -u origin main
```

### 3. Set Up Supabase Database

1. Go to https://supabase.com
2. Create new project: `kinkin`
3. Wait for provisioning (~2 min)
4. Go to **SQL Editor**
5. Copy entire contents of `lib/database-schema.sql`
6. Paste and run
7. Save your:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: (from Settings → API)
   - Database URL: (from Settings → Database)

### 4. Set Up Stripe (Payments)

1. Go to https://dashboard.stripe.com
2. Create account (or use existing)
3. Get API keys:
   - **Test mode** (for development)
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
4. Set up **Webhooks** later (for production)

### 5. Set Up Twilio (SMS Verification)

1. Go to https://console.twilio.com
2. Sign up / log in
3. Get credentials:
   - Account SID
   - Auth Token
   - Buy a phone number (or use trial)

### 6. Set Up Google Maps or Mapbox (Geolocation)

**Google Maps:**
1. https://console.cloud.google.com
2. Enable "Maps JavaScript API" + "Geocoding API"
3. Create API key

**OR Mapbox (free tier is generous):**
1. https://mapbox.com
2. Sign up
3. Get access token

### 7. Configure Environment Variables

```bash
cd /root/.openclaw/workspace/kinkin
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."

# App
NEXT_PUBLIC_APP_NAME="KINKIN"
NEXT_PUBLIC_MINIMUM_HOURLY_RATE="10"
NEXT_PUBLIC_BASE_SERVICE_RADIUS="0.5"
```

### 8. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 🎯 Immediate Development Priorities

### Phase 1: Core Marketplace (Week 1-2)
- [ ] User auth (email + phone verification)
- [ ] Provider profile creation
- [ ] Service listing CRUD
- [ ] Browse + search with geolocation
- [ ] Booking system (orders)
- [ ] Basic messaging

### Phase 2: Payments + Gamification (Week 3-4)
- [ ] Stripe integration
- [ ] XP tracking + level system
- [ ] Strike enforcement
- [ ] Provider dashboard
- [ ] Reviews + ratings

### Phase 3: Polish + Launch (Week 5-6)
- [ ] Mobile-responsive design
- [ ] SEO optimization
- [ ] Email/SMS notifications
- [ ] Admin dashboard
- [ ] Deploy to production Vercel

---

## 📞 Questions?

Ask YBOT anytime. I'm building this with you.

---

**Status:** 🟡 Ready for GitHub + Supabase setup
