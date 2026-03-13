-- =============================================================================
-- PolicyScanner — Writer Management Schema
-- Run this in the Supabase SQL Editor AFTER the main supabase-schema.sql
-- =============================================================================

-- ─── Profiles (role management for auth users) ───────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id   uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'writer' CHECK (role IN ('admin', 'writer')),
  name text,
  created_at timestamptz DEFAULT now()
);

-- Auto-create profile row when a user is created via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'writer'),
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );


-- ─── SEO Pages (single source of truth for the 20-page hub) ─────────────────
CREATE TABLE IF NOT EXISTS seo_pages (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  url          text NOT NULL,
  target_words text NOT NULL,
  week         integer NOT NULL DEFAULT 1,
  level        integer NOT NULL DEFAULT 3,
  type         text NOT NULL DEFAULT 'product',
  keyword      text NOT NULL DEFAULT '',
  seed_file    text NOT NULL DEFAULT '',
  assigned_to  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status       text NOT NULL DEFAULT 'not_started'
                 CHECK (status IN ('not_started', 'in_progress', 'done', 'published')),
  admin_notes  text,
  sanity_pushed boolean NOT NULL DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- RLS for seo_pages
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Admins: full access
CREATE POLICY "Admins full access to seo_pages" ON seo_pages
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Writers: read own assigned pages
CREATE POLICY "Writers read assigned pages" ON seo_pages
  FOR SELECT USING (assigned_to = auth.uid());

-- Writers: update status on own pages
CREATE POLICY "Writers update own page status" ON seo_pages
  FOR UPDATE USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());


-- =============================================================================
-- NOTE: Seed the seo_pages table from the admin dashboard:
-- Visit /admin/seo-pages and click "Seed DB" button.
-- This calls POST /api/admin/seed-pages-db which inserts all 20 pages.
-- =============================================================================
