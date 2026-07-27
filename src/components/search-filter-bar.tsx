import { Search } from "lucide-react";
import type { Category } from "@/lib/supabase/types";

interface SearchFilterBarProps {
  action: string;
  placeholder: string;
  query?: string;
  categories: Category[];
  categorySlug?: string;
}

// Formulário GET simples (sem JS) — filtra por query params. Suficiente pro
// escopo do MVP; se um dia precisar de filtro instantâneo, isso vira client
// component com estado.
export function SearchFilterBar({
  action,
  placeholder,
  query,
  categories,
  categorySlug,
}: SearchFilterBarProps) {
  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <select
        name="categoria"
        defaultValue={categorySlug ?? ""}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
      >
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Buscar
      </button>
    </form>
  );
}
