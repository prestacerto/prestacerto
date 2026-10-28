'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function WhatsAppMarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WhatsApp Marketing</h1>
          <Link href="/">
            <Button variant="ghost">← Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-green-100 text-green-800">Automação WhatsApp</Badge>
        <h2 className="text-5xl font-bold mb-4">
          Envie mensagens em massa sem digitar
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Automatize seu WhatsApp. Templates, agendamento, analytics. Tudo em um lugar.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Começar Grátis
          </Button>
          <Button size="lg" variant="outline">
            Ver Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">100%</p>
            <p className="text-gray-600">Taxa de entrega</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">10x</p>
            <p className="text-gray-600">Mais rápido que manual</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">R$ 299</p>
            <p className="text-gray-600">Por mês</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold mb-12 text-center">O que você consegue fazer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '📤',
              title: 'Envio em Massa',
              desc: 'Envie 1.000+ mensagens em minutos',
            },
            {
              icon: '📅',
              title: 'Agendamento',
              desc: 'Agende mensagens pra depois',
            },
            {
              icon: '🎯',
              title: 'Templates',
              desc: '30+ templates prontos',
            },
            {
              icon: '📊',
              title: 'Analytics',
              desc: 'Veja quem leu e clicou',

            },
            {
              icon: '🔗',
              title: 'Integrações',
              desc: 'Conecta com sua ferramenta',
            },
            {
              icon: '🤖',
              title: 'Automação',
              desc: 'Responda automaticamente',
            },
          ].map((feature, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <p className="text-4xl mb-2">{feature.icon}</p>
                <h4 className="font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold mb-12 text-center">Preços simples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: 'R$ 299',
              desc: 'Até 50 contatos',
              features: ['Envio em massa', 'Templates', 'Básico'],
            },
            {
              name: 'Growth',
              price: 'R$ 699',
              desc: 'Até 500 contatos',
              features: ['Tudo do Starter', 'Agendamento', 'Analytics', 'Automação'],
              highlight: true,
            },
            {
              name: 'Enterprise',
              price: 'R$ 1.999',
              desc: 'Ilimitado',
              features: ['Tudo', 'Suporte prioritário', 'Integrações custom', 'SLA'],
            },
          ].map((plan, i) => (
            <Card key={i} className={plan.highlight ? 'border-green-500 border-2' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold mt-2">{plan.price}</p>
                <p className="text-sm text-gray-600 mt-1">{plan.desc}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-sm">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'}>
                  Contratar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Pronto pra automatizar?</h3>
          <p className="mb-8">Comece grátis. Sem cartão de crédito.</p>
          <Button size="lg" variant="secondary">
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </div>
  );
}
