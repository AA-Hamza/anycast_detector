import http from "http";

async function getHttp(options: {
  url: string | URL;
  headers?: Record<string, string>;
  timeout: number;
}): Promise<{ success: boolean; statusCode: number; data?: object }> {
  console.log("sending getHttp:", JSON.stringify(options));
  const p = new Promise((resolve) => {
    http
      .get(
        options.url,
        { timeout: options.timeout || 3000, headers: options.headers },
        function(res) {
          let data = "";
          res.on("data", function(chunk) {
            data += chunk;
          });
          res.on("end", function() {
            if (res.statusCode === 200) {
              try {
                const json = JSON.parse(data);
                console.log(
                  "result getHttp:",
                  JSON.stringify(options),
                  JSON.stringify({ json }),
                );
                return resolve({ success: true, statusCode: 200, data: json });
              } catch (e) {
                console.log("Error parsing JSON!");
                return resolve({ success: false, statusCode: 200 });
              }
            } else {
              console.log("Status:", res.statusCode);
              return resolve({
                success: false,
                statusCode: res.statusCode,
                data: { err: data },
              });
            }
          });
        },
      )
      .on("error", function(err) {
        console.log("Error:", err);
        return resolve({
          success: false,
          statusCode: 0,
        });
      });
  });

  return (await p) as Awaited<ReturnType<typeof getHttp>>;
}

export { getHttp };
