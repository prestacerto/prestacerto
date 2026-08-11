"use server";

import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/lib/auth/getUser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getRevenueData() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: transactions, error } = await supabase
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
