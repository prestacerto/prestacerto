import { createServiceClient } from "@/lib/supabase/service";
import { SuccessStoryCard } from "@/components/success-story-card";
import { LinkButton } from "@/components/link-button";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Histórias de Sucesso | PrestaCerto",
  description: "Leia histórias reais de freelancers que aumentaram seus ganhos usando PrestaCerto",
};

export default async function SuccessStoriesPage() {
  const db = createServiceClient();

  const { data: stories } = await db
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

  const featuredStories = stories?.filter((s) => s.featured) ?? [];
  const regularStories = stories?.filter((s) => !s.featured) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
          <Sparkles className="size-4" />
          Histórias Reais
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          De quanto você quer ganhar?
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Leia histórias reais de freelancers que aumentaram seus ganhos em meses usando PrestaCerto.
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
                freelancer_name={(story.profiles as any).full_name}
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
                freelancer_name={(story.profiles as any).full_name}
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
            Histórias de sucesso em breve. Seja o primeiro!
          </p>
          <LinkButton href="/dashboard">
            Começa sua história
            <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      )}

      <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
        <h2 className="text-2xl font-bold">Sua história pode estar aqui</h2>
        <p className="mt-2 opacity-90">Compartilhe como você aumentou seus ganhos</p>
        <LinkButton href="/dashboard/submit-story" className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
          Compartilhar história
        </LinkButton>
      </div>
    </div>
  );
}
