"use client";

import { TrendingUp, MessageCircle, Award, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  type: "earning" | "response" | "rating" | "milestone" | "like";
  user: string;
  action: string;
  value?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "earning":
        return <TrendingUp className="size-4 text-green-600" />;
      case "response":
        return <MessageCircle className="size-4 text-blue-600" />;
      case "rating":
        return <Award className="size-4 text-amber-600" />;
      case "milestone":
        return <Zap className="size-4 text-purple-600" />;
      case "like":
        return <Heart className="size-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "earning":
        return "bg-green-50 dark:bg-green-950";
      case "response":
        return "bg-blue-50 dark:bg-blue-950";
      case "rating":
        return "bg-amber-50 dark:bg-amber-950";
      case "milestone":
        return "bg-purple-50 dark:bg-purple-950";
      case "like":
        return "bg-red-50 dark:bg-red-950";
      default:
        return "bg-slate-50 dark:bg-slate-900";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Atividade Agora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">Nenhuma atividade recente</p>
        ) : (
          activities.map(activity => (
            <div
              key={activity.id}
              className={`rounded-lg p-3 flex items-start gap-3 border border-slate-200 dark:border-slate-700 ${getBackgroundColor(activity.type)}`}
            >
              <div className="mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {activity.user}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activity.action}
                </p>
                {activity.value && (
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {activity.value}
                  </p>
                )}
              </div>
              <div className="text-xs text-slate-500 flex-shrink-0">
                {activity.timestamp}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
