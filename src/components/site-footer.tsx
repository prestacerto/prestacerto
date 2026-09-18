<<<<<<< HEAD
'use client';

import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuthNavigation } from '@/components/auth/auth-navigation';
=======
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
>>>>>>> a8ed36014a7494559268129c32c01bca01578764

const columns = [
  {
    title: "Para clientes",
    links: [
<<<<<<< HEAD
      { href: "/para-clientes", label: "Quero contratar um profissional" },
      { href: "/para-clientes", label: "Publicar projeto grátis" },
      { href: "/services", label: "Buscar prestadores" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/contratar", label: "Categorias e cidades" },
=======
      { href: "/register", label: "Publicar um projeto" },
      { href: "/services", label: "Buscar prestadores" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/projects", label: "Ver projetos abertos" },
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
      { href: "/contato", label: "Falar com a equipe" },
    ],
  },
  {
    title: "Para freelancers",
    links: [
<<<<<<< HEAD
      { href: "/para-prestadores", label: "Quero apresentar meu trabalho" },
      { href: "/register?role=freelancer", label: "Criar meu perfil" },
      { href: "/projects", label: "Encontrar projetos" },
      { href: "/ferramentas/calculadora", label: "Calcular meu preço" },
      { href: "/ferramentas/propostas", label: "Criar proposta em PDF" },
      { href: "/plans", label: "Planos e recursos" },
    ],
  },
  {
    title: "PrestaCerto",
    links: [
      { href: "/certo-ai", label: "Conhecer o Certo AI" },
      { href: "/aprenda", label: "Aprenda" },
      { href: "/ajuda", label: "Central de ajuda" },
      { href: "/contato", label: "Contato" },
      { href: "/ecossistema", label: "Marcas relacionadas" },
=======
      { href: "/register?role=freelancer", label: "Criar meu perfil" },
      { href: "/projects", label: "Encontrar projetos" },
      { href: "/ferramentas/calculadora", label: "Calcular meu preço" },
      { href: "/ferramentas/benchmark", label: "Ver benchmark" },
      { href: "/indicacoes", label: "Indicações" },
    ],
  },
  {
    title: "Certo AI & ferramentas",
    links: [
      { href: "/certo-ai", label: "Conhecer o Certo AI" },
      { href: "/plans", label: "Planos" },
      { href: "/ferramentas/calculadora", label: "Calculadora de preço" },
      { href: "/mercado", label: "Dados de mercado" },
      { href: "/aprenda", label: "Aprenda" },
    ],
  },
  {
    title: "Categorias",
    links: [
      { href: "/services?categoria=desenvolvimento", label: "Tecnologia e desenvolvimento" },
      { href: "/services?categoria=design", label: "Design e criação" },
      { href: "/services?categoria=marketing", label: "Marketing digital" },
      { href: "/services?categoria=psicologia", label: "Psicologia" },
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
    ],
  },
];

export function SiteFooter() {
<<<<<<< HEAD
  const { role } = useAuthNavigation();
  const isClient = role === "client";
  const visibleColumns = columns
    .filter(column => !isClient || column.title !== "Para freelancers")
    .map(column => ({ ...column, links: column.links.filter(link => !isClient || link.href !== "/certo-ai") }));
  return (
    <footer className="border-t border-slate-200 bg-white transition-colors  ">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2.85fr]">
          <div>
            <Link href="/" aria-label="Voltar para a página inicial do PrestaCerto" className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ">
              <Logo inverse />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500 ">
              Conectamos quem precisa de um serviço a quem sabe fazer. Encontre profissionais, compare propostas e tire suas ideias do papel.
            </p>
            <p className="mt-3 text-xs leading-6 text-slate-500">CNPJ: 68.949.661/0001-00</p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://www.instagram.com/prestacerto/" target="_blank" rel="noreferrer" aria-label="Instagram do PrestaCerto" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-500 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"><span className="text-sm font-semibold">@prestacerto</span></a>
              <a href="mailto:contato@prestacerto.com.br" aria-label="Enviar e-mail para o PrestaCerto" className="flex size-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"><Mail className="size-4" /></a>
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-3">
            {visibleColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold text-slate-950 ">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link href={link.href} className="text-sm leading-5 text-slate-500 transition hover:text-blue-600  ">{link.label}</Link>
=======
  return (
    <footer className="border-t border-slate-200 bg-white transition-colors dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2.85fr]">
          <div>
            <Link href="/" aria-label="Voltar para a página inicial do PrestaCerto" className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950">
              <Logo inverse />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              O marketplace brasileiro que combina talentos, inteligência artificial e supervisão humana para transformar necessidades em entregas.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://www.instagram.com/prestacerto/" target="_blank" rel="noreferrer" aria-label="Instagram do PrestaCerto" className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-blue-400/50 dark:hover:text-white"><span className="text-xs font-black">IG</span></a>
              <a href="mailto:contato@prestacerto.com.br" aria-label="Enviar e-mail para o PrestaCerto" className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-blue-400/50 dark:hover:text-white"><Mail className="size-4" /></a>
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold text-slate-950 dark:text-white">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link href={link.href} className="text-sm leading-5 text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300">{link.label}</Link>
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PrestaCerto. Todos os direitos reservados.</p>
=======
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-white/10 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>© {new Date().getFullYear()} PrestaCerto. Todos os direitos reservados.</p>
            <p className="mt-1 text-slate-500 dark:text-slate-600">CNPJ: 68.949.661/0001-00</p>
          </div>
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/termos" className="transition hover:text-blue-600">Termos de uso</Link>
            <Link href="/privacidade" className="transition hover:text-blue-600">Privacidade</Link>
            <Link href="/contato" className="transition hover:text-blue-600">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
