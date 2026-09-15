'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AgentSchedule {
  id: string;
  frequency: 'daily' | 'weekly' | 'twice-weekly';
  day_of_week?: number;
  time_of_day: string;
  is_active: boolean;
  last_run_at?: string;
  next_run_at?: string;
}

interface AgentRun {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  leads_discovered: number;
  leads_qualified: number;
  messages_sent: number;
  error_message?: string;
}

export function ScheduleView({ userId }: { userId: string }) {
  const [schedule, setSchedule] = useState<AgentSchedule | null>(null);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    frequency: 'daily' as const,
    time_of_day: '09:00',
    day_of_week: 1,
  });

  useEffect(() => {
    loadSchedule();
    loadRuns();
  }, [userId]);

  const loadSchedule = async () => {
    try {
      const response = await fetch(`/api/sales-agent/schedule?userId=${userId}`);
      const data = await response.json();
      if (data.schedule) {
        setSchedule(data.schedule);
        setFormData({
          frequency: data.schedule.frequency,
          time_of_day: data.schedule.time_of_day,
          day_of_week: data.schedule.day_of_week || 1,
        });
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRuns = async () => {
    try {
      const response = await fetch(`/api/sales-agent/runs?userId=${userId}`);
      const data = await response.json();
      if (data.runs) {
        setRuns(data.runs);
      }
    } catch (error) {
      console.error('Failed to load runs:', error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const response = await fetch('/api/sales-agent/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const handleManualRun = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/sales-agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, manual: true }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add new run to list
        setTimeout(loadRuns, 1000);
      }
    } catch (error) {
      console.error('Failed to run agent:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Executando</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falha</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const frequencyLabel = {
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    'twice-weekly': 'Duas vezes por semana',
  };

  const dayLabels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Schedule Card */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamento</CardTitle>
          <CardDescription>Configure quando o agente deve rodar automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <>
              {schedule ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded">
                  <div>
                    <p className="text-sm text-slate-600">Frequência</p>
                    <p className="font-semibold">{frequencyLabel[schedule.frequency as keyof typeof frequencyLabel]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Horário</p>
                    <p className="font-semibold">{schedule.time_of_day}</p>
                  </div>
                  {schedule.frequency === 'weekly' && schedule.day_of_week && (
                    <div>
                      <p className="text-sm text-slate-600">Dia da semana</p>
                      <p className="font-semibold">{dayLabels[schedule.day_of_week]}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <p className="font-semibold">{schedule.is_active ? 'Ativo ✓' : 'Inativo'}</p>
                  </div>
                  {schedule.next_run_at && (
                    <div>
                      <p className="text-sm text-slate-600">Próxima execução</p>
                      <p className="font-semibold">{new Date(schedule.next_run_at).toLocaleString('pt-BR')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-600">Nenhum agendamento configurado</p>
              )}
              <Button onClick={() => setIsEditing(true)} variant="outline">
                {schedule ? 'Editar' : 'Criar agendamento'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Frequência</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  >
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="twice-weekly">Duas vezes por semana</option>
                  </select>
                </div>

                {formData.frequency === 'weekly' && (
                  <div>
                    <label className="text-sm font-medium">Dia da semana</label>
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({ ...formData, day_of_week: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border rounded"
                    >
                      {dayLabels.map((day, idx) => (
                        <option key={idx} value={idx}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Horário</label>
                  <input
                    type="time"
                    value={formData.time_of_day}
                    onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveSchedule} className="flex-1">
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Manual Run Card */}
      <Card>
        <CardHeader>
          <CardTitle>Execução Manual</CardTitle>
          <CardDescription>Execute o agente imediatamente</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleManualRun}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Executando...' : 'Executar agora'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de execuções</CardTitle>
          <CardDescription>Últimas 10 execuções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {runs.length === 0 ? (
              <p className="text-slate-600 text-center py-4">Nenhuma execução ainda</p>
            ) : (
              runs.map((run) => (
                <div key={run.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{new Date(run.started_at).toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-slate-600">ID: {run.id.substring(0, 8)}</p>
                    </div>
                    {getStatusBadge(run.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-slate-600">Prospects</p>
                      <p className="font-semibold">{run.leads_discovered}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Qualificados</p>
                      <p className="font-semibold text-green-600">{run.leads_qualified}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Mensagens</p>
                      <p className="font-semibold text-blue-600">{run.messages_sent}</p>
                    </div>
                  </div>
                  {run.error_message && (
                    <p className="text-sm text-red-600 mt-2">Erro: {run.error_message}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
