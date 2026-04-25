-- KINKIN Database Schema
-- PostgreSQL with PostGIS for geolocation

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- USERS & AUTH
-- ============================================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  password_hash text,
  name text NOT NULL,
  avatar_url text,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- PROFILES & GAMIFICATION
-- ============================================

CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  rating numeric(3,2) DEFAULT 0.00,  -- 0.00 to 5.00
  review_count integer DEFAULT 0,
  level integer DEFAULT 1,
  xp_total integer DEFAULT 0,
  xp_current integer DEFAULT 0,
  strikes integer DEFAULT 0,
  suspended_until timestamptz,
  is_banned boolean DEFAULT false,
  achievements jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- SERVICE CATEGORIES (Static)
-- ============================================

CREATE TABLE service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_emoji text,
  description text,
  is_active boolean DEFAULT true
);

-- Insert default categories
INSERT INTO service_categories (name, slug, icon_emoji, description) VALUES
  ('Home Repairs', 'home_repair', '🔧', 'Fix appliances, plumbing, electrical, furniture assembly'),
  ('Car Maintenance', 'car_maintenance', '🚗', 'Oil change, tire rotation, battery jump, detailing'),
  ('Home-Cooked Meals', 'cooking', '🍳', 'Daily meals, batch cooking, special diets'),
  ('Nanny/Childcare', 'childcare', '👶', 'After-school care, babysitting, tutoring'),
  ('Pet Sitting', 'pet_sitting', '🐾', 'Dog walking, feeding, overnight stays, pet taxi'),
  ('Funeral/Ancestor Prayer', 'funeral_prayer', '🙏', 'Graveyard visits, prayer ceremonies, incense offerings');

-- ============================================
-- LISTINGS (Provider Services)
-- ============================================

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_category_id uuid REFERENCES service_categories(id),
  title text NOT NULL,
  description text,
  price_per_hour numeric(10,2),
  price_flat numeric(10,2),
  location geography(POINT),  -- PostGIS geolocation
  service_radius_km numeric DEFAULT 0.5,  -- Dynamic based on rating
  availability jsonb,  -- {monday: ["9-17"], tuesday: [...], ...}
  service_details jsonb,  -- Category-specific: pet_types, cultural_tradition, etc.
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for geolocation queries
CREATE INDEX idx_listings_location ON listings USING gist (location);
CREATE INDEX idx_listings_provider ON listings (provider_id);
CREATE INDEX idx_listings_category ON listings (service_category_id);

-- ============================================
-- ORDERS (Bookings)
-- ============================================

CREATE TYPE order_status AS ENUM (
  'pending',           -- Waiting for provider acceptance
  'accepted',          -- Provider accepted
  'in_progress',       -- Service being performed
  'completed',         -- Service done, awaiting review
  'cancelled',         -- Cancelled by either party
  'disputed',          -- Issue raised, needs resolution
  'refunded'           -- Refund processed
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  scheduled_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  price_total numeric(10,2) NOT NULL,
  special_instructions text,
  photo_proof_required boolean DEFAULT false,
  photo_proof_url text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_provider ON orders (provider_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_scheduled ON orders (scheduled_at);

-- ============================================
-- MESSAGES (In-App Chat)
-- ============================================

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_order ON messages (order_id);
CREATE INDEX idx_messages_sender ON messages (sender_id);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reviews_order ON reviews (order_id);
CREATE INDEX idx_reviews_reviewed ON reviews (reviewed_id);

-- ============================================
-- GAMIFICATION: XP TRANSACTIONS
-- ============================================

CREATE TABLE xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount integer NOT NULL,  -- positive or negative
  reason text NOT NULL,     -- 'job_completed', 'five_star_rating', 'no_show', etc.
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_xp_provider ON xp_transactions (provider_id);
CREATE INDEX idx_xp_created ON xp_transactions (created_at);

-- ============================================
-- GAMIFICATION: STRIKES
-- ============================================

CREATE TABLE provider_strikes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  violation_type text NOT NULL,
  severity text NOT NULL,  -- 'critical', 'severe', 'moderate'
  strikes_awarded integer NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  appealed boolean DEFAULT false,
  appeal_result text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz  -- auto-expire after 30-60 days
);

CREATE INDEX idx_strikes_provider ON provider_strikes (provider_id);

-- ============================================
-- FAIRNESS: JOB TRACKING
-- ============================================

-- Track current job count per provider
CREATE OR REPLACE VIEW provider_job_counts AS
SELECT 
  provider_id,
  COUNT(*) FILTER (WHERE status IN ('accepted', 'in_progress')) as current_jobs,
  COUNT(*) FILTER (WHERE status = 'completed' AND completed_at > now() - interval '7 days') as jobs_last_7_days,
  COALESCE(SUM(price_total) FILTER (WHERE status = 'completed' AND completed_at > now() - interval '7 days'), 0) as earnings_last_7_days
FROM orders
GROUP BY provider_id;

-- ============================================
-- FUNCTIONS: DYNAMIC RADIUS CALCULATION
-- ============================================

CREATE OR REPLACE FUNCTION get_provider_radius(
  avg_rating numeric,
  review_count integer
) RETURNS numeric AS $$
DECLARE
  base_radius numeric := 0.5;  -- Minimum radius (km)
  radius_per_star numeric := 0.9;  -- km per star
  review_weight numeric;
BEGIN
  -- Weight rating by review count (prevent gaming, caps at 10 reviews)
  review_weight := LEAST(review_count / 10.0, 1.0);
  
  -- Calculate effective radius
  RETURN base_radius + (avg_rating * radius_per_star * review_weight);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCTIONS: UPDATE PROVIDER RATING
-- ============================================

CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update rating and review count after new review
  UPDATE profiles
  SET 
    rating = (SELECT AVG(rating) FROM reviews WHERE reviewed_id = NEW.reviewed_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE reviewed_id = NEW.reviewed_id),
    updated_at = now()
  WHERE user_id = NEW.reviewed_id;
  
  -- Update service radius based on new rating
  UPDATE listings
  SET 
    service_radius_km = get_provider_radius(
      (SELECT rating FROM profiles WHERE user_id = NEW.reviewed_id),
      (SELECT review_count FROM profiles WHERE user_id = NEW.reviewed_id)
    ),
    updated_at = now()
  WHERE provider_id = NEW.reviewed_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update rating on new review
CREATE TRIGGER trg_update_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ============================================
-- FUNCTIONS: XP AWARD FOR JOB COMPLETION
-- ============================================

CREATE OR REPLACE FUNCTION award_xp_for_job_completion()
RETURNS TRIGGER AS $$
DECLARE
  xp_amount integer := 20;  -- Base XP for completing job
  rating_bonus integer := 0;
BEGIN
  -- Check if job was completed (not cancelled)
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get rating for this job if exists
    SELECT COALESCE(rating, 0) INTO rating_bonus
    FROM reviews 
    WHERE order_id = NEW.id AND reviewed_id = NEW.provider_id;
    
    -- Add rating bonus
    IF rating_bonus = 5 THEN
      xp_amount := xp_amount + 10;  -- 5★ = +10 XP
    ELSIF rating_bonus = 4 THEN
      xp_amount := xp_amount + 5;   -- 4★ = +5 XP
    END IF;
    
    -- Award XP
    INSERT INTO xp_transactions (provider_id, amount, reason, order_id)
    VALUES (NEW.provider_id, xp_amount, 'job_completed', NEW.id);
    
    -- Update provider total XP
    UPDATE profiles
    SET 
      xp_total = xp_total + xp_amount,
      xp_current = xp_current + xp_amount,
      updated_at = now()
    WHERE user_id = NEW.provider_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-award XP on job completion
CREATE TRIGGER trg_award_xp_on_completion
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION award_xp_for_job_completion();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Basic Setup
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

-- Profiles are public (for marketplace browsing)
CREATE POLICY profiles_select_all ON profiles
  FOR SELECT USING (true);

-- Listings are public
CREATE POLICY listings_select_all ON listings
  FOR SELECT USING (true);

-- Orders: users can see their own orders (as customer or provider)
CREATE POLICY orders_select_own ON orders
  FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() = provider_id
  );

-- Messages: only participants can see
CREATE POLICY messages_select_participants ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = messages.order_id 
      AND (orders.customer_id = auth.uid() OR orders.provider_id = auth.uid())
    )
  );

-- Reviews: public (for transparency)
CREATE POLICY reviews_select_all ON reviews
  FOR SELECT USING (true);

-- ============================================
-- INITIAL DATA: ACHIEVEMENTS
-- ============================================

-- Achievements are stored in profiles.achievements as JSONB
-- Example structure:
-- [
--   {"badge": "fast_starter", "earned_at": "2026-04-25", "xp_bonus": 10},
--   {"badge": "perfect_month", "earned_at": "2026-05-01", "xp_bonus": 25}
-- ]
