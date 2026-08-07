// Skill Assessments System
// Verify expertise with paid certifications

export type SkillCategory =
  | "web-development"
  | "mobile-development"
  | "design"
  | "marketing"
  | "copywriting"
  | "seo"
  | "data-analytics"
  | "ai-prompting";

export interface SkillAssessment {
  id: string;
  category: SkillCategory;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  price: number;
  passingScore: number; // 0-100
}

export interface UserSkillCertificate {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  passed: boolean;
  earnedAt: Date;
  expiresAt?: Date;
  certificateUrl?: string;
}

// Available assessments
export const SKILL_ASSESSMENTS: Record<SkillCategory, SkillAssessment> = {
  "web-development": {
    id: "skill_web_dev",
    category: "web-development",
    title: "Especialista em Web",
    description: "Valide seus conhecimentos em HTML, CSS, JavaScript, React e backend.",
    questionsCount: 40,
    difficulty: "advanced",
    duration: 60,
    price: 29,
    passingScore: 70
  },
  "mobile-development": {
    id: "skill_mobile_dev",
    category: "mobile-development",
    title: "Especialista em Mobile",
    description: "Teste seus conhecimentos em React Native, Flutter, iOS e Android.",
    questionsCount: 35,
    difficulty: "advanced",
    duration: 50,
    price: 29,
    passingScore: 70
  },
  "design": {
    id: "skill_design",
    category: "design",
    title: "Designer Profissional",
    description: "Avalie seus conhecimentos em UX/UI, Figma, Adobé XD e Design System.",
    questionsCount: 30,
    difficulty: "intermediate",
    duration: 45,
    price: 19,
    passingScore: 65
  },
  "marketing": {
    id: "skill_marketing",
    category: "marketing",
    title: "Estrategista de Marketing",
    description: "Comprove expertise em estratégia, segmentação e análise de campanhas.",
    questionsCount: 35,
    difficulty: "intermediate",
    duration: 50,
    price: 19,
    passingScore: 65
  },
  "copywriting": {
    id: "skill_copywriting",
    category: "copywriting",
    title: "Copywriter Especializado",
    description: "Teste habilidades em copywriting, persuasão e storytelling.",
    questionsCount: 30,
    difficulty: "intermediate",
    duration: 40,
    price: 19,
    passingScore: 65
  },
  "seo": {
    id: "skill_seo",
    category: "seo",
    title: "Especialista em SEO",
    description: "Valide conhecimentos em on-page, off-page, técnico e algoritmos.",
    questionsCount: 35,
    difficulty: "advanced",
    duration: 50,
    price: 19,
    passingScore: 70
  },
  "data-analytics": {
    id: "skill_data",
    category: "data-analytics",
    title: "Analista de Dados",
    description: "Teste expertise em Google Analytics, Data Studio, SQL e visualização.",
    questionsCount: 40,
    difficulty: "advanced",
    duration: 60,
    price: 29,
    passingScore: 70
  },
  "ai-prompting": {
    id: "skill_ai",
    category: "ai-prompting",
    title: "Especialista em AI Prompting",
    description: "Valide habilidades em prompt engineering e aplicações de IA.",
    questionsCount: 25,
    difficulty: "intermediate",
    duration: 35,
    price: 9,
    passingScore: 60
  }
};

// Revenue projection
export function projectedEarnings(
  certificates: number,
  avgPricePerAssessment: number = 19
): {
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalUsersCertified: number;
} {
  return {
    monthlyRevenue: certificates * avgPricePerAssessment,
    yearlyRevenue: certificates * avgPricePerAssessment * 12,
    totalUsersCertified: certificates
  };
}

// Database schema
export const SKILL_ASSESSMENTS_MIGRATION = `
create table if not exists skill_assessments (
  id uuid primary key default gen_random_uuid(),
  category text not null unique,
  title text not null,
  description text,
  questions_count int,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration int not null,
  price numeric(10,2) not null,
  passing_score int not null default 70,
  created_at timestamptz not null default now()
);

create table if not exists user_skill_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  assessment_id uuid not null references skill_assessments(id),
  score int not null check (score between 0 and 100),
  passed boolean generated always as (score >= 70) stored,
  earned_at timestamptz not null default now(),
  expires_at timestamptz,
  certificate_url text,
  created_at timestamptz not null default now(),

  constraint unique_user_assessment unique (user_id, assessment_id)
);

create index if not exists idx_user_skill_certificates_user on user_skill_certificates(user_id);
create index if not exists idx_user_skill_certificates_passed on user_skill_certificates(passed);

alter table user_skill_certificates enable row level security;

create policy "user_view_own_certificates"
on user_skill_certificates for select using (auth.uid() = user_id);

create policy "public_view_verified_certificates"
on user_skill_certificates for select using (
  passed = true
);

-- View: User's certified skills
create or replace view user_certified_skills as
select
  usc.user_id,
  sa.category,
  sa.title,
  usc.score,
  usc.passed,
  usc.earned_at,
  sa.price
from user_skill_certificates usc
join skill_assessments sa on usc.assessment_id = sa.id
where usc.passed = true
order by usc.earned_at desc;

alter table user_certified_skills enable row level security;
`;
