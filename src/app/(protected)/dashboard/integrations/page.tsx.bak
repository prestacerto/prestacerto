import Link from "next/link";
import { CheckCircle2, Calendar, HardDrive, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoogleDisconnectButton } from "@/components/dashboard/google-connect-button";

export default async function IntegrationsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createClient();
  const [{ data: googleConn }, { data: nuvemshopConn }] = await Promise.all([
    supabase
      .from("google_connections")
      .select("google_email")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("nuvemshop_connections")
      .select("store_name")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte suas ferramentas pra turbinar o fluxo de trabalho dentro da
          plataforma.
        </p>
      </div>

      {/* Google */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-semibold">Google</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Google Calendar
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="size-3.5" />
              Google Drive
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ao aceitar uma proposta, criamos automaticamente um evento no
            Google Calendar com o prazo e uma pasta compartilhada no Drive pra
            entrega dos arquivos.
          </p>

          {googleConn ? (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
                <CheckCircle2 className="size-4" />
                Conectado como <strong>{googleConn.google_email}</strong>
              </div>
              <GoogleDisconnectButton />
            </div>
          ) : (
            <Link
              href="/api/integrations/google/start"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Conectar com Google
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Nuvemshop */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Store className="size-5 text-blue-600" />
            <span className="font-semibold">Nuvemshop</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Conecte sua loja Nuvemshop pra contratar freelancers direto do
            painel — sem copiar e colar links.
          </p>

          {nuvemshopConn ? (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
              <CheckCircle2 className="size-4" />
              Loja conectada: <strong>{nuvemshopConn.store_name ?? "—"}</strong>
            </div>
          ) : (
            <Link
              href="/api/integrations/nuvemshop/start"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Store className="size-4 text-blue-600" />
              Conectar loja
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
