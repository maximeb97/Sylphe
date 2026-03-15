"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import {
  GHOST_SPRITE,
  MAROWAK_GHOST_SPRITE,
  NEUTRAL_NPC_SPRITE,
  SCIENTIST_SPRITE,
} from "@/components/PixelSprite";
import { IN_FLOOR, IN_WALL, PC_DESK } from "@/components/tilemap/tiles";
import { setGameFlag } from "@/lib/gameState";

const MAP_W = 20;
const MAP_H = 12;

const MIRROR_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return IN_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return IN_WALL;
        if ((x === 4 || x === 10 || x === 16) && (y === 3 || y === 7)) {
          return PC_DESK;
        }
        return IN_FLOOR;
      }),
  );

const requiemLines = [
  "Le gardien osseux frappe le sol une seule fois. Le miroir cesse d'imiter la salle et montre enfin ce qui a ete retire.",
  "Sous le vernis corporate, les cartels deviennent des epitaphes. Les trophées n'etaient pas des produits, mais des deuils classes.",
  "Une plaque glisse hors du reflet. Les noms effaces exigent d'etre lus, pas caches.",
];

export default function LavenderMirrorPage() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [mirrorActive, setMirrorActive] = useState(false);
  const [ritualOpen, setRitualOpen] = useState(false);
  const [ritualStep, setRitualStep] = useState(0);

  if (typeof window === "undefined") return null;

  const hasAccess =
    localStorage.getItem("sylphe_lavender_mirror_unlocked") === "true";
  const hasScope = localStorage.getItem("sylphe_silph_scope") === "true";
  const hasMirrorTag = localStorage.getItem("sylphe_mirror_tag") === "true";

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-[#170f1f] border-[#2a1c36] h-full flex flex-col justify-center items-center">
          <h1 className="text-[#e5c8ff] mb-8 blink">LIGNE INACTIVE</h1>
          <p className="text-[8px] leading-[16px] text-[#d4c3e5] mb-8">
            Le Miroir de Lavanville n&apos;est joignable qu&apos;en composant la bonne ligne apres avoir vraiment lu le Scope Sylphe.
          </p>
          <Link href="/">
            <button className="gba-btn">RACCROCHER</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    {
      id: "operator",
      x: 10,
      y: 9,
      sprite: SCIENTIST_SPRITE,
      type: "static",
    },
    ...(mirrorActive
      ? [
          {
            id: "guardian",
            x: 10,
            y: 5,
            sprite: MAROWAK_GHOST_SPRITE,
            type: "static" as const,
          },
          {
            id: "employee-left",
            x: 4,
            y: 5,
            sprite: GHOST_SPRITE,
            type: "static" as const,
          },
          {
            id: "employee-right",
            x: 16,
            y: 5,
            sprite: GHOST_SPRITE,
            type: "static" as const,
          },
        ]
      : []),
  ];

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);

    if (npcId === "operator") {
      setDialog(
        mirrorActive
          ? "Operateur: Quand le miroir passe en mode spectral, les cartels cessent de vendre. Ils commencent a nommer."
          : "Operateur: Nous appelions cette salle une vitrine corporate. Les vieux techniciens disaient simplement: Lavanville interne.",
      );
      return;
    }

    if (npcId === "guardian") {
      if (hasMirrorTag) {
        setDialog(
          "Le gardien osseux baisse la tete. Le miroir reconnait deja votre plaque memoriale.",
        );
        return;
      }

      setRitualOpen(true);
      setRitualStep(0);
      return;
    }

    if (npcId === "employee-left" || npcId === "employee-right") {
      setDialog(
        hasScope
          ? "Le Scope lit un nom complet, puis le miroir le raye a nouveau. Ici, les morts administratifs comptent autant que les spectres."
          : "Une silhouette salariée reste coincee dans le reflet. Sans le Scope, son badge demeure illisible.",
      );
      return;
    }

    if (tile === PC_DESK) {
      if (x === 10 && y === 3) {
        setMirrorActive((current) => !current);
        setDialog(
          mirrorActive
            ? "MIROIR OFF: la salle redevient une galerie corporate impeccable."
            : "MIROIR ON: la couche spectrale de Lavanville remonte a la surface.",
        );
        return;
      }

      if (x === 4 && y === 3) {
        setDialog(
          mirrorActive
            ? "Cartel A: PRODUIT RETIRE. Sous le texte promo, une note funeraire mentionne un gardien maternel jamais catalogue."
            : "Cartel A: vitrine de prestige. Trop propre pour etre honnete.",
        );
        return;
      }

      if (x === 16 && y === 3) {
        setDialog(
          mirrorActive
            ? "Cartel B: le reflet n'expose pas un produit mais un deuil, comme si Sylphe avait clone la logique de la Tour Pokemon et l'avait revendue en corporate memory."
            : "Cartel B: histoire officielle sans une seule date de fermeture. C'est louche.",
        );
        return;
      }

      if (x === 4 && y === 7) {
        setDialog(
          mirrorActive
            ? "Cartel C: des noms d'employes disparaissent ligne par ligne jusqu'a ne laisser qu'un silence mesurable."
            : "Cartel C: 'patrimoine intact'. La plaque vibre pourtant comme un vieux canal radio.",
        );
        return;
      }

      if (x === 16 && y === 7) {
        setDialog(
          hasMirrorTag
            ? "Console funeraire: commande `requiem` maintenant disponible dans le terminal."
            : "Console funeraire: aucune plaque memorielle. Le miroir attend encore que quelqu'un assume les noms effaces.",
        );
        return;
      }

      if (x === 10 && y === 7) {
        setDialog(
          mirrorActive
            ? "Socle central: la surface du miroir renvoie une tour Pokemon impossible, construite a l'interieur meme des archives Sylphe."
            : "Socle central: un verre sans reflet net. Il faut sans doute activer la vraie couche de la salle.",
        );
      }
    }
  };

  const handlePlayerMove = (_x: number, y: number) => {
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

  const handleRitualAdvance = () => {
    const nextStep = ritualStep + 1;
    if (nextStep >= requiemLines.length) {
      setGameFlag("sylphe_mirror_tag");
      setRitualOpen(false);
      setRitualStep(0);
      setDialog(
        "Vous recevez le MIRROR TAG. Les noms du miroir peuvent maintenant etre relus depuis le terminal avec `requiem`.",
      );
      return;
    }

    setRitualStep(nextStep);
  };

  return (
    <GBAShell>
      <section className="relative tile-bg pixel-grid bg-[#201528] h-full overflow-hidden">
        <div className={`absolute inset-0 pointer-events-none z-10 ${mirrorActive ? "bg-[radial-gradient(circle_at_50%_18%,rgba(232,176,255,0.18),transparent_25%),linear-gradient(180deg,rgba(126,70,160,0.16),rgba(32,21,40,0.32))]" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(32,21,40,0.1))]"}`} />

        <div className="bg-[#120b18] border-b-2 border-[#2c1d39] text-[#e8d8ff] text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
          <span>📍 LAVENDER MIRROR</span>
          <span className="opacity-60">{mirrorActive ? "SPECTRAL LAYER" : "PUBLIC LAYER"}</span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={MIRROR_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className={`w-full h-auto ${mirrorActive ? "hue-rotate-[14deg] saturate-125" : ""}`}
          />

          <div className="absolute top-2 right-2 z-20 border-2 border-gba-window-border bg-white/80 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            {hasMirrorTag ? "MIRROR TAG: CHARGE" : "MIRROR TAG: ABSENT"}
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
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#120b18]/80 p-4">
              <div className="w-full max-w-xl border-2 border-[#bb93df] bg-[#1a1022] p-4 shadow-[0_0_30px_rgba(187,147,223,0.25)]">
                <p className="text-[8px] text-[#f1dcff] mb-3">VEILLEE DU MIROIR</p>
                <p className="text-[8px] leading-[16px] text-[#e8d8ff] min-h-[64px]">{requiemLines[ritualStep]}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRitualOpen(false);
                      setRitualStep(0);
                    }}
                    className="gba-btn !bg-[#362346] !text-white hover:!bg-[#4a2f60]"
                  >
                    TAIRE
                  </button>
                  <button
                    type="button"
                    onClick={handleRitualAdvance}
                    className="gba-btn !bg-[#a66de2] !text-white hover:!bg-[#bb93df]"
                  >
                    ECOUTER
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