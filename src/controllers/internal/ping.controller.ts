import { Request, Response } from "express";
import { pingAveraged } from "../../utils/ping";

async function getPingController(req: Request, res: Response) {
  if (!req.query["dest"]) {
    return res.status(400).json({ err: "expected query dest to be defined" });
  }
  const dest = req.query["dest"];
  const port = req.query["port"] ? parseInt(req.query["port"].toString()) : 80;
  if (isNaN(port)) {
    return res.status(400).json({ err: "expected query port to be valid" });
  }

  console.log("dest", dest);
  const avg = await pingAveraged({ host: dest.toString(), port: port });
  console.log("avg", avg);
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
