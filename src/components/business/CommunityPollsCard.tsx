'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Poll {
  id: string;
  question: string;
  category: string;
  option_1: string;
  option_2: string;
  option_3: string;
  votes_1: number;
  votes_2: number;
  votes_3: number;
}

interface CommunityPollsCardProps {
  polls: Poll[];
}

export function CommunityPollsCard({ polls }: CommunityPollsCardProps) {
  const [voting, setVoting] = useState<string | null>(null);

  if (!polls?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Carregando enquetes...</p>
      </div>
    );
  }

  const handleVote = async (pollId: string, option: number) => {
    setVoting(`${pollId}-${option}`);
    try {
      const res = await fetch('/api/community/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, selectedOption: option })
      });

      if (res.ok) {
        setVoting(null);
        // Revalidate
        location.reload();
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const poll = polls[0];
  if (!poll) return null;

  const totalVotes = poll.votes_1 + poll.votes_2 + poll.votes_3;
  const p1 = totalVotes ? Math.round((poll.votes_1 / totalVotes) * 100) : 0;
  const p2 = totalVotes ? Math.round((poll.votes_2 / totalVotes) * 100) : 0;
  const p3 = totalVotes ? Math.round((poll.votes_3 / totalVotes) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 shadow border border-purple-200 dark:border-purple-800">
      <div className="mb-4">
        <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 mb-2">
          {poll.category}
        </Badge>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{poll.question}</h3>
      </div>

      <div className="space-y-3">
        {[
          { label: poll.option_1, votes: poll.votes_1, percent: p1, option: 1 },
          { label: poll.option_2, votes: poll.votes_2, percent: p2, option: 2 },
          { label: poll.option_3, votes: poll.votes_3, percent: p3, option: 3 }
        ].map(({ label, votes, percent, option }) => (
          <button
            key={option}
            onClick={() => handleVote(poll.id, option)}
            disabled={voting === `${poll.id}-${option}`}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-8 text-right">
                  {percent}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        {totalVotes} votes • Freelancer Community
      </p>
    </div>
  );
}
