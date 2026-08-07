import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { ProfileEditForm } from "@/components/dashboard/profile-edit-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProfileEditPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, headline, bio, city, state, avatar_url, resume_url, plan")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  // Views dos últimos 7 dias
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: viewsThisWeek } = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("freelancer_id", user.id)
    .gte("viewed_at", since);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          É assim que clientes e outros freelancers te enxergam na plataforma.
        </p>
      </div>

      {(viewsThisWeek ?? 0) > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm dark:border-blue-900 dark:bg-blue-950">
          <span className="font-semibold text-blue-900 dark:text-blue-300">
            Seu perfil foi visto {viewsThisWeek} {viewsThisWeek === 1 ? "vez" : "vezes"} nos últimos 7 dias
          </span>
          <span className="ml-1 text-blue-700 dark:text-blue-400">— continue atualizando!</span>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <ProfileEditForm
            userId={user.id}
            initialData={{
              full_name: profile.full_name,
              headline: profile.headline,
              bio: profile.bio,
              city: profile.city,
              state: profile.state,
              avatar_url: profile.avatar_url,
              resume_url: profile.resume_url,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
