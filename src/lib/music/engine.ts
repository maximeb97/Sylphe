/**
 * Global audio engine — singleton that owns the AudioContext, master GainNode,
 * Strudel REPL instance, and volume persistence via localStorage.
 *
 * Every audio source in the app (Strudel music, SFX, RadioPokematos) must
 * connect through `getMasterGain()` so the volume wheel controls everything.
 */

const VOLUME_KEY = "sylphe_audio_volume";
const MUTED_KEY = "sylphe_audio_muted";

type ConsoleMethodName = "debug" | "error" | "info" | "log" | "warn";

const STRUDEL_CONSOLE_METHODS: readonly ConsoleMethodName[] = [
  "debug",
  "error",
  "info",
  "log",
  "warn",
];
const STRUDEL_STACK_PATTERNS = [
  /[\\/]node_modules[\\/](?:@strudel|superdough)[\\/]/i,
  /@strudel[\\/]/i,
  /superdough/i,
  /supradough/i,
  /clockworker/i,
  /sampler/i,
  /cyclist/i,
  /eval/i,
  /webaudio/i,
  /uBOL/i,
  /getTrigger/i,
];

// ─── Singleton state ──────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let strudelScopePromise: Promise<void> | null = null;
let strudelConsoleFilterInstalled = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let replInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let replPromise: Promise<any> | null = null;

function isStrudelConsoleCall(): boolean {
  const stack = new Error().stack;
  return typeof stack === "string"
    ? STRUDEL_STACK_PATTERNS.some(pattern => pattern.test(stack))
    : false;
}

function containsStrudelLog(args: unknown[]): boolean {
  return args.some(arg => {
    if (typeof arg === "string") {
      return STRUDEL_STACK_PATTERNS.some(pattern => pattern.test(arg));
    }
    if (arg instanceof Error && typeof arg.stack === "string") {
      return STRUDEL_STACK_PATTERNS.some(pattern =>
        pattern.test(arg.stack as string),
      );
    }
    return false;
  });
}

function installStrudelConsoleFilter(): void {
  if (strudelConsoleFilterInstalled || typeof window === "undefined") return;
  strudelConsoleFilterInstalled = true;

  for (const method of STRUDEL_CONSOLE_METHODS) {
    const original = console[method].bind(console);
    console[method] = ((...args: unknown[]) => {
      if (isStrudelConsoleCall() || containsStrudelLog(args)) return;
      original(...args);
    }) as Console[ConsoleMethodName];
  }
}

installStrudelConsoleFilter();

// ─── AudioContext + master gain ───────────────────────────────────────────────

export function getAudioCtx(): AudioContext {
  if (audioCtx) return audioCtx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  audioCtx = new Ctor();
  return audioCtx;
}

/** Master GainNode through which all audio must flow. */
export function getMasterGain(): GainNode {
  if (masterGain) return masterGain;
  const ctx = getAudioCtx();
  masterGain = ctx.createGain();
  masterGain.gain.value = getPersistedVolume();
  masterGain.connect(ctx.destination);
  return masterGain;
}

/** Resume a suspended AudioContext (required after first user gesture). */
export async function ensureAudioResumed(): Promise<void> {
  const ctx = getAudioCtx();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

// ─── Volume persistence ───────────────────────────────────────────────────────

function getPersistedVolume(): number {
  if (typeof window === "undefined") return 0.7;
  const raw = localStorage.getItem(VOLUME_KEY);
  if (raw === null) return 0.7;
  const v = parseFloat(raw);
  return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.7;
}

function getPersistedMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTED_KEY) === "true";
}

export function persistVolume(volume: number): void {
  localStorage.setItem(VOLUME_KEY, String(volume));
}

export function persistMuted(muted: boolean): void {
  localStorage.setItem(MUTED_KEY, String(muted));
}

export function applyVolume(volume: number, muted: boolean): void {
  const gain = getMasterGain();
  gain.gain.value = muted ? 0 : volume;
}

export function getInitialVolume(): number {
  return getPersistedVolume();
}

export function getInitialMuted(): boolean {
  return getPersistedMuted();
}

// ─── Strudel scope (registers all Strudel functions on globalThis) ────────────

async function initStrudelScope(): Promise<void> {
  if (strudelScopePromise) return strudelScopePromise;
  strudelScopePromise = (async () => {
    const { evalScope } = await import("@strudel/core");
    await evalScope(
      import("@strudel/core"),
      import("@strudel/mini"),
      import("@strudel/webaudio"),
      import("@strudel/tonal"),
    );
    const { registerSynthSounds, registerZZFXSounds } = await import(
      "@strudel/webaudio"
    );
    registerSynthSounds();
    registerZZFXSounds();

    const { samples } = await import("@strudel/webaudio");
    await samples("github:tidalcycles/Dirt-Samples");
    await samples('github:maximeb97/dough-samples');
    await samples('github:tidalcycles/uzu-drumkit');
  })();
  return strudelScopePromise;
}

// ─── Strudel REPL (singleton) ─────────────────────────────────────────────────

export async function getRepl() {
  if (replInstance) return replInstance;
  if (replPromise) return replPromise;

  replPromise = (async () => {
    // 1. Ensure our AudioContext + masterGain exist BEFORE superdough can create its own.
    //    getMasterGain() may have already been called (e.g. from audio.ts SFX functions),
    //    so this is a no-op if they already exist.
    const ourCtx = getAudioCtx();
    if (!masterGain) {
      masterGain = ourCtx.createGain();
      masterGain.gain.value = getPersistedMuted() ? 0 : getPersistedVolume();
      masterGain.connect(ourCtx.destination);
    }

    // 2. Inject our AudioContext into superdough so that the SuperdoughAudioController
    //    (and all samples) are created on the same context as our masterGain.
    //    This MUST happen before initStrudelScope() calls getAudioContext() internally.
    const { setAudioContext: setSDCtx } =
      await import("@strudel/webaudio");
    setSDCtx(ourCtx);

    // 3. initStrudelScope() imports @strudel/webaudio which calls registerWorklet()
    //    at module level, populating the worklet URL list in superdough.
    //    initAudio() must be called AFTER that so loadWorklets() picks up the URL
    //    and calls audioCtx.audioWorklet.addModule() on ourCtx — required before
    //    any AudioWorkletNode can be constructed.
    await initStrudelScope();

    const { repl } = await import("@strudel/core");
    const { transpiler } = await import("@strudel/transpiler");
    const { webaudioOutput, getSuperdoughAudioController } =
      await import("@strudel/webaudio");

    // 4. Reroute superdough's destinationGain through our masterGain.
    //    Both nodes are now on ourCtx, so the connection is valid.
    const sdController = getSuperdoughAudioController();
    sdController.output.destinationGain.disconnect();
    sdController.output.destinationGain.connect(masterGain);

    replInstance = repl({
      defaultOutput: webaudioOutput,
      getTime: () => ourCtx.currentTime,
      transpiler,
    });

    return replInstance;
  })();

  return replPromise;
}

// ─── Imperative playback API ──────────────────────────────────────────────────

export async function playScript(code: string): Promise<void> {
  await ensureAudioResumed();
  const r = await getRepl();
  await r!.evaluate(code);
}

export function stopPlayback(): void {
  if (replInstance) {
    replInstance.stop();
  }
}
