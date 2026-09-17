import { notFound, redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/service";
import { getNoIndexMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const metadata = getNoIndexMetadata("Partner — indicações e Pix");

export default async function AdminReferralsPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/login?next=/admin/referrals");
  if (admin.role !== "super_admin") notFound();

  const db = createServiceClient();
  const { data: referrals } = await db
    .from("referrals")
    .select("id, referrer_id, referee_id, reward, status, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const ids = Array.from(new Set((referrals ?? []).flatMap((row) => [row.referrer_id, row.referee_id])));
  const { data: profiles } = ids.length
    ? await db.from("profiles").select("id, full_name, email").in("id", ids)
    : { data: [] };
  const byId = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Área privada</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Partner PrestaCerto</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Fila para validar conversões e contactar quem indicou antes de fazer o Pix. Esta página é restrita a administradores.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-3">Indicação</th><th className="px-4 py-3">Plano / valor</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Contato</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(referrals ?? []).map((row) => {
              const referrer = byId.get(row.referrer_id);
              const referee = byId.get(row.referee_id);
              return <tr key={row.id}>
                <td className="px-4 py-4"><div className="font-semibold text-slate-900">{referrer?.full_name ?? "Indicador"} indicou {referee?.full_name ?? "novo usuário"}</div><div className="mt-1 text-xs text-slate-500">Registro direto e único</div></td>
                <td className="px-4 py-4 font-semibold text-slate-900">R$ {Number(row.reward ?? 0).toFixed(2).replace(".", ",")}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{row.status ?? "pending"}</span></td>
                <td className="px-4 py-4 text-slate-600">{referrer?.email ?? "Contato não disponível"}</td>
              </tr>;
            })}
          </tbody>
        </table>
        {(!referrals || referrals.length === 0) && <p className="p-8 text-center text-sm text-slate-500">Nenhuma indicação registrada.</p>}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">O administrador deve confirmar a conversão, conferir antifraude e registrar o Pix em um fluxo idempotente antes de marcar a recompensa como paga.</p>
    </main>
  );
}
