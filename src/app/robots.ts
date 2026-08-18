import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.prestacerto.com.br"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services",
          "/projects",
          "/aprenda",
          "/certo-ai",
          "/como-funciona",
          "/mercado",
          "/vagas",
          "/ferramentas/",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/checkout/",
          "/setup/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
