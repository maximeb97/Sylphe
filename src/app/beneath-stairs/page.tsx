"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { useMusic } from "@/hooks/useMusic";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import {
  GHOST_SPRITE,
  NEUTRAL_NPC_SPRITE,
  SCIENTIST_SPRITE,
} from "@/components/PixelSprite";
import {
  CERULEAN_STAIRS,
  IN_FLOOR,
  IN_WALL,
  PC_DESK,
} from "@/components/tilemap/tiles";
import { setGameFlag } from "@/lib/gameState";

const MAP_W = 20;
const MAP_H = 12;

const BENEATH_STAIRS_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return CERULEAN_STAIRS;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return IN_WALL;
        if (y === 2 && x >= 8 && x <= 11) return IN_FLOOR;
        if (y === 5 && x >= 8 && x <= 11) return PC_DESK;
        if ((x <= 4 || x >= 15) && y >= 2 && y <= 9) return IN_WALL;
        return IN_FLOOR;
      }),
  );

export default function BeneathStairsPage() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  if (typeof window === "undefined") return null;

  const hasAccess =
    localStorage.getItem("sylphe_red_defeated") === "true" &&
    localStorage.getItem("sylphe_white_room_hint") === "true";
  const hasPrototype151 =
    localStorage.getItem("sylphe_prototype_151") === "true";
  const hasWhiteRoomUnlocked =
    localStorage.getItem("sylphe_white_room_unlocked") === "true";

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-[#0c0d12] border-slate-900 h-full flex flex-col justify-center items-center">
          <h1 className="text-slate-200 mb-8 blink">PASSAGE INTROUVABLE</h1>
          <p className="text-[8px] leading-[16px] text-slate-300 mb-8">
            L&apos;espace sous l&apos;escalier n&apos;apparait qu&apos;aux operateurs qui ont vu le
            faux bug du Hall of Fame et battu RED.
          </p>
          <Link href="/cerulean-cave">
            <button className="gba-btn">RETOUR A LA GROTTE</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    {
      id: "echo",
      x: 10,
      y: 3,
      sprite: GHOST_SPRITE,
      type: "static",
    },
    {
      id: "tech",
      x: 6,
      y: 8,
      sprite: SCIENTIST_SPRITE,
      type: "static",
    },
  ];

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);

    if (npcId === "echo") {
      actions.activateTemporarySequence("void-call");
      setDialog(
        hasWhiteRoomUnlocked
          ? "L'echo residuel ne fuit plus. Il designe silencieusement la membrane blanche ouverte au sommet du couloir."
          : "Une voix blanchie par le bruit murmure: 'je suis reste derriere l'escalier pendant que 150 occupait toute la scene'.",
      );
      return;
    }

    if (npcId === "tech") {
      actions.activateTemporarySequence("membrane-pulse");
      setDialog(
        "Journal residuel: 'Nous avions prevu une salle sterile sous la grotte. Giovanni voulait 150. Le systeme, lui, gardait 151 en reserve.'",
      );
      return;
    }

    if (tile === PC_DESK) {
      if (!hasPrototype151) {
        setDialog(
          "CONSOLE RESIDUELLE: signature refusee. Il manque la cle memoire du sujet originel.",
        );
        return;
      }

      if (!hasWhiteRoomUnlocked) {
        setGameFlag("sylphe_white_room_unlocked");
        actions.activateTemporarySequence("membrane-pulse");
        setDialog(
          "CONSOLE RESIDUELLE: ARCHIVE 151 RECONNUE. La membrane blanche s'ouvre au nord du couloir.",
        );
        return;
      }

      setDialog(
        "CONSOLE RESIDUELLE: WHITE ROOM deja accessible. Le systeme attend maintenant la confrontation finale.",
      );
      return;
    }

    if (tile === CERULEAN_STAIRS) {
      setDialog(
        "Les marches remontent vers la Grotte Azuree. L'air y est moins dense qu'ici.",
      );
      return;
    }

    if (x >= 8 && x <= 11 && y === 2) {
      setDialog(
        hasWhiteRoomUnlocked
          ? "La membrane blanche pulse sans bruit. Elle accepte enfin votre presence."
          : "Une membrane translucide bloque encore le passage. La console centrale semble en etre la cle.",
      );
    }
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (y >= MAP_H - 1) {
      router.push("/cerulean-cave");
      return;
    }

    if (y === 1 && x >= 8 && x <= 11) {
      if (!hasWhiteRoomUnlocked) {
        setDialog(
          "La White Room reste scellee. Une console dort encore au centre du couloir.",
        );
        return;
      }

      actions.activateTemporarySequence("void-call", 4);
      router.push("/white-room");
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
      <section className="relative tile-bg pixel-grid bg-[#11131a] h-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(180deg,rgba(120,140,180,0.08),transparent_65%)] pointer-events-none z-10" />

        <div className="bg-[#05060a] border-b-2 border-[#1d2230] text-slate-200 text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
          <span>📍 BENEATH STAIRS</span>
          <span className="opacity-60">SECTEUR HORS PLAN</span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={BENEATH_STAIRS_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="w-full h-auto"
          />

          <div className="absolute top-2 right-2 z-20 border-2 border-gba-window-border bg-white/80 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            {hasWhiteRoomUnlocked
              ? "MEMBRANE: OUVERTE"
              : "MEMBRANE: VERROUILLEE"}
          </div>

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-30">
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