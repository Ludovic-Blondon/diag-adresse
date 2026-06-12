import Link from "next/link";
import { AddressSearch } from "@/components/address-search";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-2xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Recherchez une adresse pour consulter son diagnostic :
        </p>
        <AddressSearch />
        <p>
          <Link
            href="/"
            className="text-primary underline-offset-4 hover:underline"
          >
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </main>
  );
}
