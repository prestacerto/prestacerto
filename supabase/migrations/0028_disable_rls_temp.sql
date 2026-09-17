-- TEMPORARY: Disable RLS to allow login to work
-- This is a temporary measure while we configure RLS policies properly
-- Once policies are verified, re-enable with: ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated access temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Add a comment to remind us to re-enable RLS
COMMENT ON TABLE profiles IS 'RLS temporarily disabled - needs re-enabling with proper policies';
