import { BASE_URL } from "./constants";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DiagAdresse",
    url: BASE_URL,
    description:
      "Diagnostic complet de votre adresse en France : risques naturels et industriels, qualite de l'eau, performance energetique.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DiagAdresse",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/adresse/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageJsonLd(
  questions: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function placeJsonLd(opts: {
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.latitude != null && opts.longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: opts.latitude,
            longitude: opts.longitude,
          },
        }
      : {}),
  };
}
