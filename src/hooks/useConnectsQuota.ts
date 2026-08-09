import { useEffect, useState } from "react";

interface ConnectsQuota {
  user_id: string;
  tier: "free" | "pro" | "business";
  connects_available: number;
  connects_used: number;
  connects_remaining: number;
  last_reset_date: string;
  reset_cycle_days: number;
}

export function useConnectsQuota() {
  const [quota, setQuota] = useState<ConnectsQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/connects/quota");
      if (!res.ok) throw new Error("Failed to fetch quota");
      const data = await res.json();
      setQuota(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  return { quota, loading, error, refetch: fetchQuota };
}
