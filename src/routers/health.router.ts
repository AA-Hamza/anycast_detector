import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_, res) => {
  return res.status(200).json({ health: "ok" });
});

export { healthRouter };
