'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, MessageSquare, Link2, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao PrestaCerto!</p>
      </div>

      {/* Certo AI Hero Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">⚡</span>
              <h2 className="text-3xl font-bold">Certo AI</h2>
              <span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-bold">NOVO</span>
            </div>
            <p className="text-lg mb-2 opacity-95">Otimize suas propostas com inteligência artificial</p>
            <p className="mb-6 opacity-90">Ganhe mais projetos, melhore seu texto, aumente sua taxa de conversão em até 78%</p>
            <Link href="/dashboard/certo-ai" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block text-lg">
              Usar Certo AI Agora →
            </Link>
          </div>
          <div className="text-6xl hidden md:block opacity-20">⚡</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Propostas</p>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Projetos</p>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Faturamento</p>
          <p className="text-3xl font-bold">R$ 5.2k</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Rating</p>
          <p className="text-3xl font-bold">4.9★</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/certo-ai" className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
          <Zap className="w-8 h-8 text-yellow-500 mb-2" />
          <h3 className="font-bold mb-1">Certo AI</h3>
          <p className="text-sm text-gray-600">Otimize propostas com IA</p>
        </Link>

        <Link href="/dashboard/messages" className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
          <MessageSquare className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="font-bold mb-1">Chat</h3>
          <p className="text-sm text-gray-600">Mensagens com clientes</p>
        </Link>

        <Link href="/dashboard/referral" className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
          <Link2 className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="font-bold mb-1">Referrais</h3>
          <p className="text-sm text-gray-600">Ganhe com indicações</p>
        </Link>

        <Link href="/dashboard/revenue" className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
          <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
          <h3 className="font-bold mb-1">Receita</h3>
          <p className="text-sm text-gray-600">Analytics & dados</p>
        </Link>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h2>
        <p className="mb-4">Você tem 4 oportunidades esperando. Verifique o marketplace agora!</p>
        <Link href="/projects" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition inline-block">
          Ver Projetos →
        </Link>
      </div>
    </div>
  );
}
