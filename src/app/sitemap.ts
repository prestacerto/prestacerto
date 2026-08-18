import type { MetadataRoute } from "next";
import { getAllLandingCombinations } from "@/lib/data/landing-data";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.prestacerto.com.br"
).replace(/\/$/, "");

export const revalidate = 3600;

const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/services", priority: 0.95, changeFrequency: "hourly" },
  { path: "/projects", priority: 0.95, changeFrequency: "hourly" },
  { path: "/como-funciona", priority: 0.85, changeFrequency: "monthly" },
  { path: "/certo-ai", priority: 0.85, changeFrequency: "weekly" },
  { path: "/mercado", priority: 0.85, changeFrequency: "weekly" },
  { path: "/vagas", priority: 0.8, changeFrequency: "daily" },
  { path: "/aprenda", priority: 0.8, changeFrequency: "weekly" },
  { path: "/ferramentas/calculadora", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ferramentas/benchmark", priority: 0.8, changeFrequency: "weekly" },
  { path: "/plans", priority: 0.75, changeFrequency: "weekly" },
  { path: "/ajuda", priority: 0.65, changeFrequency: "monthly" },
  { path: "/contato", priority: 0.55, changeFrequency: "monthly" },
  { path: "/indicacoes", priority: 0.55, changeFrequency: "weekly" },
  { path: "/termos", priority: 0.35, changeFrequency: "yearly" },
  { path: "/privacidade", priority: 0.35, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticEntries = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const localEntries = getAllLandingCombinations().flatMap(({ categoria, cidade }) => [
    {
      url: `${SITE_URL}/contratar/${categoria}/${cidade}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/mercado/${categoria}/${cidade}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.68,
    },
  ]);

  return [...staticEntries, ...localEntries];
}
