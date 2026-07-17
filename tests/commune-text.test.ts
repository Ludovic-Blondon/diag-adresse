import { describe, expect, it } from "vitest";
import { prepositionVille, deVille } from "../lib/commune-text";

describe("prepositionVille", () => {
  it("contracte l'article Le en au", () => {
    expect(prepositionVille("Le Havre")).toBe("au Havre");
  });

  it("contracte l'article Les en aux", () => {
    expect(prepositionVille("Les Lilas")).toBe("aux Lilas");
  });

  it("garde à devant La et les noms sans article", () => {
    expect(prepositionVille("La Rochelle")).toBe("à La Rochelle");
    expect(prepositionVille("L'Haÿ-les-Roses")).toBe("à L'Haÿ-les-Roses");
    expect(prepositionVille("Grenoble")).toBe("à Grenoble");
  });

  it("ne contracte pas les noms commençant par Le/Les sans espace", () => {
    expect(prepositionVille("Lens")).toBe("à Lens");
    expect(prepositionVille("Lesparre-Médoc")).toBe("à Lesparre-Médoc");
  });
});

describe("deVille", () => {
  it("contracte Le en du et Les en des", () => {
    expect(deVille("Le Havre")).toBe("du Havre");
    expect(deVille("Les Lilas")).toBe("des Lilas");
  });

  it("garde de pour les autres noms", () => {
    expect(deVille("La Rochelle")).toBe("de La Rochelle");
    expect(deVille("Grenoble")).toBe("de Grenoble");
  });
});
