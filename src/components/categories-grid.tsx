"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    icon: "💻",
    description: "React, Next.js, Node.js, Python",
    count: 2840,
    avgPrice: "R$ 150/h",
    featured: true,
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    icon: "📱",
    description: "React Native, Flutter, iOS, Android",
    count: 1920,
    avgPrice: "R$ 140/h",
    featured: true,
  },
  {
    id: "design",
    name: "Design & UI/UX",
    icon: "🎨",
    description: "Figma, Adobe XD, Prototyping",
    count: 1654,
    avgPrice: "R$ 120/h",
    featured: true,
  },
  {
    id: "marketing",
    name: "Marketing Digital",
    icon: "📊",
    description: "SEO, Google Ads, Social Media",
    count: 1432,
    avgPrice: "R$ 100/h",
    featured: false,
  },
  {
    id: "copywriting",
    name: "Copywriting",
    icon: "✍️",
    description: "Conteúdo, Blog, Landing Pages",
    count: 892,
    avgPrice: "R$ 80/h",
    featured: false,
  },
  {
    id: "video-production",
    name: "Video Production",
    icon: "🎬",
    description: "Edição, Motion Graphics, 3D",
    count: 654,
    avgPrice: "R$ 130/h",
    featured: false,
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    icon: "📈",
    description: "SQL, Power BI, Google Analytics",
    count: 523,
    avgPrice: "R$ 160/h",
    featured: false,
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    icon: "⚡",
    description: "ChatGPT, Automação, Integração",
    count: 1205,
    avgPrice: "R$ 150/h",
    featured: true,
  },
];

export function CategoriesGrid() {
  const featured = CATEGORIES.filter((c) => c.featured);
  const others = CATEGORIES.filter((c) => !c.featured);

  return (
    <div className="w-full">
      {/* Featured Categories */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            🔥 Mais Buscadas
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            As categorias com mais demanda agora
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((category) => (
            <Link
              key={category.id}
              href={`/mercado/${category.id}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
            >
              {/* Badge */}
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {category.count.toLocaleString()}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-3">{category.icon}</div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {category.description}
              </p>

              {/* Price tag */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {category.avgPrice}
                </span>
                <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Other Categories */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Mais Categorias
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {others.map((category) => (
            <Link
              key={category.id}
              href={`/mercado/${category.id}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {category.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {category.count.toLocaleString()} freelancers
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Não encontrou sua categoria?</h2>
        <p className="text-blue-100 mb-6">
          Publique um projeto e encontre o freelancer perfeito em poucas horas
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors"
          >
            Publicar Projeto
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border-2 border-white text-white font-bold hover:bg-white/10 transition-colors"
          >
            Fale com a gente
          </Link>
        </div>
      </div>
    </div>
  );
}
