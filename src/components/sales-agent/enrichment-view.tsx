'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnrichedProspect {
  id: string;
  name: string;
  company: string;
  email: string;
  enrichment_status: 'pending' | 'enriched' | 'failed';
  enriched_data?: {
    website?: string;
    linkedin_url?: string;
    company_size?: string;
    industry?: string;
    location?: string;
    revenue_estimate?: string;
  };
}

export function EnrichmentView({ userId }: { userId: string }) {
  const [prospects, setProspects] = useState<EnrichedProspect[]>([]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadProspectsForEnrichment();
  }, [userId]);

  const loadProspectsForEnrichment = async () => {
    try {
      const response = await fetch(`/api/sales-agent/enrich?userId=${userId}&limit=20`);
      const data = await response.json();
      if (data.prospects) {
        setProspects(
          data.prospects.map((p: any) => ({
            ...p,
            enrichment_status: 'pending',
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrichSingleProspect = async (prospectId: string, index: number) => {
    try {
      const response = await fetch('/api/sales-agent/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, prospectId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProspects((prev) =>
          prev.map((p) =>
            p.id === prospectId
              ? {
                  ...p,
                  enrichment_status: 'enriched',
                  enriched_data: data.enriched_data,
                }
              : p
          )
        );
      } else {
        setProspects((prev) =>
          prev.map((p) =>
            p.id === prospectId
              ? { ...p, enrichment_status: 'failed' }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Enrichment error:', error);
      setProspects((prev) =>
        prev.map((p) =>
          p.id === prospectId
            ? { ...p, enrichment_status: 'failed' }
            : p
        )
      );
    } finally {
      setProgress(((index + 1) / prospects.length) * 100);
    }
  };

  const handleEnrichAll = async () => {
    setIsEnriching(true);
    setProgress(0);

    for (let i = 0; i < prospects.length; i++) {
      await enrichSingleProspect(prospects[i].id, i);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Rate limiting
    }

    setIsEnriching(false);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  const enrichedCount = prospects.filter((p) => p.enrichment_status === 'enriched').length;
  const failedCount = prospects.filter((p) => p.enrichment_status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enriquecimento de Dados</CardTitle>
          <CardDescription>Adicione dados de empresa aos seus prospects automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold">{prospects.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Enriquecidos</p>
              <p className="text-2xl font-bold text-green-600">{enrichedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Falhas</p>
              <p className="text-2xl font-bold text-red-600">{failedCount}</p>
            </div>
          </div>

          {isEnriching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enriquecendo...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleEnrichAll}
            disabled={isEnriching || prospects.length === 0}
            className="w-full"
          >
            {isEnriching ? 'Enriquecendo...' : 'Enriquecer todos os prospects'}
          </Button>
        </CardContent>
      </Card>

      {/* Prospects List */}
      <div className="space-y-3">
        {prospects.map((prospect) => (
          <Card key={prospect.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{prospect.name}</h3>
                  <p className="text-sm text-slate-600">{prospect.company}</p>
                </div>
                <Badge
                  className={
                    prospect.enrichment_status === 'enriched'
                      ? 'bg-green-100 text-green-800'
                      : prospect.enrichment_status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {prospect.enrichment_status === 'enriched'
                    ? 'Enriquecido ✓'
                    : prospect.enrichment_status === 'failed'
                    ? 'Falha'
                    : 'Pendente'}
                </Badge>
              </div>

              {prospect.enriched_data && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {prospect.enriched_data.website && (
                    <div>
                      <p className="text-slate-600">Website</p>
                      <a href={prospect.enriched_data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {prospect.enriched_data.website}
                      </a>
                    </div>
                  )}
                  {prospect.enriched_data.industry && (
                    <div>
                      <p className="text-slate-600">Indústria</p>
                      <p>{prospect.enriched_data.industry}</p>
                    </div>
                  )}
                  {prospect.enriched_data.company_size && (
                    <div>
                      <p className="text-slate-600">Tamanho</p>
                      <p>{prospect.enriched_data.company_size}</p>
                    </div>
                  )}
                  {prospect.enriched_data.location && (
                    <div>
                      <p className="text-slate-600">Localização</p>
                      <p>{prospect.enriched_data.location}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
