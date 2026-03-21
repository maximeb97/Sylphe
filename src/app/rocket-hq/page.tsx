"use client";

import { useState, useEffect } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, TEAM_ROCKET_SPRITE } from "@/components/PixelSprite";
import { ROCKET_FLOOR, ROCKET_CRATE } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_W = 20;
const MAP_H = 12;

const ROCKET_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return ROCKET_FLOOR; // Doorway
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return ROCKET_CRATE;
        if ((x === 4 || x === 10 || x === 16) && (y === 3 || y === 8))
          return ROCKET_CRATE;
        return ROCKET_FLOOR;
      }),
  );

export default function RocketHQ() {
  const router = useRouter();
  const { actions } = useMusic();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  useEffect(() => {
    setHasAccess(localStorage.getItem("sylphe_rocket_mode") === "true");
  }, []);

  if (hasAccess === null) return null;

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-gray-900 border-gray-800 h-full flex flex-col justify-center items-center">
          <h1 className="text-white mb-8 blink">ENTRÉE INTERDITE</h1>
          <p className="opacity-70 text-xs mb-8">
            Cet entrepôt est propriété privée. Circulez.
          </p>
          <Link href="/">
            <button className="gba-btn">RETOURNER AU QG</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    { id: "grunt1", x: 10, y: 5, sprite: TEAM_ROCKET_SPRITE, type: "wander" },
    { id: "grunt2", x: 15, y: 9, sprite: TEAM_ROCKET_SPRITE, type: "static" },
  ];

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);
    if (npcId === "grunt1") {
      actions.activateTemporarySequence("alarm-siren");
      setDialog(
        "Sbire : Pff, j'ai paumé ma partie du code pour le labo... C'était 4B9F ou l'inverse ?",
      );
    }
    else if (npcId === "grunt2") {
      actions.activateTemporarySequence("alarm-siren");
      setDialog(
        "Sbire : Le projet M de Giovanni au S-S 42 avance... J'espère que cette chose est bien enfermée.",
      );
    }
    else if (tile === ROCKET_CRATE)
      setDialog(
        "Caisse : Rien d'utile, seulement des vieux uniformes de la Team Rocket.",
      );
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (y >= MAP_H - 1) {
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
      <section className="relative tile-bg pixel-grid bg-[#111] h-full">
        <WeatherOverlay />
        {/* Top bar */}
        <div className="bg-red-900 border-b-2 border-red-700 text-red-100 text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 REPAIRE SECRET</span>
          <span className="opacity-60">TEAM ROCKET</span>
        </div>

        <div className="relative h-full">
          <CustomMapCanvas
            className="opacity-90 w-full h-auto"
            mapData={ROCKET_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={2}
            initialPlayerY={2}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
          />

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity">
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
