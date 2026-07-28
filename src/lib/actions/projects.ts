"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const projectSchema = z.object({
  title: z.string().min(5, "Título muito curto"),
  description: z.string().min(20, "Descreva melhor o projeto (mín. 20 caracteres)"),
  categoryId: z.coerce.number().int().positive().optional(),
  skills: z.string().optional(),
  budgetMin: z.coerce.number().positive().optional().or(z.literal("")),
  budgetMax: z.coerce.number().positive().optional().or(z.literal("")),
  deadlineDays: z.coerce.number().int().positive().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

function parseSkills(raw: string | undefined) {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProjectAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId") || undefined,
    skills: formData.get("skills"),
    budgetMin: formData.get("budgetMin") || undefined,
    budgetMax: formData.get("budgetMax") || undefined,
    deadlineDays: formData.get("deadlineDays") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    contactPhone: formData.get("contactPhone") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  if (!parsed.data.contactEmail && !parsed.data.contactPhone) {
    throw new Error("Informe pelo menos um contato: e-mail ou telefone/WhatsApp");
  }

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      client_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category_id: parsed.data.categoryId ?? null,
      skills: parseSkills(parsed.data.skills),
      budget_min: parsed.data.budgetMin || null,
      budget_max: parsed.data.budgetMax || null,
      deadline_days: parsed.data.deadlineDays || null,
    })
    .select("id")
    .single();

  if (error || !project) {
    throw new Error(error?.message ?? "Não foi possível criar o projeto");
  }

  // Contato fica numa tabela separada (`project_contacts`) de propósito — é
  // a peça que sustenta a revelação condicional (RLS na migration 0001).
  // O SELECT público em /projects e /projects/:id nunca faz join com ela.
  const { error: contactError } = await supabase.from("project_contacts").insert({
    project_id: project.id,
    contact_email: parsed.data.contactEmail || null,
    contact_phone: parsed.data.contactPhone || null,
  });

  if (contactError) {
    throw new Error(contactError.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
