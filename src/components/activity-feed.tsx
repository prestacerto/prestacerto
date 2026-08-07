"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  type: string;
  userName: string;
  avatarUrl?: string;
  title: string;
  description?: string;
  icon: string;
  createdAt: Date;
  amount?: number;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 8 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-slate-500">
          Nenhuma atividade ainda. Comece a contribuir! 🚀
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-bold text-lg">🔥 Atividade Recente</h2>
        <p className="text-xs text-slate-500 mt-1">Veja o que está acontecendo agora</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {/* Avatar */}
              <Avatar className="size-8 flex-shrink-0 mt-1">
                <AvatarImage src={activity.avatarUrl} alt={activity.userName} />
                <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      <span className="font-bold">{activity.userName}</span>
                      {activity.title && (
                        <>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">
                            {" "}
                            {activity.title}
                          </span>
                        </>
                      )}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activity.description}
                      </p>
                    )}
                  </div>

                  {/* Icon & Amount */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg">{activity.icon}</span>
                    {activity.amount && (
                      <p className="text-xs font-bold text-green-600 mt-0.5">
                        +R$ {activity.amount.toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View more */}
        {activities.length > maxItems && (
          <button className="mt-4 w-full text-sm font-bold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
            Ver mais atividades →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
