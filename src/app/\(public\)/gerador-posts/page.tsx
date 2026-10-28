'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function GeradorPostsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerador de Posts</h1>
          <Link href="/">
            <Button variant="ghost">← Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-purple-100 text-purple-800">Powered by IA</Badge>
        <h2 className="text-5xl font-bold mb-4">
          Posts que rendem em segundos
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crie posts para LinkedIn, Instagram e TikTok em 30 segundos. Agende automaticamente.
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Começar Grátis
          </Button>
          <Button size="lg" variant="outline">
            Ver Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">10x</p>
            <p className="text-gray-600">Mais rápido</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">+40%</p>
            <p className="text-gray-600">Engagement médio</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">R$ 29</p>
            <p className="text-gray-600">Por mês</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold mb-12 text-center">Crie 10 posts em 2 minutos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🤖',
              title: 'IA inteligente',
              desc: 'Gera posts viralizáveis',
            },
            {
              icon: '📱',
              title: 'Multiplas redes',
              desc: 'LinkedIn, Instagram, TikTok',
            },
            {
              icon: '📅',
              title: 'Agendador',
              desc: 'Publique automaticamente',
            },
            {
              icon: '🎨',
              title: 'Editor visual',
              desc: 'Customize como quiser',
            },
            {
              icon: '📊',
              title: 'Analytics',
              desc: 'Veja o que funciona',
            },
            {
              icon: '💡',
              title: '100+ Modelos',
              desc: 'De tudo quanto é tipo',
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
        <h3 className="text-3xl font-bold mb-12 text-center">Comece barato</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Criador',
              price: 'R$ 29',
              desc: '5 posts/semana',
              features: ['IA gera posts', 'Agendamento', 'Editor', 'Básico'],
            },
            {
              name: 'Professional',
              price: 'R$ 79',
              desc: '50 posts/mês',
              features: ['Tudo do Criador', 'Multiplas redes', 'Analytics', 'Campanhas'],
              highlight: true,
            },
            {
              name: 'Team',
              price: 'R$ 149',
              desc: 'Ilimitado',
              features: ['Tudo', 'Multiplos usuários', 'Prioridade', 'Suporte'],
            },
          ].map((plan, i) => (
            <Card key={i} className={plan.highlight ? 'border-purple-500 border-2' : ''}>
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
      <div className="bg-purple-600 text-white py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Não perca mais tempo criando posts</h3>
          <p className="mb-8">7 dias grátis. Sem cartão de crédito.</p>
          <Button size="lg" variant="secondary">
            Começar Grátis
          </Button>
        </div>
      </div>
    </div>
  );
}
