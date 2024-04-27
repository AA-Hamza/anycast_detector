import { Router, json } from "express";
import { postAnyCastController } from "../controllers/anycast.controller";

const anycastRouter = Router();
anycastRouter.use(json());

anycastRouter.post("/", postAnyCastController);

export { anycastRouter };
