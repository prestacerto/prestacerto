import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Contato — PrestaCerto" };

export default function ContatoPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Fale com a gente</h1>
      <p className="mt-2 text-slate-500">
        Dúvidas, sugestões ou problemas — respondemos o mais rápido possível.
      </p>

      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <Mail className="size-4" />
        <a href="mailto:contato@prestacerto.com.br" className="hover:text-slate-900">
          contato@prestacerto.com.br
        </a>
      </p>

      <Card className="mt-8 p-6">
        <ContactForm />
      </Card>
    </div>
  );
}
