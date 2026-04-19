import { DEPARTEMENTS, getDepartementCode } from "./departements";
import { TOP_COMMUNES, type TopCommune } from "./communes";

export interface Region {
  name: string;
  departements: string[];
}

export const REGIONS: Region[] = [
  {
    name: "Ile-de-France",
    departements: ["75", "77", "78", "91", "92", "93", "94", "95"],
  },
  {
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
    name: "Bourgogne-Franche-Comte",
    departements: ["21", "25", "39", "58", "70", "71", "89", "90"],
  },
  {
    name: "Bretagne",
    departements: ["22", "29", "35", "56"],
  },
  {
    name: "Centre-Val de Loire",
    departements: ["18", "28", "36", "37", "41", "45"],
  },
  {
    name: "Corse",
    departements: ["2A", "2B"],
  },
  {
    name: "Grand Est",
    departements: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
  },
  {
    name: "Hauts-de-France",
    departements: ["02", "59", "60", "62", "80"],
  },
  {
    name: "Normandie",
    departements: ["14", "27", "50", "61", "76"],
  },
  {
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
    name: "Pays de la Loire",
    departements: ["44", "49", "53", "72", "85"],
  },
  {
    name: "Provence-Alpes-Cote d'Azur",
    departements: ["04", "05", "06", "13", "83", "84"],
  },
  {
    name: "Outre-mer",
    departements: ["971", "972", "973", "974", "975", "976"],
  },
];

/** Find the region containing a given departement code */
export function getRegionForDepartement(depCode: string): Region | undefined {
  return REGIONS.find((r) => r.departements.includes(depCode));
}

/** Get TOP_COMMUNES entries that belong to a given departement */
export function getTopCommunesForDepartement(depCode: string): TopCommune[] {
  return TOP_COMMUNES.filter((c) => getDepartementCode(c.code) === depCode);
}

/** Get active departements with names for a region, for use in navigation links */
export function getDepartementsForRegion(
  region: Region,
): { code: string; name: string }[] {
  return region.departements
    .filter((code) => DEPARTEMENTS[code])
    .map((code) => ({ code, name: DEPARTEMENTS[code] }));
}
