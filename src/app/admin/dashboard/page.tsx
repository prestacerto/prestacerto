import { notFound, redirect } from "next/navigation";
import { RevenueDashboard } from "@/components/admin/revenue-dashboard";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Receita e produtos",
  description: "Painel privado de receita do PrestaCerto.",
  robots: { index: false, follow: false },
};

export default async function AdminRevenuePage() {
  const admin = await getAdminContext();

  if (!admin) {
    redirect("/login?next=/admin/dashboard");
  }

  if (admin.role !== "super_admin") notFound();

  return <RevenueDashboard viewer={admin.user.email ?? "Administrador"} />;
}
