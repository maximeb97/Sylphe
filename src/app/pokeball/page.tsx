"use client";

import { useEffect, useMemo, useState } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, {
  CustomNPC,
} from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import {
  NEUTRAL_NPC_SPRITE,
  MEW_SPRITE,
  MEWTWO_SPRITE,
  PORYGON_SPRITE,
  KABUTO_SPRITE,
  FANTOMINUS_SPRITE,
  LAPRAS_SPRITE,
  ELECTRODE_SPRITE,
} from "@/components/PixelSprite";
import { POKEBALL_FLOOR, POKEBALL_WALL } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import { playPokemonCry } from "@/lib/audio";
import { hasRecentCyberVisit, setGameFlag } from "@/lib/gameState";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_W = 20;
const MAP_H = 12;

const POKEBALL_MAP: number[][] = Array(MAP_H)
  .fill(0)
  .map((_, y) =>
    Array(MAP_W)
      .fill(0)
      .map((_, x) => {
        // Roundish shape approximation for walls
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return POKEBALL_FLOOR;
        if (y === 0 || y === MAP_H - 1 || x === 0 || x === MAP_W - 1)
          return POKEBALL_WALL;
        return POKEBALL_FLOOR;
      }),
  );

type AmbientEvent = {
  title: string;
  detail: string;
  rarity: "COMMON" | "RARE" | "MYTHIC";
};

function rollAmbientEvent(options: {
  capturedCount: number;
  hasPrototype151: boolean;
  hasTriangulatedBiosphere: boolean;
}): AmbientEvent | null {
  const { capturedCount, hasPrototype151, hasTriangulatedBiosphere } = options;

  if (capturedCount === 0) return null;

  const roll = Math.random();

  if (hasTriangulatedBiosphere && roll < 0.05) {
    return {
      title: "CONVERGENCE TRIANGULEE",
      detail:
        "Les trajectoires de Mew, Mewtwo et Porygon se verrouillent en un biotope artificiel auto-stable.",
      rarity: "MYTHIC",
    };
  }

  if (hasPrototype151 && roll < 0.18) {
    return {
      title: "BRUME MEMOIRE",
      detail:
        "Une vapeur spectrale tapisse les parois. L'archive 151 reecrit les angles morts de la capsule.",
      rarity: "RARE",
    };
  }

  if (roll < 0.45) {
    return {
      title: "MICROCLIMAT DOCILE",
      detail:
        "Les sujets captures adaptent lentement l'interieur de la Masterball a leur propre ecologie.",
      rarity: "COMMON",
    };
  }

  return null;
}

export default function PokeballInterior() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const hasMew =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_mew_captured") === "true";
  const hasMewtwo =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_mewtwo_captured") === "true";
  const hasPrototype151 =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_prototype_151") === "true";
  const hasPorygonEcho =
    (typeof window !== "undefined" &&
      localStorage.getItem("sylphe_porygon_echo") === "true") ||
    hasRecentCyberVisit();
  const hasKabuto =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_kabuto_captured") === "true";
  const hasFantominus =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_fantominus_captured") === "true";
  const hasLapras =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_lapras_captured") === "true";
  const hasElectrode =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_electrode_captured") === "true";
  const capturedCount =
    Number(hasMew) +
    Number(hasMewtwo) +
    Number(hasKabuto) +
    Number(hasFantominus) +
    Number(hasLapras) +
    Number(hasElectrode);
  const hasTriangulatedBiosphere = hasMew && hasMewtwo && hasPorygonEcho;
  const ambientEvent = useMemo(
    () =>
      rollAmbientEvent({
        capturedCount,
        hasPrototype151,
        hasTriangulatedBiosphere,
      }),
    [capturedCount, hasPrototype151, hasTriangulatedBiosphere],
  );

  useEffect(() => {
    if (ambientEvent?.rarity === "MYTHIC") {
      setGameFlag("sylphe_triangulated_biosphere");
    }
  }, [ambientEvent]);

  const npcs: CustomNPC[] = [
    ...(hasMew
      ? [{ id: "mew", x: 7, y: 5, sprite: MEW_SPRITE, type: "wander" as const }]
      : []),
    ...(hasMewtwo
      ? [
          {
            id: "mewtwo",
            x: 13,
            y: 5,
            sprite: MEWTWO_SPRITE,
            type: "wander" as const,
          },
        ]
      : []),
    ...(hasPrototype151
      ? [
          {
            id: "echo151",
            x: 10,
            y: 3,
            sprite: MEW_SPRITE,
            type: "static" as const,
          },
        ]
      : []),
    ...(hasPorygonEcho
      ? [
          {
            id: "porygon",
            x: 10,
            y: 7,
            sprite: PORYGON_SPRITE,
            type: "wander" as const,
          },
        ]
      : []),
    ...(hasKabuto
      ? [
          {
            id: "kabuto",
            x: 5,
            y: 8,
            sprite: KABUTO_SPRITE,
            type: "wander" as const,
          },
        ]
      : []),
    ...(hasFantominus
      ? [
          {
            id: "fantominus",
            x: 14,
            y: 3,
            sprite: FANTOMINUS_SPRITE,
            type: "wander" as const,
          },
        ]
      : []),
    ...(hasLapras
      ? [
          {
            id: "lapras",
            x: 4,
            y: 4,
            sprite: LAPRAS_SPRITE,
            type: "wander" as const,
          },
        ]
      : []),
    ...(hasElectrode
      ? [
          {
            id: "electrode",
            x: 15,
            y: 8,
            sprite: ELECTRODE_SPRITE,
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
    if (npcId === "mew") {
      playPokemonCry(151);
      setDialog(
        hasTriangulatedBiosphere
          ? "Mew glisse d'un point d'ancrage a l'autre. La biosphere triangulee semble repondre a ses mouvements."
          : "Mew voltige joyeusement dans cet espace infini...",
      );
    } else if (npcId === "mewtwo") {
      playPokemonCry(150);
      setDialog(
        hasTriangulatedBiosphere
          ? "Mewtwo ne force plus sa cage. Le clone #150 inspecte les lignes de force reliees a Mew et Porygon."
          : hasPrototype151
            ? "Mewtwo tourne autour de l'echo 151 sans jamais l'atteindre. Le clone semble reconnaitre son origine."
            : "Mewtwo flotte en silence. La Masterball interieure est devenue sa salle de contention volontaire.",
      );
    } else if (npcId === "echo151") {
      setDialog(
        hasMew
          ? "L'archive 151 se tait. Le sujet originel a finalement retrouve une forme stable."
          : "Une silhouette blanche clignote dans la coque: 'Je n'etais pas le clone. J'etais le modele.'",
      );
    } else if (npcId === "porygon") {
      playPokemonCry(137);
      setDialog(
        hasTriangulatedBiosphere
          ? "Porygon triangule la capsule depuis le noeud 42. Les trois presences convertissent la Pokeball en biosphere auto-cartographiee."
          : "Porygon materialise une passerelle de donnees dans la Pokeball blanche. Les archives suggerent maintenant la commande terminale `archive-debug`.",
      );
    } else if (npcId === "kabuto") {
      playPokemonCry(140);
      setDialog(
        "Kabuto dessine des demi-lunes fossiles dans la poussiere claire de la capsule. Il explore les bords comme une maree miniature.",
      );
    } else if (npcId === "fantominus") {
      playPokemonCry(92);
      setDialog(
        "Fantominus se condense puis s'effiloche contre la coque interieure. Meme ici, il prefere les angles morts.",
      );
    } else if (npcId === "lapras") {
      playPokemonCry(131);
      setDialog(
        "Lapras glisse en silence dans la Masterball blanche. La capsule ressemble maintenant a un quai de maintenance minuscule et vivant.",
      );
    } else if (npcId === "electrode") {
      playPokemonCry(101);
      setDialog(
        "Electrode roule nerveusement le long de la coque interieure. Meme capture, il traite encore la Pokeball comme un tableau electrique a court-circuiter.",
      );
    } else if (tile === POKEBALL_WALL) {
      setDialog(
        hasTriangulatedBiosphere
          ? "Les parois ont change de geometrie. La Masterball n'est plus vide: c'est un habitat triangule, presque vivant."
          : hasPrototype151
            ? "Les parois vibrent. Une inscription apparait puis disparait: pr0t0type_151."
            : capturedCount > 1
              ? "La Masterball blanche pulse comme un biotope artificiel. Les sujets captures s'y deplacent librement."
              : hasMew
                ? "La paroi de la Masterball. C'est confortable à l'intérieur."
                : "La Masterball est vide... Un immense espace blanc vide.",
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
      <section className="relative tile-bg pixel-grid bg-white overflow-hidden h-full">
        <WeatherOverlay />
        {hasPrototype151 && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(248,168,184,0.35),transparent_35%)] pointer-events-none z-10" />
        )}
        {hasTriangulatedBiosphere && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(123,203,255,0.22),rgba(255,170,210,0.18),rgba(124,255,186,0.2),rgba(123,203,255,0.22))] mix-blend-multiply" />
        )}
        {capturedCount > 0 && (
          <div className="absolute top-2 left-2 z-20 border-2 border-gba-window-border bg-white/80 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            SANCTUAIRE CAPTURES: {capturedCount}
          </div>
        )}
        {ambientEvent && (
          <div className="absolute top-2 right-2 z-20 max-w-[180px] border-2 border-gba-window-border bg-white/85 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            <p>{`${ambientEvent.rarity} // ${ambientEvent.title}`}</p>
            <p className="mt-1 text-gba-bg-darker">{ambientEvent.detail}</p>
          </div>
        )}

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={POKEBALL_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className={`w-full h-auto ${hasPrototype151 ? "saturate-125 hue-rotate-[12deg]" : ""} ${hasTriangulatedBiosphere ? "contrast-110 saturate-150" : ""}`}
          />

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-20">
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
