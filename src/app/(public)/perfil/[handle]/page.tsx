import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { Star, MapPin, MessageSquare, Clock } from "lucide-react";
import { BadgesDisplay } from "@/components/badges-display";
import { LinkButton } from "@/components/link-button";

export const revalidate = 3600;

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const db = createServiceClient();

  const { data: profile } = await db
    .from("profiles")
    .select("id, full_name, headline, bio, city, state, rating, rating_count, badges, verified_senior")
    .eq("username", handle)
    .single();

  if (!profile) notFound();

  const [{ data: services }, { data: projects }] = await Promise.all([
    db.from("services").select("id, title, description, price_hour, rating").eq("profile_id", profile.id).limit(6),
    db.from("projects").select("id, title, description, skills").eq("profile_id", profile.id).eq("status", "completed").limit(3),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-700" />
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative pb-12">
        <div className="rounded-xl bg-white dark:bg-slate-900 shadow-xl p-8">
          <h1 className="text-3xl font-black">{profile.full_name}</h1>
          {profile.headline && <p className="text-lg text-blue-600 font-semibold mt-1">{profile.headline}</p>}
          
          <div className="flex flex-wrap gap-6 mt-6">
            {profile.city && <div className="flex items-center gap-2"><MapPin className="size-4" />{profile.city}, {profile.state}</div>}
            <div className="flex items-center gap-2">
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
              {profile.rating?.toFixed(1)} ★ ({profile.rating_count})
            </div>
          </div>

          {profile.badges && <div className="mt-6"><BadgesDisplay badges={profile.badges} size="md" /></div>}

          <div className="flex gap-3 mt-8">
            <LinkButton href={`/dashboard/hire/${profile.id}`} className="bg-blue-600">Contratar</LinkButton>
          </div>
        </div>

        {services && services.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6">Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="rounded-lg border p-6">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{s.description}</p>
                  <div className="flex justify-between mt-4">
                    <span className="font-bold text-blue-600">R$ {s.price_hour}/h</span>
                    {s.rating && <span>{s.rating.toFixed(1)} ★</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6">Portfólio</h2>
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="rounded-lg bg-white dark:bg-slate-900 border p-6">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-slate-600 mt-2">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
