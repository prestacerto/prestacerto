import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().trim().min(5, 'Use pelo menos 5 caracteres no título.').max(120, 'Use até 120 caracteres no título.'),
  description: z.string().trim().min(20, 'Descreva o serviço em pelo menos 20 caracteres.').max(5000, 'Use até 5.000 caracteres na descrição.'),
  categoryId: z.coerce.number().int().positive().max(2147483647).optional(),
  skills: z.string().max(1600, 'Use até 20 habilidades.').transform(value => [...new Set(value.split(',').map(skill => skill.trim()).filter(Boolean))])
    .refine(value => value.length <= 20 && value.every(skill => skill.length <= 80), 'Use até 20 habilidades, com até 80 caracteres cada.'),
  priceHour: z.coerce.number().min(0.01, 'Informe um preço de pelo menos R$ 0,01.').max(99999999.99).optional(),
  deliveryDays: z.coerce.number().int().positive('Informe um prazo maior que zero.').max(730, 'Use um prazo de até 730 dias.').optional(),
});

export type ServiceMutationResult = { success: true; id: string } | { success: false; error: string; errors?: Record<string, string> };
export const validServiceId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
