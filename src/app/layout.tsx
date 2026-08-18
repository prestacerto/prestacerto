import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { FacebookPixel } from "@/components/facebook-pixel";
import { PWAInstaller } from "@/components/pwa-installer";
import { PushNotificationManager } from "@/components/push-notification-manager";
import { StructuredData, organizationSchema, websiteSchema } from "@/components/structured-data";
import { defaultMetadata } from "@/lib/seo/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...defaultMetadata,
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/prestacerto-logo-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/prestacerto-logo-icon.svg"],
    apple: [{ url: "/prestacerto-logo-icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PrestaCerto",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData type="Organization" data={organizationSchema} />
        <StructuredData type="WebSite" data={websiteSchema} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
          <Toaster />
          <Analytics />
          <FacebookPixel />
          <PWAInstaller />
          <PushNotificationManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
