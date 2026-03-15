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
  NEUTRAL_NPC_SPRITE,
  SCIENTIST_SPRITE,
  PORYGON_SPRITE,
} from "@/components/PixelSprite";
import { IN_FLOOR, IN_WALL, PC_DESK } from "@/components/tilemap/tiles";
import { setGameFlag } from "@/lib/gameState";

const MAP_W = 20;
const MAP_H = 12;

const MUSEUM_NULL_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return IN_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1)
          return IN_WALL;
        if ((y === 3 || y === 7) && (x === 4 || x === 10 || x === 16)) {
          return PC_DESK;
        }
        return IN_FLOOR;
      }),
  );

export default function MuseumNullPage() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  if (typeof window === "undefined") return null;

  const hasAccess = localStorage.getItem("sylphe_museum_null_unlocked") === "true";
  const hasScope = localStorage.getItem("sylphe_silph_scope") === "true";
  const hasNullBadge = localStorage.getItem("sylphe_null_badge") === "true";
  const hasPorygonEcho = localStorage.getItem("sylphe_porygon_echo") === "true";

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-[#131316] border-[#25252c] h-full flex flex-col justify-center items-center">
          <h1 className="text-slate-100 mb-8 blink">AILE NON REPERTORIEE</h1>
          <p className="text-[8px] leading-[16px] text-slate-300 mb-8">
            Le Musee Null ne figure dans aucune brochure. Certains identifiants corporate repondent pourtant a sa porte.
          </p>
          <Link href="/">
            <button className="gba-btn">RETOUR AU HALL</button>
          </Link>
        </div>
      </GBAShell>
    );
  }

  const npcs: CustomNPC[] = [
    {
      id: "curator",
      x: 10,
      y: 9,
      sprite: SCIENTIST_SPRITE,
      type: "static",
    },
    ...(hasScope
      ? [
          {
            id: "ghost-curator",
            x: 4,
            y: 9,
            sprite: GHOST_SPRITE,
            type: "static" as const,
          },
        ]
      : []),
    ...(hasPorygonEcho
      ? [
          {
            id: "porygon-guide",
            x: 16,
            y: 9,
            sprite: PORYGON_SPRITE,
            type: "wander" as const,
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

    if (npcId === "curator") {
      setDialog(
        hasNullBadge
          ? "Conservateur: Vous avez deja vu la vraie collection. Le badge NULL suffit a contredire toutes nos brochures."
          : "Conservateur: Bienvenue dans le musee que la direction nie en public. Ici, les trophées couvrent surtout ce qu'on a efface.",
      );
      return;
    }

    if (npcId === "ghost-curator") {
      setDialog(
        "Le Scope revele un ancien guide: 'nos visiteurs regardaient les trophées. Personne ne lisait les noms rayes sous le vernis'.",
      );
      return;
    }

    if (npcId === "porygon-guide") {
      setDialog(
        "Porygon recompose les cartels abimes: PUBLIC CHECKSUM FAIL // les collections officielles et nulles ne racontent pas la meme histoire.",
      );
      return;
    }

    if (tile === PC_DESK) {
      if (x === 4 && y === 3) {
        setDialog(
          hasScope
            ? "Cartel 01: Innovation continue. Le Scope y superpose 6 noms d'employes effaces et une date d'evacuation rapide."
            : "Cartel 01: 'Innovation continue'. Le vernis est si epais qu'on dirait qu'il cache une autre plaque.",
        );
        return;
      }

      if (x === 16 && y === 3) {
        setDialog(
          "Cartel 03: L'aile expose des prototypes parfaits, mais leur numerotation saute curieusement de 149 a 152.",
        );
        return;
      }

      if (x === 4 && y === 7) {
        setDialog(
          "Cartel 04: Une brochure visiteurs mentionne KANTO REGION et l'ID 31415. Quelqu'un a transforme une carte stats en badge d'acces.",
        );
        return;
      }

      if (x === 16 && y === 7) {
        setDialog(
          hasPorygonEcho
            ? "Cartel 06: Porygon recalcule la vitrine et laisse apparaitre le mot 'checksum' sous une couche de poussiere numerique."
            : "Cartel 06: Une vitrine vide, mais les capteurs disent qu'un objet devrait encore y etre stocke.",
        );
        return;
      }

      if (x === 10 && y === 3) {
        if (!hasNullBadge) {
          setGameFlag("sylphe_null_badge");
          setDialog(
            "SOCLE CENTRAL: badge visiteur NULL recupere. Les archives du terminal pourront maintenant calculer un vrai checksum corporate.",
          );
          return;
        }

        setDialog(
          "SOCLE CENTRAL: le Badge NULL pulse faiblement. Cette aile n'est plus invisible pour vous, seulement pour le reste du public.",
        );
        return;
      }

      if (x === 10 && y === 7) {
        setDialog(
          hasNullBadge
            ? "Console curatoriale: checksum available // comparez les archives publiques et nulles depuis le terminal."
            : "Console curatoriale: aucune visite certifiee. Le socle central attend encore son badge.",
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

  return (
    <GBAShell>
      <section className="relative tile-bg pixel-grid bg-[#f4f1eb] h-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.65),transparent_30%),linear-gradient(180deg,rgba(30,30,35,0.03),rgba(150,120,80,0.05))] pointer-events-none z-10" />

        <div className="bg-[#d7d0c3] border-b-2 border-[#b5ab9b] text-[#3b352c] text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
          <span>📍 MUSEE NULL</span>
          <span className="opacity-60">VISITE CORPORATE SUSPENDUE</span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={MUSEUM_NULL_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="w-full h-auto"
          />

          <div className="absolute top-2 left-2 z-20 border-2 border-gba-window-border bg-white/80 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            {hasNullBadge ? "BADGE NULL: ACTIF" : "BADGE NULL: ABSENT"}
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