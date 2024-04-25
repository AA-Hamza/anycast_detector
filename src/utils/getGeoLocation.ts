import NodeCache from "node-cache";
import { getHttp } from "./request";
import { AppConfig } from "..";

type GeoLocationResult = { lat: string; lon: string };
const geoLocationCache = new NodeCache();

async function getGeoLocation(
  ip?: string,
): Promise<GeoLocationResult | undefined> {
  const cacheKey = ip || "local";
  const cacheResult = geoLocationCache.get(cacheKey);
  if (cacheResult) {
    return cacheResult as Awaited<ReturnType<typeof getGeoLocation>>;
  }

  const apiResult = await getHttp({
    url: `http://ip-api.com/json/${ip ?? ""}?fields=status,lat,lon`,
    timeout: 3000,
  });

  if (apiResult.success && apiResult.data) {
    const geoResult: GeoLocationResult = {
      lat: apiResult.data["lat"],
      lon: apiResult.data["lon"],
    };
    if (!geoResult["lat"] || !geoResult["lon"]) {
      return undefined;
    }
    geoLocationCache.set(cacheKey, geoResult);
    return geoResult;
  }
  return undefined;
}

async function askAnotherAnyCatcherForGeoLocation(
  url: URL | string,
): Promise<GeoLocationResult | undefined> {
  const cacheKey = url.toString();
  const cacheResult = geoLocationCache.get(cacheKey);
  if (cacheResult) {
    return cacheResult as Awaited<
      ReturnType<typeof askAnotherAnyCatcherForGeoLocation>
    >;
  }

  url = new URL(url);
  url.pathname = "/v1/api/internal/geo";
  const callResult = await getHttp({
    url: url,
    headers: {
      "x-api-key": AppConfig.internalApiKey,
    },
    timeout: 15000,
  });
  if (callResult.success) {
    geoLocationCache.set(cacheKey, callResult.data);
    return callResult.data as Awaited<
      ReturnType<typeof askAnotherAnyCatcherForGeoLocation>
    >;
  } else {
    return undefined;
  }
}

export {
  getGeoLocation,
  askAnotherAnyCatcherForGeoLocation,
  GeoLocationResult,
};
