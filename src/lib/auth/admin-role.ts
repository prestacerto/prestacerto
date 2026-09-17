// Read only after auth.getUser() verifies the user on the server. Supabase
// app_metadata is writable by administrators; user_metadata is not trusted.
export function hasOwnerGrant(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.prestacerto_admin_role === 'super_admin';
}
