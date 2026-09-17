import { EnhancedReviews, ReviewsList } from "@/components/enhanced-reviews";
import { ContractTemplates } from "@/components/contract-templates";
import { TimeTracker } from "@/components/time-tracking";
import { IdentityVerification } from "@/components/identity-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PremiumServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            🚀 Serviços Premium
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ferramentas profissionais para elevar seu negócio e ganhar mais
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="reviews">⭐ Avaliações</TabsTrigger>
              <TabsTrigger value="contracts">📄 Contratos</TabsTrigger>
              <TabsTrigger value="tracking">⏱️ Time Tracker</TabsTrigger>
              <TabsTrigger value="verification">🛡️ Verificação</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-8">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  💡 Sistema de Avaliações de 5 Pontos
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Categorias: Qualidade, Comunicação, Prazo, Preço e Profissionalismo.
                  Inclua fotos da entrega para aumentar confiança e converter mais clientes.
                </p>
              </div>
              <EnhancedReviews />
              <ReviewsList />
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-8">
              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 mb-8 border-l-4 border-green-600">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  📋 Contratos Legais Prontos
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Templates profissionais para Web Dev, Design e Copywriting. R$ 9 por contrato ou R$ 49/mês ilimitado.
                </p>
              </div>
              <ContractTemplates />
            </TabsContent>

            {/* Time Tracking Tab */}
            <TabsContent value="tracking" className="space-y-8">
              <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-6 mb-8 border-l-4 border-purple-600">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  ⏱️ Rastreie Suas Horas
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Timer integrado, cálculo automático de ganhos, e export de faturas. Comece a rastrear seus projetos agora.
                </p>
              </div>
              <TimeTracker />
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-8">
              <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-6 mb-8 border-l-4 border-yellow-600">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  🛡️ Aumente Sua Confiança
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Verificação de CPF, Telefone, Email e LinkedIn. Badge verde para ganhar mais propostas.
                </p>
              </div>
              <IdentityVerification />
            </TabsContent>
          </Tabs>
        </div>

        {/* Pricing Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
            💰 Planos de Preço
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Free
              </h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                R$ 0
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li>✓ Avaliações básicas</li>
                <li>✓ 1 contrato/mês</li>
                <li>✗ Time tracking</li>
                <li>✗ Verificação</li>
              </ul>
              <button className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Usando Agora
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-lg border-2 border-blue-600 p-6 bg-blue-50 dark:bg-blue-950 relative">
              <div className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Pro
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                R$ 49<span className="text-sm text-slate-600 dark:text-slate-400">/mês</span>
              </p>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
                <li>✓ 5 categorias de avaliações</li>
                <li>✓ Contratos ilimitados</li>
                <li>✓ Time tracking completo</li>
                <li>✓ Verificação de CPF + Telefone</li>
              </ul>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                Ativar Pro
              </button>
            </div>

            {/* Business */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Business
              </h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                R$ 129<span className="text-sm text-slate-600 dark:text-slate-400">/mês</span>
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li>✓ Tudo do Pro</li>
                <li>✓ Equipe (até 5 membros)</li>
                <li>✓ Analytics avançado</li>
                <li>✓ Suporte prioritário</li>
              </ul>
              <button className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Comparar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
