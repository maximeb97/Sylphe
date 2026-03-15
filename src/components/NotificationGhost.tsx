"use client";

import { useEffect } from "react";

export default function NotificationGhost() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (localStorage.getItem("sylphe_notif_sent") === "true") return;

    // Request permission if not determined
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check every minute if it's 3 AM
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      if (hour === 3 && minute === 0 && Notification.permission === "granted") {
        new Notification("SYLPHE CORP. — Signal Intercept", {
          body: 'Sujet 150 : "J\'ai mal..."',
          icon: "/favicon.ico",
          tag: "sylphe-ghost-150",
          silent: false,
        });
        localStorage.setItem("sylphe_notif_sent", "true");
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
