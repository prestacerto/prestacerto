import Link from "next/link";
import { CheckCircle2, Store } from "lucide-react";
import { getCategories } from "@/lib/supabase/queries";
import { createProjectAction } from "@/lib/actions/projects";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function NuvemshopIntegrationPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createClient();
  const [{ data: connection }, categories] = await Promise.all([
    supabase
      .from("nuvemshop_connections")
      .select("store_name, store_id")
      .eq("user_id", user.id)
      .maybeSingle(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
          <Store className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            PrestaCerto para lojistas
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contrate serviços para sua loja
          </h1>
        </div>
      </div>

      {connection ? (
        <Card className="mt-6 border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40">
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Loja conectada: <strong>{connection.store_name ?? connection.store_id}</strong>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
          <CardContent className="pt-6 text-sm text-blue-950 dark:text-blue-100">
            <p>
              Conecte sua loja Nuvemshop para enviar uma demanda ao PrestaCerto sem sair do fluxo da sua operação.
            </p>
            <Link
              href="/api/integrations/nuvemshop/start"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Conectar minha loja
            </Link>
          </CardContent>
        </Card>
      )}

      <p className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Explique o que sua loja precisa — fotos de produto, design, tráfego pago, automação ou integração — e receba propostas de profissionais dentro do marketplace.
      </p>

      <form action={createProjectAction} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do projeto</Label>
          <Input id="title" name="title" placeholder="Ex.: Fotos de produto para minha loja Nuvemshop" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">O que precisa ser feito?</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            placeholder="Descreva o escopo, os produtos envolvidos, referências, prazo e resultado esperado."
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Habilidades procuradas</Label>
            <Input id="skills" name="skills" placeholder="Fotografia, Photoshop, tráfego" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="budgetMin">Orçamento mínimo</Label>
            <Input id="budgetMin" name="budgetMin" type="number" step="0.01" min="0" placeholder="500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budgetMax">Orçamento máximo</Label>
            <Input id="budgetMax" name="budgetMax" type="number" step="0.01" min="0" placeholder="2000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadlineDays">Prazo em dias</Label>
            <Input id="deadlineDays" name="deadlineDays" type="number" min="1" placeholder="15" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground">Contato protegido</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            O contato só fica disponível conforme as regras da contratação. A conversa inicial permanece dentro do PrestaCerto.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">E-mail</Label>
              <Input id="contactEmail" name="contactEmail" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input id="contactPhone" name="contactPhone" placeholder="(11) 99999-9999" />
            </div>
          </div>
        </div>

        <Button type="submit" nativeButton className="w-full sm:w-auto">
          Publicar projeto
        </Button>
      </form>
    </div>
  );
}
