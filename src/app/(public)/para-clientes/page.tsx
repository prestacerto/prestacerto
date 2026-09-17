import { LandingPage } from "@/components/landing/landing-page";
import { getPageMetadata } from "@/lib/seo/metadata";
import { getCategories } from "@/lib/supabase/queries";

const title = "Encontre profissionais para seu projeto | Presta Certo";
const pageMetadata = getPageMetadata(
  "Encontre profissionais para seu projeto",
  "Publique seu projeto e encontre profissionais preparados para realizar seu serviço com mais agilidade.",
  "/para-clientes",
);

export const metadata = {
  ...pageMetadata,
  title: { absolute: title },
  openGraph: { ...pageMetadata.openGraph, title },
  twitter: { ...pageMetadata.twitter, title },
};

export default async function ClientLandingPage() {
  const categories = await getCategories();
  return <LandingPage journey="client" categories={categories} />;
}
