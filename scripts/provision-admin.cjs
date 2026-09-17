// Explicit, one-off server administration. No browser endpoint, credentials in
// source, or email-based signup promotion. In ordinary builds this is a no-op.
// Build-only variables allow the existing private production credential to stay
// inside the hosting environment. Never put these variables in NEXT_PUBLIC_*.
const { createClient } = require('@supabase/supabase-js');

async function main() {
  if (process.env.PRESTA_PROVISION_ADMIN !== 'true') return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secret = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const email = process.env.PRESTA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.PRESTA_ADMIN_PASSWORD;
  if (url !== 'https://taktwwwpcyxhyylzmgho.supabase.co' || !secret || !anon
    || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 8) {
    throw new Error('Invalid or missing provisioning configuration');
  }
  const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
  const admin = createClient(url, secret, options);
  const session = createClient(url, anon, options);
  let account;
  // The operator explicitly supplies the account and desired credential.
  // Preserve all unrelated metadata when granting an existing account access.
  const login = await session.auth.signInWithPassword({ email, password });
  if (login.data.user) {
    account = login.data.user;
    const { data, error } = await admin.auth.admin.getUserById(account.id);
    if (error || !data.user) throw new Error('Administrative credential rejected');
    const granted = await admin.auth.admin.updateUserById(account.id, {
      app_metadata: { ...data.user.app_metadata, prestacerto_admin_role: 'super_admin' },
    });
    if (granted.error) throw new Error('Administrator grant failed');
  } else {
    const result = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      app_metadata: { prestacerto_admin_role: 'super_admin' },
      user_metadata: { full_name: 'Administrador', role: 'client' },
    });
    if (result.error?.code === 'email_exists' && process.env.PRESTA_ADMIN_UPDATE_EXISTING === 'true') {
      // Only the specifically authorized email is changed. Never print the
      // directory or give access based on a caller-supplied UUID.
      for (let page = 1; page <= 100 && !account; page++) {
        const listed = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (listed.error) throw new Error('Administrator directory lookup failed');
        account = listed.data.users.find(user => user.email?.toLowerCase() === email);
        if (listed.data.users.length < 1000) break;
      }
      if (!account) throw new Error('Existing administrator account could not be identified');
      const granted = await admin.auth.admin.updateUserById(account.id, {
        password,
        app_metadata: { ...account.app_metadata, prestacerto_admin_role: 'super_admin' },
      });
      if (granted.error) throw new Error('Existing administrator update failed');
    } else {
      if (result.error || !result.data.user) throw new Error(`Administrator creation failed (${result.error?.code || 'unknown'})`);
      account = result.data.user;
    }
  }
  await session.auth.signOut({ scope: 'local' });
  const verification = await session.auth.signInWithPassword({ email, password });
  if (verification.error || verification.data.user?.id !== account.id) throw new Error('Administrator login verification failed');
  const verified = await session.auth.getUser();
  if (verified.error || verified.data.user?.app_metadata?.prestacerto_admin_role !== 'super_admin') {
    throw new Error('Administrator permission verification failed');
  }
  await session.auth.signOut({ scope: 'local' });
  console.log('[admin-provision] Account and administrator login verified. No password logged.');
}
main().catch(error => { console.error('[admin-provision]', error.message); process.exitCode = 1; });
