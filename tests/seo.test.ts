import { describe, expect, it } from "vitest";
import {
  generateCommuneMetadata,
  generateDepartementMetadata,
} from "../lib/seo";

// Le template du layout ajoute " | DiagAdresse" (14 chars) ; le <title> visé
// doit tenir dans 60 chars. Ces tests verrouillent la bascule long → court →
// { absolute } de fitTitle via l'API publique.

describe("generateCommuneMetadata", () => {
  it("garde le titre long quand il tient avec le suffixe", () => {
    const meta = generateCommuneMetadata("06088", "Nice", "06");
    expect(meta.title).toBe("Risques, eau potable et DPE à Nice (06)");
    expect(meta.alternates?.canonical).toBe("/commune/nice-06088");
  });

  it("bascule sur le titre court quand le long dépasse le budget", () => {
    const meta = generateCommuneMetadata("69266", "Villeurbanne", "69");
    expect(meta.title).toBe("Villeurbanne (69) : risques, eau, DPE");
    // OG/Twitter n'ont pas de budget SERP : ils gardent la forme longue.
    expect(meta.openGraph?.title).toBe(
      "Risques, eau potable et DPE à Villeurbanne (69)",
    );
  });

  it("retire le suffixe (absolute) quand même le court déborde", () => {
    const meta = generateCommuneMetadata(
      "78575",
      "Saint-Rémy-lès-Chevreuse",
      "78",
    );
    expect(meta.title).toEqual({
      absolute: "Saint-Rémy-lès-Chevreuse (78) : risques, eau, DPE",
    });
  });

  it("utilise la préposition contractée pour les noms à article", () => {
    const meta = generateCommuneMetadata("76351", "Le Havre", "76");
    expect(meta.title).toBe("Risques, eau potable et DPE au Havre (76)");
  });
});

describe("generateDepartementMetadata", () => {
  it("construit un titre neutre au tiret avec le canonical du département", () => {
    const meta = generateDepartementMetadata("Gard", "30");
    expect(meta.title).toBe("Risques, eau potable et DPE — Gard (30)");
    expect(meta.alternates?.canonical).toBe("/departement/30");
  });
});
