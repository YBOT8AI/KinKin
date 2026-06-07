# 🏡 KINKIN - Neighborhood Services Marketplace

**Tagline:** Help neighbors, earn money, level up.

---

## 🎯 Vision

KINKIN connects people with nearby residents who can provide everyday services:
- 🔧 Home repairs
- 🚗 Car maintenance
- 🍳 Home-cooked meals
- 👶 Nanny/childcare
- 🐾 Pet sitting
- 🙏 Funeral/ancestor prayer services

**Mission:** Fair opportunity for all. Reward good service. Build trust in local communities.

---

## 🎮 Gamification System

KINKIN operates like a game:

### Level Up 📈
- Earn XP for completed jobs and good ratings
- Higher levels = larger service area + more jobs
- Visual badges and achievements

### Face Consequences ⚠️
- No-shows → strikes → suspension → ban
- Poor ratings → reduced radius → retraining required
- Fairness enforcement prevents job hoarding

### Provider Levels
| Level | Title | XP Required | Benefits |
|-------|-------|-------------|----------|
| 1 | 🌱 Neighbor | 0 | 0.5km radius, 2 jobs max |
| 2 | 🏡 Helper | 100 | 1.0km radius, 3 jobs max |
| 3 | 🛠️ Pro | 300 | 2.0km radius, 4 jobs max |
| 4 | ⭐ Expert | 750 | 3.5km radius, 5 jobs max |
| 5 | 🏆 Legend | 1,500 | 5.0km radius, 6 jobs max |
| 6 | 👑 Community Hero | 3,000 | 7.0km radius, 8 jobs max, priority matching |

---

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (data fetching)

**Backend:**
- Next.js API Routes
- PostgreSQL (Supabase)
- PostGIS (geolocation)
- Stripe (payments)
- Twilio (SMS verification)
- SendGrid (email)

**Deploy:**
- Vercel (frontend + API)
- Supabase (database + auth)
- Stripe (payments)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:
- Supabase URL + anon key
- Stripe keys
- Twilio credentials
- Google Maps/Mapbox token

### 3. Set Up Database

```bash
# Connect to your Supabase PostgreSQL
psql $DATABASE_URL -f lib/database-schema.sql
```

This creates:
- All tables (users, profiles, listings, orders, etc.)
- Gamification system (XP, levels, strikes)
- Geolocation indexes (PostGIS)
- Triggers (auto-update ratings, award XP)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Phase 1 Status

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | ✅ Complete | Hero, categories, how-it-works |
| Database | ✅ Complete | Supabase + PostGIS connected |
| Gamification | ✅ Complete | 6 levels, XP, strikes, achievements |
| **Authentication** | ✅ **Complete** | Email/password + Google/Facebook OAuth |
| Browse Page | 🚧 In Progress | Next priority |
| Provider Profile | 🚧 In Progress | After browse |
| Booking Flow | 🚧 In Progress | After provider profile |
| Dashboard | ✅ Basic | Level, rating, service area stats |

---

## 📁 Project Structure

```
kinkin/
├── app/                      # Next.js app router
│   ├── page.tsx              # Homepage
│   ├── signin/               # Sign in page
│   ├── signup/               # Sign up page
│   ├── forgot-password/      # Password reset request
│   ├── reset-password/       # Set new password
│   ├── auth/
│   │   ├── callback/route.ts # OAuth + email callback
│   │   └── signout/route.ts  # Sign out action
│   ├── dashboard/            # User dashboard (protected)
│   ├── browse/               # Service categories (TODO)
│   ├── providers/[id]/       # Provider profile (TODO)
│   └── api/                  # API routes (TODO)
├── components/               # Reusable UI components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── middleware.ts     # Auth middleware
│   ├── database-schema.sql   # PostgreSQL schema
│   └── gamification.ts       # XP/levels/strikes logic
├── middleware.ts             # Next.js middleware (auth guard)
└── .env.local                # Environment variables
```

---

## 🔑 Core Features

### 1. Dynamic Radius Matching
- Provider's service area expands with higher ratings
- Formula: `radius = 0.5 + (rating × 0.9 × min(reviews/10, 1.0))`
- 5★ providers reach farther, 1★ restricted to immediate vicinity

### 2. Fairness Enforcement
- Max concurrent jobs = `ceil(avg_daily_earnings / minimum_hourly_rate)`
- Prevents job hoarding
- Distributes opportunity across community

### 3. Strike System
| Strikes | Consequence |
|---------|-------------|
| 1 | Warning |
| 2 | Radius -50% for 7 days |
| 3 | 7-day suspension |
| 4 | 30-day suspension |
| 5 | **Permanent ban** |

### 4. XP & Achievements
- Complete job: +20 XP
- 5★ rating: +10 XP
- Perfect week: +25 XP
- Badges unlock special benefits

---

## 📊 API Endpoints

### Public
- `GET /api/listings` - Search services (by location, category)
- `GET /api/providers/:id` - Provider profile + rating
- `GET /api/categories` - Service categories

### Auth Required
- `POST /api/orders` - Create booking
- `POST /api/reviews` - Submit rating
- `GET /api/dashboard` - Provider/customer dashboard
- `POST /api/xp/award` - Award XP (admin only)

---

## 🔒 Security

- **HTTPS everywhere** (Vercel TLS)
- **NextAuth.js** (email + phone verification)
- **Row Level Security** (PostgreSQL RLS)
- **Rate limiting** (API routes)
- **Input validation** (Zod schemas)
- **No sensitive data in logs**

---

## 📱 Mobile Roadmap (Phase 2)

**React Native app:**
- Reuse API contract
- Push notifications
- Native GPS + camera
- Apple App Store + Google Play Store

---

## 🤝 Contributing

This is a private project. Contact TOBY NG for access.

---

## 📄 License

Private. All rights reserved.

---

**Built with ⚡ by YBOT for TOBY NG**
<!-- Redeploy Sun Jun  7 16:52:11 UTC 2026 -->
