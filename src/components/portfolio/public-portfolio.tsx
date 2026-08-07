"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Link2, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioData {
  freelancer: {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    rating: number;
    rating_count: number;
  };
  portfolio: {
    url_slug: string;
    headline: string;
    bio: string;
    social_links: {
      instagram?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
    theme: "minimal" | "bold" | "dark";
  };
  projects: Array<{
    id: string;
    title: string;
    image: string;
    description: string;
    category: string;
  }>;
  stats: {
    projects_completed: number;
    avg_rating: number;
    years_experience: number;
  };
}

export function PublicPortfolio({ data }: { data: PortfolioData }) {
  const [copied, setCopied] = useState(false);
  const portfolioUrl = `${process.env.NEXT_PUBLIC_URL}/@${data.portfolio.url_slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    minimal: "bg-white text-slate-900",
    bold: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white",
    dark: "bg-slate-900 text-slate-100",
  };

  return (
    <div className={`min-h-screen ${themeClasses[data.portfolio.theme]}`}>
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-lg font-bold">PrestaCerto</div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{portfolioUrl}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={data.freelancer.avatar_url || "/avatar-placeholder.png"}
                alt={data.freelancer.full_name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-4">{data.freelancer.full_name}</h1>
            <p className="text-2xl font-semibold mb-6 opacity-80">{data.portfolio.headline}</p>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl opacity-90">
              {data.portfolio.bio || data.freelancer.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold">{data.stats.projects_completed}</div>
                <div className="text-sm opacity-70">Projetos Completados</div>
              </div>
              <div>
                <div className="text-3xl font-bold flex items-center gap-1">
                  {data.stats.avg_rating.toFixed(1)}
                  <span className="text-xl">⭐</span>
                </div>
                <div className="text-sm opacity-70">Nota Média</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{data.stats.years_experience}+</div>
                <div className="text-sm opacity-70">Anos de Experiência</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 flex-wrap">
              {data.portfolio.social_links.linkedin && (
                <a href={data.portfolio.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" /> LinkedIn
                  </Button>
                </a>
              )}
              {data.portfolio.social_links.twitter && (
                <a href={data.portfolio.social_links.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" /> Twitter
                  </Button>
                </a>
              )}
              {data.portfolio.social_links.instagram && (
                <a href={data.portfolio.social_links.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" /> Instagram
                  </Button>
                </a>
              )}
              {data.portfolio.social_links.email && (
                <a href={`mailto:${data.portfolio.social_links.email}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                </a>
              )}
              <Link href={`${process.env.NEXT_PUBLIC_URL}/profile/${data.freelancer.id}`}>
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" /> Ver em PrestaCerto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      {data.projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-200/10">
          <h2 className="text-4xl font-bold mb-12">Trabalhos em Destaque</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2 uppercase">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm opacity-70 line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-200/10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para trabalhar junto?</h2>
          <p className="text-lg mb-8 opacity-90">
            Contrate {data.freelancer.full_name.split(" ")[0]} diretamente via PrestaCerto
          </p>
          <Link href={`${process.env.NEXT_PUBLIC_URL}/profile/${data.freelancer.id}`}>
            <Button size="lg" variant="secondary" className="gap-2">
              Ver Disponibilidade <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/10 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm opacity-60">
          <p>Portfólio criado em <strong>PrestaCerto</strong> — Plataforma #1 de freelancers no Brasil</p>
          <p className="mt-2">
            Quer seu portfólio também? <a href="https://prestacerto.com" className="underline hover:opacity-100">
              Crie sua conta gratuitamente
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Shareable version (simplified, copy-paste friendly)
 */
export function PortfolioShareCard({ data }: { data: PortfolioData }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      {/* Mini Profile */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={data.freelancer.avatar_url || "/avatar-placeholder.png"}
            alt={data.freelancer.full_name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">{data.freelancer.full_name}</h3>
          <p className="text-sm text-slate-600">{data.portfolio.headline}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-yellow-400">{"⭐".repeat(Math.round(data.freelancer.rating))}</div>
        <span className="text-sm text-slate-600">
          {data.freelancer.rating} ({data.freelancer.rating_count} reviews)
        </span>
      </div>

      {/* Bio snippet */}
      <p className="text-sm text-slate-700 mb-4 line-clamp-3">
        {data.portfolio.bio || data.freelancer.bio}
      </p>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/@${data.portfolio.url_slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" variant="outline" className="w-full">
            Ver Portfólio
          </Button>
        </a>
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/profile/${data.freelancer.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="w-full">
            Contratar
          </Button>
        </a>
      </div>
    </div>
  );
}
