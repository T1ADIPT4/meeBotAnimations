import { execSync } from "child_process";

const ports = [8080, 3000, 3001];
const isWindows = process.platform === "win32";

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
      suggestedKill: isWindows
        ? `taskkill /PID ${pid} /F`
        : `sudo kill -9 ${pid}`,
    };
  } catch {
    return {
      port,
      status: "free",
      suggestion: "พร้อมใช้งาน",
    };
  }
});

console.log(JSON.stringify(results, null, 2));
