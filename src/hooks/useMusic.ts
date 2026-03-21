"use client";

import { useContext, useEffect } from "react";
import { MusicStateContext, MusicActionsContext } from "@/app/providers";
import type { MusicState, MusicActions } from "@/lib/music/types";

/**
 * Access the global music state and actions.
 *
 * ```tsx
 * const { state, actions } = useMusic();
 * actions.changeTrack("overworld");
 * actions.toggleSequence("drums");
 * ```
 */
export function useMusic(): { state: MusicState; actions: MusicActions } {
  const state = useContext(MusicStateContext);
  const actions = useContext(MusicActionsContext);
  if (!state || !actions) {
    throw new Error("useMusic must be used within <MusicProvider>");
  }
  return { state, actions };
}

/**
 * Declare the music for the current page.
 * On mount it will switch to the given track with the specified sequences.
 * On unmount it releases the page-level override so the route mapping
 * can take over again.
 *
 * ```tsx
 * usePageMusic("lab-ambiance", ["bass", "pads"]);
 * ```
 */
export function usePageMusic(
  trackId: string,
  sequenceIds?: string[],
): void {
  const actions = useContext(MusicActionsContext);
  if (!actions) {
    throw new Error("usePageMusic must be used within <MusicProvider>");
  }

  useEffect(() => {
    actions.changeTrack(trackId);
    if (sequenceIds) {
      // The changeTrack call sets defaultActive sequences.
      // If caller wants a specific subset, toggle accordingly.
      // We re-apply after a microtask to let the state settle.
      const timer = setTimeout(() => {
        if (sequenceIds) {
          for (const id of sequenceIds) {
            actions.toggleSequence(id);
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);
}
