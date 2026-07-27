// Tipos manuais espelhando supabase/migrations/0001_init.sql.
// Quando o projeto Supabase estiver criado, isso pode ser substituído por
// `npx supabase gen types typescript` para manter 100% sincronizado.

export type Role = "freelancer" | "client" | "both";
export type Plan = "free" | "pro" | "business";
export type ProjectStatus = "open" | "in_progress" | "closed" | "cancelled";
export type ProposalStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  city: string | null;
  state: string | null;
  bio: string | null;
  avatar_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  plan: Plan;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Service {
  id: string;
  freelancer_id: string;
  category_id: number | null;
  title: string;
  description: string;
  skills: string[];
  price_hour: number | null;
  delivery_days: number | null;
  rating: number | null;
  rating_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  category_id: number | null;
  title: string;
  description: string;
  skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  deadline_days: number | null;
  status: ProjectStatus;
  created_at: string;
}

export interface ProjectContact {
  project_id: string;
  contact_email: string | null;
  contact_phone: string | null;
}

export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  message: string;
  proposed_price: number | null;
  status: ProposalStatus;
  created_at: string;
}

export interface Message {
  id: string;
  proposal_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}
