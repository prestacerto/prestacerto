// Bound both declared and streamed payloads before parsing user-controlled JSON.
export async function readJsonObject(request: Request, maxBytes = 65536): Promise<
  { data: Record<string, unknown>; response?: never } | { data?: never; response: Response }
> {
  const fail = (message: string, status: number) => ({ response: Response.json({ error: message }, { status }) });
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return fail('Envie os dados em formato JSON.', 415);
  }
  if (Number(request.headers.get('content-length')) > maxBytes) return fail('Os dados excedem o tamanho permitido.', 413);
  const reader = request.body?.getReader();
  if (!reader) return fail('Preencha os dados da solicitação.', 400);
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return fail('Os dados excedem o tamanho permitido.', 413);
      }
      chunks.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('Confira os dados enviados.', 400);
    return { data: data as Record<string, unknown> };
  } catch {
    return fail('Não foi possível ler os dados enviados.', 400);
  } finally {
    reader.releaseLock();
  }
}
