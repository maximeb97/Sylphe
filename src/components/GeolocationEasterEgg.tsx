"use client";

import { useEffect, useState } from "react";
import { setGameFlag } from "@/lib/gameState";

export default function GeolocationEasterEgg() {
  const [message, setMessage] = useState<string | null>(null);
  const [checked, setChecked] = useState(() => typeof window !== "undefined" && localStorage.getItem("sylphe_geo_checked") === "true");

  useEffect(() => {
    if (checked) return;
    if (typeof window === "undefined") return;

    // Delay before asking for geolocation
    const timer = setTimeout(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setChecked(true);
          localStorage.setItem("sylphe_geo_checked", "true");
          const { latitude, longitude } = pos.coords;

          // Tokyo/Kanto region check (~35.6762, ~139.6503)
          const isKanto = latitude > 35.0 && latitude < 36.5 && longitude > 139.0 && longitude < 140.5;

          if (isKanto) {
            setGameFlag("sylphe_magnet_train_pass");
            setMessage("🚄 Signal GPS confirme: Region de KANTO detectee ! PASSE TRAIN MAGNETIQUE obtenu !");
          } else {
            setMessage("📡 Signal lointain... Vous n'etes pas dans la region de Kanto.");
          }

          // Clear message after delay
          setTimeout(() => setMessage(null), 8000);
        },
        () => {
          setChecked(true);
          localStorage.setItem("sylphe_geo_checked", "true");
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    }, 15000);

    return () => clearTimeout(timer);
  }, [checked]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-[#1a1a2e] border border-[#2a2a4a] p-3 rounded shadow-lg max-w-[200px] animate-pulse"
      style={{ animation: "fade-in 0.5s ease-out" }}>
      <p className="text-[7px] text-gba-accent leading-[12px]">{message}</p>
    </div>
  );
}
