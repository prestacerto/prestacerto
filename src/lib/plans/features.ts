import { createClient } from "@/lib/supabase/server";

export interface PlanFeatures {
  projects: number; // -1 = unlimited
  job_matching: boolean;
  analytics: boolean;
  featured: boolean;
  priority: boolean;
}

const PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    projects: 2,
    job_matching: false,
    analytics: false,
    featured: false,
    priority: false,
  },
  pro: {
    projects: 20,
    job_matching: true,
    analytics: true,
    featured: false,
    priority: false,
  },
  premium: {
    projects: -1,
    job_matching: true,
    analytics: true,
    featured: true,
    priority: true,
  },
};

export async function getUserPlan(userId: string) {
  const supabase = await createClient();

  try {
    const { data } = await supabase
      .from("user_subscriptions")
      .select("plan_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    return data?.plan_id || "free";
  } catch (error) {
    return "free";
  }
}

export async function getUserFeatures(userId: string): Promise<PlanFeatures> {
  const planId = await getUserPlan(userId);
  return PLAN_FEATURES[planId] || PLAN_FEATURES.free;
}

export async function canCreateProject(userId: string): Promise<boolean> {
  const features = await getUserFeatures(userId);
  if (features.projects === -1) return true;

  const supabase = await createClient();
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count || 0) < features.projects;
}

export async function canAccessFeature(userId: string, feature: keyof PlanFeatures): Promise<boolean> {
  const features = await getUserFeatures(userId);
  const value = features[feature];

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  return false;
}

export async function requireFeature(userId: string, feature: keyof PlanFeatures) {
  const hasAccess = await canAccessFeature(userId, feature);

  if (!hasAccess) {
    throw new Error(`Feature "${feature}" requires a paid plan`);
  }

  return true;
}

export function getFeatureDescription(feature: keyof PlanFeatures): string {
  const descriptions: Record<keyof PlanFeatures, string> = {
    projects: "Número de projetos simultâneos",
    job_matching: "Acesso a Job Matching com IA",
    analytics: "Relatórios e análises avançadas",
    featured: "Destaque de serviços/projetos",
    priority: "Suporte prioritário e fila premium",
  };

  return descriptions[feature];
}
