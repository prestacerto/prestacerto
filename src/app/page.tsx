// CRITICAL: Must stay at top - enables client features for auth detection
'use client';

import Link from "next/link";

export default function Home() {

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">✓</div>
            <span className="text-xl font-bold text-gray-900">PrestaCerto</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/projects" className="text-gray-700 hover:text-gray-900 font-medium">Projetos</Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 font-medium">Serviços</Link>
            <Link href="/plans" className="text-gray-700 hover:text-gray-900 font-medium">Planos</Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">Entrar</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Registrar</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Contrate talentos.<br />
            <span className="text-blue-600">Sem comissões.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Conecte-se com os melhores talentos do mercado. Zero comissões, máxima segurança e transparência total em cada projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
              Começar grátis
            </Link>
            <Link href="/projects" className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition">
              Explorar projetos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold text-gray-900">45.2k+</p>
              <p className="text-gray-600 mt-2">Freelancers ativos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">128.7k+</p>
              <p className="text-gray-600 mt-2">Projetos publicados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">R$ 937k+</p>
              <p className="text-gray-600 mt-2">Faturamento mensal</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">4.8★</p>
              <p className="text-gray-600 mt-2">Avaliação média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Por que escolher PrestaCerto</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-3">0%</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sem comissões</h3>
            <p className="text-gray-600">Você paga apenas o valor combinado com o profissional. Sem taxas ocultas.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-3">✓ Escrow</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Seguro</h3>
            <p className="text-gray-600">Pagamento protegido em escrow até a entrega do trabalho.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-3">⚡ IA</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Inteligente</h3>
            <p className="text-gray-600">Matchmaking alimentado por IA para encontrar o melhor profissional.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg opacity-90 mb-8">Junte-se a milhares de freelancers e clientes que já confiam na PrestaCerto.</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition">
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">✓</div>
                <span className="font-bold text-white">PrestaCerto</span>
              </div>
              <p className="text-sm">A plataforma de freelancers sem comissões.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/projects" className="hover:text-white">Projetos</Link></li>
                <li><Link href="/services" className="hover:text-white">Serviços</Link></li>
                <li><Link href="/plans" className="hover:text-white">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm">
            <p>© 2024 PrestaCerto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
