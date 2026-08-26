import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type ChatGPTUser = { userId: string; displayName: string; email: string; fullName: string | null };

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email');
  if (!userId || !email) return null;
  const encodedFullName = requestHeaders.get('oai-authenticated-user-full-name');
  const fullName = encodedFullName && requestHeaders.get('oai-authenticated-user-full-name-encoding') === 'percent-encoded-utf-8' ? safeDecode(encodedFullName) : null;
  return { userId, email, fullName, displayName: fullName ?? email };
}

export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect('/signin-with-chatgpt?return_to=' + encodeURIComponent(safeReturnTo(returnTo)));
}

function safeReturnTo(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  try { const url = new URL(value, 'https://app.local'); return url.origin === 'https://app.local' ? url.pathname + url.search + url.hash : '/dashboard'; }
  catch { return '/dashboard'; }
}
function safeDecode(value: string) { try { return decodeURIComponent(value); } catch { return null; } }
