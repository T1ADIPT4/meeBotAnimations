import React, { useEffect, useState } from "react";
import styles from "./MeeBotKillPanel.module.css";


interface PortStatus {
  port: number;
  status: string;
  pid?: string;
  process?: string;
  killCommand?: string;
}

export default function MeeBotKillPanel() {
  const [ports, setPorts] = useState<PortStatus[]>([]);
  const [prompt, setPrompt] = useState<null | {
    port: number;
    pid: string;
    message: string;
    actions: any[];
  }>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ports/status")
      .then((res) => res.json())
      .then((data) => setPorts(data.ports));
  }, []);

  const handleMeeBotKill = async (pid: string, port: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ports/kill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid }),
      });
      const result = await res.json();
      setPrompt({
        port,
        pid,
        message: result.message || result.error || "MeeBot Kill action complete.",
        actions: [
          { label: "รีเฟรชสถานะ", type: "refresh" },
        ],
      });
      // Refresh port status after kill
      fetch("/api/ports/status")
        .then((res) => res.json())
        .then((data) => setPorts(data.ports));
    } catch (e) {
      setPrompt({
        port,
        pid,
        message: "เกิดข้อผิดพลาด MeeBot ไม่สามารถ kill process ได้",
        actions: [
          { label: "รีเฟรชสถานะ", type: "refresh" },
        ],
      });
    }
    setLoading(false);
  };

  const handlePromptAction = (action: any) => {
    if (action.type === "refresh") {
      setPrompt(null);
      fetch("/api/ports/status")
        .then((res) => res.json())
        .then((data) => setPorts(data.ports));
    }
    if (action.type === "dismiss") {
      setPrompt(null);
    }
  };

  return (
    <div className={styles.meebotKillPanel}>
      <h2 className={styles.meebotKillPanelTitle}>🧠 MeeBot Kill Panel</h2>
      {prompt ? (
        <div className={styles.meebotKillPromptBox}>
          <div>{prompt.message}</div>
          <div className={styles.meebotKillPromptActions}>
            {prompt.actions.map((a, i) => (
              <button
                key={i}
                className={styles.meebotKillButton}
                onClick={() => handlePromptAction(a)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {ports.map((p) => (
        <div key={p.port} className={styles.meebotKillPortBox}>
          <div>🔌 Port: {p.port}</div>
          <div>Status: {p.status}</div>
          {p.status === "in-use" && (
            <>
              <div>PID: {p.pid}</div>
              <div>Process: {p.process}</div>
              <button
                className={styles.meebotKillButton}
                disabled={loading}
                onClick={() => setPrompt({
                  port: p.port,
                  pid: p.pid!,
                  message: `พอร์ตนี้ติดแล้วครับ ต้องการให้ MeeBot จัดการให้ไหม?`,
                  actions: [
                    { label: "MeeBot Kill", type: "api-call", endpoint: "/api/ports/kill", payload: { pid: p.pid } },
                    { label: "ไม่เป็นไรครับ", type: "dismiss" },
                  ],
                })}
              >
                MeeBot Kill
              </button>
              <button
                className={`${styles.meebotKillButton} ${styles.meebotKillCopyButton}`}
                onClick={() => navigator.clipboard.writeText(p.killCommand || "")}
              >
                📋 Copy Kill Command
              </button>
              {/* Prompt logic */}
              {prompt && prompt.port === p.port && prompt.actions && (
                <div className={styles.meebotKillPromptActions}>
                  {prompt.actions.map((a, i) => (
                    <button
                      key={i}
                      className={styles.meebotKillButton}
                      onClick={() => {
                        if (a.type === "api-call") handleMeeBotKill(p.pid!, p.port);
                        if (a.type === "dismiss") handlePromptAction(a);
                      }}
                      disabled={loading}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {p.status === "free" && (
            <div className={styles.meebotKillFree}>✅ พร้อมใช้งาน</div>
          )}
        </div>
      ))}
    </div>
  );
}
