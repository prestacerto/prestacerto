import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { Star, MapPin } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url, rating, rating_count")
    .eq("custom_username", params.handle)
    .single();

  if (!profile)
    return {
      title: "Perfil não encontrado",
    };

  return {
    title: `${profile.full_name} | PrestaCerto`,
    description:
      profile.bio || `Freelancer no PrestaCerto com ${profile.rating_count} avaliações`,
    openGraph: {
      title: profile.full_name,
      description: profile.bio,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
      type: "profile",
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, city, state, rating, rating_count, has_premium_portfolio")
    .eq("custom_username", params.handle)
    .single();

  if (!profile) return <div className="p-4">Perfil não encontrado</div>;

  const { data: services } = await supabase
    .from("services")
    .select("id, title, description, rating, delivery_days, price_hour")
    .eq("freelancer_id", profile.id)
    .eq("is_active", true);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start gap-6 mb-8">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-32 h-32 rounded-full" />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{profile.full_name}</h1>
            {profile.city && (
              <div className="flex items-center gap-1 text-gray-600 mt-2">
                <MapPin size={18} />
                {profile.city}, {profile.state}
              </div>
            )}
            {profile.rating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {Array(Math.round(profile.rating)).fill(0).map((_, i) => (
                    <Star key={i} size={16} fill="gold" stroke="gold" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {profile.rating.toFixed(1)} ({profile.rating_count} avaliações)
                </span>
              </div>
            )}
            {profile.has_premium_portfolio && (
              <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                ⭐ Premium
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3">Sobre</h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {services && services.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Serviços ({services.length})</h2>
            <div className="grid gap-4">
              {services.map((s) => (
                <div key={s.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{s.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    {s.price_hour && <span className="text-lg font-bold">R$ {s.price_hour}/h</span>}
                    {s.delivery_days && <span className="text-sm text-gray-500">Entrega em {s.delivery_days} dias</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
