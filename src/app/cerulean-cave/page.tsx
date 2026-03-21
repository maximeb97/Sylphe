"use client";

import { useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, RED_SPRITE } from "@/components/PixelSprite";
import { CERULEAN_FLOOR, CERULEAN_WALL, CERULEAN_WATER, CERULEAN_STAIRS, IN_FLOOR } from "@/components/tilemap/tiles";
import { useRouter } from "next/navigation";
import { hasCompletedCeruleanPrerequisites, setGameFlag } from "@/lib/gameState";
import WeatherOverlay from "@/components/WeatherOverlay";

const MAP_H = 15;

const CAVE_TEMPLATE = [
    "####################",
    "#....#....~....#..S#",
    "#.##.#.##.~.##.#.#.#",
    "#.#..#..#...##...#.#",
    "#.#.#######.#####..#",
    "#.#.....~...#...##.#",
    "#.#####.#.###.#.##.#",
    "#...#...#.....#....#",
    "###.#.#####.#####.##",
    "#...#...#~..#...#..#",
    "#.#####.#.###.#.#.##",
    "#.....#.#.....#.#..#",
    "#.###.#.#######.##.#",
    "#...#..............#",
    "##########.#########",
];

const TILE_LOOKUP: Record<string, number> = {
    "#": CERULEAN_WALL,
    ".": CERULEAN_FLOOR,
    "~": CERULEAN_WATER,
    "S": CERULEAN_STAIRS,
};

const CAV_MAP: number[][] = CAVE_TEMPLATE.map((row) => row.split("").map((tile) => TILE_LOOKUP[tile] ?? IN_FLOOR));

export default function CeruleanCave() {
    const router = useRouter();
    const { actions } = useMusic();
    const [dialog, setDialog] = useState<string | null>(null);
    const [isTypewriterDone, setIsTypewriterDone] = useState(false);
    const [forceComplete, setForceComplete] = useState(false);
    const [isBattleStarted, setIsBattleStarted] = useState(false);
    const [redDefeated, setRedDefeated] = useState(() => typeof window !== "undefined" && localStorage.getItem("sylphe_red_defeated") === "true");
    const hasAccess = typeof window === "undefined" ? null : hasCompletedCeruleanPrerequisites();
    const hasPrototype151 = typeof window !== "undefined" && localStorage.getItem("sylphe_prototype_151") === "true";
    const hasWhiteRoomHint =
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_white_room_hint") === "true";

    const npcs: CustomNPC[] = [
        {
            id: "red",
            x: 17,
            y: 2,
            sprite: RED_SPRITE,
            type: "static"
        }
    ];

    const handleInteract = (tile: number, x: number, y: number, npcId?: string) => {
        setIsTypewriterDone(false);
        setForceComplete(false);

        if (npcId === "red") {
            if (redDefeated) {
                setDialog(hasPrototype151 ? "RED : ... Tu as entendu la voix du sujet 151 aussi." : "RED : ...");
            } else {
                setDialog("RED : ...");
                setTimeout(() => {
                    setDialog("Une aura écrasante se dégage de lui. Le combat est inévitable.");
                    // Trigger battle animation or skip to win logic for now
                    setTimeout(() => {
                        setIsBattleStarted(true);
                        actions.activateTemporarySequence("red-battle");
                    }, 2000);
                }, 2000);
            }
        } else if (tile === CERULEAN_WATER) {
            setDialog(hasPrototype151 ? "L'eau glaciale reflete des fragments du sujet 151 et des tentatives de clonage abandonnees." : "L'eau est glaciale et profonde.");
        } else if (tile === CERULEAN_STAIRS) {
            setDialog(
              hasWhiteRoomHint
                ? "Les escaliers vibrent a contretemps. Quelque chose persiste sous les marches, hors du plan initial de la grotte."
                : "Ces escaliers semblent mener encore plus profondément... ou vers une sortie secrète.",
            );
        } else if (x === 4 && y === 13) {
            setDialog("Des traces de pas anciennes s'arretent net. Quelqu'un a abandonne la grotte juste avant le sanctuaire final.");
        }
    };

    const handlePlayerMove = (x: number, y: number) => {
        if (x === 18 && y === 1) {
          if (!redDefeated) {
            setDialog(
              "L'aura de RED verrouille encore le passage derriere l'escalier.",
            );
            return;
          }
          if (!hasWhiteRoomHint) {
            setDialog(
              "Les marches grincent, mais aucun passage lisible n'apparait encore.",
            );
            return;
          }

          setGameFlag("sylphe_beneath_stairs_unlocked");
          router.push("/beneath-stairs");
          return;
        }

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

    const handleDefeatRed = () => {
        setRedDefeated(true);
        setGameFlag("sylphe_red_defeated");
        setIsBattleStarted(false);
        actions.clearTemporarySequence();
        actions.playOneShot("sfx-capture");
        setDialog(hasPrototype151 ? "RED : ... ! (Il vous remet un PASS SYSTEME et confirme que le vrai boss n'etait pas 150, mais la memoire du sujet 151.)" : "RED : ... ! (Il vous remet un mystérieux PASS... L'accès au coeur du système est désormais possible.)");
        setGameFlag("sylphe_system_pass");
        if (hasPrototype151) {
          setGameFlag("sylphe_hall_of_fame");
        }
    };

    if (hasAccess === null) return null;

    if (!hasAccess) {
        return (
            <GBAShell>
                <div className="gba-screen max-w-2xl w-full p-8 text-center bg-[#111] border-blue-950 h-full flex flex-col justify-center items-center">
                    <h1 className="text-blue-300 mb-8 blink">ACCES IMPOSSIBLE</h1>
                    <p className="opacity-80 text-xs mb-6 text-blue-100">La Grotte Azuree ne s&apos;ouvre qu&apos;apres avoir boucle toutes les anomalies majeures du Projet M.</p>
                    <p className="text-[8px] leading-[16px] text-blue-200 mb-8">Indices: capture MEW, capture MEWTWO, revele les fantomes, pirate Giovanni et visite les failles.</p>
                    <Link href="/"><button className="gba-btn">RETOURNER AU QG</button></Link>
                </div>
            </GBAShell>
        );
    }

    if (isBattleStarted) {
        return (
            <GBAShell>
                <div className="gba-screen flex flex-col items-center justify-center bg-white p-4 font-[PressStart2P] text-black h-full overflow-hidden relative">
                    <div className="absolute top-4 right-4 text-right">
                        <p className="text-[8px] mb-1">RED</p>
                        <div className="w-24 h-1 bg-black mb-1">
                            <div className="w-full h-full bg-green-500 animate-pulse" />
                        </div>
                        <p className="text-[6px]">PV: 100/100</p>
                    </div>

                    <div className="absolute bottom-24 left-4">
                        <p className="text-[8px] mb-1">PLAYER</p>
                        <div className="w-24 h-1 bg-black mb-1">
                            <div className="w-1/2 h-full bg-yellow-500" />
                        </div>
                        <p className="text-[6px]">PV: 48/100</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full">
                        <div className="animate-bounce">
                            <h2 className="text-xl mb-4 text-center">TRAINER RED <br />wants to battle!</h2>
                        </div>
                    </div>

                    <div className="w-full border-4 border-black p-2 bg-white flex flex-col gap-2 relative z-20">
                        <p className="text-[8px] mb-2">Que doit faire le programme ?</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleDefeatRed} className="border-2 border-black p-1 text-[8px] hover:bg-black hover:text-white transition-colors">ATTAQUE</button>
                            <button className="border-2 border-black p-1 text-[8px] opacity-50 cursor-not-allowed">POKEMON</button>
                            <button className="border-2 border-black p-1 text-[8px] opacity-50 cursor-not-allowed">OBJET</button>
                            <button onClick={() => setIsBattleStarted(false)} className="border-2 border-black p-1 text-[8px] hover:bg-black hover:text-white transition-colors">FUITE</button>
                        </div>
                    </div>

                    {/* Battle Background elements */}
                    <div className="absolute top-[20%] left-[20%] w-16 h-16 bg-gray-100 rounded-full blur-xl opacity-50" />
                    <div className="absolute bottom-[30%] right-[20%] w-24 h-24 bg-gray-100 rounded-full blur-2xl opacity-50" />
                </div>
            </GBAShell>
        );
    }

    return (
      <GBAShell>
        <section className="relative tile-bg pixel-grid bg-[#2d2d2d] h-full shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
          <WeatherOverlay />
          {/* Cave darkening overlay */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,197,253,0.18),transparent_25%),radial-gradient(circle_at_75%_30%,rgba(167,139,250,0.15),transparent_24%)] pointer-events-none z-10" />

          <div className="bg-[#1a1a1a] border-b-2 border-[#111] text-[#777] text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
            <span>📍 GROTTE AZURÉE</span>
            <span className="opacity-60 animate-pulse">
              {hasPrototype151 ? "SANCTUAIRE 151" : "FONDE DU SYSTÈME"}
            </span>
          </div>

          <div className="relative isolate h-full">
            <CustomMapCanvas
              mapData={CAV_MAP}
              playerSprite={NEUTRAL_NPC_SPRITE}
              initialPlayerX={10}
              initialPlayerY={13}
              npcs={npcs}
              onInteract={handleInteract}
              onPlayerMove={handlePlayerMove}
              className="w-full h-auto"
            />

            {dialog && (
              <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-30">
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
