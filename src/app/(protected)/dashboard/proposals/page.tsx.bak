"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Proposal {
  id: string;
  project_title: string;
  budget: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
  client_name: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch("/api/proposals");
        if (response.ok) {
          const data = await response.json();
          setProposals(data.proposals || []);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Minhas Propostas</h1>
        <p className="text-muted-foreground">Acompanhe suas propostas e negocie com clientes</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Carregando propostas...</p>
          </CardContent>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Você ainda não tem propostas</p>
            <p className="text-center text-sm mt-2">
              <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
                Veja projetos disponíveis →
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{proposal.project_title}</CardTitle>
                    <CardDescription>Por {proposal.client_name}</CardDescription>
                  </div>
                  <Badge className={statusColors[proposal.status]}>
                    {proposal.status === "pending" && "Pendente"}
                    {proposal.status === "accepted" && "Aceita"}
                    {proposal.status === "rejected" && "Rejeitada"}
                    {proposal.status === "withdrawn" && "Retirada"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Enviada em {new Date(proposal.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-lg font-bold">R$ {proposal.budget.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  {proposal.status === "pending" && (
                    <>
                      <Link href={`/dashboard/proposals/${proposal.id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1">
                        Retirar
                      </Button>
                    </>
                  )}
                  {proposal.status === "accepted" && (
                    <Link href={`/dashboard/proposals/${proposal.id}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        Conversar
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
