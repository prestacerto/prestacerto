import { getCategories } from "@/lib/supabase/queries";
import { createProjectAction } from "@/lib/actions/projects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BriefAssistant } from "@/components/ai/brief-assistant";

export default async function NewProjectPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Publicar projeto</h1>
      <p className="mt-1 text-slate-500">
        Descreva o que você precisa e receba propostas de freelancers.
      </p>

      <div className="mt-6">
        <BriefAssistant />
      </div>

      <form action={createProjectAction} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Título do projeto</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Desenvolvimento de app mobile em React Native"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição detalhada</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Explique o que precisa ser feito, escopo, requisitos, expectativas"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Categoria</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills">Habilidades procuradas (separadas por vírgula)</Label>
            <Input id="skills" name="skills" placeholder="React, Next.js, Node.js" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="budgetMin">Orçamento mínimo (R$, opcional)</Label>
            <Input id="budgetMin" name="budgetMin" type="number" step="0.01" placeholder="1000" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budgetMax">Orçamento máximo (R$, opcional)</Label>
            <Input id="budgetMax" name="budgetMax" type="number" step="0.01" placeholder="5000" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deadlineDays">Prazo (dias, opcional)</Label>
            <Input id="deadlineDays" name="deadlineDays" type="number" placeholder="30" />
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Dados de contato</p>
          <p className="mt-1 text-xs text-blue-800">
            Será revelado apenas após você aceitar uma proposta
          </p>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">E-mail (obrigatório ou telefone)</Label>
              <Input id="contactEmail" name="contactEmail" type="email" placeholder="seu@email.com" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Telefone/WhatsApp (obrigatório ou e-mail)</Label>
              <Input id="contactPhone" name="contactPhone" placeholder="(11) 99999-9999" />
            </div>
          </div>
        </div>

        <Button type="submit" nativeButton className="w-full">
          Publicar projeto
        </Button>
      </form>
    </div>
  );
}
