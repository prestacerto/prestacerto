export type LandingJourney = 'client' | 'provider';
export type LandingLead = {
  id: string;
  journey: LandingJourney;
  name: string;
  email: string;
  whatsapp?: string;
  categoryId?: number;
  service: string;
  description?: string;
  location: string;
  deadline?: string;
  portfolio?: string;
  experience?: string;
  privacyAccepted: true;
};
export type LandingLeadValidation = { success: true; data: LandingLead } | { success: false; errors: Record<string, string> };

export function validateLandingLead(input: Record<string, unknown>): LandingLeadValidation {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { success: false, errors: { form: 'Informe os dados do formulário.' } };
  const errors: Record<string, string> = {};
  function text(field: string, label: string, max: number, required = false): string {
    const raw = input[field];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (raw != null && typeof raw !== 'string') errors[field] = `${label}: informe um texto válido.`;
    else if (required && !value) errors[field] = `Preencha ${label.toLowerCase()}.`;
    else if (value.length > max) errors[field] = `${label}: use até ${max} caracteres.`;
    return value;
  }
  const id = text('id', 'Identificador', 36, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) errors.id = 'Identificador inválido. Atualize a página e tente novamente.';
  const journey = input.journey;
  if (journey !== 'client' && journey !== 'provider') errors.journey = 'Escolha uma jornada válida.';
  const name = text('name', 'Nome', 120, true);
  if (name && name.length < 2) errors.name = 'Informe seu nome com pelo menos 2 caracteres.';
  const email = text('email', 'E-mail', 320, true).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Informe um e-mail válido.';
  const phone = text('whatsapp', 'WhatsApp', 30);
  let whatsapp: string | undefined;
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    const local = (digits.length === 12 || digits.length === 13) && digits.startsWith('55') ? digits.slice(2) : digits;
    const validPrefix = !phone.startsWith('+') || ((digits.length === 12 || digits.length === 13) && digits.startsWith('55'));
    if (!/^\+?[\d\s().-]+$/.test(phone) || !validPrefix || !/^[1-9]\d{9,10}$/.test(local)) errors.whatsapp = 'Use um número brasileiro com DDD, com ou sem +55.';
    else whatsapp = `55${local}`;
  }
  let categoryId: number | undefined;
  if (input.categoryId !== undefined && input.categoryId !== null && input.categoryId !== '') {
    const raw = typeof input.categoryId === 'string' ? input.categoryId.trim() : input.categoryId;
    if ((typeof raw !== 'string' && typeof raw !== 'number') || !/^\d+$/.test(String(raw)) || !Number.isSafeInteger(Number(raw)) || Number(raw) < 1) errors.categoryId = 'Escolha uma categoria válida.';
    else categoryId = Number(raw);
  }
  const service = text('service', journey === 'provider' ? 'Serviço oferecido' : 'Serviço desejado', 160, true);
  const description = text('description', 'Descrição do que você precisa', 5000, journey === 'client');
  const location = text('location', 'Cidade ou local de atendimento', 160, true);
  const deadline = text('deadline', 'Prazo', 120);
  const portfolio = text('portfolio', 'Link do portfólio', 2048);
  if (portfolio) {
    try {
      const url = new URL(portfolio);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) errors.portfolio = 'Use um link público começando com https:// ou http://.';
    } catch { errors.portfolio = 'Use um link completo começando com https:// ou http://.'; }
  }
  const experience = text('experience', 'Experiência', 1000);
  if (input.privacyAccepted !== true) errors.privacyAccepted = 'Leia e aceite a política de privacidade para enviar.';
  if (Object.keys(errors).length) return { success: false, errors };
  return { success: true, data: {
    id, journey: journey as LandingJourney, name, email, service, location, privacyAccepted: true,
    ...(whatsapp ? { whatsapp } : {}), ...(categoryId ? { categoryId } : {}),
    ...(description ? { description } : {}), ...(deadline ? { deadline } : {}),
    ...(portfolio ? { portfolio } : {}), ...(experience ? { experience } : {}),
  } };
}
