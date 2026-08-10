"use client";

import Link from "next/link";
import { AlertCircle, Clock, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UrgencyAlert {
  id: string;
  title: string;
  description: string;
  hoursLeft: number;
  projectCount: number;
  cta: string;
  href: string;
}

interface UrgencyBannerProps {
  alerts: UrgencyAlert[];
}

export function UrgencyBanner({ alerts }: UrgencyBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map(alert => {
        const isUrgent = alert.hoursLeft <= 2;

        return (
          <Card
            key={alert.id}
            className={`${
              isUrgent
                ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-300 dark:border-red-700"
                : "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-900 border-amber-300 dark:border-amber-700"
            }`}
          >
            <CardContent className="pt-4 flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                {isUrgent ? (
                  <Flame className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <p className={`font-bold ${isUrgent ? "text-red-900 dark:text-red-200" : "text-amber-900 dark:text-amber-200"}`}>
                    {alert.title}
                  </p>
                  <p className={`text-sm mt-1 ${isUrgent ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"}`}>
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <Clock className="size-3" />
                      {alert.hoursLeft}h restantes
                    </div>
                    <div className="text-xs">
                      {alert.projectCount} {alert.projectCount === 1 ? "projeto" : "projetos"}
                    </div>
                  </div>
                </div>
              </div>

              <Link href={alert.href}>
                <Button
                  size="sm"
                  className={
                    isUrgent
                      ? "bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                      : "bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0"
                  }
                >
                  {alert.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
