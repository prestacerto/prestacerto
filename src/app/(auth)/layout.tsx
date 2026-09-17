import type { Metadata } from "next";
import { getNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = getNoIndexMetadata(
  "Acesso à conta",
  "Entrar, criar conta ou recuperar acesso no PrestaCerto.",
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
