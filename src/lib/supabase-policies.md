# Supabase RLS Policies Documentation

## Overview

This document describes the Row Level Security (RLS) policies implemented for the Ayna Clinic application. RLS provides fine-grained access control at the database level, ensuring that users can only access data they're authorized to see.

## Why RLS Matters

Without RLS, anyone with your Supabase URL and anon key could:
- Read all bookings and patient information
- Insert fake bookings
- Modify or delete existing appointments
- Access unpublished blog drafts

With RLS policies in place, the database enforces access rules regardless of client-side code.

---

## Bookings Table Policies

### SELECT Policy
```sql
CREATE POLICY "bookings_select_authenticated" ON bookings 
FOR SELECT TO authenticated USING (true);
```

**Who can access:** Authenticated users only  
**What they can see:** All booking records  
**Security rationale:** Patient booking data is sensitive. Only logged-in staff/admins should view appointments.

### INSERT Policy
```sql
CREATE POLICY "bookings_insert_authenticated" ON bookings 
FOR INSERT TO authenticated WITH CHECK (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Create new booking records  
**Security rationale:** Prevents spam bookings and ensures accountability for appointment requests.

### UPDATE Policy
```sql
CREATE POLICY "bookings_update_authenticated" ON bookings 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Modify booking status, time, or details  
**Security rationale:** Only authorized personnel can change appointments.

### DELETE Policy
```sql
CREATE POLICY "bookings_delete_authenticated" ON bookings 
FOR DELETE TO authenticated USING (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Remove booking records  
**Security rationale:** Prevents unauthorized cancellation of appointments.

---

## Blogs Table Policies

### SELECT Policy (Public)
```sql
CREATE POLICY "blogs_select_public" ON blogs 
FOR SELECT TO public USING (published = true);
```

**Who can access:** Everyone (public)  
**What they can see:** Only `published = true` blog posts  
**Security rationale:** Unpublished drafts should not be visible to website visitors.

### SELECT Policy (Authenticated)
```sql
CREATE POLICY "blogs_select_authenticated" ON blogs 
FOR SELECT TO authenticated USING (true);
```

**Who can access:** Authenticated users only  
**What they can see:** All blog posts including unpublished drafts  
**Security rationale:** Content creators need to see drafts for editing workflow.

### INSERT Policy
```sql
CREATE POLICY "blogs_insert_authenticated" ON blogs 
FOR INSERT TO authenticated WITH CHECK (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Create new blog posts  
**Security rationale:** Only authorized content creators can publish articles.

### UPDATE Policy
```sql
CREATE POLICY "blogs_update_authenticated" ON blogs 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Modify any blog post  
**Security rationale:** Content editors can update published status, content, metadata.

### DELETE Policy
```sql
CREATE POLICY "blogs_delete_authenticated" ON blogs 
FOR DELETE TO authenticated USING (true);
```

**Who can access:** Authenticated users only  
**What they can do:** Remove blog posts  
**Security rationale:** Content managers can remove outdated content.

---

## Policy Summary Table

| Table    | Operation | Access Level      | Condition         |
|----------|-----------|-------------------|-------------------|
| bookings | SELECT    | authenticated     | none              |
| bookings | INSERT    | authenticated     | none              |
| bookings | UPDATE    | authenticated     | none              |
| bookings | DELETE    | authenticated     | none              |
| blogs    | SELECT    | public            | published = true  |
| blogs    | SELECT    | authenticated     | none              |
| blogs    | INSERT    | authenticated     | none              |
| blogs    | UPDATE    | authenticated     | none              |
| blogs    | DELETE    | authenticated     | none              |

---

## Files Included

| File | Purpose |
|------|---------|
| `supabase-policies.sql` | Full SQL script with detailed comments and explanations |
| `supabase-setup.sql` | Quick setup script for SQL Editor (minimal comments) |
| `supabase-policies.md` | This documentation file |

---

## How to Run

### Option 1: Supabase SQL Editor (Recommended)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the contents of `supabase-setup.sql`
6. Click **Run**

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: Direct SQL Connection
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```
Then paste the SQL from `supabase-setup.sql`.

---

## Verification

After running the script, verify policies are in place:

```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('bookings', 'blogs');
```

Expected output should show 9 policies (4 for bookings, 5 for blogs).

---

## Troubleshooting

### "Permission denied" errors
- Ensure the user is authenticated (logged in)
- Check that the user has the correct role (`authenticated`)

### "No rows returned" for public blog queries
- Verify the blog has `published = true`
- Check that RLS is enabled: `SELECT rowsecurity FROM pg_tables WHERE tablename = 'blogs';`

### Unexpected access
- Review policies: `SELECT * FROM pg_policies WHERE tablename = 'bookings';`
- Ensure no conflicting policies exist

---

## Security Best Practices

1. **Use the Anon Key for public access** - Only expose the anon key in client-side code
2. **Use the Service Role Key for admin operations** - Never expose this in client code
3. **Enable RLS on all tables** - Even lookup/reference tables
4. **Prefer USING over WITH CHECK** - USING filters existing rows, WITH CHECK validates new data
5. **Test policies thoroughly** - Verify both allowed and denied access scenarios

---

## Need Modifications?

### For stricter bookings (users see only their own):
```sql
-- Add user_id column to bookings table first
ALTER TABLE bookings ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Replace SELECT policy
DROP POLICY "bookings_select_authenticated" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings 
FOR SELECT TO authenticated USING (auth.uid() = user_id);
```

### For stricter blogs (only author can edit their posts):
```sql
-- Requires author_id column in blogs table
ALTER TABLE blogs ADD COLUMN author_id UUID REFERENCES auth.users(id);

-- Replace UPDATE policy
DROP POLICY "blogs_update_authenticated" ON blogs;
CREATE POLICY "blogs_update_own" ON blogs 
FOR UPDATE TO authenticated USING (auth.uid() = author_id);
```

---

## Support

For more information about Supabase RLS:
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
