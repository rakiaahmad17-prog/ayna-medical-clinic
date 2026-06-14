-- =============================================================================
-- SUPABASE RLS POLICIES SETUP SCRIPT
-- Ayna Clinic - Quick Setup
-- =============================================================================
--
-- INSTRUCTIONS:
-- 1. Go to: https://app.supabase.com
-- 2. Select your project
-- 3. Navigate to: SQL Editor > New Query
-- 4. Copy and paste this entire script
-- 5. Click "Run" or press Ctrl+Enter
--
-- This script will:
-- ✓ Enable Row Level Security on bookings and blogs tables
-- ✓ Remove any existing "Allow all" policies
-- ✓ Create secure, role-based access policies
--
-- =============================================================================

-- STEP 1: Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop existing policies
DROP POLICY IF EXISTS "Allow all" ON bookings CASCADE;
DROP POLICY IF EXISTS "Allow all" ON blogs CASCADE;
DROP POLICY IF EXISTS "Public can view all bookings" ON bookings CASCADE;
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings CASCADE;
DROP POLICY IF EXISTS "Public can update bookings" ON bookings CASCADE;
DROP POLICY IF EXISTS "Public can delete bookings" ON bookings CASCADE;
DROP POLICY IF EXISTS "Public can view all blogs" ON blogs CASCADE;
DROP POLICY IF EXISTS "Public can insert blogs" ON blogs CASCADE;
DROP POLICY IF EXISTS "Public can update blogs" ON blogs CASCADE;
DROP POLICY IF EXISTS "Public can delete blogs" ON blogs CASCADE;

-- STEP 3: Create BOOKINGS policies
CREATE POLICY "bookings_select_authenticated" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "bookings_insert_authenticated" ON bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "bookings_update_authenticated" ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "bookings_delete_authenticated" ON bookings FOR DELETE TO authenticated USING (true);

-- STEP 4: Create BLOGS policies
CREATE POLICY "blogs_select_public" ON blogs FOR SELECT TO public USING (published = true);
CREATE POLICY "blogs_select_authenticated" ON blogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "blogs_insert_authenticated" ON blogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blogs_update_authenticated" ON blogs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "blogs_delete_authenticated" ON blogs FOR DELETE TO authenticated USING (true);

-- STEP 5: Verify setup
SELECT 'Setup Complete!' AS status, COUNT(*) AS policies_created
FROM pg_policies WHERE tablename IN ('bookings', 'blogs');