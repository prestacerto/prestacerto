import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type AdminContext = {
  user: {
    id: string;
    email?: string | null;
  };
  role: string;
  permissions: string[];
};

/**
 * Verifica autenticação e autorização no servidor.
 * A rota continua fechada se a tabela admin_users ainda não tiver sido criada.
 * ADMIN_EMAIL é um bootstrap opcional para o proprietário, configurado somente
 * no ambiente de produção; não deve ser exposto ao cliente.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) return null;

    const service = createServiceClient();
    const { data: adminRecord, error } = await service
      .from("admin_users")
      .select("role, permissions")
      .eq("id", user.id)
      .in("role", ["super_admin", "admin"])
      .maybeSingle();

    if (!error && adminRecord) {
      return {
        user: { id: user.id, email: user.email },
        role: adminRecord.role,
        permissions: Array.isArray(adminRecord.permissions) ? adminRecord.permissions : [],
      };
    }

    const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (configuredAdminEmail && user.email?.toLowerCase() === configuredAdminEmail) {
      return {
        user: { id: user.id, email: user.email },
        role: "super_admin",
        permissions: ["view_dashboard", "view_analytics", "manage_users", "manage_payments"],
      };
    }

    return null;
  } catch (error) {
    console.error("[admin-auth] Falha ao validar administrador:", error);
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminContext();
  if (!admin) {
    throw new Error("ADMIN_UNAUTHORIZED");
  }
  return admin;
}
