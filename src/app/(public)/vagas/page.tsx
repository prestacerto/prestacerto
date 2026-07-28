import Link from "next/link";
import { Rss } from "lucide-react";

export const metadata = { title: "Vagas agregadas — PrestaCerto" };

export default function VagasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2">
        <Rss className="size-5 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Vagas agregadas</h1>
      </div>
      <p className="mt-1 text-slate-500">
        Projetos coletados de Telegram, LinkedIn, WhatsApp e outras fontes externas.
        0 vagas disponíveis.
      </p>

      <div className="mt-20 flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Rss className="size-6" />
        </span>
        <p className="mt-4 font-medium text-slate-700">Nenhuma vaga encontrada.</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Este recurso está em construção — em breve vamos agregar vagas de fontes
          externas automaticamente. Por enquanto, confira os{" "}
          <Link href="/projects" className="text-blue-600 hover:underline">
            projetos publicados na plataforma
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
