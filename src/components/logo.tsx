import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
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
    </Link>
  );
}
