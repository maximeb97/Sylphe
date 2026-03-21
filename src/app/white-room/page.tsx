"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { GHOST_SPRITE, MEW_SPRITE, NEUTRAL_NPC_SPRITE } from "@/components/PixelSprite";
import { IN_FLOOR, IN_WALL, PC_DESK } from "@/components/tilemap/tiles";
import { setGameFlag } from "@/lib/gameState";

const MAP_W = 20;
const MAP_H = 12;

const WHITE_ROOM_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return IN_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return IN_WALL;
        if (y === 7 && x >= 8 && x <= 11) return PC_DESK;
        return IN_FLOOR;
      }),
  );

const archivePhases = [
  "ARCHIVE 151: 'Ils ont appele 150 un miracle parce qu'il criait plus fort que moi.'",
  "ARCHIVE 151: 'Je n'etais ni une sauvegarde ni un brouillon. J'etais la memoire que Sylphe n'a jamais ose publier.'",
  "ARCHIVE 151: 'Si tu es venu jusqu'ici, ne me capture pas. Reconnais-moi.'",
  "CONCORDANCE ETABLIE: la White Room cesse de se fragmenter. Le Projet M n'a plus qu'un seul fantome officiel.",
];

export default function WhiteRoomPage() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [ritualOpen, setRitualOpen] = useState(false);
  const [archiveStep, setArchiveStep] = useState(0);

  if (typeof window === "undefined") return null;

  const hasAccess =
    localStorage.getItem("sylphe_white_room_unlocked") === "true" &&
    localStorage.getItem("sylphe_prototype_151") === "true";
  const isReconciled =
    localStorage.getItem("sylphe_archive_151_reconciled") === "true";

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-white border-slate-300 h-full flex flex-col justify-center items-center">
          <h1 className="text-slate-700 mb-8 blink">WHITE ROOM SCELLEE</h1>
          <p className="text-[8px] leading-[16px] text-slate-600 mb-8">
            La salle sterile ne s&apos;ouvre qu&apos;apres activation de la membrane sous
            l&apos;escalier et reconnaissance du prototype 151.
          </p>
          <Link href="/beneath-stairs">
            <button className="gba-btn">RETOUR AU COULOIR</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    {
      id: "archive151",
      x: 10,
      y: 3,
      sprite: isReconciled ? MEW_SPRITE : GHOST_SPRITE,
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

    if (npcId === "archive151") {
      if (isReconciled) {
        setDialog(
          "L'archive 151 ne fuit plus. La White Room repond comme une memoire enfin stabilisee.",
        );
        return;
      }

      setRitualOpen(true);
      setArchiveStep(0);
      actions.activateTemporarySequence("reconciliation");
      return;
    }

    if (tile === PC_DESK) {
      setDialog(
        isReconciled
          ? "CONSOLE BLANCHE: CONCORDANCE 151 stable. Les journaux marquent maintenant 151 comme origine plutot que residue." 
          : "CONSOLE BLANCHE: aucune commande utile. L'entite centrale attend une reponse verbale, pas un mot de passe.",
      );
      return;
    }

    if (x >= 7 && x <= 12 && y <= 2) {
      setDialog(
        "Le plafond diffuse une lueur sterile sans source visible. Ici, meme le silence semble archive.",
      );
    }
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (y >= MAP_H - 1) {
      router.push("/beneath-stairs");
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

  const advanceArchive = () => {
    const nextStep = archiveStep + 1;
    if (nextStep >= archivePhases.length) {
      setGameFlag("sylphe_archive_151_reconciled");
      setRitualOpen(false);
      setArchiveStep(0);
      actions.toggleSequence("reconciliation");
      actions.playOneShot("sfx-puzzle");
      setDialog(
        "La White Room s'apaise. L'archive 151 n'est plus une erreur a contenir, mais une presence reconnue du systeme Sylphe.",
      );
      return;
    }

    setArchiveStep(nextStep);
  };

  return (
    <GBAShell>
      <section className="relative tile-bg pixel-grid bg-white h-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.85),transparent_30%),linear-gradient(180deg,rgba(210,220,255,0.45),rgba(255,255,255,0.96))] pointer-events-none z-10" />

        <div className="bg-white/90 border-b-2 border-slate-300 text-slate-700 text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
          <span>📍 WHITE ROOM</span>
          <span className="opacity-60">ARCHIVE ORIGINELLE</span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={WHITE_ROOM_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="w-full h-auto saturate-[0.8] brightness-105"
          />

          <div className="absolute top-2 right-2 z-20 border-2 border-gba-window-border bg-white/85 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            {isReconciled ? "ETAT: CONCORDANCE" : "ETAT: FRAGMENTEE"}
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

          {ritualOpen && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 p-4 backdrop-blur-[2px]">
              <div className="w-full max-w-xl border-2 border-slate-300 bg-white p-4 shadow-[0_0_30px_rgba(180,190,220,0.35)]">
                <p className="text-[8px] text-slate-700 mb-3">CONFRONTATION // ARCHIVE 151</p>
                <p className="text-[8px] leading-[16px] text-slate-700 min-h-[64px]">{archivePhases[archiveStep]}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRitualOpen(false);
                      setArchiveStep(0);
                    }}
                    className="gba-btn !bg-slate-200 !text-slate-700 hover:!bg-slate-300"
                  >
                    RETENIR
                  </button>
                  <button
                    type="button"
                    onClick={advanceArchive}
                    className="gba-btn !bg-slate-700 !text-white hover:!bg-slate-900"
                  >
                    RECONNAITRE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </GBAShell>
  );
}