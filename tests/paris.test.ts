import { describe, expect, it } from "vitest";
import { arrondissementCodes, toHubeauCode } from "../lib/paris";

describe("toHubeauCode", () => {
  it("mappe les arrondissements de Paris vers 75056", () => {
    expect(toHubeauCode("75101")).toBe("75056");
    expect(toHubeauCode("75120")).toBe("75056");
  });

  it("mappe les arrondissements de Lyon vers 69123", () => {
    expect(toHubeauCode("69381")).toBe("69123");
    expect(toHubeauCode("69389")).toBe("69123");
  });

  it("mappe les arrondissements de Marseille vers 13055", () => {
    expect(toHubeauCode("13201")).toBe("13055");
    expect(toHubeauCode("13216")).toBe("13055");
  });

  it("laisse les codes commune globaux et ordinaires inchangés", () => {
    expect(toHubeauCode("75056")).toBe("75056");
    expect(toHubeauCode("69123")).toBe("69123");
    expect(toHubeauCode("13055")).toBe("13055");
    expect(toHubeauCode("33063")).toBe("33063");
    expect(toHubeauCode("2A004")).toBe("2A004");
  });
});

describe("arrondissementCodes", () => {
  it("liste les arrondissements de Paris, Lyon et Marseille", () => {
    const paris = arrondissementCodes("75056");
    expect(paris).toHaveLength(20);
    expect([paris[0], paris[19]]).toEqual(["75101", "75120"]);
    expect(arrondissementCodes("69123")).toEqual([
      "69381",
      "69382",
      "69383",
      "69384",
      "69385",
      "69386",
      "69387",
      "69388",
      "69389",
    ]);
    const marseille = arrondissementCodes("13055");
    expect([marseille[0], marseille[15]]).toEqual(["13201", "13216"]);
  });

  it("renvoie [] pour les autres communes et pour un arrondissement", () => {
    expect(arrondissementCodes("34172")).toEqual([]);
    expect(arrondissementCodes("75104")).toEqual([]);
  });
});
