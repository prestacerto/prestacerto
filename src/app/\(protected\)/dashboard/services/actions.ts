"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/firebase/auth";
import {
  createService,
  updateService,
  deleteService,
} from "@/lib/firebase/queries";

const serviceSchema = z.object({
  title: z.string().min(5, "Título muito curto"),
  description: z.string().min(20, "Descreva melhor o serviço (mín. 20 caracteres)"),
  categoryId: z.coerce.number().int().positive().optional(),
  skills: z.string().optional(),
  priceHour: z.coerce.number().positive().optional().or(z.literal("")),
  deliveryDays: z.coerce.number().int().positive().optional().or(z.literal("")),
});

function parseSkills(raw: string | undefined) {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createServiceAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId") || undefined,
    skills: formData.get("skills"),
    priceHour: formData.get("priceHour") || undefined,
    deliveryDays: formData.get("deliveryDays") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  try {
    await createService({
      freelancer_id: user.uid,
      title: parsed.data.title,
      description: parsed.data.description,
      category_id: parsed.data.categoryId ?? undefined,
      skills: parseSkills(parsed.data.skills),
      price_hour: parsed.data.priceHour || undefined,
      delivery_days: parsed.data.deliveryDays || undefined,
      rating_count: 0,
      is_active: true,
      created_at: Date.now(),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar serviço"
    );
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function updateServiceAction(serviceId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId") || undefined,
    skills: formData.get("skills"),
    priceHour: formData.get("priceHour") || undefined,
    deliveryDays: formData.get("deliveryDays") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  try {
    await updateService(serviceId, {
      title: parsed.data.title,
      description: parsed.data.description,
      category_id: parsed.data.categoryId ?? undefined,
      skills: parseSkills(parsed.data.skills),
      price_hour: parsed.data.priceHour || undefined,
      delivery_days: parsed.data.deliveryDays || undefined,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar serviço"
    );
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function deleteServiceAction(serviceId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await deleteService(serviceId);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao deletar serviço"
    );
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function toggleServiceActiveAction(serviceId: string, isActive: boolean) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await updateService(serviceId, { is_active: isActive });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar serviço"
    );
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/services");
}
