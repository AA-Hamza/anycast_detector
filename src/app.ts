import express, { Express, Router } from "express";
import morgan from "morgan";
import { secureEndpointMiddleware } from "./middlewares/secure.middleware";
import { geoInternalRouter } from "./routers/internal/geo.router";
import { pingInternalRouter } from "./routers/internal/ping.router";
import { anycastRouter } from "./routers/anycast.router";
import { healthRouter } from "./routers/health.router";

const app: Express = express();
const api: Router = Router();

app.use(morgan("dev"));
app.use("/v1/api/", api);

// API endpoints
// Public
api.use("/anycast", anycastRouter);
api.use("/health", healthRouter);
// Secured
api.use("/internal/geo", secureEndpointMiddleware, geoInternalRouter);
api.use("/internal/ping", secureEndpointMiddleware, pingInternalRouter);

export { app };
