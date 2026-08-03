import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
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

export async function getMyServices(freelancerId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("freelancer_id", freelancerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("getMyServices falhou:", error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        "*, freelancer:profiles!services_freelancer_id_fkey(id, full_name, city, state, bio, avatar_url, plan, rating, rating_count)"
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

export interface ReviewWithAuthor {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author: { full_name: string } | null;
}

export async function getReviewsForProfile(profileId: string): Promise<ReviewWithAuthor[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, author:profiles!reviews_author_id_fkey(full_name)")
      .eq("target_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ReviewWithAuthor[];
  } catch (error) {
    console.error("getReviewsForProfile falhou:", error);
    return [];
  }
}

export async function getMyReviewForProject(projectId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id")
      .eq("project_id", projectId)
      .eq("author_id", userId)
      .maybeSingle();
    return Boolean(data);
  } catch (error) {
    console.error("getMyReviewForProject falhou:", error);
    return false;
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

export async function getMyProjects(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, status, category_id, created_at, proposals(count)")
      .eq("client_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((project) => ({
      ...project,
      proposal_count: Array.isArray(project.proposals)
        ? (project.proposals[0]?.count ?? 0)
        : 0,
    }));
  } catch (error) {
    console.error("getMyProjects falhou:", error);
    return [];
  }
}

export interface ProposalWithProject {
  id: string;
  message: string;
  proposed_price: number | null;
  status: string;
  created_at: string;
  project: {
    id: string;
    title: string;
    status: string;
  } | null;
}

export async function getMyProposals(userId: string): Promise<ProposalWithProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposals")
      .select("id, message, proposed_price, status, created_at, project:projects(id, title, status)")
      .eq("freelancer_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ProposalWithProject[];
  } catch (error) {
    console.error("getMyProposals falhou:", error);
    return [];
  }
}

export interface ProposalWithFreelancer {
  id: string;
  message: string;
  proposed_price: number | null;
  status: string;
  created_at: string;
  freelancer: {
    id: string;
    full_name: string;
    city: string | null;
    rating: number | null;
    rating_count: number;
  } | null;
}

export async function getProposalsForProject(
  projectId: string
): Promise<ProposalWithFreelancer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposals")
      .select(
        "id, message, proposed_price, status, created_at, freelancer:profiles!proposals_freelancer_id_fkey(id, full_name, city, rating, rating_count)"
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ProposalWithFreelancer[];
  } catch (error) {
    console.error("getProposalsForProject falhou:", error);
    return [];
  }
}

export async function getAcceptedProposal(projectId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("proposals")
      .select("id, freelancer_id, proposed_price")
      .eq("project_id", projectId)
      .eq("status", "accepted")
      .maybeSingle();
    return data;
  } catch (error) {
    console.error("getAcceptedProposal falhou:", error);
    return null;
  }
}

export async function getPaymentForProject(projectId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("payments")
      .select("id, status, amount, capture_deadline")
      .eq("project_id", projectId)
      .maybeSingle();
    return data;
  } catch (error) {
    console.error("getPaymentForProject falhou:", error);
    return null;
  }
}

// Service client de propósito: o CLIENTE do projeto precisa saber se o
// freelancer já conectou o Mercado Pago (só um booleano, sem expor token)
// pra decidir se mostra o botão de pagar ou "aguardando conexão" — e a RLS
// de mp_connections só deixa o próprio freelancer ler a própria linha.
export async function hasMpConnection(freelancerId: string) {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("mp_connections")
      .select("freelancer_id")
      .eq("freelancer_id", freelancerId)
      .maybeSingle();
    return Boolean(data);
  } catch (error) {
    console.error("hasMpConnection falhou:", error);
    return false;
  }
}

export const TEAM_SEAT_LIMIT = 5;

export async function getTeamForOwner(ownerId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("owner_id", ownerId)
      .maybeSingle();
    return data;
  } catch (error) {
    console.error("getTeamForOwner falhou:", error);
    return null;
  }
}

export async function getTeamMembers(teamId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, city, state")
      .eq("team_id", teamId);
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("getTeamMembers falhou:", error);
    return [];
  }
}

export async function getTeamInvites(teamId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_invites")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("getTeamInvites falhou:", error);
    return [];
  }
}

// Público de propósito (service client): quem recebeu o link do convite
// ainda não tem necessariamente conta/sessão pra passar pela RLS.
export async function getInviteByToken(token: string) {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("team_invites")
      .select("*, team:teams(id, name)")
      .eq("token", token)
      .eq("status", "pending")
      .maybeSingle();
    return data;
  } catch (error) {
    console.error("getInviteByToken falhou:", error);
    return null;
  }
}

export interface MessageWithSender {
  id: string;
  proposal_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender: { full_name: string } | null;
}

export async function getMessagesForProposal(proposalId: string): Promise<MessageWithSender[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("id, proposal_id, sender_id, body, created_at, sender:profiles!messages_sender_id_fkey(full_name)")
      .eq("proposal_id", proposalId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as MessageWithSender[];
  } catch (error) {
    console.error("getMessagesForProposal falhou:", error);
    return [];
  }
}

export interface ProposalThreadInfo {
  id: string;
  freelancer_id: string;
  status: string;
  project: {
    id: string;
    title: string;
    client_id: string;
  } | null;
  freelancer: { full_name: string } | null;
}

export async function getProposalThreadInfo(
  proposalId: string
): Promise<ProposalThreadInfo | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("proposals")
      .select(
        "id, freelancer_id, status, project:projects(id, title, client_id), freelancer:profiles!proposals_freelancer_id_fkey(full_name)"
      )
      .eq("id", proposalId)
      .single();
    if (error) throw error;
    return data as unknown as ProposalThreadInfo;
  } catch (error) {
    console.error("getProposalThreadInfo falhou:", error);
    return null;
  }
}

export async function hasSubmittedProposal(projectId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("proposals")
      .select("id")
      .eq("project_id", projectId)
      .eq("freelancer_id", userId)
      .maybeSingle();
    return Boolean(data);
  } catch (error) {
    console.error("hasSubmittedProposal falhou:", error);
    return false;
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
