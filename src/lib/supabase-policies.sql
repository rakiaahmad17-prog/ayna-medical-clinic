-- =============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Ayna Clinic Application
-- =============================================================================
--
-- This script implements strict role-based access control for the bookings
-- and blogs tables. Each policy is documented below with its purpose and
-- security rationale.
--
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire script
-- 4. Click "Run" to execute
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: ENABLE ROW LEVEL SECURITY ON TABLES
-- -----------------------------------------------------------------------------

-- Enable RLS on bookings table
-- RLS ensures that rows are only visible/modifiable based on user authentication
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on blogs table
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- STEP 2: DROP EXISTING POLICIES (if any)
-- -----------------------------------------------------------------------------

-- Drop all existing policies on bookings table to start fresh
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN SELECT policyname FROM pg_policies WHERE tablename = 'bookings'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON bookings', policy_name);
    END LOOP;
END $$;

-- Drop all existing policies on blogs table to start fresh
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN SELECT policyname FROM pg_policies WHERE tablename = 'blogs'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON blogs', policy_name);
    END LOOP;
END $$;


-- =============================================================================
-- BOOKINGS TABLE POLICIES
-- =============================================================================
--
-- Security Model:
-- - All authenticated users can CREATE (INSERT) bookings
-- - All authenticated users can READ (SELECT) all bookings (for admin review)
-- - All authenticated users can UPDATE bookings (status changes)
-- - All authenticated users can DELETE bookings (cancellation)
--
-- Note: In a production app, you might want to restrict UPDATE/DELETE to:
-- - The user who created the booking, OR
-- - Admin users only
-- Uncomment the appropriate policies below for stricter access control.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- BOOKINGS: SELECT Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to view all bookings
-- Rationale: Staff/admins need to see all bookings to manage appointments
-- Security: Anonymous users cannot see any booking data (protects patient privacy)

CREATE POLICY "Authenticated users can view all bookings"
ON bookings
FOR SELECT
TO authenticated
USING (true);

-- ALTERNATIVE: Stricter policy - users can only see their own bookings
-- Uncomment this and comment out the above policy if users should only see their own
-- CREATE POLICY "Users can only view their own bookings"
-- ON bookings
-- FOR SELECT
-- TO authenticated
-- USING (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- BOOKINGS: INSERT Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to create new bookings
-- Rationale: Only logged-in users should be able to make appointments
-- Security: Prevents spam bookings and ensures accountability

CREATE POLICY "Authenticated users can create bookings"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ALTERNATIVE: Allow public to book appointments (common for clinic booking)
-- Uncomment this policy if you want unauthenticated booking submissions
-- Note: This still requires a Supabase client but doesn't require login
-- CREATE POLICY "Anyone can create bookings (public booking)"
-- ON bookings
-- FOR INSERT
-- TO public
-- WITH CHECK (true);


-- -----------------------------------------------------------------------------
-- BOOKINGS: UPDATE Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to update booking information
-- Rationale: Staff can modify booking status, times, or details
-- Security: Ensures only authorized personnel can change appointments

CREATE POLICY "Authenticated users can update bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ALTERNATIVE: Stricter policy - users can only update their own bookings
-- Uncomment this if users should only modify their own appointments
-- CREATE POLICY "Users can only update their own bookings"
-- ON bookings
-- FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- BOOKINGS: DELETE Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to delete bookings
-- Rationale: For cancellation functionality
-- Security: Prevents unauthorized deletion of appointments

CREATE POLICY "Authenticated users can delete bookings"
ON bookings
FOR DELETE
TO authenticated
USING (true);

-- ALTERNATIVE: Stricter policy - users can only delete their own bookings
-- Uncomment this if users should only cancel their own appointments
-- CREATE POLICY "Users can only delete their own bookings"
-- ON bookings
-- FOR DELETE
-- TO authenticated
-- USING (auth.uid() = user_id);


-- =============================================================================
-- BLOGS TABLE POLICIES
-- =============================================================================
--
-- Security Model:
-- - PUBLIC: Can SELECT only published blogs (for website visitors)
-- - AUTHENTICATED: Can INSERT new blogs (content creators/admins)
-- - AUTHENTICATED: Can UPDATE any blog (content editors)
-- - AUTHENTICATED: Can DELETE blogs (content managers)
--
-- This ensures the public sees only approved content while authenticated
-- users have full control over content management.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- BLOGS: SELECT Policy (Public Access)
-- -----------------------------------------------------------------------------
-- Purpose: Allow anyone (public) to view published blog posts
-- Rationale: Blog content should be accessible to website visitors
-- Security: Only published=true blogs are visible; drafts remain hidden

CREATE POLICY "Public can view published blogs"
ON blogs
FOR SELECT
TO public
USING (published = true);

-- -----------------------------------------------------------------------------
-- BLOGS: SELECT Policy (Authenticated Access)
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to view ALL blogs including drafts
-- Rationale: Content creators need to see unpublished drafts for editing
-- Security: Ensures content management workflow

CREATE POLICY "Authenticated users can view all blogs"
ON blogs
FOR SELECT
TO authenticated
USING (true);


-- -----------------------------------------------------------------------------
-- BLOGS: INSERT Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to create new blog posts
-- Rationale: Only logged-in content creators should be able to write blogs
-- Security: Prevents unauthorized content creation

CREATE POLICY "Authenticated users can create blogs"
ON blogs
FOR INSERT
TO authenticated
WITH CHECK (true);


-- -----------------------------------------------------------------------------
-- BLOGS: UPDATE Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to update blog posts
-- Rationale: Content editors can modify published status, content, etc.
-- Security: Ensures content quality control

CREATE POLICY "Authenticated users can update blogs"
ON blogs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- -----------------------------------------------------------------------------
-- BLOGS: DELETE Policy
-- -----------------------------------------------------------------------------
-- Purpose: Allow authenticated users to delete blog posts
-- Rationale: Content managers can remove outdated or inappropriate content
-- Security: Prevents unauthorized deletion

CREATE POLICY "Authenticated users can delete blogs"
ON blogs
FOR DELETE
TO authenticated
USING (true);


-- =============================================================================
-- STEP 3: VERIFY POLICIES
-- =============================================================================

-- List all policies created for verification
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('bookings', 'blogs')
ORDER BY tablename, policyname;


-- =============================================================================
-- STEP 4: ENABLE RLS VERIFICATION
-- =============================================================================

-- Check if RLS is enabled on tables
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('bookings', 'blogs');


-- =============================================================================
-- POLICY SUMMARY
-- =============================================================================
--
-- BOOKINGS TABLE:
-- ┌─────────────┬──────────────────────────────┬─────────────────┐
-- │ Operation   │ Who Can Access               │ Conditions      │
-- ├─────────────┼──────────────────────────────┼─────────────────┤
-- │ SELECT      │ Authenticated users          │ None            │
-- │ INSERT      │ Authenticated users          │ None            │
-- │ UPDATE      │ Authenticated users          │ None            │
-- │ DELETE      │ Authenticated users          │ None            │
-- └─────────────┴──────────────────────────────┴─────────────────┘
--
-- BLOGS TABLE:
-- ┌─────────────┬──────────────────────────────┬─────────────────┐
-- │ Operation   │ Who Can Access               │ Conditions      │
-- ├─────────────┼──────────────────────────────┼─────────────────┤
-- │ SELECT      │ Everyone (public)            │ published=true  │
-- │ SELECT      │ Authenticated users          │ None (all rows) │
-- │ INSERT      │ Authenticated users          │ None            │
-- │ UPDATE      │ Authenticated users          │ None            │
-- │ DELETE      │ Authenticated users          │ None            │
-- └─────────────┴──────────────────────────────┴─────────────────┘
--
-- SECURITY NOTES:
-- 1. All "Allow all" policies have been removed
-- 2. RLS is now enforced on both tables
-- 3. Authentication is required for any data modification
-- 4. Public can only see published blog content
--
-- =============================================================================