"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

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
  const user = await getAuthenticatedUser();
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
    // MVP: validação detalhada fica no client; aqui só uma rede de segurança.
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    freelancer_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    category_id: parsed.data.categoryId ?? null,
    skills: parseSkills(parsed.data.skills),
    price_hour: parsed.data.priceHour || null,
    delivery_days: parsed.data.deliveryDays || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/services");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateServiceAction(serviceId: string, formData: FormData) {
  const user = await getAuthenticatedUser();
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

  const supabase = await createClient();
  // RLS garante que só o dono (`freelancer_id = auth.uid()`) consegue editar.
  const { error } = await supabase
    .from("services")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      category_id: parsed.data.categoryId ?? null,
      skills: parseSkills(parsed.data.skills),
      price_hour: parsed.data.priceHour || null,
      delivery_days: parsed.data.deliveryDays || null,
    })
    .eq("id", serviceId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/services");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteServiceAction(serviceId: string) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  // RLS garante que só o dono (`freelancer_id = auth.uid()`) consegue apagar.
  await supabase.from("services").delete().eq("id", serviceId);

  revalidatePath("/services");
  revalidatePath("/dashboard");
}
