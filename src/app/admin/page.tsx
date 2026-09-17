import { redirect, notFound } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Painel do dono",
  description: "Painel executivo privado do PrestaCerto.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await getAdminContext();

  if (!admin) {
    redirect("/login?next=/admin");
  }

  if (admin.role !== "super_admin") notFound();

  return <AdminDashboardClient viewer={admin.user.email ?? "Administrador"} role={admin.role} />;
}
