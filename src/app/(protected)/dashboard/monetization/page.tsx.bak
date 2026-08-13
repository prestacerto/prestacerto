import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Monetização | PrestaCerto",
  description: "Ative planos premium para aumentar sua visibilidade",
};

export default async function MonetizationPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monetização</h1>
        <p className="text-muted-foreground">Aumente sua visibilidade com planos premium</p>
      </div>

      <div className="rounded-lg border p-6 bg-card">
        <h2 className="text-xl font-bold mb-2">Planos Premium</h2>
        <p className="text-sm text-muted-foreground">
          Aumente sua visibilidade e ganhe mais propostas com nossos planos premium
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Destaque de Projetos</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Apareça no topo das buscas e receba muito mais propostas
        </p>
        {/* Aqui você adicionaria os cards de projeto destacado */}
      </div>

      <div className="rounded-lg border border-dashed p-6 bg-muted/50">
        <h3 className="font-bold">📊 Próximas features</h3>
        <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
          <li>✨ Conectar/Propostas Limitadas (R$ 600k/ano)</li>
          <li>⚡ Priority Queue (R$ 150k/ano)</li>
          <li>🎓 Cursos & Certificações</li>
          <li>🏆 Contests & Desafios</li>
        </ul>
      </div>
    </div>
  );
}
