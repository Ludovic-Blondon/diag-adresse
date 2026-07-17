import { describe, expect, it } from "vitest";
import {
  scoreSeismic,
  scoreRadon,
  scoreRGA,
  scoreInondation,
  scoreICPE,
  scoreCavites,
  scoreRiskReport,
} from "../lib/scoring";
import type {
  RiskReport,
  RiskReportRisk,
  ICPEResult,
} from "../lib/types/georisques";

// Les libellés de statut proviennent de réponses réelles de l'API Géorisques
// (resultats_rapport_risque) : "Risque Existant", "Risque Existant - important",
// "Risque Concerne", "Risque non Concerne", "Risque non Connu".

function risk(overrides: Partial<RiskReportRisk> = {}): RiskReportRisk {
  return { present: true, libelle: "Risque", ...overrides };
}

function report(
  naturels: RiskReportRisk[] = [],
  technos: RiskReportRisk[] = [],
): RiskReport {
  return { risquesNaturels: naturels, risquesTechnologiques: technos };
}

function icpe(overrides: Partial<ICPEResult> = {}): ICPEResult {
  return {
    statutSeveso: null,
    regime: null,
    etatActivite: null,
    longitude: null,
    latitude: null,
    ...overrides,
  };
}

describe("scoreSeismic", () => {
  it("mappe les zones de sismicité vers les niveaux", () => {
    expect(scoreSeismic({ data: [{ code_zone: 1 }] }).level).toBe(
      "negligeable",
    );
    expect(scoreSeismic({ data: [{ code_zone: 2 }] }).level).toBe("faible");
    expect(scoreSeismic({ data: [{ code_zone: 3 }] }).level).toBe("moyen");
    expect(scoreSeismic({ data: [{ code_zone: 4 }] }).level).toBe("fort");
    expect(scoreSeismic({ data: [{ code_zone: 5 }] }).level).toBe("fort");
  });

  it("retombe en zone 1 quand la donnée est absente", () => {
    const scored = scoreSeismic({ data: [] });
    expect(scored.level).toBe("negligeable");
    expect(scored.description).toBe("Zone de sismicité 1/5");
  });
});

describe("scoreRadon", () => {
  it("mappe les classes de potentiel vers les niveaux", () => {
    expect(
      scoreRadon({ data: [{ code_insee: "75056", classe_potentiel: 1 }] })
        .level,
    ).toBe("faible");
    expect(
      scoreRadon({ data: [{ code_insee: "75056", classe_potentiel: 2 }] })
        .level,
    ).toBe("moyen");
    expect(
      scoreRadon({ data: [{ code_insee: "75056", classe_potentiel: 3 }] })
        .level,
    ).toBe("fort");
  });

  it("retombe en classe 1 quand la donnée est absente", () => {
    expect(scoreRadon({ data: [] }).level).toBe("faible");
  });
});

describe("scoreRGA", () => {
  it("mappe les codes d'exposition vers les niveaux", () => {
    expect(
      scoreRGA({ codeExposition: "1", exposition: "Exposition faible" }).level,
    ).toBe("faible");
    expect(
      scoreRGA({ codeExposition: "2", exposition: "Exposition moyenne" }).level,
    ).toBe("moyen");
    expect(
      scoreRGA({ codeExposition: "3", exposition: "Exposition forte" }).level,
    ).toBe("fort");
  });

  it("reprend le libellé humain de l'API en description", () => {
    const scored = scoreRGA({
      codeExposition: "2",
      exposition: "Exposition moyenne",
    });
    expect(scored.description).toBe("Exposition moyenne");
  });

  it("traite un corps vide (hors couverture) comme négligeable", () => {
    const scored = scoreRGA({});
    expect(scored.level).toBe("negligeable");
    expect(scored.description).toBe("Hors couverture ou non concerné");
  });

  it("traite le code 0 comme négligeable", () => {
    expect(scoreRGA({ codeExposition: "0" }).level).toBe("negligeable");
  });
});

describe("scoreInondation", () => {
  it("score « Risque Existant » à moyen, à l'adresse", () => {
    const scored = scoreInondation(
      report([
        risk({
          libelle: "Inondation",
          libelleStatutAdresse: "Risque Existant",
          libelleStatutCommune: "Risque Existant",
        }),
      ]),
    );
    expect(scored).toMatchObject({
      id: "inondation",
      level: "moyen",
      source: "adresse",
    });
  });

  it("score « Risque Existant - important » à fort", () => {
    const scored = scoreInondation(
      report([
        risk({
          libelle: "Inondation",
          libelleStatutAdresse: "Risque Existant - important",
        }),
      ]),
    );
    expect(scored?.level).toBe("fort");
  });

  it("retombe sur le statut commune quand l'adresse est « Risque non Connu »", () => {
    const scored = scoreInondation(
      report([
        risk({
          libelle: "Inondation",
          libelleStatutAdresse: "Risque non Connu",
          libelleStatutCommune: "Risque Existant",
        }),
      ]),
    );
    expect(scored).toMatchObject({
      level: "moyen",
      source: "commune",
      description: "Risque Existant",
    });
  });

  it("renvoie null quand le risque est absent ou non concerné", () => {
    expect(scoreInondation(report([]))).toBeNull();
    expect(
      scoreInondation(
        report([risk({ libelle: "Inondation", present: false })]),
      ),
    ).toBeNull();
    expect(
      scoreInondation(
        report([
          risk({
            libelle: "Inondation",
            libelleStatutAdresse: "Risque non Concerne",
            libelleStatutCommune: "Risque non Concerne",
          }),
        ]),
      ),
    ).toBeNull();
  });
});

describe("scoreICPE", () => {
  it("est négligeable sans site à proximité", () => {
    expect(scoreICPE({ data: [] }).level).toBe("negligeable");
  });

  it("score faible pour des sites non Seveso", () => {
    const scored = scoreICPE({ data: [icpe(), icpe()] });
    expect(scored.level).toBe("faible");
    expect(scored.description).toContain("2 sites");
  });

  it("score moyen dès qu'un site est Seveso seuil bas", () => {
    const scored = scoreICPE({
      data: [icpe(), icpe({ statutSeveso: "Seveso seuil bas" })],
    });
    expect(scored.level).toBe("moyen");
    expect(scored.details).toBe("Au moins un site Seveso seuil bas");
  });

  it("score fort dès qu'un site est Seveso seuil haut", () => {
    const scored = scoreICPE({
      data: [
        icpe({ statutSeveso: "Seveso seuil bas" }),
        icpe({ statutSeveso: "Seveso seuil haut" }),
      ],
    });
    expect(scored.level).toBe("fort");
    expect(scored.details).toBe("Au moins un site Seveso seuil haut");
  });
});

describe("scoreCavites", () => {
  const cavite = { nom: "Carrière", type_cavite: "carrière", commune: "Test" };

  it("gradue selon le nombre de cavités", () => {
    expect(scoreCavites({ data: [] }).level).toBe("negligeable");
    expect(scoreCavites({ data: [cavite, cavite] }).level).toBe("faible");
    expect(scoreCavites({ data: Array(5).fill(cavite) }).level).toBe("moyen");
  });
});

describe("scoreRiskReport", () => {
  it("ignore les risques couverts par les endpoints dédiés", () => {
    const scored = scoreRiskReport(
      report(
        [
          risk({
            libelle: "Inondation",
            libelleStatutAdresse: "Risque Existant",
          }),
          risk({ libelle: "Séisme", libelleStatutAdresse: "Risque Existant" }),
          risk({ libelle: "Radon", libelleStatutAdresse: "Risque Existant" }),
          risk({
            libelle: "Retrait gonflement des argiles",
            libelleStatutAdresse: "Risque Existant",
          }),
        ],
        [],
      ),
    );
    expect(scored).toEqual([]);
  });

  it("score les autres risques présents avec le bon niveau", () => {
    const scored = scoreRiskReport(
      report(
        [
          risk({
            libelle: "Remontée de nappe",
            libelleStatutAdresse: "Risque Existant",
          }),
        ],
        [
          risk({
            libelle: "Canalisations de transport de matières dangereuses",
            libelleStatutAdresse: "Risque Concerne",
          }),
        ],
      ),
    );
    expect(scored).toHaveLength(2);
    expect(scored[0]).toMatchObject({
      label: "Remontée de nappe",
      level: "moyen",
    });
    expect(scored[1]).toMatchObject({ level: "faible" });
  });

  it("écarte les risques non présents ou au statut inconnu partout", () => {
    const scored = scoreRiskReport(
      report([
        risk({ libelle: "Avalanche", present: false }),
        risk({
          libelle: "Mouvements de terrain",
          libelleStatutAdresse: "Risque non Connu",
          libelleStatutCommune: "Risque non Connu",
        }),
      ]),
    );
    expect(scored).toEqual([]);
  });
});
