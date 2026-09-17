"use client";

import { Zap } from "lucide-react";
import { useConnectsQuota } from "@/hooks/useConnectsQuota";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ConnectsDisplay() {
  const { quota, loading } = useConnectsQuota();

  if (loading || !quota) return null;

  const remaining = quota.connects_remaining;
  const low = remaining < 3;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
      low ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
    }`}>
      <Zap className="size-4" />
      <span className="text-sm font-medium">
        {remaining} conectar{remaining !== 1 ? "es" : ""} disponível{remaining !== 1 ? "s" : ""}
      </span>
      {low && (
        <Link href="/dashboard/connects" className="ml-auto text-xs underline hover:no-underline">
          Comprar
        </Link>
      )}
    </div>
  );
}
