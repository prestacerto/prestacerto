import Link from "next/link";

const columns = [
  {
    title: "Plataforma",
    links: [
      { href: "/services", label: "Buscar serviços" },
      { href: "/projects", label: "Projetos abertos" },
      { href: "/aprenda", label: "Aprenda" },
      { href: "/mercado", label: "Dados de mercado" },
      { href: "/ferramentas/calculadora", label: "Calculadora de preço" },
      { href: "/ferramentas/benchmark", label: "Benchmark de preço" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/plans", label: "Planos" },
      { href: "/ajuda", label: "Central de ajuda" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
      { href: "/contato", label: "Contato" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white transition-colors dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">PrestaCerto</p>
            <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              A plataforma de freelancers com modelo justo por assinatura.
            </p>
            <a
              href="mailto:contato@prestacerto.com.br"
              className="mt-3 inline-block text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
            >
              contato@prestacerto.com.br
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {column.title}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-white/10 dark:text-slate-500">
          © {new Date().getFullYear()} PrestaCerto. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
