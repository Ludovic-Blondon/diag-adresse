import { DEPARTEMENTS, getDepartementCode } from "./departements";
import { TOP_COMMUNES, type TopCommune } from "./communes";

export interface Region {
  code: string;
  name: string;
  departements: string[];
}

export const REGIONS: Region[] = [
  {
    code: "ile-de-france",
    name: "Ile-de-France",
    departements: ["75", "77", "78", "91", "92", "93", "94", "95"],
  },
  {
    code: "auvergne-rhone-alpes",
    name: "Auvergne-Rhone-Alpes",
    departements: [
      "01",
      "03",
      "07",
      "15",
      "26",
      "38",
      "42",
      "43",
      "63",
      "69",
      "73",
      "74",
    ],
  },
  {
    code: "bourgogne-franche-comte",
    name: "Bourgogne-Franche-Comte",
    departements: ["21", "25", "39", "58", "70", "71", "89", "90"],
  },
  {
    code: "bretagne",
    name: "Bretagne",
    departements: ["22", "29", "35", "56"],
  },
  {
    code: "centre-val-de-loire",
    name: "Centre-Val de Loire",
    departements: ["18", "28", "36", "37", "41", "45"],
  },
  {
    code: "corse",
    name: "Corse",
    departements: ["2A", "2B"],
  },
  {
    code: "grand-est",
    name: "Grand Est",
    departements: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  },
  {
    code: "hauts-de-france",
    name: "Hauts-de-France",
    departements: ["02", "59", "60", "62", "80"],
  },
  {
    code: "normandie",
    name: "Normandie",
    departements: ["14", "27", "50", "61", "76"],
  },
  {
    code: "nouvelle-aquitaine",
    name: "Nouvelle-Aquitaine",
    departements: [
      "16",
      "17",
      "19",
      "23",
      "24",
      "33",
      "40",
      "47",
      "64",
      "79",
      "86",
      "87",
    ],
  },
  {
    code: "occitanie",
    name: "Occitanie",
    departements: [
      "09",
      "11",
      "12",
      "30",
      "31",
      "32",
      "34",
      "46",
      "48",
      "65",
      "66",
      "81",
      "82",
    ],
  },
  {
    code: "pays-de-la-loire",
    name: "Pays de la Loire",
    departements: ["44", "49", "53", "72", "85"],
  },
  {
    code: "provence-alpes-cote-d-azur",
    name: "Provence-Alpes-Cote d'Azur",
    departements: ["04", "05", "06", "13", "83", "84"],
  },
  {
    code: "outre-mer",
    name: "Outre-mer",
    departements: ["971", "972", "973", "974", "975", "976"],
  },
];

/** Find the region containing a given departement code */
export function getRegionForDepartement(depCode: string): Region | undefined {
  return REGIONS.find((r) => r.departements.includes(depCode));
}

/** Find a region by its slug/code */
export function getRegionByCode(code: string): Region | undefined {
  return REGIONS.find((r) => r.code === code);
}

/** Get TOP_COMMUNES entries that belong to a given departement */
export function getTopCommunesForDepartement(depCode: string): TopCommune[] {
  return TOP_COMMUNES.filter((c) => getDepartementCode(c.code) === depCode);
}

/** Get TOP_COMMUNES entries that belong to any departement of a region */
export function getTopCommunesForRegion(region: Region): TopCommune[] {
  const deps = new Set(region.departements);
  return TOP_COMMUNES.filter((c) => deps.has(getDepartementCode(c.code)));
}

/** Get active departements with names for a region, for use in navigation links */
export function getDepartementsForRegion(
  region: Region,
): { code: string; name: string }[] {
  return region.departements
    .filter((code) => DEPARTEMENTS[code])
    .map((code) => ({ code, name: DEPARTEMENTS[code] }));
}
