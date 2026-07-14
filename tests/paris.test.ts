import { describe, expect, it } from "vitest";
import { toHubeauCode } from "../lib/paris";

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
