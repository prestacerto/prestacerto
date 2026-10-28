'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { isProductRoute } from '@/lib/product-routes';

export function HideOnProductRoutes({ children }: { children: ReactNode }) {
  return isProductRoute(usePathname()) ? null : children;
}
