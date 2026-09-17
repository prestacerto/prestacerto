import { Wand2, TrendingUp, Lightbulb, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

export const metadata = { title: "Certo AI — Assistente de Propostas" };

const CertoAIOptimizer = dynamic(
  () => import("@/components/proposal/certo-ai-optimizer").then(m => ({ default: m.CertoAIOptimizer })),
  { loading: () => <div className="bg-gray-100 rounded animate-pulse h-40" /> }
);

const ProposalComparison = dynamic(
  () => import("@/components/proposal/proposal-comparison").then(m => ({ default: m.ProposalComparison })),
  { loading: () => <div className="bg-gray-100 rounded animate-pulse h-32" /> }
);

const CertoAIClient = dynamic(
  () => import("@/components/dashboard/certo-ai-client").then(m => ({ default: m.CertoAIClient })),
  { loading: () => <div className="bg-gray-100 rounded animate-pulse h-96" /> }
);

export default function CertoAIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Wand2 size={32} className="text-blue-600" />
          ✨ Certo AI
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Seu assistente de IA que aumenta suas chances de ganhar projetos. Escreva melhor, ganhe mais.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Taxa média de ganho</p>
                <p className="text-3xl font-bold text-green-600">+35%</p>
                <p className="text-xs text-gray-500">vs. propostas não otimizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 size={24} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Usuários ativos</p>
                <p className="text-3xl font-bold text-blue-600">1,200+</p>
                <p className="text-xs text-gray-500">ganhando mais com Certo AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Lightbulb size={24} className="text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Propostas analisadas</p>
                <p className="text-3xl font-bold text-yellow-600">50K+</p>
                <p className="text-xs text-gray-500">esse mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <CertoAIClient>
        <CertoAIOptimizer />
        <ProposalComparison />
      </CertoAIClient>
    </div>
  );
}
