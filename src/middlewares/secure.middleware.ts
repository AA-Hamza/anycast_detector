import { NextFunction, Request, Response } from "express";
import { AppConfig } from "..";

async function secureEndpointMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (AppConfig.internalApiKey != req.header("x-api-key")) {
    return res.status(401).json({ err: "unauthorized" });
  } else {
    return next();
  }
}

export { secureEndpointMiddleware };
