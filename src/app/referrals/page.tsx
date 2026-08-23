'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Share2, TrendingUp, Users, Home as HomeIcon, Search, Heart, Plus, Menu } from 'lucide-react';

interface ReferralStats {
  code: string;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: string;
  estimated_earnings: number;
  referrals: Array<{
    id: string;
    referred_user_id: string;
    created_at: string;
    bonus_amount: number;
    status: string;
  }>;
}

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/referrals/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch referral stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const copyToClipboard = () => {
    if (stats?.code) {
      const url = `${window.location.origin}/?ref=${stats.code}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    if (stats?.code) {
      const url = `${window.location.origin}/?ref=${stats.code}`;
      const message = `Confira este incrível marketplace de carros! ${url}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-gray-900">
            ← Voltar
          </Link>
          <h1 className="text-lg font-bold">Programa de Indicação</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4">
          <h2 className="text-2xl font-bold mb-2">Ganhe Dinheiro Indicando</h2>
          <p className="text-sm opacity-95">
            Compartilhe seu código com amigos e ganhe R$ 50 por cada novo usuário!
          </p>
        </section>

        {/* Referral Code */}
        {stats && (
          <section className="px-4 py-6">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Seu código de indicação
              </p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-red-500">{stats.code}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Copy size={20} className="text-gray-700" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 font-semibold">
                  ✓ Copiado para a área de transferência!
                </p>
              )}
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                <Copy size={20} />
                Copiar Link
              </button>
              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                <Share2 size={20} />
                WhatsApp
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <Users size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_conversions}
                </p>
                <p className="text-xs text-gray-600">Pessoas Indicadas</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <TrendingUp size={24} className="mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats.estimated_earnings.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">Ganhos Totais</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <p className="text-gray-600">Cliques no link</p>
                  <p className="font-bold text-gray-900">{stats.total_clicks}</p>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <p className="text-gray-600">Taxa de conversão</p>
                  <p className="font-bold text-gray-900">{stats.conversion_rate}%</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Ganho por indicação</p>
                  <p className="font-bold text-gray-900">R$ 50,00</p>
                </div>
              </div>
            </div>

            {/* Recent Referrals */}
            {stats.referrals.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  Indicações Recentes ({stats.referrals.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats.referrals.map((ref) => (
                    <div
                      key={ref.id}
                      className="flex justify-between items-center py-2 border-b last:border-0 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Novo usuário
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(ref.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">
                        +R$ {ref.bonus_amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Info Section */}
        <section className="px-4 py-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">Como funciona?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Compartilhe seu código com amigos</li>
              <li>✓ Eles se registram usando seu código</li>
              <li>✓ Você ganha R$ 50 por cada amigo</li>
              <li>✓ Sem limite de ganhos!</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex-1 py-3 text-center hover:bg-gray-50">
            <HomeIcon className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Início</span>
          </Link>
          <Link href="/search" className="flex-1 py-3 text-center hover:bg-gray-50">
            <Search className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Buscar</span>
          </Link>
          <Link href="/favorites" className="flex-1 py-3 text-center hover:bg-gray-50">
            <Heart className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Favoritos</span>
          </Link>
          <Link href="/sell" className="flex-1 py-3 text-center hover:bg-gray-50">
            <Plus className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Vender</span>
          </Link>
          <Link
            href="/referrals"
            className="flex-1 py-3 text-center hover:bg-gray-50 border-t-2 border-red-500"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-red-500" />
            <span className="text-xs text-red-500 font-semibold">Ganhar</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
