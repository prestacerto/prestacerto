import { getCategories } from "@/lib/supabase/queries";
import { createServiceAction } from "@/app/(protected)/dashboard/services/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function NewServicePage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Novo serviço</h1>
      <p className="mt-1 text-slate-500">
        Descreva o que você oferece pra aparecer na busca de clientes.
      </p>

      <form action={createServiceAction} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Título do serviço</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Desenvolvimento de landing pages em React"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Explique sua experiência, como trabalha e o que está incluso"
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
            <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
            <Input id="skills" name="skills" placeholder="React, Next.js, Tailwind" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="priceHour">Preço por hora (R$, opcional)</Label>
            <Input id="priceHour" name="priceHour" type="number" step="0.01" placeholder="120" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliveryDays">Prazo de entrega (dias, opcional)</Label>
            <Input id="deliveryDays" name="deliveryDays" type="number" placeholder="14" />
          </div>
        </div>

        <Button type="submit" nativeButton className="w-full">
          Publicar serviço
        </Button>
      </form>
    </div>
  );
}
