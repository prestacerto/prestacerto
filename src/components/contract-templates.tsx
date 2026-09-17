"use client";

import { Download, Copy, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  content: string;
  icon: string;
}

const TEMPLATES: ContractTemplate[] = [
  {
    id: "web-dev",
    name: "Contrato de Web Development",
    category: "Web Development",
    description: "Scopus, deliverables, payment terms, revisions",
    price: 9,
    icon: "💻",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - WEB DEVELOPMENT

PARTES:
Cliente: [CLIENTE_NOME]
Freelancer: [FREELANCER_NOME]

ESCOPO DO PROJETO:
[DESCREVER_ESCOPO]

DELIVERABLES:
- [DELIVERABLE_1]
- [DELIVERABLE_2]
- [DELIVERABLE_3]

VALOR: R$ [VALOR]
PRAZO: [DATA_ENTREGA]

TERMOS DE PAGAMENTO:
- 50% no início do projeto
- 50% na entrega final

REVISÕES INCLUÍDAS: [NUMERO] rodadas de revisão
Revisões adicionais: R$ [VALOR_EXTRA] por rodada

DIREITOS AUTORAIS:
Todos os arquivos e código desenvolvido serão de propriedade do cliente após pagamento integral.

Data: ___/___/_____
Assinado digitalmente por ambas as partes.`,
  },
  {
    id: "design",
    name: "Contrato de Design & UI/UX",
    category: "Design",
    description: "Creative brief, mockups, revisions, usage rights",
    price: 9,
    icon: "🎨",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - DESIGN

PARTES:
Cliente: [CLIENTE_NOME]
Designer: [DESIGNER_NOME]

BRIEF CRIATIVO:
[DESCREVER_PROJETO]

DELIVERABLES:
- [MOCKUPS/DESIGNS_COUNT] propostas de design
- Arquivos em Figma/Adobe XD
- Arquivo final em alta resolução

VALOR: R$ [VALOR]
PRAZO: [DATA_ENTREGA]

PROCESSO:
1. Kickoff com cliente
2. Desenvolvimento de 3 propostas
3. Feedback e iterações (até [REVISIONS] rodadas)
4. Arquivo final

DIREITOS E PROPRIEDADE:
O design original é propriedade do cliente após pagamento integral.
Designer retém o direito de exibir o trabalho em portfolio.

Data: ___/___/_____
Assinado digitalmente por ambas as partes.`,
  },
  {
    id: "copywriting",
    name: "Contrato de Copywriting & Conteúdo",
    category: "Copywriting",
    description: "Content specs, revisions, SEO optimization",
    price: 9,
    icon: "✍️",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - COPYWRITING

PARTES:
Cliente: [CLIENTE_NOME]
Copywriter: [COPYWRITER_NOME]

ESCOPO DO CONTEÚDO:
Quantidade: [QTD] peças
Tipo: [BLOG/LANDING/SOCIAL/OUTRAS]
Palavras-chave SEO: [KEYWORDS]

DELIVERABLES:
- Pesquisa de keywords e competitors
- [QTD] peças de conteúdo original
- Otimização SEO
- CTA direcionado para conversão

VALOR: R$ [VALOR]
PRAZO: [DATA_ENTREGA]

TERMOS:
- Conteúdo 100% original
- Revisões incluídas: [REVISIONS] rodadas
- Direitos autorais totais para o cliente

PROPRIEDADE INTELECTUAL:
Todo conteúdo criado é propriedade exclusiva do cliente.

Data: ___/___/_____
Assinado digitalmente por ambas as partes.`,
  },
];

export function ContractTemplates() {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (template: ContractTemplate) => {
    const element = document.createElement("a");
    const file = new Blob([template.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.id}-contrato.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          📄 Contratos Legais Prontos
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Templates profissionais para cada categoria - customize e assinale
          digitalmente
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setSelected(
                  selected === template.id ? null : template.id
                )
              }
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{template.icon}</span>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {template.description}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                    R$ {template.price}/contrato
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-600">
                  {selected === template.id ? "−" : "+"}
                </span>
                <ChevronDown
                  className={`size-5 text-slate-500 transition-transform ${
                    selected === template.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {selected === template.id && (
              <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900">
                {/* Preview */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                    {template.content}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(template.content)}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="size-4" />
                    {copied ? "✅ Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={() => handleDownload(template)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="size-4" />
                    Download
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  💡 Customize os campos [ENTRE_COLCHETES] com seus dados
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature highlights */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            ✅ Legalmente Válido
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Baseados em contratos profissionais
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            🔐 E-signature Ready
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Compatível com DocuSign, Assino, etc
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            📱 Customizável
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Adapte para seu projeto específico
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            💰 R$ 9 cada
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Ou R$ 49/mês para acesso ilimitado
          </p>
        </div>
      </div>
    </div>
  );
}
