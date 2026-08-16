export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">PrestaCerto</h1>
          <p className="text-xl text-gray-300">Marketplace de Freelancers com IA</p>
        </div>

        <div className="grid gap-4 mb-8">
          <a href="/projects" className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition">
            🚀 Projetos Abertos
          </a>
          <a href="/services" className="block bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-semibold transition">
            💼 Serviços Disponíveis
          </a>
          <a href="/plans" className="block bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg font-semibold transition">
            📊 Planos e Preços
          </a>
          <a href="/dashboard" className="block bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-semibold transition">
            📈 Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}
