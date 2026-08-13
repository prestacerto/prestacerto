'use client';

import { useEffect, useState } from 'react';
import { TransactionCard } from './TransactionCard';
import { RevenueCard } from './RevenueCard';
import { ProposalCard } from './ProposalCard';
import { ResponseRateCard } from './ResponseRateCard';
import { SkillDemandCard } from './SkillDemandCard';
import { CommunityPollsCard } from './CommunityPollsCard';
import { ProjectOfDay } from './ProjectOfDay';
import { VisitHistory } from './VisitHistory';
import { ConsistencyBadgeDisplay } from './ConsistencyBadgeDisplay';
import { LeaderboardCard } from './LeaderboardCard';
import { CampaignROICard } from './CampaignROICard';

export function BusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, revRes, propRes, respRes, skillRes, pollRes] = await Promise.all([
          fetch('/api/business/transactions'),
          fetch('/api/business/revenue'),
          fetch('/api/business/proposals'),
          fetch('/api/business/response-rate'),
          fetch('/api/market/skill-demand'),
          fetch('/api/community/polls')
        ]);

        const [trans, rev, prop, resp, skill, poll] = await Promise.all([
          transRes.json(),
          revRes.json(),
          propRes.json(),
          respRes.json(),
          skillRes.json(),
          pollRes.json()
        ]);

        setData({
          transactions: trans,
          revenue: rev,
          proposals: prop,
          responseRate: resp,
          skills: skill,
          polls: poll
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Projeto do Dia + Consistência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectOfDay />
        <ConsistencyBadgeDisplay />
      </div>

      {/* Row 2: Revenue + Response Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueCard revenue={data.revenue} />
        <ResponseRateCard metrics={data.responseRate} />
      </div>

      {/* Row 3: ROI de Campanhas */}
      <CampaignROICard />

      {/* Row 4: Histórico de Visitas + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VisitHistory />
        <LeaderboardCard city="São Paulo" />
      </div>

      {/* Row 4: Transactions */}
      <TransactionCard transactions={data.transactions?.transactions || []} />

      {/* Row 5: Proposals */}
      <ProposalCard proposals={data.proposals?.proposals || []} stats={data.proposals?.stats} />

      {/* Row 6: Market Data + Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillDemandCard skills={data.skills?.skills || []} />
        <CommunityPollsCard polls={data.polls?.polls || []} />
      </div>
    </div>
  );
}
