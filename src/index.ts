// import { app } from "./app";
// import { AppConfig } from "./config";

// app.listen(AppConfig.port, () => {
//   console.log(
//     `[server]: Server is running at http://localhost:${AppConfig.port}`,
//   );
// });

import serverlessExpress from "@codegenie/serverless-express";
import { app } from "./app";

// serverlessExpress
const cachedServerlessExpress = serverlessExpress({ app });

module.exports = async function(context, req) {
  return cachedServerlessExpress(context, req);
};
