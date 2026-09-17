"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { serviceSchema, validServiceId, type ServiceMutationResult } from '@/lib/services/validation';

function parseForm(formData: FormData) {
  return serviceSchema.safeParse({
    title: formData.get('title'), description: formData.get('description'),
    categoryId: formData.get('categoryId') || undefined, skills: formData.get('skills') || '',
    priceHour: formData.get('priceHour') || undefined, deliveryDays: formData.get('deliveryDays') || undefined,
  });
}
function refreshService(id: string) {
  revalidatePath('/services'); revalidatePath(`/services/${id}`);
  revalidatePath('/dashboard'); revalidatePath('/dashboard/services');
  revalidatePath(`/dashboard/services/${id}/edit`);
}

async function saveService(formData: FormData, serviceId?: string): Promise<ServiceMutationResult> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Entre na sua conta para salvar o serviço. Seus dados foram mantidos.' };
    if (serviceId !== undefined && !validServiceId(serviceId)) return { success: false, error: 'Serviço inválido.' };
    const parsed = parseForm(formData);
    if (!parsed.success) return { success: false, error: 'Revise os campos indicados.', errors: Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])) };
    const { title, description, categoryId, skills, priceHour, deliveryDays } = parsed.data;
    const payload = { title, description, category_id: categoryId ?? null, skills, price_hour: priceHour == null ? null : Math.round(priceHour * 100) / 100, delivery_days: deliveryDays ?? null };
    // Authenticated client retains ownership RLS; no service-role bypass.
    const supabase = await createClient();
    const query = serviceId
      ? supabase.from('services').update(payload).eq('id', serviceId).eq('freelancer_id', user.id)
      : supabase.from('services').insert({ ...payload, freelancer_id: user.id });
    const { data, error } = await query.select('id').maybeSingle();
    if (error || !data) return { success: false, error: 'Não foi possível salvar o serviço. Confira a categoria e tente novamente; seus dados foram mantidos.' };
    refreshService(data.id);
    return { success: true, id: data.id };
  } catch { return { success: false, error: 'A conexão falhou. Seus dados foram mantidos para tentar novamente.' }; }
}

export async function createServiceAction(formData: FormData): Promise<ServiceMutationResult> { return saveService(formData); }
export async function updateServiceAction(serviceId: string, formData: FormData): Promise<ServiceMutationResult> { return saveService(formData, serviceId); }

async function changeService(serviceId: string, active?: boolean): Promise<ServiceMutationResult> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Entre na sua conta para gerenciar o serviço.' };
    if (!validServiceId(serviceId)) return { success: false, error: 'Serviço inválido.' };
    const supabase = await createClient();
    const query = active === undefined ? supabase.from('services').delete() : supabase.from('services').update({ is_active: active });
    const { data, error } = await query.eq('id', serviceId).eq('freelancer_id', user.id).select('id').maybeSingle();
    if (error || !data) return { success: false, error: 'Não foi possível alterar este serviço. Atualize a página e tente novamente.' };
    refreshService(data.id);
    return { success: true, id: data.id };
  } catch { return { success: false, error: 'A conexão falhou. Tente novamente.' }; }
}

export async function deleteServiceAction(serviceId: string): Promise<ServiceMutationResult> { return changeService(serviceId); }
export async function toggleServiceActiveAction(serviceId: string, isActive: boolean): Promise<ServiceMutationResult> {
  if (typeof isActive !== 'boolean') return { success: false, error: 'Status inválido.' };
  return changeService(serviceId, isActive);
}
