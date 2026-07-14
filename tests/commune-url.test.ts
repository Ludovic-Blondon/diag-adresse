import { describe, expect, it } from "vitest";
import {
  communePath,
  parseCommuneParam,
  slugifyCommune,
} from "../lib/commune-url";

describe("slugifyCommune", () => {
  it("retire les diacritiques et met en minuscules", () => {
    expect(slugifyCommune("Besançon")).toBe("besancon");
    expect(slugifyCommune("Nîmes")).toBe("nimes");
  });

  it("remplace apostrophes et espaces par des tirets", () => {
    expect(slugifyCommune("L'Haÿ-les-Roses")).toBe("l-hay-les-roses");
    expect(slugifyCommune("Aix-en-Provence")).toBe("aix-en-provence");
  });

  it("décompose les ligatures œ/æ que NFD ne décompose pas", () => {
    expect(slugifyCommune("Œuilly")).toBe("oeuilly");
    expect(slugifyCommune("Vœlfling-lès-Bouzonville")).toBe(
      "voelfling-les-bouzonville",
    );
  });
});

describe("communePath", () => {
  it("construit un chemin slug-insee entièrement en minuscules", () => {
    expect(communePath("75056", "Paris")).toBe("/commune/paris-75056");
    expect(communePath("2A004", "Ajaccio")).toBe("/commune/ajaccio-2a004");
  });
});

describe("parseCommuneParam", () => {
  it("reconnaît un code INSEE nu", () => {
    expect(parseCommuneParam("75056")).toEqual({
      kind: "insee",
      insee: "75056",
    });
  });

  it("reconnaît et normalise les codes corses (2A/2B)", () => {
    expect(parseCommuneParam("2a004")).toEqual({
      kind: "insee",
      insee: "2A004",
    });
    expect(parseCommuneParam("2B033")).toEqual({
      kind: "insee",
      insee: "2B033",
    });
  });

  it("reconnaît la forme canonique slug-insee", () => {
    expect(parseCommuneParam("paris-75056")).toEqual({
      kind: "sluggedInsee",
      insee: "75056",
      slugPart: "paris",
    });
    expect(parseCommuneParam("ajaccio-2a004")).toEqual({
      kind: "sluggedInsee",
      insee: "2A004",
      slugPart: "ajaccio",
    });
  });

  it("classe tout le reste en other", () => {
    expect(parseCommuneParam("paris")).toEqual({ kind: "other" });
    expect(parseCommuneParam("1234")).toEqual({ kind: "other" });
    expect(parseCommuneParam("123456")).toEqual({ kind: "other" });
  });
});
