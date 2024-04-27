import { Request, Response } from "express";
import { broadCast } from "../utils/broadcast";
import { getHttp } from "../utils/request";
import { getTheorticalLatencyToServer } from "../utils/distance";
import { AppConfig } from "../config";

async function postAnyCastController(req: Request, res: Response) {
  if (!req.body["dest"]) {
    return res.status(400).json({ err: "expected body dest to be defined" });
  }
  const dest = req.body["dest"];

  const port = req.body["port"] ? parseInt(req.body["port"].toString()) : 80;
  if (isNaN(port)) {
    return res.status(400).json({ err: "expected query port to be valid" });
  }
  const results = await broadCast(dest, port);

  let thisServerResult: Awaited<ReturnType<typeof getHttp>> | undefined =
    undefined;
  for (const result of results) {
    if (result.server.toString() == AppConfig.thisServer.toString()) {
      thisServerResult = await result.result;
    }
  }

  let thisServerLatencyAvg: number = NaN;
  if (!thisServerResult || !thisServerResult.success) {
    console.log(
      "could not get the theortical latency from this server:",
      JSON.stringify(thisServerResult),
    );
    return res.status(500).json({
      err: "could not get the latency from this server to the destination",
    });
  } else {
    thisServerLatencyAvg = parseFloat(
      thisServerResult.data?.["result"]?.["avg"],
    );

    if (isNaN(thisServerLatencyAvg)) {
      console.log(
        "could not extract the latency from this server to the destination:",
        JSON.stringify(thisServerResult),
      );
      return res.status(500).json({
        err: "could not extract the latency from this server to the destination",
      });
    }
  }

  // Not the best approach as we need to wait for ANY server to respond
  const detailsArray: {
    this: number;
    remote: number;
    theorticalThisToRemote: number;
  }[] = [];
  for (const result of results) {
    if (result.server.toString() == AppConfig.thisServer.toString()) {
      continue;
    }
    const theorticalLatencyToRemoteServer = await getTheorticalLatencyToServer(
      result.server,
    );
    if (!theorticalLatencyToRemoteServer) {
      console.log(
        "could not get the theortical latency to remote server:",
        result.server.toString(),
      );
      continue;
    }
    const remoteServerResp = await result.result;
    if (remoteServerResp.success && remoteServerResp.statusCode === 200) {
      const remoteLatencyAvg = parseFloat(
        remoteServerResp.data?.["result"]?.["avg"],
      );
      if (!isNaN(remoteLatencyAvg)) {
        detailsArray.push({
          this: thisServerLatencyAvg,
          remote: remoteLatencyAvg,
          theorticalThisToRemote: theorticalLatencyToRemoteServer,
        });
        if (
          remoteLatencyAvg + thisServerLatencyAvg <
          theorticalLatencyToRemoteServer
        ) {
          return res.status(200).json({
            success: true,
            result: {
              dest: dest,
              anycast: true,
              details: detailsArray,
            },
          });
        }
      } else {
        console.log(
          "latency to remote server:",
          result.server,
          " could not be extracted, resp: ",
          JSON.stringify(remoteServerResp),
        );
      }
    } else {
      console.log(
        "request to remote server:",
        result.server.toString(),
        " failed, resp: ",
        JSON.stringify(remoteServerResp),
      );
    }
  }
  return res.status(200).json({
    success: true,
    result: {
      dest: dest,
      anycast: false,
      details: detailsArray,
    },
  });
}

export { postAnyCastController };
