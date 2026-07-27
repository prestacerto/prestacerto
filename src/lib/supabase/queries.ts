import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

// Helpers de leitura pública, com fallback resiliente: se o Supabase ainda
// não estiver configurado (ou a rede falhar), a página mostra estado vazio
// em vez de quebrar — nunca deixe uma falha de dado derrubar o render.

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("getCategories falhou:", error);
    return [];
  }
}

export interface ServiceWithFreelancer {
  id: string;
  title: string;
  description: string;
  skills: string[];
  price_hour: number | null;
  delivery_days: number | null;
  rating: number | null;
  rating_count: number;
  category_id: number | null;
  freelancer: {
    id: string;
    full_name: string;
    city: string | null;
    state: string | null;
  } | null;
}

export async function listServices(params: {
  query?: string;
  categoryId?: number;
}): Promise<ServiceWithFreelancer[]> {
  try {
    const supabase = await createClient();
    let request = supabase
      .from("services")
      .select(
        "id, title, description, skills, price_hour, delivery_days, rating, rating_count, category_id, freelancer:profiles!services_freelancer_id_fkey(id, full_name, city, state)"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (params.categoryId) {
      request = request.eq("category_id", params.categoryId);
    }
    if (params.query) {
      request = request.ilike("title", `%${params.query}%`);
    }

    const { data, error } = await request;
    if (error) throw error;
    return (data ?? []) as unknown as ServiceWithFreelancer[];
  } catch (error) {
    console.error("listServices falhou:", error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        "*, freelancer:profiles!services_freelancer_id_fkey(id, full_name, city, state, bio, avatar_url)"
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getServiceById falhou:", error);
    return null;
  }
}

export interface ProjectListItem {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  deadline_days: number | null;
  status: string;
  category_id: number | null;
  created_at: string;
  proposal_count?: number;
}

export async function listOpenProjects(params: {
  query?: string;
  categoryId?: number;
}): Promise<ProjectListItem[]> {
  try {
    const supabase = await createClient();
    let request = supabase
      .from("projects")
      .select(
        "id, title, description, skills, budget_min, budget_max, deadline_days, status, category_id, created_at, proposals(count)"
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (params.categoryId) {
      request = request.eq("category_id", params.categoryId);
    }
    if (params.query) {
      request = request.ilike("title", `%${params.query}%`);
    }

    const { data, error } = await request;
    if (error) throw error;

    return (data ?? []).map((project) => ({
      ...project,
      proposal_count: Array.isArray(project.proposals)
        ? (project.proposals[0]?.count ?? 0)
        : 0,
    })) as unknown as ProjectListItem[];
  } catch (error) {
    console.error("listOpenProjects falhou:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "*, client:profiles!projects_client_id_fkey(id, full_name), proposals(count)"
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getProjectById falhou:", error);
    return null;
  }
}
