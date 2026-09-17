import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Criptografa credenciais de terceiros (hoje: access/refresh token do
// Mercado Pago em `mp_connections`) antes de gravar no banco. Um vazamento
// do banco ou da service role key não deve expor essas credenciais em texto
// puro — são tokens de pagamento reais de cada freelancer conectado.
//
// AES-256-GCM: IV aleatório de 12 bytes + auth tag de 16 bytes por valor,
// tudo empacotado num único base64 (`iv.authTag.ciphertext`).

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.MP_TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "MP_TOKEN_ENCRYPTION_KEY não configurada — necessária para criptografar credenciais do Mercado Pago."
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      "MP_TOKEN_ENCRYPTION_KEY inválida — deve ser uma chave de 32 bytes em base64 (gere com `openssl rand -base64 32`)."
    );
  }
  return key;
}

export function encryptSecret(plainText: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((part) => part.toString("base64")).join(".");
}

export function decryptSecret(packed: string): string {
  const key = getKey();
  const [ivB64, authTagB64, dataB64] = packed.split(".");
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error("Valor criptografado malformado.");
  }
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const data = Buffer.from(dataB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
