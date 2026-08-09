"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TrendingUp } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface RevenueData {
  today: number;
  month: number;
  total: number;
  breakdown: Record<string, number>;
  currency: string;
}

export function RevenueWidget() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      const res = await fetch("/api/monetization/dashboard/revenue");
      const data = await res.json();
      setRevenue(data);
      setLoading(false);
    };

    fetchRevenue();

    // Supabase Realtime subscription
    const channel = supabase
      .channel("revenue-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "revenue_events" }, () => {
        // Refresh quando há novo evento
        fetchRevenue();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-4 bg-gray-100 rounded animate-pulse h-40" />;
  if (!revenue) return <div>Erro ao carregar dados</div>;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Receita em Tempo Real</h2>
        <TrendingUp size={24} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-700 bg-opacity-50 rounded p-4">
          <p className="text-sm opacity-80">Hoje</p>
          <p className="text-3xl font-bold">R$ {revenue.today.toFixed(2)}</p>
        </div>
        <div className="bg-blue-700 bg-opacity-50 rounded p-4">
          <p className="text-sm opacity-80">Este mês</p>
          <p className="text-3xl font-bold">R$ {revenue.month.toFixed(2)}</p>
        </div>
        <div className="bg-blue-700 bg-opacity-50 rounded p-4">
          <p className="text-sm opacity-80">Total</p>
          <p className="text-3xl font-bold">R$ {revenue.total.toFixed(2)}</p>
        </div>
      </div>

      {Object.keys(revenue.breakdown).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 opacity-80">Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(revenue.breakdown).map(([type, amount]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="capitalize">{type.replace(/_/g, " ")}</span>
                <span className="font-semibold">R$ {amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
