'use client';

import { useState } from 'react';
import { Copy, Share2, QrCode, TrendingUp } from 'lucide-react';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const userId = 'user_demo_123';
  const referralLink = `https://prestacerto.com.br/register?ref=${userId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">💰 Programa de Referrais</h1>
        <p className="text-gray-600">Ganhe 10% do faturamento de quem você indicar PARA SEMPRE</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600 text-sm">Referências Ativas</p>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-green-600 mt-2">+3 este mês</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600 text-sm">Ganho Acumulado</p>
          <p className="text-3xl font-bold">R$ 8,420</p>
          <p className="text-xs text-green-600 mt-2">+R$ 1,200 este mês</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600 text-sm">Taxa de Conversão</p>
          <p className="text-3xl font-bold">32%</p>
          <p className="text-xs text-green-600 mt-2">Acima da média</p>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Seu Link de Referência</h2>

        <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-between">
          <code className="text-sm font-mono text-gray-700">{referralLink}</code>
          <button
            onClick={copyLink}
            className={`p-2 rounded transition ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Copy size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Share2 size={20} /> Compartilhar
          </button>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <QrCode size={20} /> QR Code
          </button>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Como Funciona</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-bold mb-1">Compartilhe seu link</h3>
              <p className="text-gray-600">Envie o link de referência pra amigos, colegas ou redes sociais</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-bold mb-1">Eles se cadastram</h3>
              <p className="text-gray-600">Quando clicam no seu link e criam conta, você fica linkado</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-bold mb-1">Ganhe comissão</h3>
              <p className="text-gray-600">Você recebe 10% de TUDO que ele faturar na plataforma. PARA SEMPRE!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white p-8 rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Seus Referenciados</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-bold">Nome</th>
              <th className="text-left py-3 font-bold">Data</th>
              <th className="text-right py-3 font-bold">Faturamento</th>
              <th className="text-right py-3 font-bold">Seu Ganho</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-4">João Silva</td>
              <td className="py-4">12 ago 2026</td>
              <td className="text-right">R$ 15,000</td>
              <td className="text-right font-bold text-green-600">R$ 1,500</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-4">Maria Santos</td>
              <td className="py-4">08 ago 2026</td>
              <td className="text-right">R$ 8,400</td>
              <td className="text-right font-bold text-green-600">R$ 840</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-4">Carlos Dev</td>
              <td className="py-4">01 ago 2026</td>
              <td className="text-right">R$ 22,000</td>
              <td className="text-right font-bold text-green-600">R$ 2,200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
