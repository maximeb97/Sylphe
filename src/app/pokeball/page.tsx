"use client";

import { useState } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, MEW_SPRITE } from "@/components/PixelSprite";
import { POKEBALL_FLOOR, POKEBALL_WALL } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import { playPokemonCry } from "@/lib/audio";

const MAP_W = 20;
const MAP_H = 12;

const POKEBALL_MAP: number[][] = Array(MAP_H).fill(0).map((_, y) =>
  Array(MAP_W).fill(0).map((_, x) => {
    // Roundish shape approximation for walls
    if (y === MAP_H - 1 && x >= 8 && x <= 11) return POKEBALL_FLOOR;
    if (y === 0 || y === MAP_H - 1 || x === 0 || x === MAP_W - 1) return POKEBALL_WALL;
    return POKEBALL_FLOOR;
  })
);

export default function PokeballInterior() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const hasMew = typeof window !== "undefined" && localStorage.getItem("sylphe_mew_captured") === "true";
  const hasPrototype151 = typeof window !== "undefined" && localStorage.getItem("sylphe_prototype_151") === "true";

  const npcs: CustomNPC[] = [
   ...(hasMew ? [{ id: "mew", x: 10, y: 5, sprite: MEW_SPRITE, type: "wander" as const }] : []),
   ...(hasPrototype151 ? [{ id: "echo151", x: 10, y: 3, sprite: MEW_SPRITE, type: "static" as const }] : []),
  ];

  const handleInteract = (tile: number, x: number, y: number, npcId?: string) => {
    setIsTypewriterDone(false);
    setForceComplete(false);
    if (npcId === "mew") {
       playPokemonCry(151);
       setDialog("Mew voltige joyeusement dans cet espace infini...");
   } else if (npcId === "echo151") {
     setDialog(hasMew ? "L'archive 151 se tait. Le sujet originel a finalement retrouve une forme stable." : "Une silhouette blanche clignote dans la coque: 'Je n'etais pas le clone. J'etais le modele.'");
    } else if (tile === POKEBALL_WALL) {
     setDialog(hasPrototype151 ? "Les parois vibrent. Une inscription apparait puis disparait: pr0t0type_151." : hasMew ? "La paroi de la Masterball. C'est confortable à l'intérieur." : "La Masterball est vide... Un immense espace blanc vide.");
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
      <section className="relative tile-bg pixel-grid bg-white overflow-hidden h-full">
        {hasPrototype151 && <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(248,168,184,0.35),transparent_35%)] pointer-events-none z-10" />}

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={POKEBALL_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className={`w-full h-auto ${hasPrototype151 ? "saturate-125 hue-rotate-[12deg]" : ""}`}
          />

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-20">
              <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
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
