import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import { AdvancedDashboard } from "../advanced";

export const metadata = { title: "Admin Dashboard FODA — PrestaCerto" };

export default async function FodaDashboardPage() {
  const user = await getAuthenticatedUser();

  // Verificar se é admin
  if (!user || user.email !== "finaltest@prestacerto.com.br") {
    redirect("/");
  }

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">🔥 Dashboard FODA</h1>
        <p className="text-slate-400 mt-2">Análise completa de negócios em tempo real</p>
      </div>

      <AdvancedDashboard />
    </div>
  );
}
