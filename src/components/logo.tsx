"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-white text-slate-900">
        <Check className="size-5" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          inverse ? "text-slate-900" : "text-white"
        )}
      >
        presta<span className="text-blue-400">certo</span>
      </span>
    </button>
  );
}
