import { Request, Response } from "express";
import { getGeoLocation } from "../../utils/getGeoLocation";

async function getMyGeoLocationController(req: Request, res: Response) {
  const geoLocationResult = await getGeoLocation();
  if (!geoLocationResult) {
    return res.status(500).json({ err: "error getting geolocation" });
  }
  return res.status(200).json(geoLocationResult);
}

export { getMyGeoLocationController };
