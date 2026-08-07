import type { MetadataRoute } from "next";
import { getAllLandingCombinations } from "@/lib/data/landing-data";
import { APRENDA_CARDS } from "@/lib/data/aprenda-cards";
import { createServiceClient } from "@/lib/supabase/service";

const BASE_URL = "https://prestacerto.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = createServiceClient();

  const [{ data: profiles }, { data: services }, { data: projects }] = await Promise.all([
    db.from("profiles").select("id, updated_at").in("role", ["freelancer", "both"]),
    db.from("services").select("id, updated_at").eq("is_active", true),
    db.from("projects").select("id, updated_at").eq("status", "open"),
  ]);

  const now = new Date().toISOString();

  // Páginas estáticas principais
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/services`,                lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE_URL}/projects`,                lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE_URL}/mercado`,                 lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${BASE_URL}/ferramentas/benchmark`,   lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${BASE_URL}/aprenda`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${BASE_URL}/ferramentas/calculadora`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/como-funciona`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/plans`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
  ];

  // 105 landing pages por nicho + cidade
  const landingPages: MetadataRoute.Sitemap = getAllLandingCombinations().map(({ categoria, cidade }) => ({
    url: `${BASE_URL}/contratar/${categoria}/${cidade}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // 105 páginas de dados de mercado por nicho + cidade
  const mercadoLocalPages: MetadataRoute.Sitemap = getAllLandingCombinations().map(({ categoria, cidade }) => ({
    url: `${BASE_URL}/mercado/${categoria}/${cidade}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Cards da seção Aprenda
  const aprendaPages: MetadataRoute.Sitemap = APRENDA_CARDS.map((card) => ({
    url: `${BASE_URL}/aprenda/${card.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  // Perfis públicos de freelancers
  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${BASE_URL}/profile/${p.id}`,
    lastModified: p.updated_at ?? now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Serviços ativos
  const servicePages: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
    url: `${BASE_URL}/services/${s.id}`,
    lastModified: s.updated_at ?? now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  // Projetos abertos
  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: p.updated_at ?? now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...landingPages,
    ...mercadoLocalPages,
    ...aprendaPages,
    ...profilePages,
    ...servicePages,
    ...projectPages,
  ];
}
