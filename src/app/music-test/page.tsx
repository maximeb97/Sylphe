"use client";

import { useState } from "react";
import GBAShell from "@/components/GBAShell";
import { useMusic } from "@/hooks/useMusic";
import { getAllTracks } from "@/lib/music/tracks";
import type { MusicTrack } from "@/lib/music/types";

export default function MusicTestPage() {
  const { state, actions } = useMusic();
  const allTracks = getAllTracks();
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  return (
    <GBAShell>
      <div className="min-h-screen bg-gba-bg p-4">
        {/* Header */}
        <div className="border-2 border-gba-window-border bg-gba-white/60 px-3 py-2 mb-4">
          <p className="text-[10px] text-gba-text font-bold">
            MUSIC ENGINE — TEST CONSOLE
          </p>
          <p className="text-[7px] text-gba-bg-darker mt-1">
            Page technique pour tester le système audio Strudel.
          </p>
        </div>

        {/* Current State */}
        <div className="border-2 border-gba-window-border bg-gba-white/60 px-3 py-2 mb-4">
          <p className="text-[8px] text-gba-text font-bold mb-2">
            ETAT COURANT
          </p>
          <div className="space-y-1 text-[7px] text-gba-bg-darker font-mono">
            <p>
              Piste:{" "}
              <span className="text-gba-text">
                {state.currentTrack?.name ?? "Aucune"}
              </span>
            </p>
            <p>
              Sequences actives:{" "}
              <span className="text-gba-text">
                {state.activeSequenceIds.size > 0
                  ? [...state.activeSequenceIds].join(", ")
                  : "—"}
              </span>
            </p>
            <p>
              Sequences temporaires:{" "}
              <span className="text-gba-text">
                {state.temporarySequenceIds.size > 0
                  ? [...state.temporarySequenceIds].join(", ")
                  : "—"}
              </span>
            </p>
            <p>
              One-shot:{" "}
              <span className="text-gba-text">
                {state.oneShotPlaying ? "En cours" : "—"}
              </span>
            </p>
            <p>
              Volume:{" "}
              <span className="text-gba-text">
                {Math.round(state.volume * 100)}%{state.muted ? " (MUTE)" : ""}
              </span>
            </p>
            <p>
              Chargement:{" "}
              <span className="text-gba-text">
                {state.loading ? "Oui" : "Non"}
              </span>
            </p>
            {state.error && (
              <p className="text-red-600">Erreur: {state.error}</p>
            )}
          </div>
          <button
            type="button"
            onClick={actions.stopMusic}
            className="mt-2 border border-red-400 bg-red-900/20 text-red-400 text-[7px] px-2 py-1 hover:bg-red-900/40 transition-colors"
          >
            STOP TOUT
          </button>
        </div>

        {/* Track list */}
        <div className="space-y-3">
          {allTracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isActive={state.currentTrack?.id === track.id}
              activeSequenceIds={state.activeSequenceIds}
              temporarySequenceIds={state.temporarySequenceIds}
              expanded={expandedTrack === track.id}
              onToggleExpand={() =>
                setExpandedTrack(expandedTrack === track.id ? null : track.id)
              }
              onPlay={() => actions.changeTrack(track.id)}
              onPlayOneShot={() => actions.playOneShot(track.id)}
              onToggleSequence={actions.toggleSequence}
              onActivateTemp={actions.activateTemporarySequence}
              onClearTemp={actions.clearTemporarySequence}
            />
          ))}
        </div>
      </div>
    </GBAShell>
  );
}

function TrackCard({
  track,
  isActive,
  activeSequenceIds,
  temporarySequenceIds,
  expanded,
  onToggleExpand,
  onPlay,
  onPlayOneShot,
  onToggleSequence,
  onActivateTemp,
  onClearTemp,
}: {
  track: MusicTrack;
  isActive: boolean;
  activeSequenceIds: Set<string>;
  temporarySequenceIds: Set<string>;
  expanded: boolean;
  onToggleExpand: () => void;
  onPlay: () => void;
  onPlayOneShot: () => void;
  onToggleSequence: (id: string) => void;
  onActivateTemp: (id: string) => void;
  onClearTemp: () => void;
}) {
  return (
    <div
      className={`border-2 px-3 py-2 transition-colors ${
        isActive
          ? "border-gba-accent bg-gba-accent/10"
          : "border-gba-window-border bg-gba-white/60"
      }`}
    >
      {/* Track header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex-1 text-left"
        >
          <p className="text-[8px] text-gba-text font-bold">
            {isActive ? "▶ " : ""}
            {track.name}
          </p>
          <p className="text-[6px] text-gba-bg-darker mt-[2px]">
            ID: {track.id} — {track.sequences.length} sequences —{" "}
            {track.loop ? "Boucle" : "One-shot"}
          </p>
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onPlay}
            className="border border-gba-accent text-gba-accent text-[7px] px-2 py-1 hover:bg-gba-accent/20 transition-colors"
          >
            PLAY
          </button>
          {!track.loop && (
            <button
              type="button"
              onClick={onPlayOneShot}
              className="border border-gba-gold text-gba-gold text-[7px] px-2 py-1 hover:bg-gba-gold/20 transition-colors"
            >
              ONE-SHOT
            </button>
          )}
        </div>
      </div>

      {/* Sequences */}
      {expanded && (
        <div className="mt-3 border-t border-gba-window-border pt-2">
          <p className="text-[7px] text-gba-bg-darker mb-2">SEQUENCES:</p>
          <div className="space-y-1">
            {track.sequences.map(seq => {
              const isSeqActive = activeSequenceIds.has(seq.id);
              const isTemp = temporarySequenceIds.has(seq.id);

              return (
                <div
                  key={seq.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <span
                      className={`text-[7px] font-mono ${
                        isSeqActive || isTemp
                          ? "text-gba-accent"
                          : "text-gba-bg-darker"
                      }`}
                    >
                      {isSeqActive ? "●" : isTemp ? "◐" : "○"} {seq.id}
                    </span>
                    <span className="text-[6px] text-gba-bg-darker ml-2">
                      {seq.defaultActive ? "(defaut: ON)" : "(defaut: OFF)"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleSequence(seq.id)}
                      className={`text-[6px] px-1 py-[2px] border transition-colors ${
                        isSeqActive
                          ? "border-gba-accent text-gba-accent"
                          : "border-gba-bg-darker text-gba-bg-darker"
                      }`}
                    >
                      {isSeqActive ? "ON" : "OFF"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        isTemp ? onClearTemp() : onActivateTemp(seq.id)
                      }
                      className={`text-[6px] px-1 py-[2px] border transition-colors ${
                        isTemp
                          ? "border-gba-gold text-gba-gold"
                          : "border-gba-bg-darker text-gba-bg-darker"
                      }`}
                    >
                      {isTemp ? "TEMP ✕" : "TEMP"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Raw code preview */}
          <details className="mt-2">
            <summary className="text-[6px] text-gba-bg-darker cursor-pointer">
              Code source Strudel
            </summary>
            <pre className="mt-1 text-[6px] text-gba-bg-darker bg-gba-text/10 p-2 overflow-x-auto whitespace-pre-wrap max-h-[200px] overflow-y-auto">
              {track.preamble && `${track.preamble}\n\n`}
              {track.sequences.map(s => s.code).join("\n\n")}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
