import Link from "next/link";
import { getCommuneArgileDiff, argileLevelLabel } from "@/lib/argile/data";

/**
 * Encart « Nouvelle carte argile 2026 » affiché sur les pages commune dont la
 * classe d'exposition change entre les millésimes 2020 et 2026 (delta != 0).
 * Rendu serveur : renvoie null si le département n'est pas couvert, si le
 * calcul n'a pas tourné, ou si la commune ne change pas de classe.
 */
export async function Argile2026Badge({ codeInsee }: { codeInsee: string }) {
  const result = await getCommuneArgileDiff(codeInsee);
  if (!result || result.diff.d === 0) return null;

  const { diff, dep } = result;
  const up = diff.d > 0;
  const from = argileLevelLabel(diff.a20.max);
  const to = argileLevelLabel(diff.a26.max);

  return (
    <aside
      className={`space-y-2 rounded-lg border p-4 ${
        up
          ? "border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30"
          : "border-emerald-300 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
      }`}
    >
      <p className="text-sm font-semibold">
        Nouvelle carte argile 2026 : exposition {from} → {to}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        La carte d&apos;exposition au retrait-gonflement des argiles est mise à
        jour par l&apos;arrêté du 9 janvier 2026, applicable au 1<sup>er</sup>{" "}
        juillet 2026. Cette commune {up ? "passe à" : "revient à"} une
        exposition <strong>{to}</strong> (contre {from} sur la carte de 2020).
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link
          href={`/argile-2026/departement/${dep}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Communes du département qui changent de classe
        </Link>
        <Link
          href="/risque/argile"
          className="text-primary underline-offset-4 hover:underline"
        >
          Comprendre le risque argile
        </Link>
      </div>
    </aside>
  );
}
