import { describe, expect, it } from "vitest";
import { formatDateFr, formatNumberFr } from "../lib/format";

describe("formatDateFr", () => {
  it("formate une date de prélèvement Hub'Eau en français", () => {
    expect(formatDateFr("2026-03-31T13:40:00Z")).toBe("31 mars 2026");
  });

  it("formate une date seule sans décaler le jour", () => {
    expect(formatDateFr("2026-01-01")).toBe("1 janvier 2026");
  });

  it("renvoie la chaîne brute si ce n'est pas une date", () => {
    expect(formatDateFr("pas une date")).toBe("pas une date");
  });

  it("renvoie une chaîne vide pour une date absente", () => {
    expect(formatDateFr(null)).toBe("");
    expect(formatDateFr(undefined)).toBe("");
  });
});

describe("formatNumberFr", () => {
  it("utilise la virgule décimale", () => {
    expect(formatNumberFr(5.2, 1)).toBe("5,2");
    expect(formatNumberFr(0.5, 2)).toBe("0,50");
  });

  it("garde les entiers courts tels quels", () => {
    expect(formatNumberFr(50)).toBe("50");
    expect(formatNumberFr(0.5)).toBe("0,5");
  });
});
