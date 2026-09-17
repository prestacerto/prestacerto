// Alias de /api/webhooks/assinify. A plataforma se chama "Assiny" e o webhook
// cadastrado no painel aponta para esta grafia; manter as duas evita que um
// endereço errado falhe em silêncio e a assinatura não seja aplicada.
// `dynamic` precisa ser declarado aqui: o Next.js não aceita reexportá-lo.
export const dynamic = "force-dynamic";

export { POST, GET } from "../assinify/route";
