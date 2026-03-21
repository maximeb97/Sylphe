"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMusic } from "@/hooks/useMusic";
import { markMapVisited, setGameFlag } from "@/lib/gameState";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import {
  ARCHIVE_DOOR_SPRITE,
  NEUTRAL_NPC_SPRITE,
  PHANTOM_WAGON_SPRITE,
  SUBWAY_SIGNAL_SPRITE,
} from "@/components/PixelSprite";
import { SUBWAY_PLATFORM, SUBWAY_TRACK, SUBWAY_WALL } from "@/components/tilemap/tiles";

const MAP_W = 24;
const MAP_H = 12;

const SUBWAY_MAP: number[][] = Array.from({ length: MAP_H }, (_, y) =>
  Array.from({ length: MAP_W }, (_, x) => {
    if (y === MAP_H - 1 && x >= 10 && x <= 13) return SUBWAY_PLATFORM;
    if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return SUBWAY_WALL;
    if (y >= 3 && y <= 7) return SUBWAY_TRACK;
    return SUBWAY_PLATFORM;
  }),
);

const ARCHIVE_ENTRIES = [
  {
    title: "REGISTRE LOGISTIQUE 1996-04-12",
    content: "Transfert de materiel biologique depuis le niveau -3 vers le Laboratoire Central. Conteneur marque '151-ALPHA'. Le personnel de nuit rapporte des bruits dans le tunnel apres fermeture.",
  },
  {
    title: "MEMO INTERNE — CHEF DE GARE",
    content: "Les wagons fantomes ne sont pas un mythe. Le systeme de suivi affiche un convoi non programme sur la voie B tous les mardis a 03:00. Nous avons cesse d'envoyer des equipes d'investigation.",
  },
  {
    title: "RAPPORT INCIDENT 2001-09-17",
    content: "Un employe a signale avoir vu un Lokhlass dans le tunnel de refroidissement adjacent. L'entite a disparu dans le systeme de ventilation cryogenique. Reclassifie comme hallucination thermique.",
  },
  {
    title: "NOTE CONFIDENTIELLE — PROJET SUBWAY",
    content: "Le tunnel relie l'aile publique de Sylphe Corp. au sous-sol du Musee Null. Cette connexion a ete effacee des plans officiels apres l'incident du Prototype 151. Seul le Passe Train Magnetique peut activer l'aiguillage fantome.",
  },
];

export default function SilphSubwayPage() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(
    "TUNNEL LOGISTIQUE SYLPHE // VOIE ABANDONNEE // PROFONDEUR: -2 SOUS-SOLS",
  );
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [wagonVisible, setWagonVisible] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sylphe_subway_wagon_arrived") === "true",
  );
  const [wagonArrived, setWagonArrived] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sylphe_subway_wagon_arrived") === "true",
  );
  const [wagonX, setWagonX] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("sylphe_subway_wagon_arrived") === "true" ? 17 : -4),
  );
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveIndex, setArchiveIndex] = useState(0);
  const [archiveFound, setArchiveFound] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sylphe_subway_archive_found") === "true",
  );
  const [signalsActivated, setSignalsActivated] = useState<Set<string>>(new Set());

  const hasMagnetPass =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_magnet_train_pass") === "true";

  useEffect(() => {
    markMapVisited("/silph-subway");
    setGameFlag("sylphe_subway_visited");
  }, []);

  useEffect(() => {
    if (!hasMagnetPass || wagonVisible || wagonArrived) return;

    const timer = setTimeout(() => {
      setWagonVisible(true);
      actions.activateTemporarySequence("phantom-wagon", 4);
      setDialog("Un grondement lointain... Le Passe Train Magnetique vibre dans votre poche. Un wagon fantome approche sur la voie B.");
    }, 8000);
    return () => clearTimeout(timer);
  }, [actions, hasMagnetPass, wagonArrived, wagonVisible]);

  useEffect(() => {
    if (!wagonVisible || wagonArrived) return;

    const animInterval = setInterval(() => {
      setWagonX((prev) => {
        if (prev >= 17) {
          clearInterval(animInterval);
          setWagonArrived(true);
          setGameFlag("sylphe_subway_wagon_arrived");
          setTimeout(() => {
            setDialog("Le wagon fantome s'est arrete devant la Porte des Archives. L'aiguillage repond au Passe Train Magnetique. Approchez-vous de la porte violette.");
          }, 500);
          return 17;
        }
        return prev + 1;
      });
    }, 160);

    return () => clearInterval(animInterval);
  }, [wagonArrived, wagonVisible]);

  const npcs = useMemo<CustomNPC[]>(() => {
    const base: CustomNPC[] = [
      { id: "signal-nw", x: 5, y: 1, sprite: SUBWAY_SIGNAL_SPRITE, type: "static" },
      { id: "signal-ne", x: 17, y: 1, sprite: SUBWAY_SIGNAL_SPRITE, type: "static" },
      { id: "signal-sw", x: 5, y: 9, sprite: SUBWAY_SIGNAL_SPRITE, type: "static" },
      { id: "signal-se", x: 17, y: 9, sprite: SUBWAY_SIGNAL_SPRITE, type: "static" },
      { id: "archive-door", x: 11, y: 8, sprite: ARCHIVE_DOOR_SPRITE, type: "static" },
    ];

    if (wagonVisible) {
      base.push({
        id: "phantom-wagon",
        x: wagonX,
        y: 5,
        sprite: PHANTOM_WAGON_SPRITE,
        type: "static",
      });
    }

    return base;
  }, [wagonVisible, wagonX]);

  const handleInteract = useCallback(
    (_tile: number, _x: number, _y: number, npcId?: string) => {
      if (!npcId) return;

      setIsTypewriterDone(false);
      setForceComplete(false);

      if (npcId.startsWith("signal-")) {
        if (signalsActivated.has(npcId)) {
          setDialog("Le signal reste au vert. La voie fantome est deja alimentee par votre passage.");
          return;
        }

        setSignalsActivated((current) => {
          const next = new Set(current);
          next.add(npcId);
          return next;
        });
        actions.activateTemporarySequence("archive-whistle", 2);
        setDialog("Le signal d'aiguillage s'allume. Les anciens registres logistiques mentionnent des wagons fantomes sur cette voie..."
        );
        return;
      }

      if (npcId === "phantom-wagon") {
        setDialog(
          wagonArrived
            ? "Le wagon fantome n'affiche aucun numero de ligne. Son moteur tourne sans chaleur et sans conducteur."
            : "Le convoi spectral traverse le tunnel sans ralentir encore. Sa carrosserie semble imprimee par la brume."
        );
        return;
      }

      if (npcId === "archive-door") {
        if (!hasMagnetPass) {
          setDialog("La porte des Archives porte un lecteur de carte magnetique. L'etiquette indique: KANTO RAIL CORP. — ACCES RESTREINT.");
          return;
        }

        if (!wagonArrived) {
          setDialog("La porte est verrouillee. Le wagon fantome n'est pas encore arrive devant l'aiguillage archive.");
          return;
        }

        if (!archiveFound) {
          setArchiveFound(true);
          setGameFlag("sylphe_subway_archive_found");
        }
        actions.activateTemporarySequence("archive-whistle", 6);
        setArchiveIndex(0);
        setArchiveOpen(true);
      }
    },
    [actions, archiveFound, hasMagnetPass, signalsActivated, wagonArrived],
  );

  const handlePlayerMove = useCallback(
    (_x: number, y: number) => {
      if (archiveOpen) return;
      if (y >= MAP_H - 1) router.push("/");
    },
    [archiveOpen, router],
  );

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
      <section className="relative h-full overflow-hidden bg-[#12121a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,100,200,0.12),transparent_30%),linear-gradient(180deg,rgba(20,20,30,0.5),rgba(12,12,18,0.9))]" />

        <div className="relative z-20 flex items-center justify-between border-b border-[#2a2a4a] bg-[#1a1a2a]/90 px-4 py-2 text-[8px] text-[#c8c8e8]">
          <span>📍 SYLPHE SUBWAY // VOIE ABANDONNEE B</span>
          <span className="opacity-60">
            {hasMagnetPass ? "🎫 PASSE TRAIN MAGNETIQUE" : "🔒 ACCES RESTREINT"}
          </span>
        </div>

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={SUBWAY_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={12}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="h-auto w-full"
          />

          <div className="absolute left-2 top-2 z-20 border border-[#393955] bg-[#11111a]/85 px-3 py-2 text-[6px] leading-[12px] text-[#d8d8ff]">
            <p>SIGNAUX: {signalsActivated.size}/4</p>
            <p>WAGON: {wagonArrived ? "A QUAI" : wagonVisible ? "EN APPROCHE" : "ABSENT"}</p>
          </div>

        {archiveOpen && (
          <div className="absolute inset-0 z-50 bg-[#0a0a12]/95 flex items-center justify-center">
            <div className="bg-[#1a1a2a] border border-[#3a3a5a] p-4 max-w-[320px]">
              <div className="text-[7px] text-[#d4af37] mb-2">
                📂 ARCHIVES LOGISTIQUES — {archiveIndex + 1}/{ARCHIVE_ENTRIES.length}
              </div>
              <div className="text-[8px] text-[#c8a8f8] font-bold mb-1">
                {ARCHIVE_ENTRIES[archiveIndex].title}
              </div>
              <p className="text-[7px] text-[#8a8aaa] leading-[12px] mb-3">
                {ARCHIVE_ENTRIES[archiveIndex].content}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (archiveIndex > 0) setArchiveIndex(archiveIndex - 1);
                  }}
                  className="text-[7px] text-[#6a6a9a] hover:text-[#c8c8e8] disabled:opacity-30"
                  disabled={archiveIndex === 0}
                >
                  ← PRECEDENT
                </button>
                <button
                  onClick={() => {
                    if (archiveIndex < ARCHIVE_ENTRIES.length - 1) {
                      setArchiveIndex(archiveIndex + 1);
                    } else {
                      setArchiveOpen(false);
                      setDialog("Les archives logistiques confirment que le tunnel reliait autrefois Sylphe Corp. au sous-sol du Musee Null. Ce passage a ete scelle apres l'incident 151.");
                    }
                  }}
                  className="text-[7px] text-[#c8a8f8] hover:text-[#e8d8ff]"
                >
                  {archiveIndex < ARCHIVE_ENTRIES.length - 1 ? "SUIVANT →" : "FERMER"}
                </button>
              </div>
            </div>
          </div>
        )}

        {dialog && !archiveOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-40">
            <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
              <TypewriterText
                key={dialog}
                text={dialog}
                speed={40}
                forceComplete={forceComplete}
                onComplete={() => setIsTypewriterDone(true)}
              />
            </DialogBox>
          </div>
        )}

        </div>

        <Link
          href="/"
          className="absolute bottom-1 right-2 text-[6px] text-[#8a8aaa] hover:text-[#d8d8ff] z-40 transition-colors"
        >
          ← RETOUR
        </Link>
      </section>
    </GBAShell>
  );
}
