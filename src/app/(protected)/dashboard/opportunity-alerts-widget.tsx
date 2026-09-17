'use client';

import { useEffect, useState } from 'react';
import { Bell, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface Alert {
  skill: string;
  new_projects: number;
  percentage_change: number;
  alert_level: 'high' | 'medium' | 'low';
}

export function OpportunityAlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/opportunities/alerts');
        const data = await response.json();
        setAlerts(data.alerts || []);
        setNotificationsEnabled(data.notifications_enabled);
      } catch (error) {
        console.error('Erro ao carregar alertas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-40 bg-slate-700/30 rounded-lg" />;
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Alertas de Oportunidade
        </h3>
        <button className="text-xs px-3 py-1 bg-blue-600/20 border border-blue-600/50 text-blue-400 rounded-full hover:bg-blue-600/30 transition">
          {notificationsEnabled ? '🔔 Ligado' : '🔕 Desligado'}
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.skill}
            className={`border rounded-lg p-4 ${
              alert.alert_level === 'high'
                ? 'bg-red-600/20 border-red-600/50'
                : alert.alert_level === 'medium'
                ? 'bg-amber-600/20 border-amber-600/50'
                : 'bg-blue-600/20 border-blue-600/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-white">{alert.skill}</p>
              <div className="flex items-center gap-2">
                {alert.percentage_change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={alert.percentage_change > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {alert.percentage_change > 0 ? '+' : ''}{alert.percentage_change}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm">
                {alert.new_projects} novos projetos hoje
              </p>
              <button className="text-xs px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded transition">
                Ver projetos →
              </button>
            </div>
          </div>
        ))}
      </div>

      {!notificationsEnabled && (
        <div className="mt-4 bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 text-center">
          <p className="text-blue-300 text-sm">
            💡 Ative notificações para receber alertas em tempo real
          </p>
        </div>
      )}
    </div>
  );
}
