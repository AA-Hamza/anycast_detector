import { AppConfig } from "..";
import { getHttp } from "./request";

async function broadCast(
  destinationIp: string,
  port: number = 80,
): Promise<
  {
    server: string | URL;
    result: ReturnType<typeof getHttp>;
  }[]
> {
  console.log("boradcasting to: ", destinationIp);
  const promisesArray: Awaited<ReturnType<typeof broadCast>> = [];

  for (const server of AppConfig.serversListString) {
    const url = new URL(server);
    url.pathname = "/v1/api/internal/ping";
    url.search = `dest=${destinationIp}&port=${port}`;
    promisesArray.push({
      server: server,
      result: getHttp({
        url: url,
        headers: {
          "x-api-key": AppConfig.internalApiKey,
        },
        timeout: 15000,
      }),
    });
  }

  return promisesArray;
}

export { broadCast };
