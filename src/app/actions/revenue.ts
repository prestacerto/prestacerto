"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

let supabaseClient: ReturnType<typeof createServiceClient> | null = null;
const getSupabase = () => (supabaseClient ??= createServiceClient());

export async function getRevenueData() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const { data: transactions, error } = await getSupabase()
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Revenue query failed:", error);

  const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const approvedTransactions = transactions?.filter(t => t.status === "approved") || [];
  const monthlyRevenue = approvedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const projectedRevenue = monthlyRevenue * 12;

  return {
    totalRevenue,
    monthlyRevenue,
    todayRevenue: 0,
    projectedRevenue,
    transactions: transactions || [],
  };
}
