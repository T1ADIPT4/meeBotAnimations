import { createServer } from "http";
import { Server } from "socket.io";
import { execSync } from "child_process";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Firestore setup
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// WebSocket setup
const server = createServer();
const io = new Server(server, { cors: { origin: "*" } });

const portsToWatch = [8080, 3000, 3001];

function checkPort(port: number): string | null {
  try {
    const output = execSync(`lsof -t -i:${port}`).toString().trim();
    return output || null;
  } catch {
    return null;
  }
}

io.on("connection", (socket) => {
  console.log("MeeBot connected");

  setInterval(async () => {
    portsToWatch.forEach(async (port) => {
      const pid = checkPort(port);
      if (pid) {
        const message = `⚠️ พอร์ต ${port} ถูกใช้งานโดย PID ${pid} — ให้ MeeBot ช่วยไหมครับ?`;

        socket.emit("portConflict", { port, pid, message });

        await db.collection("meebot_logs").add({
          type: "PortConflictDetected",
          port,
          pid,
          timestamp: new Date().toISOString(),
          message,
        });
      }
    });
  }, 5000);
});

server.listen(3001, () => console.log("✅ MeeBot WebSocket server running on port 3001"));
