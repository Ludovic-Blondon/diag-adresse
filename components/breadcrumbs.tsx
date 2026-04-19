import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Accueil", href: "/" }, ...items];
  const jsonLdItems = allItems.map((item) => ({
    name: item.name,
    url: `${BASE_URL}${item.href}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(jsonLdItems)),
        }}
      />
      <nav aria-label="Fil d'Ariane" className="text-muted-foreground text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < allItems.length - 1 ? (
                <Link href={item.href} className="hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
