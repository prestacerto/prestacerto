"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trophy, Users, DollarSign } from "lucide-react";

interface ContestType {
  id: string;
  name: string;
  description: string;
  // Taxa FIXA de organizar o concurso — nunca % do prêmio. O prêmio inteiro
  // (100%) vai pro vencedor; isso é o mesmo princípio de "zero comissão"
  // que vale pro resto da plataforma, só que aplicado aqui também.
  organizationFee: number;
  examples: string[];
}

const CONTEST_TYPES: ContestType[] = [
  {
    id: "design",
    name: "Design Contest",
    description: "Logo, UI, banner, ou qualquer design",
    organizationFee: 49.9,
    examples: ["Logo design", "UI mockup", "Brand identity", "Packaging design"],
  },
  {
    id: "copy",
    name: "Copy Contest",
    description: "Taglines, headlines, ou copy de marketing",
    organizationFee: 39.9,
    examples: ["Slogan", "Email copy", "Ad headline", "Product description"],
  },
  {
    id: "dev",
    name: "Dev Contest",
    description: "Componentes, widgets, ou funcionalidades",
    organizationFee: 59.9,
    examples: ["React component", "API integration", "Feature build", "Bug fix"],
  },
  {
    id: "content",
    name: "Content Contest",
    description: "Artigos, vídeos, ou conteúdo criativo",
    organizationFee: 39.9,
    examples: ["Blog post", "Video script", "Infographic", "Podcast episode"],
  },
];

export function CreateContestModal() {
  const [step, setStep] = useState<"type" | "details">("type");
  const [selectedType, setSelectedType] = useState<ContestType | null>(null);
  const [prizeAmount, setPrizeAmount] = useState<number>(500);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fee = selectedType?.organizationFee ?? 0;
  const total = prizeAmount + fee;

  const handleCreate = async () => {
    if (!selectedType || !title || !description) return;

    setLoading(true);
    try {
      const response = await fetch("/api/monetization/contests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType.id,
          title,
          description,
          prizeAmount,
          fee,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar contest");

      const { preferenceId } = await response.json();
      // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
      if (window.mp) {
        // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
        window.mp.checkout({ preference: preferenceId });
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === "type") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">🏆 Crie um Contest</h2>
          <p className="text-slate-500 mt-1">
            Receba múltiplas soluções de freelancers competindo
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 flex gap-3">
            <Trophy className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Como Funciona</p>
              <p className="mt-1">
                Você define um prêmio, freelancers enviam soluções, você escolhe a melhor. O
                prêmio vai 100% pro vencedor — você paga só uma taxa fixa pra organizar o
                concurso.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contest Types */}
        <div className="space-y-3">
          {CONTEST_TYPES.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition ${
                selectedType?.id === type.id
                  ? "ring-2 ring-blue-600 bg-blue-50"
                  : "hover:border-slate-400"
              }`}
              onClick={() => setSelectedType(type)}
            >
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-lg">{type.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{type.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {type.examples.map((ex) => (
                    <Badge key={ex} variant="outline" className="text-xs">
                      {ex}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Taxa de organização: R$ {type.organizationFee.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => setStep("details")}
          disabled={!selectedType}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Próximo: Detalhes do Contest
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Detalhes do Contest</h2>
        <p className="text-slate-500 mt-1 text-sm">{selectedType?.name}</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Título do Contest *</label>
          <Input
            placeholder="Ex: Design de Logo Moderno"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descrição *</label>
          <textarea
            placeholder="Descreva o que você quer. Mais detalhes = melhores soluções"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Prêmio Total (R$) *</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={prizeAmount}
              onChange={(e) => setPrizeAmount(Math.max(100, parseInt(e.target.value) || 0))}
              min={100}
              step={50}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setPrizeAmount(500)}>
              R$ 500
            </Button>
            <Button variant="outline" onClick={() => setPrizeAmount(1000)}>
              R$ 1k
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Mínimo: R$ 100</p>
        </div>
      </div>

      {/* Summary */}
      <Card className="border-2 border-blue-600 bg-blue-50">
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Prêmio:</span>
            <span className="font-bold">R$ {prizeAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Taxa de organização:</span>
            <span className="font-bold">R$ {fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-slate-600">Total:</span>
            <span className="text-xl font-bold">R$ {total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep("type")}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!title || !description || loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Processando..." : "Criar e Pagar"}
        </Button>
      </div>

      <div className="flex gap-2 text-xs text-slate-600 bg-slate-100 p-3 rounded">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          O contest fica ativo imediatamente após o pagamento. Freelancers começam a enviar soluções.
        </p>
      </div>
    </div>
  );
}
