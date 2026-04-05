export interface GeocodeFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [lon: number, lat: number];
  };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    name: string;
    postcode: string;
    citycode: string;
    city: string;
    context: string;
    type: "housenumber" | "street" | "locality" | "municipality";
    x: number;
    y: number;
    street?: string;
  };
}

export interface GeocodeResponse {
  type: "FeatureCollection";
  version: string;
  features: GeocodeFeature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

export interface GeocodeSuggestion {
  label: string;
  lon: number;
  lat: number;
  citycode: string;
  postcode: string;
  city: string;
  context: string;
  type: GeocodeFeature["properties"]["type"];
}
