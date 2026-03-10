"use client";

import { useState, useEffect } from "react";
import PixelSprite, { BUILDING_SPRITE } from "@/components/PixelSprite";
import StarField from "@/components/StarField";

export default function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showPress, setShowPress] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPress(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px] bg-gba-text tile-bg overflow-hidden">
      <StarField />

      {/* Logo */}
      <div
        className="relative z-10 text-center"
        style={{ animation: "slide-in-up 1s ease-out" }}
      >
        <div className="mb-2">
          <PixelSprite sprite={BUILDING_SPRITE} size={112} className="mx-auto" />
        </div>

        <h1
          className="text-gba-gold text-[18px] md:text-[22px] leading-tight tracking-wider mb-1"
          style={{
            textShadow: "2px 2px 0 #a08820, 4px 4px 0 #604810",
          }}
        >
          SYLPHE
        </h1>
        <h2
          className="text-gba-white text-[10px] md:text-[12px] tracking-[6px]"
          style={{
            textShadow: "1px 1px 0 #384030",
          }}
        >
          CORPORATION
        </h2>

        <div className="mt-4 text-[7px] text-gba-bg-dark tracking-wider">
          ─── La Technologie du Futur ───
        </div>
      </div>

      {/* Press Start */}
      {showPress && (
        <button
          onClick={onStart}
          className="relative z-10 mt-10 text-[9px] text-gba-white tracking-wider"
          style={{ animation: "pixel-pulse 1.5s ease-in-out infinite" }}
        >
          ▶ PRESS START ◀
        </button>
      )}

      {/* Version tag */}
      <div className="absolute bottom-4 right-4 text-[6px] text-gba-bg-darker z-10">
        v3.1.4
      </div>
      <div className="absolute bottom-4 left-4 text-[6px] text-gba-bg-darker z-10">
        © 2026 SYLPHE
      </div>
    </div>
  );
}
