"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import PixelSprite, { MEW_SPRITE, MEWTWO_SPRITE, MISSINGNO_SPRITE, PORYGON_SPRITE, BOSS_SPRITE } from "@/components/PixelSprite";
import { getUnlockedInventoryItems, getVisitedMaps, setGameFlag } from "@/lib/gameState";

const archiveRoster = [
  { key: "sylphe_mew_captured", name: "MEW", sprite: MEW_SPRITE, note: "Sujet mythique stabilise apres capture aquatique." },
  { key: "sylphe_mewtwo_captured", name: "MEWTWO", sprite: MEWTWO_SPRITE, note: "Clone #150 conserve dans la Masterball blanche." },
  { key: "sylphe_missingno_unlocked", name: "MISSINGNO", sprite: MISSINGNO_SPRITE, note: "Anomalie ayant fracture l'inventaire et revele le Scope Sylphe." },
  { key: "sylphe_porygon_echo", name: "PORYGON ECHO", sprite: PORYGON_SPRITE, note: "Residus de SYLPHE_NET transites clandestinement vers l'interieur de la capsule." },
  { key: "sylphe_giovanni_unlocked", name: "GIOVANNI", sprite: BOSS_SPRITE, note: "Presence archivee du commanditaire du Projet M." },
];

const archiveRougePhases = [
  "ARCHIVE ROUGE // tentative de corruption detectee.",
  "Le Hall of Fame rejette la falsification et reconstruit les preuves une a une.",
  "Une signature inconnue sature l'ecran: WHITE_ROOM::BENEATH_STAIRS.",
  "Contre-mesure acceptee. L'indice est ecrit dans l'inventaire de supervision.",
];

export default function HallOfFamePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [hasArchiveDebug, setHasArchiveDebug] = useState(false);
  const [hasWhiteRoomHint, setHasWhiteRoomHint] = useState(false);
  const [inventory, setInventory] = useState(() => getUnlockedInventoryItems());
  const [visitedMaps, setVisitedMaps] = useState(() => getVisitedMaps());
  const [unlockedRoster, setUnlockedRoster] = useState<typeof archiveRoster>([]);
  const [showGlitchStrip, setShowGlitchStrip] = useState(false);
  const [showArchiveRouge, setShowArchiveRouge] = useState(false);
  const [archiveRougeStep, setArchiveRougeStep] = useState(0);

  useEffect(() => {
    const syncState = () => {
      const access = localStorage.getItem("sylphe_hall_of_fame") === "true";
      const archiveDebug = localStorage.getItem("sylphe_archive_debug") === "true";
      const whiteRoomHint = localStorage.getItem("sylphe_white_room_hint") === "true";

      setHasAccess(access);
      setHasArchiveDebug(archiveDebug);
      setHasWhiteRoomHint(whiteRoomHint);
      setInventory(getUnlockedInventoryItems());
      setVisitedMaps(getVisitedMaps());
      setUnlockedRoster(
        archiveRoster.filter(
          (entry) => localStorage.getItem(entry.key) === "true",
        ),
      );
    };

    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("sylphe_state_change", syncState);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("sylphe_state_change", syncState);
    };
  }, []);

  useEffect(() => {
    if (!hasArchiveDebug) return;

    const interval = window.setInterval(() => {
      setShowGlitchStrip(Math.random() < 0.35);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [hasArchiveDebug]);

  const handleArchiveRougeAdvance = () => {
    const nextStep = archiveRougeStep + 1;

    if (nextStep >= archiveRougePhases.length) {
      setGameFlag("sylphe_white_room_hint");
      setHasWhiteRoomHint(true);
      setShowArchiveRouge(false);
      setArchiveRougeStep(0);
      return;
    }

    setArchiveRougeStep(nextStep);
  };

  if (!hasAccess) {
    return (
      <GBAShell>
        <div className="gba-screen max-w-2xl w-full p-8 text-center bg-[#080b11] border-cyan-950 h-full flex flex-col justify-center items-center">
          <h1 className="text-cyan-300 mb-8 blink">HALL OF FAME INDISPONIBLE</h1>
          <p className="text-[8px] leading-[16px] text-cyan-100 mb-8">Le Hall of Fame est conserve dans les archives profondes. Le terminal doit monter le mode `archive-debug` avant ouverture.</p>
          <Link href="/"><button className="gba-btn">RETOUR SYSTEME</button></Link>
        </div>
      </GBAShell>
    );
  }

  return (
    <GBAShell>
      <section className="relative h-full bg-[radial-gradient(circle_at_top,rgba(120,255,255,0.14),transparent_30%),linear-gradient(180deg,#071019_0%,#0d1c2d_100%)] pixel-grid overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(90,220,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(90,220,255,0.06)_1px,transparent_1px)] bg-[size:18px_18px]" />

        <div className="bg-[#030812] border-b-2 border-cyan-950 text-cyan-300 text-[8px] px-4 py-2 flex justify-between items-center relative z-10">
          <span>📍 HALL OF FAME</span>
          <span className="opacity-70">ARCHIVE DEBUG {hasArchiveDebug ? "ONLINE" : "MOUNTED"}</span>
        </div>

        {showGlitchStrip && (
          <div className="relative z-10 border-b border-red-500/40 bg-[linear-gradient(90deg,rgba(255,60,60,0.16),rgba(255,255,255,0.05),rgba(255,60,60,0.2))] px-4 py-2 text-[7px] leading-[14px] text-red-100 animate-pulse">
            {hasWhiteRoomHint
              ? "VISUAL BUG? NON. WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE"
              : "VISUAL BUG? Une trame parasite insiste derriere les escaliers de la Grotte Azuree."}
          </div>
        )}

        <div className="p-4 md:p-5 space-y-4 relative z-10">
          <DialogBox className="!bg-[#dffcff]">
            <p className="text-[8px] leading-[16px] text-gba-text">Les archives profondes condensent toute la progression du Projet M en une seule salle. Ici, captures, objets et zones visitees deviennent des preuves.</p>
          </DialogBox>

          <DialogBox className="!bg-[#fff0f0]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[8px] text-gba-text">ARCHIVE ROUGE</p>
                <p className="text-[7px] leading-[14px] text-gba-bg-darker mt-1">Une routine de corruption factice rode ici. La provoquer force le Hall of Fame a montrer ce qu&apos;il tente encore de cacher.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setArchiveRougeStep(0);
                  setShowArchiveRouge(true);
                }}
                className="gba-btn !bg-[#8f1d2c] !text-white hover:!bg-[#b42236]"
              >
                CORROMPRE LES ARCHIVES
              </button>
            </div>
          </DialogBox>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DialogBox className="!bg-[#f6ffec]">
              <p className="text-[8px] mb-3 text-gba-text">ROSTER ARCHIVE</p>
              <div className="space-y-3">
                {unlockedRoster.map((entry) => (
                  <div key={entry.name} className="border-b border-gba-bg-dark/50 pb-2 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <PixelSprite sprite={entry.sprite} size={28} animate={false} />
                      <span className="text-[8px] text-gba-text">{entry.name}</span>
                    </div>
                    <p className="text-[7px] leading-[14px] text-gba-bg-darker">{entry.note}</p>
                  </div>
                ))}
              </div>
            </DialogBox>

            <DialogBox className="!bg-[#fff8e2]">
              <p className="text-[8px] mb-3 text-gba-text">INVENTAIRE TRACE</p>
              <div className="space-y-2">
                {inventory.map((item) => (
                  <div key={item.key}>
                    <p className="text-[8px] text-gba-text">▶ {item.name}</p>
                    <p className="text-[7px] leading-[14px] text-gba-bg-darker mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </DialogBox>

            <DialogBox className="!bg-[#f2f3ff]">
              <p className="text-[8px] mb-3 text-gba-text">CARTOGRAPHIE CONSERVEE</p>
              <div className="space-y-2">
                {visitedMaps.map((map) => (
                  <div key={map.href} className="flex items-center justify-between text-[7px] text-gba-text border-b border-gba-bg-dark/40 pb-1 last:border-b-0">
                    <span>{map.name}</span>
                    <Link href={map.href} className="text-gba-accent hover:text-gba-text">OUVRIR</Link>
                  </div>
                ))}
              </div>
            </DialogBox>
          </div>

          <DialogBox className="!bg-[#edf7ff]">
            <p className="text-[8px] text-gba-text mb-2">NOTE FINALE</p>
            <p className="text-[7px] leading-[14px] text-gba-bg-darker">Le Hall of Fame n&apos;est pas un musee. C&apos;est le journal de confinement de Sylphe Corp. Chaque secret archive ici represente une fuite qui n&apos;a jamais vraiment ete colmatee.</p>
            {hasWhiteRoomHint && (
              <p className="text-[7px] leading-[14px] text-red-700 mt-3">Indice persistant: WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE.</p>
            )}
          </DialogBox>
        </div>

        {showArchiveRouge && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#12050b]/85 p-4">
            <div className="w-full max-w-xl border-2 border-red-500 bg-[#16060a] p-4 shadow-[0_0_30px_rgba(255,60,60,0.24)]">
              <p className="text-[8px] text-red-300 mb-3">CONTRE-MESURE // ARCHIVE ROUGE</p>
              <p className="text-[8px] leading-[16px] text-red-100 min-h-[64px]">{archiveRougePhases[archiveRougeStep]}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowArchiveRouge(false);
                    setArchiveRougeStep(0);
                  }}
                  className="gba-btn !bg-[#2a1016] !text-red-100 hover:!bg-[#3a151d]"
                >
                  ANNULER
                </button>
                <button
                  type="button"
                  onClick={handleArchiveRougeAdvance}
                  className="gba-btn !bg-[#8f1d2c] !text-white hover:!bg-[#b42236]"
                >
                  LANCER CONTRE-MESURE
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </GBAShell>
  );
}