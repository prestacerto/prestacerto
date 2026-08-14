'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Eye } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  skills: string[];
  created_at: string;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_url: '',
    skills: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPortfolio(data || []);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('portfolio')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          image_url: data.publicUrl,
          project_url: formData.project_url,
          skills: formData.skills.split(',').map(s => s.trim()),
        });

      if (insertError) throw insertError;

      setFormData({ title: '', description: '', project_url: '', skills: '' });
      setSelectedFile(null);
      await loadPortfolio();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadPortfolio();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar portfólio');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Portfólio</h1>
        <p className="text-gray-600">Showcase seus melhores trabalhos</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Projeto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título do projeto"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="p-3 border rounded-lg w-full"
              required
            />
            <input
              type="url"
              placeholder="URL do projeto (opcional)"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              className="p-3 border rounded-lg w-full"
            />
          </div>

          <textarea
            placeholder="Descrição do projeto"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="p-3 border rounded-lg w-full h-24"
          />

          <input
            type="text"
            placeholder="Skills usadas (separadas por vírgula)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="p-3 border rounded-lg w-full"
          />

          <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              required
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">{selectedFile ? selectedFile.name : 'Clique para fazer upload da imagem'}</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {uploading ? 'Enviando...' : 'Adicionar ao Portfólio'}
          </button>
        </form>
      </div>

      {/* Portfolio Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Meus Projetos ({portfolio.length})</h2>
        {portfolio.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Nenhum projeto adicionado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
                <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />

                <div className="p-4">
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.skills?.map((skill) => (
                      <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Projeto
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-sm bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
