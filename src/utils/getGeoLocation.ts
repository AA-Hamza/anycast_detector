import NodeCache from "node-cache";
import { getHttp } from "./request";

const geoLocationCache = new NodeCache();

async function getGeoLocation(
  ip?: string,
): Promise<{ success: boolean; lat?: string; lon?: string }> {
  const cacheKey = ip || "local";
  const cacheResult = geoLocationCache.get(cacheKey);
  if (cacheResult) {
    return cacheResult as Awaited<ReturnType<typeof getGeoLocation>>;
  }

  const apiResult = await getHttp({
    url: `http://ip-api.com/json/${ip}?fields=status,lat,lon`,
    timeout: 3000,
  });
  if (apiResult.success && apiResult.data) {
    geoLocationCache.set(cacheKey, apiResult.data);
    return apiResult.data as Awaited<ReturnType<typeof getGeoLocation>>;
  }
  return {
    success: false,
  };
}

export { getGeoLocation };
