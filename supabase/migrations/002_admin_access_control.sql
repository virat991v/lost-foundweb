-- ============================================================
-- Migration: 002_admin_access_control.sql
-- Restricts admin role to aaryanvirat911@gmail.com only.
-- ============================================================

-- 1. Promote the account if it already exists in profiles
UPDATE profiles
  SET role = 'admin'
WHERE email = 'aaryanvirat911@gmail.com';

-- 2. Add a CHECK constraint so no other email can ever hold 'admin'
--    This is enforced at the DB level on every INSERT and UPDATE.
ALTER TABLE profiles
  ADD CONSTRAINT only_designated_admin
  CHECK (
    role = 'student'
    OR (role = 'admin' AND email = 'aaryanvirat911@gmail.com')
  );

-- 3. Replace the handle_new_user trigger function so new signups
--    get 'admin' only when the email matches, 'student' otherwise.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, phone, role, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'phone', '')), ''),
    CASE WHEN NEW.email = 'aaryanvirat911@gmail.com' THEN 'admin'::user_role ELSE 'student'::user_role END,
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone     = COALESCE(EXCLUDED.phone, profiles.phone),
    role      = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
