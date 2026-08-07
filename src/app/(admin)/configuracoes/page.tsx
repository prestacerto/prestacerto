"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Copy, Check } from "lucide-react";

export default function ConfiguracoesPage() {
  const [copied, setCopied] = useState("");

  const envVars = [
    {
      name: "GOOGLE_TAG_ID",
      description: "Google Tag Manager ID",
      example: "G-XXXXXXXXXX",
      status: "não configurado",
    },
    {
      name: "META_PIXEL_ID",
      description: "Meta/Facebook Pixel ID",
      example: "123456789",
      status: "não configurado",
    },
    {
      name: "TIKTOK_PIXEL_ID",
      description: "TikTok Pixel ID",
      example: "XXXXXXXXXXXXXX",
      status: "não configurado",
    },
  ];

  const tasks = [
    {
      title: "Configurar Analytics",
      description: "Ativar Google Tag Manager, Meta Pixel e TikTok Pixel",
      priority: "alta",
      status: "pendente",
    },
    {
      title: "Chat Interno em Tempo Real",
      description: "Implementar mensagens entre freelancers e clientes",
      priority: "alta",
      status: "pendente",
    },
    {
      title: "Histórias de Sucesso",
      description: "Showcase de freelancers que cresceram na plataforma",
      priority: "média",
      status: "pendente",
    },
    {
      title: "Badges Gamificadas",
      description: "Sistema de verificação e conquistas",
      priority: "média",
      status: "pendente",
    },
    {
      title: "Destaques Pagos",
      description: "Freelancers podem aparecer em destaque nas buscas",
      priority: "média",
      status: "pendente",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gerencie as configurações da plataforma
        </p>
      </div>

      {/* Analytics */}
      <Card className="border-orange-200 dark:border-orange-900/50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                IDs de Analytics
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Configure os IDs para rastrear conversões e tráfego
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {envVars.map((env) => (
            <div
              key={env.name}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {env.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {env.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-mono">
                    Exemplo: {env.example}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                  {env.status}
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
              Como configurar:
            </p>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
              <li>Vá pro Vercel Dashboard → seu projeto → Settings → Environment Variables</li>
              <li>Adicione cada variável acima com seu ID correto</li>
              <li>Faça redeploy do projeto</li>
              <li>Pronto! Os pixels começam a rastrear conversões</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Roadmap Prioritário
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Próximas features em ordem de ROI
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === "alta"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-slate-100 dark:bg-slate-900/50">
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Sobre a Dashboard
          </h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Você tá vendo uma dashboard completa que conecta direto no seu banco de dados Supabase.
          </p>
          <p>
            Todos os dados (usuários, transações, propostas) são carregados em tempo real do seu banco.
          </p>
          <p>
            Quando alguém se registra, paga, ou fecha uma proposta, aqui você vê na hora!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
