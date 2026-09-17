import Link from "next/link";
import { Button } from "@/components/ui/button";

type ButtonOwnProps = Omit<
  React.ComponentProps<typeof Button>,
  "render" | "nativeButton" | "children"
>;

interface LinkButtonProps extends ButtonOwnProps {
  href: string;
  children: React.ReactNode;
}

// O Button do shadcn/ui (Base UI) espera um <button> nativo por padrão
// quando substituído via `render`. Como aqui SEMPRE renderizamos um <Link>
// (âncora), centralizamos `nativeButton={false}` neste wrapper em vez de
// repetir em cada call site.
export function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button nativeButton={false} render={<Link href={href}>{children}</Link>} {...props} />
  );
}
