"use client";

import { useState } from "react";
import Link from "next/link";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, MISSINGNO_SPRITE } from "@/components/PixelSprite";
import { GLITCH_TILE, GLITCH_WALL } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import { playGlitchSound } from "@/lib/audio";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_W = 20;
const MAP_H = 12;

const GLITCH_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        // Highly disordered map
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return GLITCH_WALL;
        return Math.random() < 0.3 ? GLITCH_WALL : GLITCH_TILE;
      }),
  );

export default function GlitchCity() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  const npcs: CustomNPC[] = [
    { id: "missing1", x: 5, y: 5, sprite: MISSINGNO_SPRITE, type: "wander" },
    { id: "missing2", x: 15, y: 3, sprite: MISSINGNO_SPRITE, type: "wander" },
    { id: "missing3", x: 10, y: 8, sprite: MISSINGNO_SPRITE, type: "static" },
  ];

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);
    if (npcId) {
      playGlitchSound();
      setDialog(
        "§%* ERROR : µ@& DATA CORRUPTED 0x9F4C... Item quantity x128. SILPH SCOPE UNLOCKED. CODE (PART 2): 4B9F...",
      );
      localStorage.setItem("sylphe_rich", "true"); // Easter egg combo!
      localStorage.setItem("sylphe_silph_scope", "true");
      window.dispatchEvent(new Event("storage"));
    } else if (tile === GLITCH_WALL) setDialog("Le mur est intangible...");
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (x <= 0 || x >= MAP_W - 1 || y <= 0 || y >= MAP_H - 1) {
      router.push("/");
    }
  };

  const handleDialogClick = () => {
    if (isTypewriterDone) {
      setDialog(null);
      setIsTypewriterDone(false);
      setForceComplete(false);
    } else {
      setForceComplete(true);
    }
  };

  return (
    <GBAShell>
      <section
        className="relative tile-bg pixel-grid bg-white h-full"
        style={{ cursor: "none" }}
      >
        <WeatherOverlay />

        {/* Top bar completely glitched */}
        <div className="bg-black text-fuchsia-500 text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span className="animate-pulse">📍 ??&%# ERROR</span>
          <span className="animate-[spin_10s_linear_infinite]">SYS_0x00</span>
        </div>

        <div className="relative isolate h-full">
          {/* Heavy noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-50 bg-repeat"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)"/%3E%3C/svg%3E\')',
            }}
          />

          <CustomMapCanvas
            className="hue-rotate-180 invert brightness-150 w-full h-auto"
            mapData={GLITCH_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={6}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
          />

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-[100]">
              <DialogBox
                isClickable={isTypewriterDone}
                onClick={handleDialogClick}
              >
                <TypewriterText
                  key={dialog}
                  text={dialog}
                  speed={40}
                  forceComplete={forceComplete}
                  className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                  onComplete={() => setIsTypewriterDone(true)}
                />
              </DialogBox>
            </div>
          )}
        </div>
      </section>
    </GBAShell>
  );
}
