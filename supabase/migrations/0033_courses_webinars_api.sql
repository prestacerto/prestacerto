-- Migration: Cursos, Webinars, API Enterprise, Certificações
-- R$ 120k + R$ 100k + R$ 250k + R$ 80k/ano

-- COURSES MARKETPLACE
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  price numeric(10,2) not null,
  prestacerto_commission numeric(3,2) default 0.30, -- 30-50%
  student_count int default 0,
  rating numeric(2,1),
  is_published boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_creator on courses(creator_id);
create index if not exists idx_courses_published on courses(is_published);

alter table courses enable row level security;

create policy "anyone_view_published_courses"
on courses for select using (is_published = true or creator_id = auth.uid());

-- Course enrollments
create table if not exists course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'dropped')),
  progress_percent int default 0,
  enrolled_at timestamptz not null default now(),
  unique (course_id, student_id)
);

create index if not exists idx_enrollments_course on course_enrollments(course_id);
create index if not exists idx_enrollments_student on course_enrollments(student_id);

-- WEBINARS
create table if not exists webinars (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  zoom_url text,
  scheduled_at timestamptz not null,
  price numeric(10,2) default 0,
  max_attendees int,
  registered_count int default 0,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'cancelled')),
  recording_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_webinars_host on webinars(host_id);
create index if not exists idx_webinars_scheduled on webinars(scheduled_at);

alter table webinars enable row level security;

create policy "anyone_view_webinars"
on webinars for select using (status != 'cancelled');

-- Webinar registrations
create table if not exists webinar_registrations (
  id uuid primary key default gen_random_uuid(),
  webinar_id uuid not null references webinars(id) on delete cascade,
  attendee_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'registered' check (status in ('registered', 'attended', 'cancelled')),
  registered_at timestamptz not null default now(),
  unique (webinar_id, attendee_id)
);

create index if not exists idx_webinar_reg_webinar on webinar_registrations(webinar_id);
create index if not exists idx_webinar_reg_attendee on webinar_registrations(attendee_id);

-- API ENTERPRISE
create table if not exists api_enterprise_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null,
  rate_limit int not null, -- requests/month
  features text[], -- JSON array de features
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists api_enterprise_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id uuid not null references api_enterprise_plans(id),
  api_key text not null unique,
  status text not null default 'active' check (status in ('active', 'suspended', 'cancelled')),
  monthly_requests int default 0,
  mp_order_id text,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_api_enterprise_user on api_enterprise_subscriptions(user_id);
create index if not exists idx_api_enterprise_key on api_enterprise_subscriptions(api_key);

alter table api_enterprise_subscriptions enable row level security;

create policy "user_view_own_api"
on api_enterprise_subscriptions for select using (user_id = auth.uid());

-- CERTIFICATIONS
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  exam_questions int not null,
  pass_score int not null default 70,
  validity_months int not null default 12,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists user_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  certification_id uuid not null references certifications(id),
  exam_score int not null,
  passed boolean not null,
  certificate_url text,
  obtained_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, certification_id)
);

create index if not exists idx_user_certs_user on user_certifications(user_id);
create index if not exists idx_user_certs_cert on user_certifications(certification_id);

alter table user_certifications enable row level security;

create policy "user_view_own_certs"
on user_certifications for select using (user_id = auth.uid());
