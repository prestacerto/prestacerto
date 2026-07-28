import Link from "next/link";
import {
  Code2,
  Smartphone,
  Palette,
  PenTool,
  Languages,
  Megaphone,
  Folder,
  ArrowRight,
} from "lucide-react";
import type { Category } from "@/lib/supabase/types";

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "desenvolvimento-web": Code2,
  mobile: Smartphone,
  "design-grafico": Palette,
  "redacao-conteudo": PenTool,
  traducao: Languages,
  "marketing-digital": Megaphone,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug] ?? Folder;
        return (
          <Link
            key={category.id}
            href={`/services?categoria=${category.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-blue-200 hover:bg-blue-50/60"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="size-5" />
            </span>
            <span className="text-sm font-medium text-slate-900">
              {category.name}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
              Ver serviços
              <ArrowRight className="size-3" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
