import { createServiceClient, hasServiceCredentials } from "@/lib/supabase/service";
import { SuccessStoryCard } from "@/components/success-story-card";
import { LinkButton } from "@/components/link-button";
import { ArrowRight, Sparkles } from "lucide-react";
import { getPageMetadata } from "@/lib/seo/metadata";
import { indexingRobots } from "@/lib/seo/discovery";

type SuccessStory = {
  id: string;
  title: string;
  before_price: number;
  after_price: number;
  before_month: string;
  after_month: string;
  featured: boolean;
  featured_until: string | null;
  profiles: { full_name: string };
};

export const metadata = {
  ...getPageMetadata(
    "Histórias de profissionais",
    "Espaço para relatos de profissionais sobre sua experiência no PrestaCerto.",
    "/aprenda/historias",
  ),
  // Story detail and submission routes are not published yet.
  robots: indexingRobots(false),
};

export default async function SuccessStoriesPage() {
  let stories: SuccessStory[] = [];
  if (hasServiceCredentials()) {
    const db = createServiceClient();
    const { data } = await db
      .from("success_stories")
      .select(`
        id,
        title,
        before_price,
        after_price,
        before_month,
        after_month,
        featured,
        featured_until,
        profiles!inner(full_name)
      `)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    stories = (data ?? []) as unknown as SuccessStory[];
  }

  const featuredStories = stories?.filter((s) => s.featured) ?? [];
  const regularStories = stories?.filter((s) => !s.featured) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
          <Sparkles className="size-4" />
          Experiências da comunidade
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Histórias de profissionais
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Um espaço para profissionais compartilharem sua experiência no PrestaCerto.
        </p>
      </div>

      {featuredStories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span> Destaques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredStories.map((story) => (
              <SuccessStoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                freelancer_name={story.profiles?.full_name || "Profissional"}
                before_price={story.before_price}
                after_price={story.after_price}
                before_month={story.before_month}
                after_month={story.after_month}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {regularStories.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Mais Histórias ({regularStories.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularStories.map((story) => (
              <SuccessStoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                freelancer_name={story.profiles?.full_name || "Profissional"}
                before_price={story.before_price}
                after_price={story.after_price}
                before_month={story.before_month}
                after_month={story.after_month}
              />
            ))}
          </div>
        </div>
      )}

      {!stories?.length && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ainda não há relatos publicados.
          </p>
          <LinkButton href="/dashboard">
            Acessar meu painel
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      )}

      <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
        <h2 className="text-2xl font-bold">Sua história pode estar aqui</h2>
        <p className="mt-2 opacity-90">Conte à equipe sobre sua experiência na plataforma</p>
        <LinkButton href="/contato" className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
          Falar com a equipe
        </LinkButton>
      </div>
    </div>
  );
}
