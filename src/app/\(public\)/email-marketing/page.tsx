'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function EmailMarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <Link href="/">
            <Button variant="ghost">← Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-800">Simplicidade em primeiro lugar</Badge>
        <h2 className="text-5xl font-bold mb-4">
          Email marketing que funciona
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sem complicação. Sem curva de aprendizado. Envie, acompanhe, venda.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Começar Grátis
          </Button>
          <Button size="lg" variant="outline">
            Ver Exemplo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">95%</p>
            <p className="text-gray-600">Inbox na caixa</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">3x</p>
            <p className="text-gray-600">Mais conversão</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">R$ 79</p>
            <p className="text-gray-600">Por mês</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold mb-12 text-center">Tudo que você precisa</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '✏️',
              title: 'Editor Drag & Drop',
              desc: 'Crie emails lindos sem código',
            },
            {
              icon: '📨',
              title: 'Listas ilimitadas',
              desc: 'Organize seus contatos',
            },
            {
              icon: '🎯',
              title: 'Segmentação',
              desc: 'Envie pra quem importa',
            },
            {
              icon: '📊',
              title: 'Relatórios',
              desc: 'Veja tudo que importa',
            },
            {
              icon: '⏰',
              title: 'Agendamento',
              desc: 'Envie no horário perfeito',
            },
            {
              icon: '🔗',
              title: 'Integrações',
              desc: 'Funciona com suas ferramentas',
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
        <h3 className="text-3xl font-bold mb-12 text-center">Preços justos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: 'R$ 79',
              desc: '5.000 contatos',
              features: ['Editor', 'Listas', 'Básico', 'Suporte'],
            },
            {
              name: 'Professional',
              price: 'R$ 199',
              desc: '25.000 contatos',
              features: ['Tudo do Starter', 'Segmentação', 'Agendamento', 'Relatórios'],
              highlight: true,
            },
            {
              name: 'Enterprise',
              price: 'R$ 499',
              desc: 'Ilimitado',
              features: ['Tudo', 'Suporte 24/7', 'API acesso', 'Custom'],
            },
          ].map((plan, i) => (
            <Card key={i} className={plan.highlight ? 'border-blue-500 border-2' : ''}>
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
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Comece em 2 minutos</h3>
          <p className="mb-8">Sem cartão de crédito. Sem promessas falsas.</p>
          <Button size="lg" variant="secondary">
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </div>
  );
}
