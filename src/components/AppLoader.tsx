import { useEffect, useState } from "react";
import "./AppLoader.css";

export default function AppLoader({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="app-loader">
      <h1 className="app-title">MeeChain</h1>
    </div>
  );
}
