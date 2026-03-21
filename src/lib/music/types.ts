/** A named block extracted from a Strudel script (delimited by `$:`) */
export interface SequenceBlock {
  /** Unique identifier for this sequence block */
  id: string;
  /** The raw Strudel code for this block (including the `$:` prefix) */
  code: string;
  /** Whether this block is active by default */
  defaultActive: boolean;
}

/** A complete music track with its sequences */
export interface MusicTrack {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Preamble code (setcpm, comments, etc. — everything before the first $:) */
  preamble: string;
  /** All sequence blocks parsed from the script */
  sequences: SequenceBlock[];
  /** Whether this track loops (true) or plays once (false) */
  loop: boolean;
}

/** Current playback state exposed by the provider */
export interface MusicState {
  /** Currently loaded track (null = silence) */
  currentTrack: MusicTrack | null;
  /** IDs of sequences currently active (persistent) */
  activeSequenceIds: Set<string>;
  /** IDs of temporarily activated sequences (auto-expire after N cycles) */
  temporarySequenceIds: Set<string>;
  /** Whether a one-shot is currently playing */
  oneShotPlaying: boolean;
  /** Volume level 0–1 */
  volume: number;
  /** Whether audio is muted */
  muted: boolean;
  /** Whether the engine is loading/initializing */
  loading: boolean;
  /** Current error message, if any */
  error: string | null;
}

/** Actions available through the music hook */
export interface MusicActions {
  /** Replace the current track entirely */
  changeTrack: (trackId: string) => void;
  /** Stop all music */
  stopMusic: () => void;
  /** Toggle a sequence on/off persistently */
  toggleSequence: (sequenceId: string) => void;
  /** Activate a sequence temporarily; auto-expires after `loops` cycles (default 2) */
  activateTemporarySequence: (sequenceId: string, loops?: number) => void;
  /** Clear all temporary sequences immediately */
  clearTemporarySequence: () => void;
  /** Play a track as a one-shot (plays once, then restores previous) */
  playOneShot: (trackId: string) => void;
  /** Set volume (0–1) */
  setVolume: (volume: number) => void;
  /** Toggle mute */
  toggleMute: () => void;
}

/** Route-to-music mapping entry */
export interface RouteMusicConfig {
  /** Track ID to play on this route */
  trackId: string;
  /** Sequence IDs to activate by default on this route */
  defaultSequences?: string[];
}
