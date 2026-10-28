'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, Plus, X } from 'lucide-react';

interface AgentConfigProps {
  userId: string;
}

export function AgentConfig({ userId }: AgentConfigProps) {
  const [config, setConfig] = useState({
    agentName: 'Meu SDR',
    icpDescription: '',
    targetPersonas: [] as string[],
    prospectsPerDay: 10,
    channels: { email: true, whatsapp: false, linkedin: false },
    schedule: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
  });

  const [newPersona, setNewPersona] = useState('');

  const handleAddPersona = () => {
    if (newPersona.trim()) {
      setConfig((prev) => ({
        ...prev,
        targetPersonas: [...prev.targetPersonas, newPersona],
      }));
      setNewPersona('');
    }
  };

  const handleRemovePersona = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      targetPersonas: prev.targetPersonas.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/sales-agent/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, userId }),
      });

      if (!response.ok) throw new Error('Failed to save config');
      alert('✅ Configuração salva!');
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao salvar configuração');
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Name */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Agente</label>
            <input
              type="text"
              value={config.agentName}
              onChange={(e) => setConfig((prev) => ({ ...prev, agentName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="ex: SDR de Vendas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descrição do ICP (Ideal Customer Profile)</label>
            <textarea
              value={config.icpDescription}
              onChange={(e) => setConfig((prev) => ({ ...prev, icpDescription: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="Descreva seu cliente ideal: tamanho da empresa, setor, dor principal..."
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Target Personas */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Personas Alvo</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPersona}
              onChange={(e) => setNewPersona(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPersona()}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              placeholder="ex: CEO, Gerente de Marketing, CTO..."
            />
            <Button onClick={handleAddPersona} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {config.targetPersonas.map((persona, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full"
              >
                <span className="text-sm">{persona}</span>
                <button
                  onClick={() => handleRemovePersona(idx)}
                  className="hover:text-emerald-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Prospecção Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Configurações de Prospecção</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prospects por dia</label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.prospectsPerDay}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, prospectsPerDay: parseInt(e.target.value) }))
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Canais de Contato</label>
            <div className="space-y-2">
              {Object.entries(config.channels).map(([channel, enabled]) => (
                <label key={channel} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        channels: { ...prev.channels, [channel]: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="capitalize">{channel === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Cronograma</h3>
        <div className="space-y-2">
          {Object.entries(config.schedule).map(([day, enabled]) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    schedule: { ...prev.schedule, [day]: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="capitalize">{day === 'monday' ? 'Segunda' : day === 'tuesday' ? 'Terça' : day === 'wednesday' ? 'Quarta' : day === 'thursday' ? 'Quinta' : day === 'friday' ? 'Sexta' : day === 'saturday' ? 'Sábado' : 'Domingo'}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
        <Save className="h-5 w-5 mr-2" />
        Salvar Configuração
      </Button>
    </div>
  );
}
