"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { MusicTrack, MusicState, MusicActions } from "@/lib/music/types";
import {
  applyVolume,
  ensureAudioResumed,
  getAudioCtx,
  getInitialMuted,
  getInitialVolume,
  persistMuted,
  persistVolume,
  playScript,
  stopPlayback,
} from "@/lib/music/engine";
import { buildActiveScript } from "@/lib/music/parser";
import { getTrackById, getAllTracks } from "@/lib/music/tracks";
import { getRouteMusicConfig } from "@/lib/music/routeMusic";
import { parseCpmFromPreamble, msPerCycle } from "@/lib/music/parser";

// ─── Context ──────────────────────────────────────────────────────────────────

export const MusicStateContext = createContext<MusicState | null>(null);
export const MusicActionsContext = createContext<MusicActions | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MusicProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Audio state
  const [volume, setVolumeState] = useState(() => getInitialVolume());
  const [muted, setMutedState] = useState(() => getInitialMuted());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track state
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [activeSequenceIds, setActiveSequenceIds] = useState<Set<string>>(
    new Set(),
  );
  const [temporarySequenceIds, setTemporarySequenceIds] = useState<Set<string>>(
    new Set(),
  );
  const [oneShotPlaying, setOneShotPlaying] = useState(false);

  // Refs for avoiding stale closures
  const currentTrackRef = useRef(currentTrack);
  const activeSeqRef = useRef(activeSequenceIds);
  const tempSeqRef = useRef(temporarySequenceIds);
  const pageOverrideRef = useRef(false);
  const previousTrackRef = useRef<{
    track: MusicTrack;
    sequences: Set<string>;
  } | null>(null);
  // Per-sequence expiry timers
  const tempTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  currentTrackRef.current = currentTrack;
  activeSeqRef.current = activeSequenceIds;
  tempSeqRef.current = temporarySequenceIds;

  // ─── Volume ───────────────────────────────────────────────────────────────

  useEffect(() => {
    applyVolume(volume, muted);
    persistVolume(volume);
    persistMuted(muted);
  }, [volume, muted]);

  // ─── Evaluate active script whenever track/sequences change ───────────────

  const evaluate = useCallback(
    async (track: MusicTrack, seqIds: Set<string>, tempIds: Set<string>) => {
      const allActive = new Set(seqIds);
      for (const id of tempIds) allActive.add(id);

      const script = buildActiveScript(track, allActive);
      if (!script.trim()) {
        stopPlayback();
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await playScript(script);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Playback error";
        setError(msg);
        console.error("Music evaluation error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ─── Resume audio + retry on first user gesture ───────────────────────────
  // When a page is loaded directly (typed URL / hard refresh), the AudioContext
  // starts suspended because no user gesture has yet occurred. The browser
  // won't let ctx.resume() succeed until user interaction. We listen once for
  // the first pointer/keyboard event, resume the context, and re-evaluate the
  // current track so the Strudel scheduler re-schedules from the current time.

  useEffect(() => {
    const handler = async () => {
      try {
        const ctx = getAudioCtx();
        if (ctx.state !== "suspended") return;
        await ensureAudioResumed();
        const track = currentTrackRef.current;
        if (track) {
          evaluate(track, activeSeqRef.current, tempSeqRef.current);
        }
      } catch {
        // ignore — evaluate() has its own error handling
      }
    };

    document.addEventListener("pointerdown", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [evaluate]);

  // Re-evaluate on sequence changes
  useEffect(() => {
    if (!currentTrack) return;
    evaluate(currentTrack, activeSequenceIds, temporarySequenceIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, activeSequenceIds, temporarySequenceIds]);

  // ─── Route-based music mapping ────────────────────────────────────────────

  useEffect(() => {
    if (pageOverrideRef.current) return;

    const config = getRouteMusicConfig(pathname);
    if (!config) {
      // No music for this route — stop
      if (currentTrackRef.current) {
        stopPlayback();
        setCurrentTrack(null);
        setActiveSequenceIds(new Set());
        setTemporarySequenceIds(new Set());
        for (const t of tempTimersRef.current.values()) clearTimeout(t);
        tempTimersRef.current.clear();
      }
      return;
    }

    const track = getTrackById(config.trackId);
    if (!track) return;

    // Avoid re-evaluating if same track
    if (currentTrackRef.current?.id === track.id) return;

    const defaultSeqs = config.defaultSequences
      ? new Set(config.defaultSequences)
      : new Set(track.sequences.filter(s => s.defaultActive).map(s => s.id));

    setCurrentTrack(track);
    setActiveSequenceIds(defaultSeqs);
    setTemporarySequenceIds(new Set());
    // Cancel all pending expiry timers
    for (const t of tempTimersRef.current.values()) clearTimeout(t);
    tempTimersRef.current.clear();
    setOneShotPlaying(false);
  }, [pathname]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const changeTrack = useCallback((trackId: string) => {
    const track = getTrackById(trackId);
    if (!track) return;
    pageOverrideRef.current = true;
    const defaultSeqs = new Set(
      track.sequences.filter(s => s.defaultActive).map(s => s.id),
    );
    setCurrentTrack(track);
    setActiveSequenceIds(defaultSeqs);
    setTemporarySequenceIds(new Set());
    for (const t of tempTimersRef.current.values()) clearTimeout(t);
    tempTimersRef.current.clear();
    setOneShotPlaying(false);
  }, []);

  const stopMusic = useCallback(() => {
    stopPlayback();
    setCurrentTrack(null);
    setActiveSequenceIds(new Set());
    setTemporarySequenceIds(new Set());
    for (const t of tempTimersRef.current.values()) clearTimeout(t);
    tempTimersRef.current.clear();
    setOneShotPlaying(false);
    pageOverrideRef.current = false;
  }, []);

  const toggleSequence = useCallback((sequenceId: string) => {
    setActiveSequenceIds(prev => {
      const next = new Set(prev);
      if (next.has(sequenceId)) {
        next.delete(sequenceId);
      } else {
        next.add(sequenceId);
      }
      return next;
    });
  }, []);

  const activateTemporarySequence = useCallback(
    (sequenceId: string, loops = 2) => {
      // Cancel any existing timer for this sequence
      const existing = tempTimersRef.current.get(sequenceId);
      if (existing !== undefined) clearTimeout(existing);

      // Add the sequence to the active set
      setTemporarySequenceIds(prev => {
        const next = new Set(prev);
        next.add(sequenceId);
        return next;
      });

      // Compute expiry duration from the current track's CPM
      const track = currentTrackRef.current;
      const cpm = track ? parseCpmFromPreamble(track.preamble) : null;
      const duration = msPerCycle(cpm) * loops;

      // Schedule auto-removal
      const timer = setTimeout(() => {
        tempTimersRef.current.delete(sequenceId);
        setTemporarySequenceIds(prev => {
          const next = new Set(prev);
          next.delete(sequenceId);
          return next;
        });
      }, duration);

      tempTimersRef.current.set(sequenceId, timer);
    },
    [],
  );

  const clearTemporarySequence = useCallback(() => {
    for (const t of tempTimersRef.current.values()) clearTimeout(t);
    tempTimersRef.current.clear();
    setTemporarySequenceIds(new Set());
  }, []);

  const playOneShot = useCallback((trackId: string) => {
    const track = getTrackById(trackId);
    if (!track) return;

    // Remember current state for restoration
    if (currentTrackRef.current) {
      previousTrackRef.current = {
        track: currentTrackRef.current,
        sequences: new Set(activeSeqRef.current),
      };
    }

    const seqs = new Set(
      track.sequences.filter(s => s.defaultActive).map(s => s.id),
    );
    setCurrentTrack(track);
    setActiveSequenceIds(seqs);
    setTemporarySequenceIds(new Set());
    for (const t of tempTimersRef.current.values()) clearTimeout(t);
    tempTimersRef.current.clear();
    setOneShotPlaying(true);

    // For one-shot, evaluate once then restore after a generous delay.
    // A smarter approach could listen to Strudel's scheduler, but this is
    // sufficient for short SFX-like tracks.
    const script = buildActiveScript(track, seqs);
    playScript(script)
      .then(() => {
        // Wait a cycle (~2s at default 0.5 CPS) then restore
        setTimeout(() => {
          setOneShotPlaying(false);
          for (const t of tempTimersRef.current.values()) clearTimeout(t);
          tempTimersRef.current.clear();
          setTemporarySequenceIds(new Set());
          const prev = previousTrackRef.current;
          if (prev) {
            setCurrentTrack(prev.track);
            setActiveSequenceIds(prev.sequences);
            previousTrackRef.current = null;
          } else {
            stopPlayback();
            setCurrentTrack(null);
            setActiveSequenceIds(new Set());
          }
        }, 2500);
      })
      .catch(() => {
        setOneShotPlaying(false);
      });
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState(prev => !prev);
  }, []);

  // ─── Memoised context values ──────────────────────────────────────────────

  const state: MusicState = useMemo(
    () => ({
      currentTrack,
      activeSequenceIds,
      temporarySequenceIds,
      oneShotPlaying,
      volume,
      muted,
      loading,
      error,
    }),
    [
      currentTrack,
      activeSequenceIds,
      temporarySequenceIds,
      oneShotPlaying,
      volume,
      muted,
      loading,
      error,
    ],
  );

  const actions: MusicActions = useMemo(
    () => ({
      changeTrack,
      stopMusic,
      toggleSequence,
      activateTemporarySequence,
      clearTemporarySequence,
      playOneShot,
      setVolume,
      toggleMute,
    }),
    [
      changeTrack,
      stopMusic,
      toggleSequence,
      activateTemporarySequence,
      clearTemporarySequence,
      playOneShot,
      setVolume,
      toggleMute,
    ],
  );

  return (
    <MusicStateContext value={state}>
      <MusicActionsContext value={actions}>{children}</MusicActionsContext>
    </MusicStateContext>
  );
}

/** Barrel export: all track metadata for UI (e.g. test page) */
export { getAllTracks };
