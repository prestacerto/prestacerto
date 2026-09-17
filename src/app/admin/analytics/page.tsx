"use client";

import { useEffect, useState } from "react";

interface AnalyticsSummary {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  conversionRate: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    users: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // TODO: Implement analytics API endpoint
        setAnalytics({
          totalUsers: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
          conversionRate: 0,
          topProducts: [],
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📊 CERTO Analytics</h1>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Summary Cards */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6">
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-3xl font-bold">
                {analytics?.totalUsers || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6">
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">
                R$ {(analytics?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6">
              <p className="text-sm opacity-90">Active Subscriptions</p>
              <p className="text-3xl font-bold">
                {analytics?.activeSubscriptions || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6">
              <p className="text-sm opacity-90">Conversion Rate</p>
              <p className="text-3xl font-bold">
                {(analytics?.conversionRate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Coming Soon */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">📈 Live Dashboard Coming Soon</h2>
          <p className="text-slate-300">
            Once Assinify links are created and webhooks are configured,
            real-time analytics will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
