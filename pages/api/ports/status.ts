import { execSync } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";

const ports = [8080, 3000, 3001];
const isWindows = process.platform === "win32";

  const fallbackPorts = [8081, 3002, 5173, 4000];
  const results = ports.map((port) => {
    try {
      const cmd = isWindows
        ? `netstat -ano | findstr :${port}`
        : `lsof -t -i:${port}`;
      const output = execSync(cmd).toString();
      const pid = isWindows
        ? output.trim().split(/\s+/).pop()
        : output.trim();

      return {
        port,
        status: "in-use",
        pid,
        process: "node", // optional: enhance with `ps` or `tasklist`
        killCommand: isWindows
          ? `taskkill /PID ${pid} /F`
          : `sudo kill -9 ${pid}`,
      };
    } catch {
      return {
        port,
        status: "free",
      };
    }
  });
  const usedPorts = results.filter((r) => r.status === "in-use").map((r) => r.port);
  const suggestedPorts = fallbackPorts.filter((p) => !usedPorts.includes(p));
  res.status(200).json({ ports: results, suggestedPorts });
}
