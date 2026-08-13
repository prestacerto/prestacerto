'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [proposalForm, setProposalForm] = useState({ content: '', price: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects/list');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proposalForm.content || !proposalForm.price) {
      toast.error('Preencha conteúdo e preço');
      return;
    }

    try {
      const res = await fetch('/api/proposals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selectedProject.id,
          content: proposalForm.content,
          price: proposalForm.price,
        }),
      });

      if (!res.ok) throw new Error('Erro ao enviar proposta');

      toast.success('✅ Proposta enviada!');
      setProposalForm({ content: '', price: '' });
      setSelectedProject(null);
    } catch (error) {
      toast.error('Erro ao enviar proposta');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">💼 Marketplace de Projetos</h1>
        <p className="text-gray-600">Encontre projetos e envie propostas</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando projetos...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-600">Nenhum projeto disponível</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description.slice(0, 100)}...</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-500">Orçamento</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {(project.budget_cents / 100).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold">{project.status}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(project)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Enviar Proposta
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">{selectedProject.title}</h2>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Sua Proposta</label>
                <textarea
                  value={proposalForm.content}
                  onChange={(e) => setProposalForm({ ...proposalForm, content: e.target.value })}
                  placeholder="Descreva como você faria este projeto..."
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Seu Preço (R$)</label>
                <input
                  type="number"
                  value={proposalForm.price}
                  onChange={(e) => setProposalForm({ ...proposalForm, price: e.target.value })}
                  placeholder="1000"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✅ Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
