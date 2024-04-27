import { Router } from "express";
import { getPingController } from "../../controllers/internal/ping.controller";

const pingInternalRouter = Router();

pingInternalRouter.get("/", getPingController);

export { pingInternalRouter };
