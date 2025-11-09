import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pid, port, user = "Unknown" } = req.body;

  if (!pid || isNaN(Number(pid))) {
    return res.status(400).json({ error: "Invalid PID" });
  }

  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ error: "MeeBot Kill allowed only in dev" });
  }

  try {
    const cmd = process.platform === "win32"
      ? `taskkill /PID ${pid} /F`
      : `kill -9 ${pid}`;
    require("child_process").execSync(cmd);

    await db.collection("meebot_logs").add({
      type: "MeeBotKill",
      port,
      pid,
      user,
      timestamp: new Date().toISOString(),
      emotion: "MeeBot จัดการให้เรียบร้อยแล้วครับ!",
    });

    res.status(200).json({ message: `MeeBot killed PID ${pid} successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to kill process", details: err });
  }
}
