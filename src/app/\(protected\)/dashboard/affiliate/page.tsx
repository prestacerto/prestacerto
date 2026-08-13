'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, Share2, TrendingUp } from 'lucide-react';

interface AffiliateData {
  affiliateId: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  conversionRate: number;
  commissionRate: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  earnings: number;
  projects: number;
}

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const [affiliate] = useState<AffiliateData>({
    affiliateId: 'AFF-12345678',
    referralLink: 'https://prestacerto.com.br?ref=AFF-12345678',
    totalReferrals: 28,
    activeReferrals: 23,
    totalEarnings: 14000,
    thisMonthEarnings: 3500,
    conversionRate: 68,
    commissionRate: 15,
  });

  const [referrals] = useState<Referral[]>([
    { id: '1', name: 'João Silva', email: 'joao@email.com', joinDate: '2024-08-10', status: 'active', earnings: 750, projects: 8 },
    { id: '2', name: 'Maria Costa', email: 'maria@email.com', joinDate: '2024-08-15', status: 'active', earnings: 450, projects: 5 },
    { id: '3', name: 'Pedro Santos', email: 'pedro@email.com', joinDate: '2024-07-20', status: 'active', earnings: 600, projects: 6 },
    { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', joinDate: '2024-06-01', status: 'inactive', earnings: 200, projects: 2 },
    { id: '5', name: 'Carlos Rodrigues', email: 'carlos@email.com', joinDate: '2024-09-01', status: 'active', earnings: 300, projects: 3 },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliate.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <LinkIcon className="w-8 h-8 text-green-500" />
          Programa de Afiliados
        </h1>
        <p className="text-gray-600">Ganhe comissões indicando freelancers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Total Indicados</p>
          <p className="text-3xl font-bold">{affiliate.totalReferrals}</p>
          <p className="text-xs opacity-75 mt-2">{affiliate.activeReferrals} ativos</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Ganhos Totais</p>
          <p className="text-3xl font-bold">R$ {(affiliate.totalEarnings / 1000).toFixed(1)}k</p>
          <p className="text-xs opacity-75 mt-2">Desde o início</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Ganhos este Mês</p>
          <p className="text-3xl font-bold">R$ {(affiliate.thisMonthEarnings / 1000).toFixed(1)}k</p>
          <p className="text-xs opacity-75 mt-2">Taxa de conversão: {affiliate.conversionRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Comissão por Indicação</p>
          <p className="text-3xl font-bold">{affiliate.commissionRate}%</p>
          <p className="text-xs opacity-75 mt-2">De cada projeto</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Seu Link de Afiliado</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={affiliate.referralLink}
            readOnly
            className="flex-1 p-3 bg-white border rounded-lg font-mono text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
              copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-50 border-2 border-blue-300 transition">
            <Share2 className="w-4 h-4" />
            Compartilhar no WhatsApp
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-50 border-2 border-blue-300 transition">
            <Share2 className="w-4 h-4" />
            Compartilhar no Twitter
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-50 border-2 border-blue-300 transition">
            <Share2 className="w-4 h-4" />
            Enviar por Email
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Meus Indicados</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data de Entrada</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Projetos</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Ganhos</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{referral.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{referral.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(referral.joinDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      referral.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {referral.status === 'active' ? '✓ Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">{referral.projects}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    R$ {(referral.earnings / 1000).toFixed(1)}k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Como maximizar seus ganhos
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>💡 <strong>Compartilhe seu link</strong> em redes sociais, comunidades e grupos</li>
          <li>💼 <strong>Recomende para amigos</strong> que procuram trabalhar como freelancer</li>
          <li>📈 <strong>Rastreie suas conversões</strong> e otimize a estratégia de compartilhamento</li>
          <li>🎁 <strong>Ofereça um bônus pessoal</strong> aos seus indicados para motivar inscrição</li>
        </ul>
      </div>
    </div>
  );
}
