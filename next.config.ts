import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "@" não pode ser nome literal de pasta no App Router (é reservado pra
  // parallel routes) — por isso a URL bonita /@handle é resolvida via
  // rewrite pra uma rota real em /portfolio/[handle].
  async rewrites() {
    return [{ source: "/@:handle", destination: "/portfolio/:handle" }];
  },
};

export default nextConfig;
