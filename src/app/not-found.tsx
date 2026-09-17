import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-blue-700">Página não encontrada</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Vamos encontrar outro caminho.</h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">Este endereço não está disponível. Você pode voltar ao início ou encontrar profissionais para o seu projeto.</p>
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
        <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Voltar ao início</Link>
        <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Encontrar profissionais</Link>
      </div>
    </section>
  );
}
