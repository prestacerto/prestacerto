import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  done: boolean;
  href: string;
  cta: string;
}

export function OnboardingChecklist({ items }: { items: ChecklistItem[] }) {
  const pending = items.filter((i) => !i.done);
  if (pending.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-base">Complete seu perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2",
              item.done && "opacity-60"
            )}
          >
            <span className="flex items-center gap-2 text-sm text-slate-700">
              {item.done ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <Circle className="size-4 text-slate-300" />
              )}
              {item.label}
            </span>
            {!item.done && (
              <Link href={item.href} className="text-xs font-medium text-blue-600 hover:underline">
                {item.cta}
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
