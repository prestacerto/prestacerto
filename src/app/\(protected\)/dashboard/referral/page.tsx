'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Copy, Share2, TrendingUp } from 'lucide-react';

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, earned: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setReferralCode(user.id.slice(0, 8).toUpperCase());

        const { data } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id);

        setReferrals(data || []);

        const earned = data?.filter((r: any) => r.status === 'approved').reduce((sum: number, r: any) => sum + 50000, 0) || 0;

        setStats({
          total: data?.length || 0,
          active: data?.filter((r: any) => r.status === 'active').length || 0,
          earned,
        });
      }
    };

    loadData();
  }, []);

  const referralLink = `https://prestacerto.com.br?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Programa de Referência</h1>
        <p className="text-gray-600">Ganhe R$ 50 por cada amigo que se cadastrar</p>
      </div>

      {/* Referral Link */}
      <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
        <p className="text-sm text-blue-600 font-semibold mb-3">SEU LINK DE REFERÊNCIA</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-2 border rounded-lg bg-white text-sm font-mono"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Total de Referências</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Ativas</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Ganhos</p>
          <p className="text-3xl font-bold">R$ {(stats.earned / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Share */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Compartilhe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'WhatsApp', color: 'bg-green-500' },
            { name: 'Telegram', color: 'bg-blue-500' },
            { name: 'Email', color: 'bg-gray-500' },
            { name: 'LinkedIn', color: 'bg-blue-700' },
          ].map((platform) => (
            <button
              key={platform.name}
              className={`${platform.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2`}
            >
              <Share2 className="w-4 h-4" />
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Meus Referidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ganho</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length > 0 ? (
                referrals.map((ref) => (
                  <tr key={ref.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{ref.referred_email}</td>
                    <td className="px-6 py-3 text-sm">{new Date(ref.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ref.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ref.status === 'approved' ? 'Aprovado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-emerald-600">
                      {ref.status === 'approved' ? 'R$ 50,00' : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nenhum referido ainda. Comece a compartilhar seu link!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
