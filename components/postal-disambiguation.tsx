import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import type { PostalCommune } from "@/lib/apis/geo-gouv";

interface Props {
  codeInsee: string;
  matches: PostalCommune[];
}

export function PostalDisambiguation({ codeInsee, matches }: Props) {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Breadcrumbs
          items={[
            {
              name: `Code postal ${codeInsee}`,
              href: `/commune/${codeInsee}`,
            },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold">
          Plusieurs communes pour ce code postal
        </h1>
        <p className="text-muted-foreground mt-1">
          Le code postal {codeInsee} couvre {matches.length} communes.
          Selectionnez celle qui vous interesse pour acceder au diagnostic.
        </p>
      </div>

      <AddressSearch placeholder="Ou cherchez une adresse precise..." />

      <section>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((c) => (
            <Link
              key={c.code}
              href={`/commune/${c.code}`}
              className="hover:bg-accent flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              <LinkPendingIndicator />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
