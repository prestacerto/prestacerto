"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, CheckCircle2 } from "lucide-react";

interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  proposed_price: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  created_at: string;
  freelancer?: { full_name: string; email: string };
  project?: { title: string; category_id: string };
}

export default function PropostasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("accepted");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      const { data } = await supabase
        .from("proposals")
        .select(`
          id,
          project_id,
          freelancer_id,
          proposed_price,
          status,
          created_at,
          profiles!freelancer_id(full_name, email),
          projects!inner(title, category_id)
        `)
        .order("created_at", { ascending: false })
        .limit(200);

      setProposals(
        data?.map((p: any) => ({
          ...p,
          freelancer: p.profiles,
          project: p.projects,
        })) || []
      );
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.freelancer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.project?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "todos" || p.status === filter;

    return matchesSearch && matchesFilter;
  });

  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;
  const totalValue = proposals
    .filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + p.proposed_price, 0);

  const statusLabels = {
    pending: "Aguardando",
    accepted: "Aceito",
    rejected: "Rejeitado",
    completed: "Concluído",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Propostas Fechadas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Matches entre freelancers e clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Propostas Aceitas
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {acceptedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Valor em Propostas
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              R$ {totalValue.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Propostas
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {proposals.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por freelancer ou projeto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-4 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
            >
              <option value="todos">Todas</option>
              <option value="pending">Aguardando</option>
              <option value="accepted">Aceito</option>
              <option value="completed">Concluído</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Freelancer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Projeto
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProposals.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {proposal.freelancer?.full_name || "—"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {proposal.freelancer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {proposal.project?.title || "—"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          R$ {proposal.proposed_price.toLocaleString("pt-BR")}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            statusColors[proposal.status]
                          }`}
                        >
                          {proposal.status === "accepted" && (
                            <CheckCircle2 className="size-3" />
                          )}
                          {statusLabels[proposal.status]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(proposal.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProposals.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Nenhuma proposta encontrada
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
