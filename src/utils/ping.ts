// Taken from:
// https://github.com/notechsolution/tcp-ping-node/blob/main/ping.js
// Modified to be typescript friendly

/*
The MIT License (MIT)

Copyright (c) 2021 Lames Zeng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.;
*/

import net from "node:net";

function getElapsedTime(startAt: [number, number]): string {
  const elapsed = process.hrtime(startAt);
  const ms = elapsed[0] * 1e3 + elapsed[1] * 1e-6;
  return ms.toFixed(3);
}

type PingOptions = {
  host: string;
  port?: number;
  timeout?: number;
};

async function ping(options: PingOptions): Promise<{
  host: string;
  port: number;
  success: boolean;
  time?: string;
  error?: string;
}> {
  const host = options.host || "localhost";
  const port = options.port || 80;
  const timeout = options.timeout || 5000;
  const start: [number, number] = process.hrtime();
  const result: Awaited<ReturnType<typeof ping>> = {
    host: host,
    port: port,
    success: false,
  };
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.connect(port, host, () => {
      result.time = getElapsedTime(start);
      result.success = true;
      socket.destroy();
      resolve(result);
    });

    socket.on("error", (e) => {
      result.time = getElapsedTime(start);
      result.success = false;
      result.error = e.message;
      socket.destroy();
      resolve(result);
    });

    socket.setTimeout(timeout, () => {
      result.time = getElapsedTime(start);
      result.success = false;
      result.error = "Request Timeout";
      socket.destroy();
      resolve(result);
    });
  });
}

async function pingAveraged(
  options: PingOptions,
  numberOfTries: number = 3,
): Promise<number | undefined> {
  try {
    const promisesArray: ReturnType<typeof ping>[] = [];
    for (let i = 0; i < numberOfTries; i++) {
      promisesArray.push(ping(options));
    }

    const results = await Promise.all(promisesArray);
    let sum = 0;
    for (let i = 0; i < numberOfTries; i++) {
      const resultFreezed = Object.freeze(results[i]);
      if (!resultFreezed.success || !resultFreezed.time) {
        return undefined;
      }
      sum += parseFloat(resultFreezed.time);
    }
    return sum / numberOfTries;
  } catch (err) {
    console.log("pingAveraged err:", err);
    return undefined;
  }
}

export { ping, pingAveraged };
