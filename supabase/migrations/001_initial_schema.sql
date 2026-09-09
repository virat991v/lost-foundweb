-- ============================================================
-- Lost & Found Campus Platform — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'restricted', 'inactive');
CREATE TYPE item_category AS ENUM ('electronics', 'bags', 'keys', 'books', 'clothing', 'accessories', 'documents', 'bottles', 'other');
CREATE TYPE campus_location AS ENUM ('main_gate', 'library', 'canteen', 'classroom', 'laboratory', 'hostel', 'parking', 'sports_ground', 'auditorium', 'office', 'corridor', 'other');
CREATE TYPE item_status AS ENUM ('active', 'matched', 'verification', 'returned', 'closed');
CREATE TYPE claim_status AS ENUM ('pending', 'under_verification', 'approved', 'rejected', 'needs_admin_review', 'cancelled');
CREATE TYPE match_status AS ENUM ('potential', 'confirmed', 'rejected');
CREATE TYPE flag_reason AS ENUM ('fake_report', 'spam', 'suspicious_claim', 'wrong_information', 'other');
CREATE TYPE flag_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed');
CREATE TYPE notification_type AS ENUM ('match_found', 'claim_submitted', 'verification_requested', 'claim_approved', 'claim_rejected', 'needs_admin_review', 'item_returned', 'item_closed', 'flag_action', 'admin_action');

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  account_status account_status NOT NULL DEFAULT 'active',
  trust_score INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lost items table
CREATE TABLE lost_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category item_category NOT NULL,
  description TEXT NOT NULL,
  brand_model TEXT,
  color TEXT,
  photo_url TEXT NOT NULL DEFAULT '',
  lost_date DATE NOT NULL,
  lost_time TIME,
  campus_location campus_location NOT NULL,
  specific_spot TEXT,
  identifying_details TEXT,
  private_verification TEXT NOT NULL,
  status item_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Found items table
CREATE TABLE found_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category item_category NOT NULL,
  description TEXT NOT NULL,
  brand_model TEXT,
  color TEXT,
  photo_url TEXT NOT NULL DEFAULT '',
  found_date DATE NOT NULL,
  found_time TIME,
  campus_location campus_location NOT NULL,
  specific_spot TEXT,
  current_location TEXT,
  status item_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lost_item_id UUID NOT NULL REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id UUID NOT NULL REFERENCES found_items(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  match_reason TEXT,
  status match_status NOT NULL DEFAULT 'potential',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lost_item_id, found_item_id)
);

-- Claims table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claimant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('lost', 'found')),
  item_id UUID NOT NULL,
  verification_response JSONB,
  proof_url TEXT,
  status claim_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Returns table
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  owner_confirmed BOOLEAN DEFAULT FALSE,
  finder_confirmed BOOLEAN DEFAULT FALSE,
  owner_confirmed_at TIMESTAMPTZ,
  finder_confirmed_at TIMESTAMPTZ,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_type TEXT,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Flags table
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('lost_item', 'found_item', 'claim', 'user')),
  target_id UUID NOT NULL,
  reason flag_reason NOT NULL,
  description TEXT,
  status flag_status NOT NULL DEFAULT 'open',
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact disclosures table (audit trail for when contact is revealed)
CREATE TABLE contact_disclosures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  disclosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disclosed_by UUID REFERENCES profiles(id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX idx_lost_items_status ON lost_items(status);
CREATE INDEX idx_lost_items_category ON lost_items(category);
CREATE INDEX idx_lost_items_campus_location ON lost_items(campus_location);
CREATE INDEX idx_lost_items_created_at ON lost_items(created_at DESC);
CREATE INDEX idx_found_items_user_id ON found_items(user_id);
CREATE INDEX idx_found_items_status ON found_items(status);
CREATE INDEX idx_found_items_category ON found_items(category);
CREATE INDEX idx_found_items_campus_location ON found_items(campus_location);
CREATE INDEX idx_found_items_created_at ON found_items(created_at DESC);
CREATE INDEX idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_flags_status ON flags(status);
CREATE INDEX idx_activity_logs_actor_id ON activity_logs(actor_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_lost_items_fts ON lost_items USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_found_items_fts ON found_items USING gin(to_tsvector('english', title || ' ' || description));

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lost_items_updated_at BEFORE UPDATE ON lost_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_found_items_updated_at BEFORE UPDATE ON found_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_disclosures ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Service can insert profiles"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS POLICIES: lost_items
-- ============================================================
CREATE POLICY "Authenticated users can view lost items"
  ON lost_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own lost items"
  ON lost_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own active lost items"
  ON lost_items FOR UPDATE
  USING (auth.uid() = user_id AND status = 'active')
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any lost item"
  ON lost_items FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- RLS POLICIES: found_items
-- ============================================================
CREATE POLICY "Authenticated users can view found items"
  ON found_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own found items"
  ON found_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own active found items"
  ON found_items FOR UPDATE
  USING (auth.uid() = user_id AND status = 'active')
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any found item"
  ON found_items FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- RLS POLICIES: matches
-- ============================================================
CREATE POLICY "Authenticated users can view matches"
  ON matches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert matches"
  ON matches FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update matches"
  ON matches FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- RLS POLICIES: claims
-- ============================================================
CREATE POLICY "Users can view their own claims"
  ON claims FOR SELECT USING (auth.uid() = claimant_id);
CREATE POLICY "Admins can view all claims"
  ON claims FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can insert claims"
  ON claims FOR INSERT WITH CHECK (auth.uid() = claimant_id);
CREATE POLICY "Users can update their own pending claims"
  ON claims FOR UPDATE
  USING (auth.uid() = claimant_id AND status = 'pending')
  WITH CHECK (auth.uid() = claimant_id);
CREATE POLICY "Admins can update any claim"
  ON claims FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- RLS POLICIES: returns
-- ============================================================
CREATE POLICY "Users can view returns for their claims"
  ON returns FOR SELECT USING (
    EXISTS (SELECT 1 FROM claims WHERE claims.id = returns.claim_id AND claims.claimant_id = auth.uid())
  );
CREATE POLICY "Admins can view all returns"
  ON returns FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can insert returns for their approved claims"
  ON returns FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM claims WHERE claims.id = claim_id AND claims.claimant_id = auth.uid() AND claims.status = 'approved')
  );
CREATE POLICY "Users can update their own return confirmations"
  ON returns FOR UPDATE USING (
    EXISTS (SELECT 1 FROM claims WHERE claims.id = returns.claim_id AND claims.claimant_id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: notifications
-- ============================================================
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- RLS POLICIES: flags
-- ============================================================
CREATE POLICY "Users can insert flags"
  ON flags FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own flags"
  ON flags FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Admins can view all flags"
  ON flags FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update flags"
  ON flags FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- RLS POLICIES: activity_logs
-- ============================================================
CREATE POLICY "Admins can view activity logs"
  ON activity_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- RLS POLICIES: contact_disclosures
-- ============================================================
CREATE POLICY "Users can view disclosures for their claims"
  ON contact_disclosures FOR SELECT USING (
    EXISTS (SELECT 1 FROM claims WHERE claims.id = contact_disclosures.claim_id AND claims.claimant_id = auth.uid())
  );
CREATE POLICY "Admins can view all disclosures"
  ON contact_disclosures FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert disclosures"
  ON contact_disclosures FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Campus User'),
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
