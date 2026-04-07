import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { organizationJsonLd } from "@/lib/json-ld";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DiagAdresse - Diagnostic complet de votre adresse",
    template: "%s | DiagAdresse",
  },
  description:
    "Risques naturels et industriels, qualite de l'eau, performance energetique : le diagnostic complet de votre adresse en France.",
  metadataBase: new URL("https://diagadresse.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DiagAdresse",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "theme-color": "#09090b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="dns-prefetch" href="https://data.geopf.fr" />
        <link rel="dns-prefetch" href="https://georisques.gouv.fr" />
        <link rel="dns-prefetch" href="https://hubeau.eaufrance.fr" />
        <link rel="dns-prefetch" href="https://data.ademe.fr" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <header className="flex items-center justify-end px-4 py-2">
              <ThemeToggle />
            </header>
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
