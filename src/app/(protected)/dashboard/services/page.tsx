import Link from "next/link";
import { Briefcase, Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMyServices } from "@/lib/firebase/queries";
import {
  deleteServiceAction,
  toggleServiceActiveAction,
} from "@/app/(protected)/dashboard/services/actions";

export const metadata = { title: "Meus serviços — Dashboard PrestaCerto" };

export default async function DashboardServicesPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const services = await getMyServices(user.id);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus serviços</h1>
          <p className="mt-1 text-sm text-slate-500">
            O que você oferece — visível pra clientes em &ldquo;Serviços&rdquo;.
          </p>
        </div>
        <LinkButton href="/dashboard/services/new" size="sm">
          <Plus className="size-4" />
          Novo serviço
        </LinkButton>
      </div>

      {services.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Briefcase className="size-6" />
          </span>
          <p className="mt-4 font-medium text-slate-700">
            Você ainda não publicou nenhum serviço.
          </p>
          <LinkButton href="/dashboard/services/new" className="mt-4">
            Publicar meu primeiro serviço
          </LinkButton>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {services.map((service) => {
            const toggleAction = toggleServiceActiveAction.bind(
              null,
              service.id,
              !service.is_active
            );
            const deleteAction = deleteServiceAction.bind(null, service.id);

            return (
              <Card key={service.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Ativo" : "Pausado"}
                  </Badge>
                  <h3 className="mt-2 font-semibold text-slate-900">{service.title}</h3>
                  {service.price_hour && (
                    <p className="mt-1 text-sm text-slate-500">
                      R$ {service.price_hour}/hora
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Link>
                  <form action={toggleAction}>
                    <Button type="submit" nativeButton variant="outline" size="sm">
                      {service.is_active ? "Pausar" : "Ativar"}
                    </Button>
                  </form>
                  <form action={deleteAction}>
                    <Button type="submit" nativeButton variant="ghost" size="sm">
                      Excluir
                    </Button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
