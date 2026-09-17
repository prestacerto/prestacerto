-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- PROFILES: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- PROFILES: Users can insert their own profile (during signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- PROFILES: Allow public read for portfolios (freelancers who want to be discoverable)
DROP POLICY IF EXISTS "Public profiles are readable" ON profiles;
CREATE POLICY "Public profiles are readable" ON profiles
  FOR SELECT
  USING (is_active = true);

-- PROJECTS: Clients can read their own projects
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
CREATE POLICY "Users can read own projects" ON projects
  FOR SELECT
  USING (auth.uid() = client_id);

-- PROJECTS: Clients can update their own projects
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE
  USING (auth.uid() = client_id);

-- PROJECTS: Allow public read for active projects (freelancers need to see available projects)
DROP POLICY IF EXISTS "Public projects are readable" ON projects;
CREATE POLICY "Public projects are readable" ON projects
  FOR SELECT
  USING (status != 'archived');

-- PROPOSALS: Freelancers can read their own proposals
DROP POLICY IF EXISTS "Freelancers can read own proposals" ON proposals;
CREATE POLICY "Freelancers can read own proposals" ON proposals
  FOR SELECT
  USING (auth.uid() = freelancer_id);

-- PROPOSALS: Clients can read proposals for their projects
DROP POLICY IF EXISTS "Clients can read proposals on own projects" ON proposals;
CREATE POLICY "Clients can read proposals on own projects" ON proposals
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = proposals.project_id
    AND projects.client_id = auth.uid()
  ));

-- SERVICES: Freelancers can read their own services
DROP POLICY IF EXISTS "Freelancers can read own services" ON services;
CREATE POLICY "Freelancers can read own services" ON services
  FOR SELECT
  USING (auth.uid() = freelancer_id);

-- SERVICES: Allow public read for active services
DROP POLICY IF EXISTS "Public services are readable" ON services;
CREATE POLICY "Public services are readable" ON services
  FOR SELECT
  USING (is_active = true);
