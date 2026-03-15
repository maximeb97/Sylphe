"use client";

import { useState } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, PORYGON_SPRITE } from "@/components/PixelSprite";
import { CYBER_FLOOR, CYBER_WALL } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import { playPokemonCry } from "@/lib/audio";
import { setGameFlag } from "@/lib/gameState";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_W = 20;
const MAP_H = 12;

const CYBER_MAP: number[][] = Array(MAP_H).fill(0).map((_, y) =>
    Array(MAP_W).fill(0).map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return CYBER_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return CYBER_WALL;
        return CYBER_FLOOR;
    })
);

export default function CyberSpace() {
    const router = useRouter();
    const [dialog, setDialog] = useState<string | null>(null);
    const [isTypewriterDone, setIsTypewriterDone] = useState(false);
    const [forceComplete, setForceComplete] = useState(false);

    const npcs: CustomNPC[] = [
        { id: "pory", x: 10, y: 5, sprite: PORYGON_SPRITE, type: "wander" },
    ];

    const handleInteract = (tile: number, x: number, y: number, npcId?: string) => {
        setIsTypewriterDone(false);
        setForceComplete(false);
        if (npcId === "pory") {
            playPokemonCry(137);
            setGameFlag("sylphe_porygon_echo");
            setDialog("Porygon: bzzz... FRAGMENT CODE: 7382... TRANSFERT VERS PROJET M...");
        }
        else if (tile === CYBER_WALL) setDialog("Alerte: Pare-feu Sylphe.net actif.");
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
        <section className="relative tile-bg pixel-grid bg-[#001] h-full shadow-[0_0_50px_rgba(0,128,255,0.2)]">
          <WeatherOverlay />
          {/* Top bar */}
          <div className="bg-[#002] border-b-2 border-cyan-800 text-cyan-400 text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none font-[PressStart2P]">
            <span>📍 SYLPHE_NET // NODE_42</span>
            <span className="opacity-60 animate-pulse">CYBER-ESPACE V2.1</span>
          </div>

          <div className="relative isolate h-full">
            {/* Cyber Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30 bg-[linear-gradient(rgba(0,255,255,0.4)_1px,transparent_1px)] bg-[length:100%_4px] animate-pulse" />

            <CustomMapCanvas
              mapData={CYBER_MAP}
              playerSprite={NEUTRAL_NPC_SPRITE}
              initialPlayerX={10}
              initialPlayerY={9}
              npcs={npcs}
              onInteract={handleInteract}
              onPlayerMove={handlePlayerMove}
              className="w-full h-auto"
            />

            {dialog && (
              <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-20">
                <DialogBox
                  isClickable={isTypewriterDone}
                  onClick={handleDialogClick}
                  className="!bg-[#001] !border-cyan-900 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                >
                  <TypewriterText
                    key={dialog}
                    text={dialog}
                    speed={40}
                    forceComplete={forceComplete}
                    className="text-[8px] md:text-[9px] leading-[18px] text-cyan-400 block"
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
