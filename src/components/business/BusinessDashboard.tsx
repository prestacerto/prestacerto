'use client';

import { useEffect, useState } from 'react';
import { TransactionCard } from './TransactionCard';
import { RevenueCard } from './RevenueCard';
import { ProposalCard } from './ProposalCard';
import { ResponseRateCard } from './ResponseRateCard';
import { SkillDemandCard } from './SkillDemandCard';
import { CommunityPollsCard } from './CommunityPollsCard';

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
      {/* Revenue Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueCard revenue={data.revenue} />
        <ResponseRateCard metrics={data.responseRate} />
      </div>

      {/* Transactions */}
      <TransactionCard transactions={data.transactions?.transactions || []} />

      {/* Proposals */}
      <ProposalCard proposals={data.proposals?.proposals || []} stats={data.proposals?.stats} />

      {/* Market Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillDemandCard skills={data.skills?.skills || []} />
        <CommunityPollsCard polls={data.polls?.polls || []} />
      </div>
    </div>
  );
}
