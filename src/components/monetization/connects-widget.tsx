'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ConnectsWidget() {
  const [connects, setConnects] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnects();
  }, []);

  const checkConnects = async () => {
    try {
      const res = await fetch('/api/connects/check');
      if (res.ok) {
        setConnects(await res.json());
      }
    } catch (error) {
      console.error('Failed to check connects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Propostas Disponíveis</p>
            <p className="text-4xl font-bold">{connects?.available_this_month || 0}</p>
            <p className="text-xs opacity-75 mt-1">
              {connects?.used_this_month || 0} / {connects?.monthly_limit || 5} usadas este mês
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/dashboard/connects/buy'}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Comprar mais
          </Button>
        </div>

        {!connects?.can_propose && (
          <div className="mt-4 p-3 bg-red-500/20 rounded text-sm">
            ⚠️ Você atingiu o limite de propostas este mês
          </div>
        )}
      </CardContent>
    </Card>
  );
}
