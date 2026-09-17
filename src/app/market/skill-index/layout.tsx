import { getPageMetadata } from "@/lib/seo/metadata";
import { indexingRobots } from "@/lib/seo/discovery";

export const metadata = {
  ...getPageMetadata(
    "Índice de habilidades",
    "Consulte a disponibilidade de dados sobre habilidades nos projetos do PrestaCerto.",
    "/market/skill-index",
  ),
  // This client-side dashboard is not a published market research page.
  robots: indexingRobots(false),
};

export default function SkillIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
