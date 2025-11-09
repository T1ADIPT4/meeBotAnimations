import { spawn } from "child_process";

const dev = spawn("pnpm", ["dev"], { stdio: ["inherit", "inherit", "pipe"] });

dev.stderr.on("data", (data) => {
  const msg = data.toString();
  if (msg.includes("EADDRINUSE")) {
    console.log("⚠️ Port conflict detected — MeeBot will assist");
    // Here you could call the API or trigger a UI prompt
  }
});

dev.on("close", (code) => {
  process.exit(code ?? 0);
});
