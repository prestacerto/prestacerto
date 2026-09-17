export type OwnerMetric = number | null;
export type OwnerOverview = {
  generatedAt: string;
  days: number;
  state: 'ready' | 'partial' | 'not_configured';
  counts: {
    profiles: OwnerMetric; newProfiles: OwnerMetric; freelancers: OwnerMetric; clients: OwnerMetric;
    projects: OwnerMetric; openProjects: OwnerMetric; newProjects: OwnerMetric;
    proposals: OwnerMetric; newProposals: OwnerMetric; acceptedProposals: OwnerMetric;
    activeServices: OwnerMetric; free: OwnerMetric; pro: OwnerMetric; business: OwnerMetric;
    pendingSubscriptions: OwnerMetric;
  };
  recentProfiles: Array<{ id: string; full_name: string | null; role: string | null; city: string | null; created_at: string }>;
  recentProjects: Array<{ id: string; title: string; status: string; created_at: string }>;
  integrations: { database: boolean; webhook: boolean; checkout: boolean; analytics: boolean; searchConsole: boolean };
  notices: Array<{ title: string; description: string }>;
};
