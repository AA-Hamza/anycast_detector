import express, { Express, Router } from "express";
import { secureEndpointMiddleware } from "./middlewares/secure.middleware";
import { geoInternalRouter } from "./routers/internal/geo.router";

const app: Express = express();
const api: Router = Router();

app.use("/v1/api/", api);

// API endpoints
api.use("/internal/geo", secureEndpointMiddleware, geoInternalRouter);

export { app };
