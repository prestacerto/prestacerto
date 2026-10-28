import type { Metadata } from 'next';

const icon = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${color}"/></svg>`
  )}`;

export function productMetadata(title: string, description: string, color: string): Metadata {
  return {
    title: { absolute: title },
    description,
    applicationName: title,
    openGraph: { title, description, siteName: title, type: 'website' },
    twitter: { card: 'summary', title, description },
    icons: { icon: icon(color), shortcut: icon(color), apple: icon(color) },
    appleWebApp: { title },
  };
}
