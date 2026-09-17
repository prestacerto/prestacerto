import { LandingPage } from "@/components/landing/landing-page";
import { getPageMetadata } from "@/lib/seo/metadata";
import { getCategories } from "@/lib/supabase/queries";

const title = "Encontre projetos e clientes para seu serviço | Presta Certo";
const pageMetadata = getPageMetadata(
  "Encontre projetos e clientes para seu serviço",
  "Cadastre seu serviço, mostre seu trabalho e encontre projetos compatíveis no Presta Certo.",
  "/para-prestadores",
);

export const metadata = {
  ...pageMetadata,
  title: { absolute: title },
  openGraph: { ...pageMetadata.openGraph, title },
  twitter: { ...pageMetadata.twitter, title },
};

export default async function ProviderLandingPage() {
  const categories = await getCategories();
  return <LandingPage journey="provider" categories={categories} />;
}
