import Link from "next/link";
import { LogIn } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: { text: string; linkLabel: string; href: string };
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16 transition-colors dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <LogIn className="size-5 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {footer.text}{" "}
            <Link href={footer.href} className="font-semibold text-slate-900 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-300">
              {footer.linkLabel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
