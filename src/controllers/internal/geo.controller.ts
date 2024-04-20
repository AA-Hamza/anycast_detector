import { Request, Response } from "express";
import { getGeoLocation } from "../../utils/getGeoLocation";

async function getMyGeoLocationController(req: Request, res: Response) {
  const geoLocationResult = await getGeoLocation();
  if (geoLocationResult.success) {
    return res.status(200).json(geoLocationResult);
  }
  return res.status(500).json({ err: "error getting geolocation" });
}

export { getMyGeoLocationController };
