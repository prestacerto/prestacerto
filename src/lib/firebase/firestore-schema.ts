// Firestore collection schemas
// These define the structure for each collection in Firestore

export interface Profile {
  id: string;
  role: "freelancer" | "client" | "both";
  full_name: string;
  email: string;
  city?: string;
  state?: string;
  bio?: string;
  avatar_url?: string;
  contact_email?: string;
  contact_phone?: string;
  plan: "free" | "pro" | "business";
  created_at: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Service {
  id: string;
  freelancer_id: string;
  category_id?: string;
  title: string;
  description: string;
  skills: string[];
  price_hour?: number;
  delivery_days?: number;
  rating?: number;
  rating_count: number;
  is_active: boolean;
  created_at: number;
}

export interface Project {
  id: string;
  client_id: string;
  category_id?: string;
  title: string;
  description: string;
  skills: string[];
  budget_min?: number;
  budget_max?: number;
  deadline_days?: number;
  status: "open" | "in_progress" | "closed" | "cancelled";
  created_at: number;
}

export interface ProjectContact {
  project_id: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  message: string;
  proposed_price?: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: number;
}

export interface Message {
  id: string;
  proposal_id: string;
  sender_id: string;
  body: string;
  created_at: number;
  read_at?: number;
}

export interface PlanInterestLead {
  id: string;
  email: string;
  plan: "pro" | "business";
  created_at: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: number;
}

// Firestore collection names
export const COLLECTIONS = {
  PROFILES: "profiles",
  CATEGORIES: "categories",
  SERVICES: "services",
  PROJECTS: "projects",
  PROJECT_CONTACTS: "project_contacts",
  PROPOSALS: "proposals",
  MESSAGES: "messages",
  PLAN_INTEREST_LEADS: "plan_interest_leads",
  CONTACT_MESSAGES: "contact_messages",
} as const;
