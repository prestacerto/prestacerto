import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Currículo IA | PrestaCerto',
  description: 'Gerador de currículos com inteligência artificial',
};

export default function CurriculoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">📄 Currículo IA</h1>
            <p className="text-gray-600 mt-2">Gerador de currículos com inteligência artificial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção de funcionalidades */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Funcionalidades</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Geração automática de currículo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Múltiplos templates profissionais</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Export em PDF e DOCX</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Otimização para ATS</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Sugestões de melhoria com IA</span>
                </li>
              </ul>
            </div>

            {/* Seção de getting started */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Começar</h2>
              <div className="space-y-3">
                <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                  Criar Novo Currículo
                </button>
                <button className="w-full py-2 border border-gray-300 rounded hover:bg-gray-50 font-semibold">
                  Meus Currículos
                </button>
                <button className="w-full py-2 border border-gray-300 rounded hover:bg-gray-50 font-semibold">
                  Ver Templates
                </button>
              </div>
            </div>
          </div>

          {/* Seção de documentação */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Como Usar</h2>
            <div className="prose max-w-none">
              <ol className="space-y-3">
                <li><strong>Passo 1:</strong> Clique em "Criar Novo Currículo"</li>
                <li><strong>Passo 2:</strong> Preencha suas informações profissionais</li>
                <li><strong>Passo 3:</strong> Selecione um template de sua preferência</li>
                <li><strong>Passo 4:</strong> Deixe a IA sugerir melhorias</li>
                <li><strong>Passo 5:</strong> Baixe em PDF ou DOCX</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
