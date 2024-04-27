import { Router } from "express";
import { getMyGeoLocationController } from "../../controllers/internal/geo.controller";

const geoInternalRouter = Router();

geoInternalRouter.get("/", getMyGeoLocationController);

export { geoInternalRouter };
