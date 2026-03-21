"use client";

import { useState, useEffect } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, BOSS_SPRITE } from "@/components/PixelSprite";
import { ROCKET_FLOOR, BOSS_DESK } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_W = 20;
const MAP_H = 12;

const BOSS_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        // Limits
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return ROCKET_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return BOSS_DESK;
        // Desk
        if (x >= 8 && x <= 11 && y === 4) return BOSS_DESK;
        return ROCKET_FLOOR;
      }),
  );

export default function GiovanniOffice() {
  const router = useRouter();
  const { actions } = useMusic();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  useEffect(() => {
    setHasAccess(localStorage.getItem("sylphe_giovanni_unlocked") === "true");
  }, []);

  if (hasAccess === null) return null;

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-gray-900 border-red-800 h-full flex flex-col justify-center items-center">
          <h1 className="text-red-500 mb-8 blink">ACCESS DENIED</h1>
          <p className="opacity-70 text-xs mb-8">
            Niveau de clairance insuffisant pour le Sous-Sol -42.
          </p>
          <Link href="/">
            <button className="gba-btn">RETOURNER AU QG</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    { id: "boss", x: 9, y: 3, sprite: BOSS_SPRITE, type: "static" },
  ];

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);
    if (npcId === "boss") {
      actions.activateTemporarySequence("confrontation", 3);
      setDialog(
        "Giovanni : Le Projet M approche de sa phase finale. Je vois que tu as trouvé mon repaire... Déguerpis !",
      );
    } else if (tile === BOSS_DESK) {
      actions.activateTemporarySequence("power-surge");
      setDialog(
        "Terminal : [TENTATIVE DE CRACKING...] Code '7382-4B9F' accepté. 'Le clone 150 est trop instable... Ne l'approchez pas sans la Masterball.'",
      );
    }
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
      <section className="relative tile-bg pixel-grid bg-red-950 h-full">
        <WeatherOverlay />
        <div className="bg-gradient-to-b from-black to-red-950 border-b-2 border-red-900 text-red-500 text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 BUREAU DE LA DIRECTION</span>
          <span className="opacity-60">SOUS-SOL -42</span>
        </div>

        <div className="relative h-full">
          <CustomMapCanvas
            mapData={BOSS_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="w-full h-auto"
          />

          {dialog && (
            <div className="absolute bottom-4 left-0 right-0 p-3 transition-opacity">
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
