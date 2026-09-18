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
  business: {
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
    // Roll out only after the reviewed lifecycle migration and cron are verified.
    // Keeping the default off lets unrelated releases precede the database work.
    if (process.env.ASSINIFY_ACCESS_LIFECYCLE_ENABLED !== "true") {
      const { data } = await supabase.from("profiles").select("plan").eq("id", userId).maybeSingle();
      return data?.plan === "pro" || data?.plan === "business" ? data.plan : "free";
    }
    // The database evaluates the paid deadline on every request, including
    // between cron runs. A stale profiles.plan must never authorize access.
    const { data, error } = await supabase.rpc("get_effective_plan", { p_user_id: userId });
    return !error && (data === "pro" || data === "business") ? data : "free";
  } catch {
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
    .eq("client_id", userId);

  return (count || 0) < features.projects;
}

export async function canAccessFeature(userId: string, feature: keyof PlanFeatures): Promise<boolean> {
  const features = await getUserFeatures(userId);
  const value = features[feature];

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === -1 || value > 0;

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
