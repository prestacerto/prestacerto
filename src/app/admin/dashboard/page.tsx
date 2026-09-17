import { redirect } from "next/navigation";

/** Keep a safe legacy URL without exposing the retired mock dashboard. */
export default function LegacyAdminDashboardPage() {
  redirect("/admin");
}
