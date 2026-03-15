export const playPokemonCry = (id: number) => {
  const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
  audio.volume = 0.3;
  audio.play().catch((e) => console.warn("Failed to play cry (user unmuted?):", e));
};

export const playReversedMewCry = async () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const res = await fetch(
      "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/151.ogg",
    );
    const buf = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);

    // Reverse the audio buffer
    const reversed = ctx.createBuffer(
      decoded.numberOfChannels,
      decoded.length,
      decoded.sampleRate,
    );
    for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
      const src = decoded.getChannelData(ch);
      const dst = reversed.getChannelData(ch);
      for (let i = 0; i < src.length; i++) {
        dst[i] = src[src.length - 1 - i];
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = reversed;
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.warn("Reversed cry failed:", e);
  }
};

export const playGlitchSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "square";
        
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch(e) {
        console.warn("AudioContext not supported or unmuted");
    }
};
