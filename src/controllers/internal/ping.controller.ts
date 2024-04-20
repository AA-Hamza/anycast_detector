import { Request, Response } from "express";
import { pingAveraged } from "../../utils/ping";

async function getPingController(req: Request, res: Response) {
  if (!req.query["dest"]) {
    return res.status(400).json({ err: "expected query dest to be defined" });
  }
  const dest = req.query["dest"].toString();
  const avg = await pingAveraged({ host: dest });
  if (avg) {
    return res.status(200).json({
      success: true,
      result: {
        avg: avg,
      },
    });
  } else {
    return res.status(500).json({
      success: false,
    });
  }
}

export { getPingController };
