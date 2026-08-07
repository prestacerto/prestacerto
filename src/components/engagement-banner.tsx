"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ENGAGEMENT_HOOKS, HookType } from "@/lib/engagement-hooks";

interface EngagementBannerProps {
  hookType: HookType;
  onDismiss?: () => void;
}

export function EngagementBanner({ hookType, onDismiss }: EngagementBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const hook = ENGAGEMENT_HOOKS[hookType];

  if (dismissed) return null;

  const priorityColors = {
    5: 'from-red-500 to-orange-500 border-red-600',
    4: 'from-blue-500 to-cyan-500 border-blue-600',
    3: 'from-purple-500 to-pink-500 border-purple-600',
    2: 'from-green-500 to-teal-500 border-green-600',
    1: 'from-slate-500 to-gray-500 border-slate-600',
  };

  return (
    <div className={`
      rounded-lg border-l-4 bg-gradient-to-r ${priorityColors[hook.priority as keyof typeof priorityColors]}
      p-4 text-white shadow-lg flex items-start justify-between gap-4
      animate-in slide-in-from-top-2 duration-300
    `}>
      <div className="flex-1">
        <p className="font-bold text-sm">{hook.title}</p>
        <p className="text-sm opacity-90 mt-1">{hook.message}</p>
        <Link
          href={hook.cta.href}
          className="inline-block mt-2 px-3 py-1.5 bg-white text-slate-900 rounded font-semibold text-xs hover:opacity-90 transition-opacity"
        >
          {hook.cta.text}
        </Link>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          onDismiss?.();
        }}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
