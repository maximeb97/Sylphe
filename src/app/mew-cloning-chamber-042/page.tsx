"use client";

import { useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BattleTransition from "@/components/BattleTransition";
import DialogBox from "@/components/DialogBox";
import PokemonCaptureSequence from "@/components/PokemonCaptureSequence";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import { NEUTRAL_NPC_SPRITE, MEWTWO_SPRITE, MEW_SPRITE } from "@/components/PixelSprite";
import { IN_FLOOR, IN_WALL, VAT_BG, PC_DESK } from "@/components/tilemap/tiles";
import { playPokemonCry, playReversedMewCry } from "@/lib/audio";
import { setGameFlag } from "@/lib/gameState";
import WeatherOverlay from "@/components/WeatherOverlay";

function checkPokeballRushEasterEgg(): boolean {
  if (typeof window === "undefined") return false;
  const lastRoute = localStorage.getItem("sylphe_last_route");
  const lastAt = Number(localStorage.getItem("sylphe_last_route_at") || "0");
  if (lastRoute !== "/pokeball" || !lastAt) return false;
  return Date.now() - lastAt <= 15000;
}

const MAP_W = 20;
const MAP_H = 12;

const MEW_MAP: number[][] = Array(MAP_H).fill(0).map((_, y) =>
    Array(MAP_W).fill(0).map((_, x) => {
        if (y === MAP_H - 1 && x >= 8 && x <= 11) return IN_FLOOR;
        if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return IN_WALL;
        if (x >= 7 && x <= 12 && y <= 5) return VAT_BG;
        if (x >= 2 && x <= 4 && y === 1) return PC_DESK;
        return IN_FLOOR;
    })
);

export default function MewChamber() {
    const router = useRouter();
    const { actions } = useMusic();
    const [dialog, setDialog] = useState<string | null>(null);
    const [isTypewriterDone, setIsTypewriterDone] = useState(false);
    const [forceComplete, setForceComplete] = useState(false);
    const [showBattleTransition, setShowBattleTransition] = useState(false);
    const [captureTarget, setCaptureTarget] = useState<"mewtwo" | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean | null>(() => typeof window === "undefined" ? null : localStorage.getItem("sylphe_mew_unlocked") === "true");
    const [isPasswordPrompt, setIsPasswordPrompt] = useState(() => typeof window !== "undefined" ? localStorage.getItem("sylphe_mew_unlocked") !== "true" : false);
    const [passwordInput, setPasswordInput] = useState("");
    const hasPrototype151 = typeof window !== "undefined" && localStorage.getItem("sylphe_prototype_151") === "true";
    const [labNoteUnlocked] = useState(() => {
      if (typeof window === "undefined") return false;
      if (checkPokeballRushEasterEgg()) {
        playReversedMewCry();
        setGameFlag("sylphe_mew_reverse_cry");
        return true;
      }
      return localStorage.getItem("sylphe_mew_reverse_cry") === "true";
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput?.toUpperCase() === "7382-4B9F") {
            setGameFlag("sylphe_mew_unlocked");
            setHasAccess(true);
            setIsPasswordPrompt(false);
            setDialog(null);
            actions.playOneShot("sfx-puzzle");
        } else {
            setDialog("MOT DE PASSE INCORRECT. ALARME ACTIVÉE.");
        }
    };

    // Custom NPCs for Mewtwo inside the vat, and little Mews inside small vats
    const npcs: CustomNPC[] = [
        { id: "mewtwo", x: 9, y: 3, sprite: MEWTWO_SPRITE, type: "wander" },
        { id: "mew1", x: 8, y: 4, sprite: MEW_SPRITE, type: "static" },
        { id: "mew2", x: 11, y: 4, sprite: MEW_SPRITE, type: "static" }
    ];

    const handleInteract = (tile: number, x: number, y: number, npcId?: string) => {
        setIsTypewriterDone(false);
        setForceComplete(false);
        if (npcId === "mewtwo") {
            playPokemonCry(150);
            const hasMasterball = localStorage.getItem("sylphe_masterball_unlocked") === "true";
            const alreadyCaptured = localStorage.getItem("sylphe_mewtwo_captured") === "true";
            if (alreadyCaptured) {
                setDialog("La cuve est vide. Seule une empreinte psychique de #150 flotte encore dans le liquide.");
            } else if (hasMasterball) {
                setCaptureTarget("mewtwo");
                setShowBattleTransition(true);
                actions.activateTemporarySequence("alarm");
                actions.activateTemporarySequence("emergency-protocol", 8);
            } else {
                setDialog("Le monstre endormi dans la cuve émet une onde psychique terrifiante, mais reste figé.");
            }
        }
        else if (npcId === "mew1" || npcId === "mew2") {
            playPokemonCry(151);
            setDialog(hasPrototype151 ? "Mew... L'original nous observe. Une archive chuchote: '151 precede 150.'" : "Mew... L'original nous observe...");
        }
        else if (tile === PC_DESK) setDialog(hasPrototype151 ? "Terminal Labo : Tentative de clonage #41 echouee. Note supprimee: le sujet originel 151 presente une signature plus stable que le clone 150." : "Terminal Labo : Tentative de clonage #41 échouée. Les fonds de la Team Rocket permettent de relancer l'essai #42.");
        else if (tile === VAT_BG) setDialog("Le liquide fluorescent bouillonne mystérieusement.");
    };

    const handleCaptureComplete = () => {
        setCaptureTarget(null);
        setGameFlag("sylphe_mewtwo_captured");
        actions.clearTemporarySequence();
        actions.playOneShot("sfx-capture");
        setDialog(hasPrototype151 ? "La MASTERBALL absorbe le clone #150. Les capteurs indiquent une resonance immediate avec l'archive 151." : "Le clone instable #150 se déchaîne... Vous lancez la MASTERBALL ! Mewtwo a été capturé avec succès !");
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

    if (hasAccess === null && !isPasswordPrompt) return null;

    if (isPasswordPrompt) {
        return (
            <GBAShell>
                <div className="gba-screen max-w-2xl w-full p-8 text-center bg-black border-green-800 h-full flex flex-col justify-center items-center font-[PressStart2P]">
                    <h1 className="text-green-500 mb-8 blink">PROJET M - ACCES RESTREINT</h1>
                    <p className="opacity-70 text-xs mb-8 text-green-400">Veuillez entrer le code de sécurité global.</p>
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 items-center w-full max-w-xs">
                        <input
                            type="text"
                            className="w-full bg-black border-2 border-green-700 text-green-400 p-2 text-center text-xs uppercase focus:outline-none focus:border-green-400"
                            placeholder="XXXX-XXXX"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            maxLength={9}
                            autoFocus
                        />
                        <button type="submit" className="gba-btn !bg-green-900 !text-white hover:!bg-green-700 w-full">DÉVERROUILLER</button>
                    </form>
                    {dialog && <p className="mt-4 text-[8px] text-red-500 animate-pulse">{dialog}</p>}

                    <Link href="/"><button className="mt-8 text-[8px] text-gray-500 hover:text-white underline">Annuler</button></Link>
                </div>
            </GBAShell>
        );
    }

    return (
      <GBAShell>
        <section className="relative tile-bg pixel-grid bg-[#0a110a] h-full shadow-[0_0_50px_rgba(0,255,100,0.1)]">
          <WeatherOverlay />
          {/* Top bar */}
          <div className="bg-[#051105] border-b-2 border-green-900 text-green-500 text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
            <span>📍 CHAMBRE 042</span>
            <span className="opacity-60 animate-pulse">PROJET M</span>
          </div>

          <div className="relative isolate h-full">
            {/* Glass Overlay over vats */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-green-500/10 mix-blend-color-dodge pointer-events-none z-10 border-b border-green-400/20" />

            {/* Lab Note unlocked by Pokeball rush easter egg */}
            {labNoteUnlocked && (
              <div
                className="absolute top-12 right-2 z-30 max-w-[180px] border-2 border-green-800 bg-[#0a110a]/95 px-3 py-2 text-[6px] leading-[12px] text-green-400"
                style={{ animation: "weather-fade 8s ease-in-out forwards" }}
              >
                <p className="font-bold text-green-300 mb-1">
                  NOTE DE LABO — DR FUJI
                </p>
                <p>
                  Le cri de Mew inverse revele une frequence subsonic. Le sujet
                  151 a laisse une empreinte acoustique dans la cuve #42.
                </p>
                <p className="mt-1 text-green-600">
                  Ce signal precede la creation du clone #150. La matrice
                  vivante chantait avant d&apos;etre copiee.
                </p>
                <p className="mt-1 text-green-700 italic">
                  Commande deverrouillee: `sylphedex`
                </p>
              </div>
            )}

            <CustomMapCanvas
              mapData={MEW_MAP}
              playerSprite={NEUTRAL_NPC_SPRITE}
              initialPlayerX={10}
              initialPlayerY={10}
              npcs={npcs}
              onInteract={handleInteract}
              onPlayerMove={handlePlayerMove}
              className="w-full h-auto hue-rotate-90 saturate-50"
            />

            {showBattleTransition && (
              <BattleTransition
                onComplete={() => setShowBattleTransition(false)}
              />
            )}

            {captureTarget === "mewtwo" && !showBattleTransition && (
              <PokemonCaptureSequence
                pokemonName="Mewtwo"
                pokemonSprite={MEWTWO_SPRITE}
                accentClassName="from-[#f3f0ff] via-[#cab8ff] to-[#98c8ff]"
                introText={
                  hasPrototype151
                    ? "Le clone #150 force l'ouverture d'une archive interdite avant de charger."
                    : undefined
                }
                onComplete={handleCaptureComplete}
              />
            )}

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
