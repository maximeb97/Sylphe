"use client";

import { useEffect, useMemo, useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import { useGameProgression } from "@/hooks/useGameProgression";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, {
  CustomNPC,
} from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE } from "@/components/PixelSprite";
import { POKEBALL_FLOOR, POKEBALL_WALL } from "@/components/tilemap/tiles";

import { useRouter } from "next/navigation";
import { playPokemonCry } from "@/lib/audio";
import { setGameFlag } from "@/lib/gameState";
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
  const { actions } = useMusic();
  const progression = useGameProgression();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const npcs = useMemo<CustomNPC[]>(
    () =>
      progression.pokeballOccupants.map(occupant => ({
        id: occupant.id,
        x: occupant.x,
        y: occupant.y,
        sprite: occupant.sprite,
        type: occupant.type,
      })),
    [progression.pokeballOccupants],
  );
  const occupantMap = useMemo(
    () => new Map(progression.pokeballOccupants.map(occupant => [occupant.id, occupant])),
    [progression.pokeballOccupants],
  );
  const ambientEvent = useMemo(
    () =>
      rollAmbientEvent({
        capturedCount: progression.capturedCount,
        hasPrototype151: progression.hasPrototype151,
        hasTriangulatedBiosphere: progression.hasTriangulatedBiosphere,
      }),
    [
      progression.capturedCount,
      progression.hasPrototype151,
      progression.hasTriangulatedBiosphere,
    ],
  );

  useEffect(() => {
    if (ambientEvent?.rarity === "MYTHIC") {
      setGameFlag("sylphe_triangulated_biosphere");
      actions.toggleSequence("alert");
    }
  }, [ambientEvent, actions]);

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);
    if (npcId) {
      const occupant = occupantMap.get(npcId);
      if (!occupant) return;

      if (occupant.interaction.cryId) {
        playPokemonCry(occupant.interaction.cryId);
      }
      if (occupant.interaction.oneShot) {
        actions.playOneShot(occupant.interaction.oneShot);
      }
      if (occupant.interaction.temporarySequence) {
        actions.activateTemporarySequence(occupant.interaction.temporarySequence);
      }

      setDialog(occupant.interaction.dialog(progression.pokeballDialogContext));
      return;
    }

    if (tile === POKEBALL_WALL) {
      setDialog(
        progression.hasTriangulatedBiosphere
          ? "Les parois ont change de geometrie. La Masterball n'est plus vide: c'est un habitat triangule, presque vivant."
          : progression.hasPrototype151
            ? "Les parois vibrent. Une inscription apparait puis disparait: pr0t0type_151."
            : progression.capturedCount > 1
              ? "La Masterball blanche pulse comme un biotope artificiel. Les sujets captures s'y deplacent librement."
              : progression.flags.sylphe_mew_captured
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
        {progression.hasPrototype151 && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(248,168,184,0.35),transparent_35%)] pointer-events-none z-10" />
        )}
        {progression.hasTriangulatedBiosphere && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(123,203,255,0.22),rgba(255,170,210,0.18),rgba(124,255,186,0.2),rgba(123,203,255,0.22))] mix-blend-multiply" />
        )}
        {progression.capturedCount > 0 && (
          <div className="absolute top-2 left-2 z-20 border-2 border-gba-window-border bg-white/80 px-3 py-2 text-[7px] leading-[14px] text-gba-text">
            SANCTUAIRE CAPTURES: {progression.capturedCount}
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
            className={`w-full h-auto ${progression.hasPrototype151 ? "saturate-125 hue-rotate-[12deg]" : ""} ${progression.hasTriangulatedBiosphere ? "contrast-110 saturate-150" : ""}`}
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
