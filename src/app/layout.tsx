import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteHeaderFrame } from '@/components/site-header-frame';
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { PWAInstaller } from "@/components/pwa-installer";
import { PushNotificationManager } from "@/components/push-notification-manager";
import { StructuredData, organizationSchema, websiteSchema } from "@/components/structured-data";
import { defaultMetadata } from "@/lib/seo/metadata";
import { AuthNavigationProvider } from '@/components/auth/auth-navigation';
import { CaduWidget } from '@/components/support/cadu-widget';

export const metadata: Metadata = {
  ...defaultMetadata,
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/prestacerto-logo-icon.svg?v=20260825", type: "image/svg+xml" }],
    shortcut: ["/prestacerto-logo-icon.svg?v=20260825"],
    apple: [{ url: "/prestacerto-logo-icon.svg?v=20260825" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PrestaCerto",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <StructuredData type="Organization" data={organizationSchema} />
        <StructuredData type="WebSite" data={websiteSchema} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthNavigationProvider>
            <SiteHeaderFrame><SiteHeader /></SiteHeaderFrame>
            <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-white focus:px-5 focus:py-3 focus:text-blue-700 focus:shadow-lg">Pular para o conteúdo</a>
            <main id="conteudo-principal" className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
          </AuthNavigationProvider>
          <Toaster />
          <Analytics />
          <CaduWidget />
          <PWAInstaller />
          {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && <PushNotificationManager />}
        </ThemeProvider>
      </body>
    </html>
  );
}
