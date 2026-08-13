"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Download } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "freelancer" | "client" | "both";
  created_at: string;
  city?: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at, city")
        .order("created_at", { ascending: false });

      setUsers(data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase())
  );

  const roleLabels = {
    freelancer: "Freelancer",
    client: "Cliente",
    both: "Ambos",
  };

  const roleColors = {
    freelancer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    client: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    both: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Usuários
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {users.length} usuários registrados
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>
            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
              <Download className="size-4 text-slate-600 dark:text-slate-400" />
            </button>
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
                      Nome
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Cidade
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Cadastrado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.full_name || "—"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            roleColors[user.role]
                          }`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.city || "—"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(user.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Nenhum usuário encontrado
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
