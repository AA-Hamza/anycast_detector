import http from "http";

async function getHttp(options: {
  url: string;
  timeout: number;
}): Promise<{ success: boolean; statusCode: number; data?: object }> {
  const p = new Promise((resolve, reject) => {
    http
      .get(options.url, { timeout: options.timeout || 3000 }, function(res) {
        let data = "";
        res.on("data", function(chunk) {
          data += chunk;
        });
        res.on("end", function() {
          if (res.statusCode === 200) {
            try {
              const json = JSON.parse(data);
              return resolve({ success: true, statusCode: 200, data: json });
            } catch (e) {
              console.log("Error parsing JSON!");
              return resolve({ success: false, statusCode: 200 });
            }
          } else {
            console.log("Status:", res.statusCode);
            return reject({
              success: false,
              statusCode: res.statusCode,
              data: { err: data },
            });
          }
        });
      })
      .on("error", function(err) {
        console.log("Error:", err);
        return reject({
          success: false,
          statusCode: 0,
        });
      });
  });

  const x = await p;
  return x as Awaited<ReturnType<typeof getHttp>>;
}

export { getHttp };
