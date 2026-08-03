import { notFound } from "next/navigation";
import { getCategories, getServiceById } from "@/lib/supabase/queries";
import {
  updateServiceAction,
  deleteServiceAction,
} from "@/app/(protected)/dashboard/services/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const [categories, service] = await Promise.all([
    getCategories(),
    getServiceById(id),
  ]);

  if (!service) {
    notFound();
  }

  const updateWithId = updateServiceAction.bind(null, id);
  const deleteWithId = deleteServiceAction.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Editar serviço</h1>
        <form action={deleteWithId}>
          <Button type="submit" nativeButton variant="ghost" size="sm">
            Excluir serviço
          </Button>
        </form>
      </div>

      <form action={updateWithId} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Título do serviço</Label>
          <Input id="title" name="title" defaultValue={service.title} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={service.description}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Categoria</Label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={service.category_id ?? ""}
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
            <Input
              id="skills"
              name="skills"
              defaultValue={(service.skills ?? []).join(", ")}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="priceHour">Preço por hora (R$, opcional)</Label>
            <Input
              id="priceHour"
              name="priceHour"
              type="number"
              step="0.01"
              defaultValue={service.price_hour ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliveryDays">Prazo de entrega (dias, opcional)</Label>
            <Input
              id="deliveryDays"
              name="deliveryDays"
              type="number"
              defaultValue={service.delivery_days ?? ""}
            />
          </div>
        </div>

        <Button type="submit" nativeButton className="w-full">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
