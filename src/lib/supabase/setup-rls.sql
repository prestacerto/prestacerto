-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Similar policies for other tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT
  USING (auth.uid() = client_id);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can read own proposals" ON proposals
  FOR SELECT
  USING (auth.uid() = freelancer_id);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can read own services" ON services
  FOR SELECT
  USING (auth.uid() = freelancer_id);
