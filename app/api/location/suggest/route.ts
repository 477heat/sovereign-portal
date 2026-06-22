import {
  GeoPlacesClient,
  GeocodeCommand,
  GeocodeFilterPlaceType,
  GeocodeIntendedUse,
  GeocodeAdditionalFeature,
} from "@aws-sdk/client-geo-places";

import type { BirthLocationSuggestion } from "@/app/portal/portal-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LocationSuggestRequest = {
  countryCode?: string;
  limit?: number;
  region?: string;
  text?: string;
};

let geoPlacesClient: GeoPlacesClient | null = null;

function getGeoPlacesClient() {
  if (!geoPlacesClient) {
    geoPlacesClient = new GeoPlacesClient({
      region:
        process.env.AWS_GEO_PLACES_REGION ??
        process.env.AWS_LOCATION_REGION ??
        process.env.AWS_REGION ??
        "us-east-1",
    });
  }

  return geoPlacesClient;
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function cleanCode(value: unknown) {
  return typeof value === "string"
    ? value.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)
    : "";
}

function getLimit(value: unknown) {
  const parsed = typeof value === "number" ? value : Number.parseInt(`${value}`, 10);

  if (!Number.isFinite(parsed)) {
    return 6;
  }

  return Math.min(Math.max(parsed, 1), 8);
}

export async function POST(request: Request) {
  let payload: LocationSuggestRequest;

  try {
    payload = (await request.json()) as LocationSuggestRequest;
  } catch {
    return Response.json({ message: "Location request must be valid JSON." }, { status: 400 });
  }

  const text = cleanText(payload.text);
  const countryCode = cleanCode(payload.countryCode);
  const region = cleanText(payload.region);
  const limit = getLimit(payload.limit);

  if (text.length < 2) {
    return Response.json({ results: [] satisfies BirthLocationSuggestion[] });
  }

  try {
    const response = await getGeoPlacesClient().send(
      new GeocodeCommand({
        AdditionalFeatures: [GeocodeAdditionalFeature.TIME_ZONE],
        Filter: {
          IncludeCountries: countryCode ? [countryCode] : undefined,
          IncludePlaceTypes: [GeocodeFilterPlaceType.LOCALITY],
        },
        IntendedUse: GeocodeIntendedUse.STORAGE,
        Key: process.env.AWS_GEO_PLACES_API_KEY,
        MaxResults: limit,
        QueryComponents: {
          Country: countryCode || undefined,
          Locality: text,
          Region: region || undefined,
        },
      }),
    );

    const results = (response.ResultItems ?? [])
      .map((item): BirthLocationSuggestion | null => {
        const [longitude, latitude] = item.Position ?? [];
        const address = item.Address;
        const city = address?.Locality ?? item.Title;
        const label = address?.Label ?? item.Title;
        const country = address?.Country?.Name;
        const normalizedCountryCode = address?.Country?.Code2 ?? countryCode;

        if (
          !item.PlaceId ||
          !label ||
          !city ||
          !country ||
          !normalizedCountryCode ||
          typeof latitude !== "number" ||
          typeof longitude !== "number"
        ) {
          return null;
        }

        return {
          city,
          country,
          countryCode: normalizedCountryCode,
          label,
          latitude,
          longitude,
          placeId: item.PlaceId,
          region: address?.Region?.Name,
          regionCode: address?.Region?.Code,
          timeZone: item.TimeZone?.Name,
        };
      })
      .filter((item): item is BirthLocationSuggestion => Boolean(item));

    return Response.json({ results });
  } catch {
    return Response.json(
      {
        message:
          "Birthplace lookup is not available yet. Check AWS Geo Places credentials and region.",
      },
      { status: 503 },
    );
  }
}
