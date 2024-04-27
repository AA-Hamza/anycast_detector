import {
  askAnotherAnyCatcherForGeoLocation,
  getGeoLocation,
  GeoLocationResult,
} from "./getGeoLocation";

const SPEED_OF_LIGHT_IN_KM_PER_SECOND = 300_000;

async function distanceBetween2GeoLocationsInKm(
  first: GeoLocationResult,
  second: GeoLocationResult,
): Promise<number> {
  const lat1 = parseFloat(first.lat);
  const lon1 = parseFloat(first.lon);

  const lat2 = parseFloat(second.lat);
  const lon2 = parseFloat(second.lon);
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // For Kilometer
    return dist;
  }
}

async function getTheorticalLatencyToServer(
  server: URL | string,
): Promise<number | undefined> {
  const otherGeoLocation = await askAnotherAnyCatcherForGeoLocation(server);
  const myGeoLocation = await getGeoLocation();
  if (!otherGeoLocation || !myGeoLocation) {
    return undefined;
  }

  const distanceInKm = await distanceBetween2GeoLocationsInKm(
    myGeoLocation,
    otherGeoLocation,
  );

  const latencyInMilliSeconds =
    (distanceInKm / SPEED_OF_LIGHT_IN_KM_PER_SECOND) * 1000;

  return latencyInMilliSeconds * 2; // x2 because of RTT
}

export { getTheorticalLatencyToServer };
