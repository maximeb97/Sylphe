declare module '@strudel/mini' {
  export function mini(code: string): any;
}

interface SuperdoughOutput {
  destinationGain: GainNode;
  channelMerger: ChannelMergerNode;
  connectToDestination(input: AudioNode, channels?: number[]): void;
  disconnect(): void;
  reset(): void;
}

interface SuperdoughAudioController {
  output: SuperdoughOutput;
  reset(): void;
  getOrbit(orbit: string, channels?: number[]): unknown;
  getBus(bus: string): unknown;
}

declare module '@strudel/webaudio' {
  export function webaudioOutput(hap: any, deadline: number, duration: any): void;
  export function getAudioContext(): AudioContext;
  export function initAudioOnFirstClick(): void;
  export function samples(urlOrMap: string | object, baseUrl?: string): Promise<void>;
  export function registerSynthSounds(): void;
  export function registerZZFXSounds(): void;
  export function getSuperdoughAudioController(): SuperdoughAudioController;
  export function setSuperdoughAudioController(controller: SuperdoughAudioController | null): SuperdoughAudioController | null;
  export function setAudioContext(context: AudioContext): AudioContext;
}

declare module '@strudel/core' {
  export function evalScope(...modules: Promise<any>[]): Promise<void>;
  export function repl(options: {
    defaultOutput: any;
    getTime: () => number;
    transpiler?: any;
  }): {
    evaluate: (code: string) => Promise<any>;
    start: () => void;
    stop: () => void;
    pause: () => void;
  };
}

declare module '@strudel/transpiler' {
  export function transpiler(code: string): Promise<{ output: string }>;
}

declare module '@strudel/tonal' {}
