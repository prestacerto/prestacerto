'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search, Heart, Menu, Home as HomeIcon, Filter, Settings, Plus, Share2, Gift, TrendingUp } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle-card';
import { ReferralTracker } from '@/components/ReferralTracker';

const featuredVehicles = [
  {
    id: '1',
    brand: 'JEEP',
    model: 'COMPASS',
    price: 259890,
    year: 2026,
    mileage: 51795,
    location: 'São Paulo',
    type: 'SUV',
    image: '/vehicles/jeep-compass.jpg',
    isFavorite: false,
    status: 'available' as const,
    isHighlighted: true,
    sellerBadge: 'top-seller' as const,
    views: 1234
  },
  {
    id: '2',
    brand: 'VOLKSWAGEN',
    model: 'T-CROSS',
    price: 161690,
    year: 2026,
    mileage: 51795,
    location: 'São Bernardo do Campo',
    type: 'SUV',
    image: '/vehicles/vw-tcross.jpg',
    isFavorite: false,
    status: 'sold' as const,
    sellerBadge: 'verified' as const,
    views: 2845
  },
  {
    id: '3',
    brand: 'HONDA',
    model: 'CIVIC',
    price: 122000,
    year: 2025,
    mileage: 15000,
    location: 'São Paulo',
    type: 'Sedan',
    image: '/vehicles/honda-civic.jpg',
    isFavorite: true,
    status: 'available' as const,
    priceDropped: true,
    views: 892
  }
];

const services = [
  {
    icon: '🔍',
    title: 'Mega Feirão',
    badge: 'ATÉ 31/07'
  },
  {
    icon: '⚡',
    title: 'Abaixo da Fipe',
    badge: 'OFERTAS'
  },
  {
    icon: '💚',
    title: 'Rápido e Fácil',
    badge: 'VERDE'
  },
  {
    icon: '🔎',
    title: 'Quero Comprar',
    badge: ''
  },
  {
    icon: '💰',
    title: 'Quero Vender',
    badge: ''
  }
];

const recentSearches = [
  'Hyundai HB20',
  'Volkswagen T-Cross',
  'Honda Civic',
  'Jeep Compass'
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'cars' | 'motos'>('cars');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteCount, setFavoriteCount] = useState(1);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showReferralBanner, setShowReferralBanner] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const response = await fetch('/api/referrals/generate-code');
        const data = await response.json();
        if (data.code) {
          setReferralCode(data.code);
        }
      } catch (error) {
        console.error('Failed to fetch referral code:', error);
      }
    };

    fetchReferralCode();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterMessage('Por favor, digite seu email');
      return;
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'home_page' }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewsletterMessage(data.message);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterMessage(''), 4000);
      } else {
        setNewsletterMessage(data.error || 'Erro ao inscrever');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsletterMessage('Erro ao processar sua inscrição');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Webmotors</h1>
            <p className="text-xs text-gray-500">Sua plataforma de carros</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-50 rounded-lg">
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Encontre o seu veículo aqui"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-red-500 rounded-full focus:outline-none focus:border-red-600 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Service Categories */}
        <section className="px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {services.map((service, idx) => (
              <button
                key={idx}
                className={`p-3 rounded-lg text-center transition ${
                  idx < 3
                    ? idx === 0
                      ? 'bg-red-500 text-white'
                      : idx === 1
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-xl mb-1">{service.icon}</div>
                <div className="text-xs font-semibold">{service.title}</div>
                {service.badge && (
                  <div className="text-xs font-bold opacity-90 mt-1">{service.badge}</div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Referral Banner */}
        {showReferralBanner && (
          <section className="px-4 py-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <Gift size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <h3 className="text-lg font-bold">Ganhe R$ Indicando!</h3>
                </div>
                <p className="text-sm mb-3 opacity-95">
                  Indique amigos e ganhe até R$ 50 por cada pessoa que se cadastrar
                </p>
                {referralCode ? (
                  <div className="bg-white bg-opacity-20 rounded p-2 mb-3">
                    <p className="text-xs opacity-90 mb-1">Seu código de indicação:</p>
                    <p className="font-bold text-sm">{referralCode}</p>
                  </div>
                ) : null}
                <Link
                  href={referralCode ? `/referrals?code=${referralCode}` : '/referrals'}
                  className="inline-block w-full bg-white text-orange-500 font-semibold py-2 rounded text-center hover:bg-gray-100 transition"
                >
                  <Share2 className="inline mr-2" size={16} />
                  Copiar Link e Compartilhar
                </Link>
              </div>
              <button
                onClick={() => setShowReferralBanner(false)}
                className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </section>
        )}

        {/* Recent Searches */}
        <section className="px-4 py-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Últimas buscas</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0"
              >
                {search}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="px-4 py-4">
          <h2 className="text-lg font-bold mb-3">Recomendados para você</h2>
          <div className="space-y-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 py-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">
              📧 Receba ofertas exclusivas
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Seja o primeiro a saber sobre os melhores veículos
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Seu email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
              >
                Se inscrever gratuitamente
              </button>
            </form>
            {newsletterMessage && (
              <p className={`text-xs mt-2 ${newsletterMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {newsletterMessage}
              </p>
            )}
          </div>
        </section>

        {/* Financing Section */}
        <section className="px-4 py-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>
              <span className="font-bold text-gray-900">Santander Financiamentos</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Descubra se você tem crédito pré-aprovado para comprar um veículo, sem compromisso!
            </p>
            <button className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600">
              Descobrir crédito pré-aprovado
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex-1 py-3 text-center hover:bg-gray-50">
            <HomeIcon className="w-6 h-6 mx-auto mb-1 text-red-500" />
            <span className="text-xs text-red-500 font-semibold">Início</span>
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
          <button className="flex-1 py-3 text-center hover:bg-gray-50">
            <Menu className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
