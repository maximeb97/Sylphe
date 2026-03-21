"use client";

import { useState, useEffect } from "react";
import PixelSprite, { BUILDING_SPRITE } from "@/components/PixelSprite";
import StarField from "@/components/StarField";

function DiscordIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M19.73 5.34A16.66 16.66 0 0 0 15.65 4c-.18.32-.39.76-.53 1.1a15.47 15.47 0 0 0-4.24 0A11.5 11.5 0 0 0 10.35 4a16.52 16.52 0 0 0-4.09 1.35C3.67 9.25 2.97 13.05 3.32 16.8a16.83 16.83 0 0 0 5.01 2.53c.4-.53.76-1.1 1.06-1.71-.58-.22-1.13-.5-1.64-.82.14-.1.28-.21.41-.32 3.16 1.48 6.59 1.48 9.72 0 .14.11.28.22.42.32-.52.33-1.07.6-1.65.82.3.61.66 1.18 1.06 1.71a16.72 16.72 0 0 0 5.02-2.53c.4-4.34-.68-8.1-2.99-11.46ZM9.83 14.49c-.95 0-1.73-.88-1.73-1.96 0-1.08.76-1.96 1.73-1.96.97 0 1.75.88 1.73 1.96 0 1.08-.76 1.96-1.73 1.96Zm4.34 0c-.95 0-1.73-.88-1.73-1.96 0-1.08.76-1.96 1.73-1.96.97 0 1.75.88 1.73 1.96 0 1.08-.76 1.96-1.73 1.96Z" />
    </svg>
  );
}

export default function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showPress, setShowPress] = useState(false);
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL;

  useEffect(() => {
    const t = setTimeout(() => setShowPress(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px] bg-gba-text tile-bg overflow-hidden">
      <StarField />

      {discordUrl && (
        <a
          href={discordUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Rejoindre le Discord Sylphe"
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 bg-gba-bg-dark px-3 py-2 text-[7px] text-gba-white pixel-border transition-transform hover:-translate-y-1"
        >
          <DiscordIcon />
          <span className="tracking-[2px]">DISCORD</span>
        </a>
      )}

      {/* Logo */}
      <div
        className="relative z-10 text-center"
        style={{ animation: "slide-in-up 1s ease-out" }}
      >
        <div className="mb-2">
          <PixelSprite
            sprite={BUILDING_SPRITE}
            size={112}
            className="mx-auto"
          />
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
          ▶ ENTRER ◀
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
