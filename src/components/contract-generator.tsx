"use client";

import { useState } from "react";
import { Download, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CONTRACT_TEMPLATES, PREMIUM_ADDONS } from "@/lib/contracts";

interface ContractGeneratorProps {
  category: string;
  freelancerName: string;
  clientName: string;
}

export function ContractGenerator({ category, freelancerName, clientName }: ContractGeneratorProps) {
  const [editing, setEditing] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const template = CONTRACT_TEMPLATES[category] || CONTRACT_TEMPLATES['desenvolvimento-web'];
  const addonPrice = selectedAddons.reduce((sum, addon) => {
    const addonData = PREMIUM_ADDONS.find(a => a.name === addon);
    return sum + (addonData?.price || 0);
  }, 0);

  const downloadContract = () => {
    // Gerar PDF/DOCX com o contrato preenchido
    const contractText = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Cliente: ${clientName}
Prestador: ${freelancerName}
Categoria: ${template.category}

${template.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')}

${selectedAddons.length > 0 ? `ADITIVOS:\n${selectedAddons.join('\n')}` : ''}

Assinado digitalmente via PrestaCerto
Data: ${new Date().toLocaleDateString('pt-BR')}
    `;
    
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato-${template.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-bold flex items-center gap-2">
            <Zap className="size-5 text-blue-600" />
            {template.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{template.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contrato Gratuito */}
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold">Contrato Básico</p>
                <p className="text-sm text-slate-500 mt-1">Grátis - Inclui:</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  {template.includes.map(item => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={downloadContract}
                disabled={selectedAddons.length > 0 && addonPrice === 0}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="size-4" />
                Baixar
              </button>
            </div>
          </div>

          {/* Premium Add-ons */}
          <div>
            <p className="font-bold text-sm mb-3">Aditivos Premium (Opcionais)</p>
            <div className="space-y-2">
              {PREMIUM_ADDONS.map(addon => (
                <label key={addon.name} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAddons([...selectedAddons, addon.name]);
                      } else {
                        setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{addon.name}</p>
                    <p className="text-xs text-slate-500">{addon.description}</p>
                  </div>
                  <span className="font-bold text-sm text-green-600">R$ {addon.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          {selectedAddons.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total com aditivos</p>
                  <p className="text-2xl font-bold text-green-600">R$ {addonPrice}</p>
                </div>
                <button
                  onClick={downloadContract}
                  className="px-6 py-3 rounded bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="size-4" />
                  Baixar Contrato
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
