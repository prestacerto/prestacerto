const PRODUCT_ROUTES = ['/whatsapp-marketing', '/email-marketing', '/gerador-posts', '/sales-agent', '/pricing'];

export function isProductRoute(pathname: string | null): boolean {
  return !!pathname && PRODUCT_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}
