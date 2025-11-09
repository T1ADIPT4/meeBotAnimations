import { useEffect } from "react";
import { io } from "socket.io-client";

export default function MeeBotSocketListener() {
    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("portConflict", (data) => {
            // Trigger MeeBot Prompt UI
            window.dispatchEvent(new CustomEvent("meebot:prompt", { detail: data }));
        });

        return () => { socket.disconnect(); };
    }, []);

    return null;
}
