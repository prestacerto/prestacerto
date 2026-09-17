"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Lock, CheckCircle, Clock, AlertCircle } from "lucide-react";

const contracts = [
  {
    id: "1",
    projectTitle: "Website Redesign - E-commerce",
    clientName: "Tech Store Brasil",
    freelancerName: "João Dev",
    status: "active",
    value: 8000,
    escrowStatus: "secured", // dinheiro bloqueado na plataforma
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    milestonePaid: 1,
    totalMilestones: 3,
    description: "Redesenho completo do website com integração de checkout",
  },
  {
    id: "2",
    projectTitle: "App Mobile - SaaS Dashboard",
    clientName: "StartUp XYZ",
    freelancerName: "Maria Designer",
    status: "pending_signature",
    value: 12000,
    escrowStatus: "pending",
    startDate: "2026-09-15",
    endDate: "2026-11-14",
    milestonePaid: 0,
    totalMilestones: 4,
    description: "Desenvolvimento de app mobile com React Native",
  },
  {
    id: "3",
    projectTitle: "Consultoria Cloud - AWS",
    clientName: "Corp Systems",
    freelancerName: "Carlos Backend",
    status: "completed",
    value: 6500,
    escrowStatus: "released",
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    milestonePaid: 2,
    totalMilestones: 2,
    description: "Arquitetura e consultoria de infraestrutura cloud",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800";
    case "pending_signature":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Em Andamento";
    case "pending_signature":
      return "Aguardando Assinatura";
    case "completed":
      return "Concluído";
    default:
      return "Desconhecido";
  }
};

const getEscrowColor = (status: string) => {
  switch (status) {
    case "secured":
      return "bg-green-50 border-green-200";
    case "pending":
      return "bg-yellow-50 border-yellow-200";
    case "released":
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-gray-50";
  }
};

export default function ContractsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Contratos Digitais
        </h1>
        <p className="text-muted-foreground">
          Crie, assine e gerencie contratos com segurança de pagamento em escrow
        </p>
      </div>

      {/* Como Funciona */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Como Funciona o Escrow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="font-bold mb-2">1. Contrato Criado</p>
              <p className="text-sm">Cliente cria contrato na plataforma</p>
            </div>
            <div>
              <p className="font-bold mb-2">2. Pagamento Bloqueado</p>
              <p className="text-sm">Valor é bloqueado no escrow (seguro)</p>
            </div>
            <div>
              <p className="font-bold mb-2">3. Trabalho Realizado</p>
              <p className="text-sm">Freelancer executa as tarefas</p>
            </div>
            <div>
              <p className="font-bold mb-2">4. Liberado</p>
              <p className="text-sm">Cliente aprova → Freelancer recebe</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor em Escrow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">R$ 8.000</div>
            <p className="text-xs text-green-600">Garantido pela plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recebido este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 6.500</div>
            <p className="text-xs text-muted-foreground">1 contrato finalizado</p>
          </CardContent>
        </Card>
      </div>

      {/* Contratos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Meus Contratos</h2>
        {contracts.map((contract) => (
          <Card
            key={contract.id}
            className={`border-2 ${getEscrowColor(contract.escrowStatus)}`}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{contract.projectTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {contract.freelancerName} ↔ {contract.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {contract.value.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(contract.status)}>
                    {getStatusLabel(contract.status)}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={
                      contract.escrowStatus === "secured"
                        ? "bg-green-100 text-green-800"
                        : contract.escrowStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {contract.escrowStatus === "secured" && (
                      <>
                        <Lock className="h-3 w-3 mr-1" /> Valor Garantido
                      </>
                    )}
                    {contract.escrowStatus === "pending" && (
                      <>
                        <Clock className="h-3 w-3 mr-1" /> Aguardando Pagamento
                      </>
                    )}
                    {contract.escrowStatus === "released" && (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Liberado
                      </>
                    )}
                  </Badge>
                </div>

                {/* Descrição */}
                <p className="text-sm text-muted-foreground">{contract.description}</p>

                {/* Timeline */}
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Início</p>
                    <p className="text-muted-foreground">
                      {new Date(contract.startDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div>
                    <p className="font-semibold">Fim</p>
                    <p className="text-muted-foreground">
                      {new Date(contract.endDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="font-semibold">Marcos</p>
                    <p className="text-muted-foreground">
                      {contract.milestonePaid}/{contract.totalMilestones} pagos
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(contract.milestonePaid / contract.totalMilestones) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">Ver Contrato</Button>
                  {contract.status === "pending_signature" && (
                    <Button variant="outline" className="flex-1">
                      Assinar Contrato
                    </Button>
                  )}
                  {contract.status === "active" && (
                    <Button variant="outline" className="flex-1">
                      Enviar Milestone
                    </Button>
                  )}
                  {contract.status === "completed" && (
                    <Button variant="outline" className="flex-1" disabled>
                      Concluído
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Novo Contrato */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Contrato</CardTitle>
          <CardDescription>
            Inicie um novo contrato com proteção de escrow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">+ Criar Contrato Digital</Button>
        </CardContent>
      </Card>

      {/* Proteção */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">🛡️ Proteção Total</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Pagamento bloqueado até aprovação do trabalho</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Contrato assinado digitalmente (força legal)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Disputa resolvida pela plataforma em 5 dias</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Zero comissão em contratos via escrow</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
