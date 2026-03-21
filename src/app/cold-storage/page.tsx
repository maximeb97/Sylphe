"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMusic } from "@/hooks/useMusic";
import { markMapVisited, setGameFlag } from "@/lib/gameState";
import GBAShell from "@/components/GBAShell";
import BattleTransition from "@/components/BattleTransition";
import DialogBox from "@/components/DialogBox";
import PokemonCaptureSequence from "@/components/PokemonCaptureSequence";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import {
  CRYO_POD_OPEN_SPRITE,
  CRYO_POD_SPRITE,
  CRYO_TERMINAL_SPRITE,
  ICE_PILLAR_SPRITE,
  LAPRAS_ARCHIVE_SPRITE,
  NEUTRAL_NPC_SPRITE,
  VENT_GRATE_SPRITE,
} from "@/components/PixelSprite";
import { CRYO_FLOOR, CRYO_WALL } from "@/components/tilemap/tiles";

const MAP_W = 20;
const MAP_H = 12;

const COLD_STORAGE_MAP: number[][] = Array.from({ length: MAP_H }, (_, y) =>
  Array.from({ length: MAP_W }, (_, x) => {
    if (y === MAP_H - 1 && x >= 8 && x <= 11) return CRYO_FLOOR;
    if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return CRYO_WALL;
    return CRYO_FLOOR;
  }),
);

const CRYO_PODS = [
  { id: "pod-01", x: 4, y: 2, label: "SAVE_01 — PIKACHU" },
  { id: "pod-02", x: 6, y: 2, label: "SAVE_02 — DRACAUFEU" },
  { id: "pod-03", x: 13, y: 2, label: "SAVE_03 — TORTANK" },
  { id: "pod-04", x: 15, y: 2, label: "SAVE_04 — FLORIZARRE" },
  { id: "pod-05", x: 4, y: 8, label: "SAVE_05 — ???? [CORROMPU]" },
  { id: "pod-06", x: 6, y: 8, label: "SAVE_06 — LOKHLASS ARCHIVE" },
  { id: "pod-07", x: 13, y: 8, label: "SAVE_07 — OSSATUEUR" },
  { id: "pod-08", x: 15, y: 8, label: "SAVE_08 — PORYGON-1" },
] as const;

export default function ColdStoragePage() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(
    "CHAMBRE FROIDE // SERVEUR DE SAUVEGARDE CRYOGENIQUE // TEMPERATURE: -42.0°C",
  );
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [thawLevel, setThawLevel] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [breathDetected, setBreathDetected] = useState(false);
  const [radioThawApplied, setRadioThawApplied] = useState(false);
  const [showBattleTransition, setShowBattleTransition] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<"lapras-archive" | null>(null);
  const [lokhlassCaptured, setLokhlassCaptured] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sylphe_lapras_archive_captured") === "true",
  );
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micFrameRef = useRef<number>(0);
  const awakenedRef = useRef(lokhlassCaptured);

  const hasMasterball =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_masterball_unlocked") === "true";
  const lokhlassAwake = thawLevel >= 80 && !lokhlassCaptured;
  const frozenPodIds = useMemo<Set<string>>(() => {
    const next = new Set<string>(CRYO_PODS.map((pod) => pod.id));
    if (lokhlassAwake) next.delete("pod-06");
    return next;
  }, [lokhlassAwake]);

  useEffect(() => {
    markMapVisited("/cold-storage");
  }, []);

  const applyThaw = useCallback(
    (amount: number) => {
      setThawLevel((value) => {
        const next = Math.min(value + amount, 100);
        if (value < 80 && next >= 80 && !lokhlassCaptured && !awakenedRef.current) {
          awakenedRef.current = true;
          actions.activateTemporarySequence("glacier-tone", 6);
          actions.activateTemporarySequence("thaw-signal", 4);
          setDialog(
            "La cuve 06 claque puis s'ouvre d'un cran. LOKHLASS ARCHIVE se detache de la glace et recommence a lire les sauvegardes oubliees.",
          );
        }
        return next;
      });
    },
    [actions, lokhlassCaptured],
  );

  const startMic = useCallback(async () => {
    if (micActive) {
      setDialog("Le micro est deja actif. Soufflez dans la ventilation pour accelerer le degel.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      streamRef.current = stream;
      audioContextRef.current = context;
      setMicActive(true);
      setDialog("Micro actif. Soufflez dans la grille cryogenique pour injecter un peu de chaleur dans la cuve 06.");
    } catch {
      setDialog("Micro inaccessible. Utilisez la Radio Pokematos sur 5.0 MHz pour emettre un signal thermique a distance.");
    }
  }, [micActive]);

  useEffect(() => {
    if (!micActive || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const spectrum = new Uint8Array(analyser.frequencyBinCount);

    const scan = () => {
      analyser.getByteFrequencyData(spectrum);
      const lowBand = spectrum.slice(0, 12).reduce((sum, value) => sum + value, 0) / 12;
      if (lowBand > 75) {
        setBreathDetected(true);
        applyThaw(1);
      }
      micFrameRef.current = window.requestAnimationFrame(scan);
    };

    scan();
    return () => window.cancelAnimationFrame(micFrameRef.current);
  }, [applyThaw, micActive]);

  useEffect(() => {
    const applyRadioThaw = () => {
      if (typeof window === "undefined") return;
      const hasSignal = localStorage.getItem("sylphe_cryo_thaw") === "true";
      if (hasSignal && !radioThawApplied) {
        setRadioThawApplied(true);
        setBreathDetected(true);
        applyThaw(50);
        setDialog("Un pic thermique traverse les conduits. La frequence 5.0 MHz secoue les cuves depuis la radio de poche.");
      }
    };

    applyRadioThaw();
    window.addEventListener("storage", applyRadioThaw);
    window.addEventListener("sylphe_state_change", applyRadioThaw);

    return () => {
      window.removeEventListener("storage", applyRadioThaw);
      window.removeEventListener("sylphe_state_change", applyRadioThaw);
    };
  }, [applyThaw, radioThawApplied]);

  useEffect(() => {
    return () => {
      if (micFrameRef.current) window.cancelAnimationFrame(micFrameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  const npcs = useMemo<CustomNPC[]>(() => {
    const pods: CustomNPC[] = CRYO_PODS.map((pod) => ({
      id: pod.id,
      x: pod.x,
      y: pod.y,
      sprite:
        pod.id === "pod-06" && lokhlassAwake && !lokhlassCaptured
          ? CRYO_POD_OPEN_SPRITE
          : CRYO_POD_SPRITE,
      type: "static",
    }));

    return [
      ...pods,
      { id: "terminal", x: 10, y: 5, sprite: CRYO_TERMINAL_SPRITE, type: "static" },
      { id: "vent", x: 9, y: 9, sprite: VENT_GRATE_SPRITE, type: "static" },
      { id: "pillar-a", x: 9, y: 3, sprite: ICE_PILLAR_SPRITE, type: "static" },
      { id: "pillar-b", x: 10, y: 7, sprite: ICE_PILLAR_SPRITE, type: "static" },
      ...(lokhlassAwake && !lokhlassCaptured
        ? [{ id: "lokhlass-archive", x: 6, y: 7, sprite: LAPRAS_ARCHIVE_SPRITE, type: "static" as const }]
        : []),
    ];
  }, [lokhlassAwake, lokhlassCaptured]);

  const handleInteract = useCallback(
    (_tile: number, _x: number, _y: number, npcId?: string) => {
      setIsTypewriterDone(false);
      setForceComplete(false);

      if (!npcId) return;

      if (npcId.startsWith("pod-")) {
        const pod = CRYO_PODS.find((entry) => entry.id === npcId);
        if (!pod) return;

        if (npcId === "pod-06" && lokhlassAwake && !lokhlassCaptured) {
          setDialog("CUVE 06: verrouillage rompu. Les cristaux de sauvegarde tournent autour de LOKHLASS ARCHIVE comme un halo de memoire.");
          return;
        }

        if (frozenPodIds.has(npcId)) {
          setDialog(`CUVE CRYOGENIQUE // ${pod.label} // STATUT: GELE. Les donnees tournent encore en boucle.`);
        } else {
          setDialog(`CUVE CRYOGENIQUE // ${pod.label} // STATUT: DEGEL EN COURS. Les octets respirent de nouveau.`);
        }
        return;
      }

      if (npcId === "terminal") {
        if (lokhlassCaptured) {
          setDialog("TERMINAL CENTRAL: extraction archivee. La cuve 06 est maintenant vide et le serveur marque l'incident comme transfert autorise.");
        } else if (!lokhlassAwake) {
          setDialog("TERMINAL CENTRAL: degel insuffisant. Injectez un souffle via la grille ou une impulsion radio 5.0 MHz pour atteindre 80%.");
        } else if (!hasMasterball) {
          setDialog("TERMINAL CENTRAL: LOKHLASS ARCHIVE est reveille mais instable. Une Masterball est requise pour securiser l'extraction.");
        } else {
          setDialog("TERMINAL CENTRAL: protocole de capture arme. L'archive vivante a quitte sa cuve. Approchez-vous d'elle pour lancer l'extraction.");
        }
        return;
      }

      if (npcId === "vent") {
        if (!micActive) {
          void startMic();
          return;
        }
        setDialog("GRILLE DE VENTILATION: le micro ecoute deja votre souffle. Chaque pulse thermique fait craquer la couche de glace.");
        return;
      }

      if (npcId === "pillar-a" || npcId === "pillar-b") {
        setDialog("Une colonne de givre entoure les tuyaux du sous-sol. On dirait moins un decor qu'une sauvegarde figee en infrastructure.");
        return;
      }

      if (npcId === "lokhlass-archive") {
        if (!hasMasterball) {
          setDialog("LOKHLASS ARCHIVE flotte hors de la cuve mais refuse de quitter la chambre froide sans capsule de confinement adapte.");
          return;
        }

        setCaptureTarget("lapras-archive");
        setShowBattleTransition(true);
      }
    },
    [frozenPodIds, hasMasterball, lokhlassAwake, lokhlassCaptured, micActive, startMic],
  );

  const handlePlayerMove = useCallback(
    (_x: number, y: number) => {
      if (y >= MAP_H - 1) router.push("/");
    },
    [router],
  );

  const handleCaptureComplete = useCallback(() => {
    setCaptureTarget(null);
    setLokhlassCaptured(true);
    setGameFlag("sylphe_lapras_archive_captured");
    actions.playOneShot("sfx-capture");
    actions.activateTemporarySequence("cryo-alarm", 2);
    setDialog("LOKHLASS ARCHIVE est capture. La chambre froide perd son dernier specimen vivant, mais pas la memoire qu'il transportait.");
  }, [actions]);

  const handleDialogClick = () => {
    if (isTypewriterDone) {
      setDialog(null);
      setIsTypewriterDone(false);
      setForceComplete(false);
      return;
    }
    setForceComplete(true);
  };

  return (
    <GBAShell>
      <section className="relative h-full overflow-hidden bg-[#0a1520]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(136,200,248,0.16),transparent_28%),linear-gradient(180deg,rgba(5,20,35,0.45),rgba(8,18,30,0.88))]" />

        <div className="relative z-20 flex items-center justify-between border-b border-[#1a3050] bg-[#0c1a28]/90 px-4 py-2 text-[8px] text-[#9fd8ff]">
          <span>📍 CHAMBRE FROIDE // LVL -3</span>
          <span className="opacity-70">TEMP: {(-42 + thawLevel * 0.4).toFixed(1)}°C</span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={COLD_STORAGE_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="h-auto w-full saturate-110"
          />

          <div className="absolute right-2 top-2 z-20 border border-[#2a4a6a] bg-[#071520]/85 px-3 py-2 text-[6px] leading-[12px] text-[#c9f1ff]">
            <p>DEGEL: {Math.min(thawLevel, 100)}%</p>
            <p>MICRO: {micActive ? "ACTIF" : "INACTIF"}</p>
            <p>RADIO 5.0: {radioThawApplied ? "IMPULSION REÇUE" : "EN ATTENTE"}</p>
            <p>THERMIQUE: {breathDetected ? "DETECTEE" : "CALME"}</p>
          </div>

          {!micActive && !lokhlassCaptured && (
            <button
              type="button"
              onClick={() => {
                void startMic();
              }}
              className="absolute right-2 top-20 z-20 border border-[#2a4a6a] bg-[#102638] px-3 py-2 text-[7px] text-[#d8f6ff] hover:bg-[#16324a]"
            >
              ACTIVER LE MICRO
            </button>
          )}

          {showBattleTransition && (
            <BattleTransition onComplete={() => setShowBattleTransition(false)} />
          )}

          {captureTarget === "lapras-archive" && !showBattleTransition && (
            <PokemonCaptureSequence
              pokemonName="Lokhlass Archive"
              pokemonSprite={LAPRAS_ARCHIVE_SPRITE}
              accentClassName="from-[#d0f0ff] via-[#88c8f8] to-[#17324a]"
              introText="La glace se reforme derriere lui pendant que LOKHLASS ARCHIVE quitte sa cuve. Les anciennes sauvegardes hurlent a travers la condensation."
              onComplete={handleCaptureComplete}
            />
          )}

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
              <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
                <TypewriterText
                  key={dialog}
                  text={dialog}
                  speed={40}
                  forceComplete={forceComplete}
                  className="block text-[8px] leading-[18px] text-gba-text md:text-[9px]"
                  onComplete={() => setIsTypewriterDone(true)}
                />
              </DialogBox>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="absolute bottom-1 right-2 z-30 text-[6px] text-[#7fbde8] transition-colors hover:text-[#d8f6ff]"
        >
          ← RETOUR
        </Link>
      </section>
    </GBAShell>
  );
}
