import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              Contrate talentos.<br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Sem comissões.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              A plataforma onde freelancers e clientes se encontram.
              Zero taxa de intermediação. 100% transparência.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105">
              Começar agora
            </Link>
            <Link href="/projects" className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition transform hover:scale-105">
              Ver projetos
            </Link>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <Link href="/projects" className="p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700/50">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-semibold text-white">Projetos</div>
            </Link>
            <Link href="/services" className="p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700/50">
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-semibold text-white">Serviços</div>
            </Link>
            <Link href="/plans" className="p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700/50">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-semibold text-white">Planos</div>
            </Link>
            <Link href="/login" className="p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700/50">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-semibold text-white">Entrar</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Por que PrestaCerto?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Sem comissões</h3>
              <p className="text-slate-300">Você paga apenas o valor combinado, nada mais.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">100% Seguro</h3>
              <p className="text-slate-300">Escrow garante que o trabalho seja entregue.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Rápido</h3>
              <p className="text-slate-300">Encontre o talento certo em minutos.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
