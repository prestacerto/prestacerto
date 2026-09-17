import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Valida a assinatura enviada pela Nuvemshop/Tiendanube.
 * O header oficial é x-linkedstore-hmac-sha256 e a assinatura é calculada
 * sobre o corpo bruto usando o Client Secret do app.
 */
export function verifyNuvemshopWebhook(rawBody: string, signature: string | null): boolean {
  const secret = process.env.NUVEMSHOP_CLIENT_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const received = signature.trim().toLowerCase();
  if (received.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(received, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function getNuvemshopWebhookSignature(request: Request): string | null {
  return (
    request.headers.get("x-linkedstore-hmac-sha256") ??
    request.headers.get("X-LinkedStore-Hmac-SHA256")
  );
}
