import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { organizationJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { RISK_NAV } from "@/lib/navigation";
import { REGIONS, getDepartementsForRegion } from "@/lib/regions";
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
  metadataBase: new URL(BASE_URL),
  verification: {
    google: "ngRiAmVkdtheHcVPZyf1g9QlfKjTtrKjHjaY5N6Jpis",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DiagAdresse",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
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
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <header className="flex items-center justify-end px-4 py-2">
              <ThemeToggle />
            </header>
            {children}
            <footer className="mt-auto space-y-4 border-t px-4 py-6">
              <nav className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-1">
                {RISK_NAV.map((r) => (
                  <Link
                    key={r.type}
                    href={`/risque/${r.type}`}
                    className="text-muted-foreground text-xs hover:underline"
                  >
                    {r.label}
                  </Link>
                ))}
                <Link
                  href="/blog"
                  className="text-muted-foreground text-xs hover:underline"
                >
                  Blog
                </Link>
                <Link
                  href="/faq"
                  className="text-muted-foreground text-xs hover:underline"
                >
                  FAQ
                </Link>
                <a
                  href="https://github.com/Ludovic-Blondon/diag-adresse/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-xs hover:underline"
                >
                  Contact / signaler un probleme
                </a>
              </nav>
              <details className="mx-auto max-w-6xl">
                <summary className="text-muted-foreground cursor-pointer text-center text-xs hover:underline">
                  Tous les departements
                </summary>
                <div className="mt-4 columns-2 gap-4 md:columns-3 lg:columns-4">
                  {REGIONS.map((region) => (
                    <div key={region.code} className="mb-5 break-inside-avoid">
                      <h3 className="mb-1 text-xs font-medium">
                        <Link
                          href={`/region/${region.code}`}
                          className="hover:underline"
                        >
                          {region.name}
                        </Link>
                      </h3>
                      <ul className="space-y-0.5">
                        {getDepartementsForRegion(region).map((dep) => (
                          <li key={dep.code}>
                            <Link
                              href={`/departement/${dep.code}`}
                              className="text-muted-foreground text-xs hover:underline"
                            >
                              {dep.name} ({dep.code})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </footer>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
