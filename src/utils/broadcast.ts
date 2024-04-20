import { AppConfig } from "..";
import { getHttp } from "./request";

async function broadCast(destinationIp: string): Promise<
  {
    server: string | URL;
    result: ReturnType<typeof getHttp>;
  }[]
> {
  // const promisesArray: {
  //   server: string | URL;
  //   result: ReturnType<typeof getHttp>;
  // }[] = [];
  const promisesArray: Awaited<ReturnType<typeof broadCast>> = [];

  for (const server of AppConfig.serversListString) {
    const url = new URL(server);
    url.pathname = "/v1/api/internal/ping";
    url.search = "dest=" + destinationIp;
    promisesArray.push({
      server: server,
      result: getHttp({
        url: url,
        timeout: 15000,
      }),
    });
  }

  return promisesArray;
}

export { broadCast };
