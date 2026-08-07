"use client";

import { Lightbulb, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateCTAProps {
  category?: string;
  type: "projects" | "services";
}

export function EmptyStateCTA({ category, type }: EmptyStateCTAProps) {
  const isProjects = type === "projects";
  const categoryText = category ? `em "${category}"` : "nessa categoria";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="mb-6">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
          {isProjects ? (
            <Lightbulb className="h-8 w-8 text-blue-600" />
          ) : (
            <Rocket className="h-8 w-8 text-blue-600" />
          )}
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
        {isProjects
          ? `Nenhum projeto ${categoryText}`
          : `Nenhum serviço ${categoryText}`}
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-center max-w-md mb-8">
        {isProjects
          ? "Mas isso é uma OPORTUNIDADE! Projetos novos atraem os melhores profissionais."
          : "Seja o primeiro a oferecer! Categorias novas são ouro puro."}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link href={isProjects ? "/dashboard/services/new" : "/dashboard/projects/new"}>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Rocket className="h-4 w-4" />
            {isProjects ? "Publicar Meu Serviço" : "Publicar Projeto"}
          </Button>
        </Link>
        <Link href={isProjects ? "/services" : "/projects"}>
          <Button variant="outline" className="gap-2">
            Ver Outras Categorias
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6 max-w-md w-full">
        <p className="text-sm font-semibold text-blue-900 mb-3">✨ Dica:</p>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ Primeiros a entrar em categoria nova ficam em destaque</li>
          <li>✓ Mais visibilidade = mais propostas</li>
          <li>✓ Diferencial competitivo imediato</li>
        </ul>
      </div>
    </div>
  );
}
