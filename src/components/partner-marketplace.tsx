"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Zap,
  Shield,
  DollarSign,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  commission_rate: number;
  logo_url?: string;
  website_url?: string;
}

const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Hotmart",
    category: "education",
    description: "Cursos sobre propostas vencedoras, pitch e negociação",
    commission_rate: 20,
    website_url: "https://hotmart.com",
  },
  {
    id: "2",
    name: "ChatGPT Pro",
    category: "tools",
    description: "AI assistant para reescrever propostas automaticamente",
    commission_rate: 30,
    website_url: "https://openai.com/chatgpt",
  },
  {
    id: "3",
    name: "Figma Teams",
    category: "tools",
    description: "Ferramentas de design para criar portfólio visual",
    commission_rate: 15,
    website_url: "https://figma.com",
  },
  {
    id: "4",
    name: "Responsabilidade Civil",
    category: "insurance",
    description: "Seguros profissionais para freelancers",
    commission_rate: 25,
    website_url: "https://tokio.com.br",
  },
  {
    id: "5",
    name: "Nuvemshop",
    category: "marketplace",
    description: "Integração com loja virtual para vender cursos/templates",
    commission_rate: 10,
    website_url: "https://nuvemshop.com.br",
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  education: <BookOpen className="size-6" />,
  tools: <Zap className="size-6" />,
  insurance: <Shield className="size-6" />,
  fintech: <DollarSign className="size-6" />,
  marketplace: <ExternalLink className="size-6" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  education: "Educação",
  tools: "Ferramentas",
  insurance: "Seguros",
  fintech: "Fintechs",
  marketplace: "Marketplace",
};

export function PartnerMarketplace({ userId }: { userId: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);

  useEffect(() => {
    setPartners(PARTNERS);
  }, []);

  async function generateAffiliateLink(partnerId: string) {
    setGeneratingLink(partnerId);
    try {
      const res = await fetch("/api/affiliate/generate-link", {
        method: "POST",
        body: JSON.stringify({ userId, partnerId }),
      });
      const data = await res.json();

      // Copiar link e redirecionar
      navigator.clipboard.writeText(data.affiliateLink);
      window.open(data.affiliateLink, "_blank");
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setGeneratingLink(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Marketplace de Parceiros</h2>
        <p className="opacity-90">
          Ganhe comissão indicando ferramentas e cursos que seus colegas vão
          usar
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Parceiros Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Comissão Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(partners.reduce((a, b) => a + b.commission_rate, 0) / partners.length)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ganhos Possíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ~R$ 500/mês
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {CATEGORY_ICONS[partner.category]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{partner.name}</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {CATEGORY_LABELS[partner.category]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    {partner.commission_rate}%
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    comissão
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {partner.description}
              </p>
              <button
                onClick={() => generateAffiliateLink(partner.id)}
                disabled={generatingLink === partner.id}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {generatingLink === partner.id ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando link...
                  </>
                ) : (
                  <>
                    Gerar Link de Afiliado
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            🚀 Mais parceiros em breve: Zapier, Canva, Seguros, Contabilidade...
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Quer trazer uma plataforma que você usa? Manda sugestão pra gente!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
