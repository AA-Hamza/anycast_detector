import "dotenv/config";
// Checking env vars
if (!process.env.SERVERS) {
  throw new Error(
    "env var SERVERS must be defined and not empty, please add your servers URLs/IPs seperated by |",
  );
}

if (!process.env.THIS_SERVER) {
  throw new Error(
    "env var THIS_SERVER must be defined and not empty, please add this server URL",
  );
}

if (!process.env.INTERNAL_API_KEY) {
  throw new Error("env var INTERNAL_API_KEY must be defined and not empty");
}

const AppConfig = {
  port: process.env.PORT || 3000,
  thisServer: new URL(process.env.THIS_SERVER),
  serversListString: process.env.SERVERS.trim()
    .split("|")
    .map((x) => new URL(x)),
  internalApiKey: process.env.INTERNAL_API_KEY,
};

import { app } from "./app";

app.listen(AppConfig.port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${AppConfig.port}`,
  );
});

export { AppConfig };
