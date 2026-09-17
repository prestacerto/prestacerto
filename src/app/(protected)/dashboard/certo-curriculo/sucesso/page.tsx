import { redirect } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createServiceClient } from "@/lib/supabase/service";
import { ConfirmedPurchaseTracker } from "@/components/confirmed-purchase-tracker";

export const dynamic = "force-dynamic";

export default async function CertoCurriculoSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/dashboard/certo-curriculo");
  const { session_id } = await searchParams;
  let confirmed = false;
  let orderId: string | null = null;
  if (session_id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const service = createServiceClient();
    const { data } = await service.from("certo_resume_orders").select("id").eq("user_id", user.id).eq("stripe_session_id", session_id).eq("status", "paid").maybeSingle();
    confirmed = Boolean(data);
    orderId = data?.id ?? null;
  }

  return <div className="mx-auto max-w-xl py-10 text-center">
    {confirmed ? <><ConfirmedPurchaseTracker transactionId={orderId!} value={19.9} /><CheckCircle2 className="mx-auto size-12 text-emerald-600" /><h1 className="mt-5 text-3xl font-black text-slate-950">Pagamento confirmado.</h1><p className="mt-3 leading-7 text-slate-600">Seu acesso ao Certo Currículo está confirmado. A etapa de envio e revisão será liberada conforme a configuração do produto.</p></> : <><Clock3 className="mx-auto size-12 text-blue-600" /><h1 className="mt-5 text-3xl font-black text-slate-950">Estamos confirmando o pagamento.</h1><p className="mt-3 leading-7 text-slate-600">O acesso só é liberado depois da confirmação pelo Stripe. Atualize esta página em alguns instantes.</p></>}
  </div>;
}
