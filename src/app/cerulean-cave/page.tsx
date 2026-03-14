"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, RED_SPRITE } from "@/components/PixelSprite";
import { CERULEAN_FLOOR, CERULEAN_WALL, CERULEAN_WATER, CERULEAN_STAIRS, IN_FLOOR } from "@/components/tilemap/tiles";
import { useRouter } from "next/navigation";
import { playPokemonCry } from "@/lib/audio";

const MAP_W = 20;
const MAP_H = 15;

// Generate a labyrinth
const CAV_MAP: number[][] = Array(MAP_H).fill(0).map((_, y) =>
    Array(MAP_W).fill(0).map((_, x) => {
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return CERULEAN_WALL;

        // Some internal walls to make a path
        if (x === 5 && y > 3 && y < 12) return CERULEAN_WALL;
        if (x === 10 && y < 10) return CERULEAN_WALL;
        if (x === 15 && y > 5) return CERULEAN_WALL;
        if (y === 5 && x > 5 && x < 15) return CERULEAN_WALL;
        if (y === 10 && x > 2 && x < 10) return CERULEAN_WALL;

        // Water patches
        if (x > 12 && x < 18 && y > 1 && y < 4) return CERULEAN_WATER;

        // Stairs at the end
        if (x === 18 && y === 1) return CERULEAN_STAIRS;

        // Exit
        if (y === MAP_H - 1 && x === 10) return IN_FLOOR;

        return CERULEAN_FLOOR;
    })
);

export default function CeruleanCave() {
    const router = useRouter();
    const [dialog, setDialog] = useState<string | null>(null);
    const [isTypewriterDone, setIsTypewriterDone] = useState(false);
    const [forceComplete, setForceComplete] = useState(false);
    const [isBattleStarted, setIsBattleStarted] = useState(false);
    const [redDefeated, setRedDefeated] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("sylphe_red_defeated") === "true") {
            setRedDefeated(true);
        }
    }, []);

    const npcs: CustomNPC[] = [
        {
            id: "red",
            x: 18,
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
                setDialog("...");
            } else {
                setDialog("RED : ...");
                setTimeout(() => {
                    setDialog("Une aura écrasante se dégage de lui. Le combat est inévitable.");
                    // Trigger battle animation or skip to win logic for now
                    setTimeout(() => {
                        setIsBattleStarted(true);
                    }, 2000);
                }, 2000);
            }
        } else if (tile === CERULEAN_WATER) {
            setDialog("L'eau est glaciale et profonde.");
        } else if (tile === CERULEAN_STAIRS) {
            setDialog("Ces escaliers semblent mener encore plus profondément... ou vers une sortie secrète.");
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

    const handleDefeatRed = () => {
        setRedDefeated(true);
        localStorage.setItem("sylphe_red_defeated", "true");
        setIsBattleStarted(false);
        setDialog("RED : ... ! (Il vous remet un mystérieux PASS... L'accès au coeur du système est désormais possible.)");
        localStorage.setItem("sylphe_system_pass", "true");
    };

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
                {/* Cave darkening overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

                <div className="bg-[#1a1a1a] border-b-2 border-[#111] text-[#777] text-[8px] px-4 py-2 flex justify-between items-center z-20 relative select-none">
                    <span>📍 GROTTE AZURÉE</span>
                    <span className="opacity-60 animate-pulse">FONDE DU SYSTÈME</span>
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
