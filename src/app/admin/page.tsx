import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Centro de comando | PrestaCerto",
  description: "Painel executivo privado do PrestaCerto.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await getAdminContext();

  if (!admin) {
    redirect("/login?next=/admin");
  }

  return <AdminDashboardClient viewer={admin.user.email ?? "Administrador"} role={admin.role} />;
}
