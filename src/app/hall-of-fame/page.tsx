"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import { useGameProgression } from "@/hooks/useGameProgression";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import PixelSprite from "@/components/PixelSprite";
import { setGameFlag } from "@/lib/gameState";
import {
  ARCHIVE_WITNESS_PROGRESSIONS,
  CAPTURE_PROGRESSIONS,
} from "@/lib/progression";

const archiveRougePhases = [
  "ARCHIVE ROUGE // tentative de corruption detectee.",
  "Le Hall of Fame rejette la falsification et reconstruit les preuves une a une.",
  "Une signature inconnue sature l'ecran: WHITE_ROOM::BENEATH_STAIRS.",
  "Contre-mesure acceptee. L'indice est ecrit dans l'inventaire de supervision.",
];

export default function HallOfFamePage() {
  const { actions } = useMusic();
  const progression = useGameProgression();
  const [showGlitchStrip, setShowGlitchStrip] = useState(false);
  const [showArchiveRouge, setShowArchiveRouge] = useState(false);
  const [archiveRougeStep, setArchiveRougeStep] = useState(0);

  useEffect(() => {
    if (!progression.hasArchiveDebug) return;

    const interval = window.setInterval(() => {
      setShowGlitchStrip(Math.random() < 0.35);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [progression.hasArchiveDebug]);

  const handleArchiveRougeAdvance = () => {
    const nextStep = archiveRougeStep + 1;

    if (nextStep >= archiveRougePhases.length) {
      setGameFlag("sylphe_white_room_hint");
      setShowArchiveRouge(false);
      setArchiveRougeStep(0);
      actions.clearTemporarySequence();
      actions.activateTemporarySequence("glory-theme", 6);
      actions.playOneShot("sfx-puzzle");
      return;
    }

    if (nextStep === 1) {
      actions.activateTemporarySequence("corruption-glitch", 4);
    }

    setArchiveRougeStep(nextStep);
  };

  if (!progression.hasHallOfFameAccess) {
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
          <span className="opacity-70">
            ARCHIVE DEBUG {progression.hasArchiveDebug ? "ONLINE" : "MOUNTED"}
          </span>
        </div>

        {showGlitchStrip && (
          <div className="relative z-10 border-b border-red-500/40 bg-[linear-gradient(90deg,rgba(255,60,60,0.16),rgba(255,255,255,0.05),rgba(255,60,60,0.2))] px-4 py-2 text-[7px] leading-[14px] text-red-100 animate-pulse">
            {progression.hasWhiteRoomHint
              ? "VISUAL BUG? NON. WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE"
              : "VISUAL BUG? Une trame parasite insiste derriere les escaliers de la Grotte Azuree."}
          </div>
        )}

        <div className="p-4 md:p-5 space-y-4 relative z-10">
          <DialogBox className="!bg-[#dffcff]">
            <p className="text-[8px] leading-[16px] text-gba-text">
              Les archives profondes condensent toute la progression du Projet M
              en une seule salle. Ici, captures, evenements, objets et zones
              visitees deviennent des preuves consultables.
            </p>
          </DialogBox>

          <DialogBox className="!bg-[#fff0f0]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[8px] text-gba-text">ARCHIVE ROUGE</p>
                <p className="text-[7px] leading-[14px] text-gba-bg-darker mt-1">
                  Une routine de corruption factice rode ici. La provoquer force
                  le Hall of Fame a montrer ce qu&apos;il tente encore de
                  cacher.
                </p>
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

          <DialogBox className="!bg-[#eef7ff]">
            <div className="grid grid-cols-2 gap-2 text-[7px] leading-[14px] text-gba-text md:grid-cols-4">
              <p>
                CAPTURES: {progression.capturedPokemon.length}/{CAPTURE_PROGRESSIONS.length}
              </p>
              <p>
                ANOMALIES: {progression.archiveWitnesses.length}/{ARCHIVE_WITNESS_PROGRESSIONS.length}
              </p>
              <p>EVENEMENTS: {progression.unlockedEvents.length}</p>
              <p>ROUTES TRACEES: {progression.visitedMaps.length}</p>
            </div>
          </DialogBox>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <DialogBox className="!bg-[#f6ffec]">
              <p className="text-[8px] mb-3 text-gba-text">
                CAPTURES CONSERVEES
              </p>
              <div className="space-y-3">
                {progression.capturedPokemon.length === 0 && (
                  <p className="text-[7px] leading-[14px] text-gba-bg-darker">
                    Aucune capture archivee pour le moment.
                  </p>
                )}
                {progression.capturedPokemon.map(entry => (
                  <div
                    key={entry.name}
                    className="border-b border-gba-bg-dark/50 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <PixelSprite
                        sprite={entry.sprite}
                        size={28}
                        animate={false}
                      />
                      <span className="text-[8px] text-gba-text">
                        {entry.name}
                      </span>
                    </div>
                    <p className="text-[7px] leading-[14px] text-gba-bg-darker">
                      {entry.hallNote}
                    </p>
                  </div>
                ))}
              </div>
            </DialogBox>

            <DialogBox className="!bg-[#fff3ef]">
              <p className="text-[8px] mb-3 text-gba-text">
                ANOMALIES & TEMOINS
              </p>
              <div className="space-y-2">
                {progression.archiveWitnesses.length === 0 && (
                  <p className="text-[7px] leading-[14px] text-gba-bg-darker">
                    Aucune anomalie majeure encore indexee.
                  </p>
                )}
                {progression.archiveWitnesses.map(entry => (
                  <div
                    key={entry.name}
                    className="border-b border-gba-bg-dark/40 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <PixelSprite
                        sprite={entry.sprite}
                        size={28}
                        animate={false}
                      />
                      <span className="text-[8px] text-gba-text">
                        {entry.name}
                      </span>
                    </div>
                    <p className="text-[7px] leading-[14px] text-gba-bg-darker">
                      {entry.hallNote}
                    </p>
                  </div>
                ))}
              </div>
            </DialogBox>

            <DialogBox className="!bg-[#fff8e2]">
              <p className="text-[8px] mb-3 text-gba-text">
                EVENEMENTS DEBLOQUES
              </p>
              <div className="space-y-2">
                {progression.unlockedEvents.length === 0 && (
                  <p className="text-[7px] leading-[14px] text-gba-bg-darker">
                    Le registre d'evenements est encore vide.
                  </p>
                )}
                {progression.unlockedEvents.map(event => (
                  <div
                    key={event.key}
                    className="border-b border-gba-bg-dark/40 pb-2 last:border-b-0"
                  >
                    <p className="text-[8px] text-gba-text">▶ {event.title}</p>
                    <p className="text-[7px] leading-[14px] text-gba-bg-darker mt-1">
                      {event.detail}
                    </p>
                  </div>
                ))}
              </div>
            </DialogBox>

            <DialogBox className="!bg-[#f2f3ff]">
              <p className="text-[8px] mb-3 text-gba-text">
                CARTOGRAPHIE CONSERVEE
              </p>
              <div className="space-y-2">
                {progression.visitedMaps.map(map => (
                  <div
                    key={map.href}
                    className="flex items-center justify-between text-[7px] text-gba-text border-b border-gba-bg-dark/40 pb-1 last:border-b-0"
                  >
                    <span>{map.name}</span>
                    <Link
                      href={map.href}
                      className="text-gba-accent hover:text-gba-text"
                    >
                      OUVRIR
                    </Link>
                  </div>
                ))}
              </div>
            </DialogBox>
          </div>

          <DialogBox className="!bg-[#fff8e2]">
            <p className="text-[8px] mb-3 text-gba-text">INVENTAIRE TRACE</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {progression.inventory.map(item => (
                <div key={item.key}>
                  <p className="text-[8px] text-gba-text">▶ {item.name}</p>
                  <p className="text-[7px] leading-[14px] text-gba-bg-darker mt-1">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </DialogBox>

          <DialogBox className="!bg-[#edf7ff]">
            <p className="text-[8px] text-gba-text mb-2">NOTE FINALE</p>
            <p className="text-[7px] leading-[14px] text-gba-bg-darker">
              Le Hall of Fame n&apos;est pas un musee. C&apos;est le journal de
              confinement de Sylphe Corp. Chaque capture, chaque evenement et
              chaque route archivee ici represente une fuite que le systeme
              n&apos;a jamais reussi a refermer.
            </p>
            {progression.hasWhiteRoomHint && (
              <p className="text-[7px] leading-[14px] text-red-700 mt-3">
                Indice persistant: WHITE_ROOM // BENEATH_STAIRS //
                CERULEAN-CAVE.
              </p>
            )}
          </DialogBox>
        </div>

        {showArchiveRouge && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#12050b]/85 p-4">
            <div className="w-full max-w-xl border-2 border-red-500 bg-[#16060a] p-4 shadow-[0_0_30px_rgba(255,60,60,0.24)]">
              <p className="text-[8px] text-red-300 mb-3">
                CONTRE-MESURE // ARCHIVE ROUGE
              </p>
              <p className="text-[8px] leading-[16px] text-red-100 min-h-[64px]">
                {archiveRougePhases[archiveRougeStep]}
              </p>
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