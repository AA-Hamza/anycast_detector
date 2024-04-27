import { app } from "./app";
import { AppConfig } from "./config";

app.listen(AppConfig.port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${AppConfig.port}`,
  );
});
