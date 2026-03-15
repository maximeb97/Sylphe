"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function RadioPokematos() {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState(88.0);
  const [message, setMessage] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 200;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    audioCtxRef.current = ctx;
    oscillatorRef.current = osc;
    gainRef.current = gain;
  }, []);

  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  const handleFrequencyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const freq = parseFloat(e.target.value);
    setFrequency(freq);

    if (!audioCtxRef.current) startAudio();

    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = 100 + (freq - 80) * 20;
    }

    // Special frequencies
    if (Math.abs(freq - 20.5) < 0.6) {
      // Pokeflute frequency
      setMessage("🎵 La melodie de la Pokeflute resonne... Un Ronflex se reveille quelque part !");
      if (typeof window !== "undefined") {
        localStorage.setItem("sylphe_pokeflute_played", "true");
        window.dispatchEvent(new Event("storage"));
      }
      if (oscillatorRef.current) {
        // Play Pokeflute melody
        const osc = oscillatorRef.current;
        const now = audioCtxRef.current!.currentTime;
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.2);
        osc.frequency.setValueAtTime(784, now + 0.4);
        osc.frequency.setValueAtTime(1047, now + 0.6);
      }
    } else if (Math.abs(freq - 10.5) < 0.3) {
      // Lavender frequency
      setMessage("👻 ...des murmures... 'Sujet 151... nous t'attendons...' ...le signal s'affaiblit...");
      if (typeof window !== "undefined") {
        localStorage.setItem("sylphe_lavender_whisper", "true");
        window.dispatchEvent(new Event("storage"));
      }
      if (oscillatorRef.current && gainRef.current) {
        oscillatorRef.current.frequency.value = 60;
        gainRef.current.gain.value = 0.02;
      }
    } else if (Math.abs(freq - 42.0) < 0.3) {
      setMessage("📡 Signal inconnu... 'La reponse est 42. Mais quelle etait la question ?'");
    } else if (Math.abs(freq - 151.0) < 0.3) {
      setMessage("⚡ Frequence interdite ! Signal du Sujet 151 detecte sur cette bande !");
    } else {
      setMessage(null);
    }
  }, [startAudio]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-[6px] text-gba-gold opacity-60 hover:opacity-100 transition-opacity"
        title="Radio Pokematos"
      >
        📻
      </button>
    );
  }

  return (
    <div className="absolute top-[26px] right-2 z-50 bg-[#1a1a2e] border border-[#2a2a4a] p-2 rounded shadow-lg"
      style={{ width: 400 }}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[7px] text-gba-gold">📻 RADIO POKEMATOS</span>
        <button onClick={() => { setIsOpen(false); oscillatorRef.current?.stop(); audioCtxRef.current?.close(); audioCtxRef.current = null; oscillatorRef.current = null; }}
          className="text-[8px] text-[#666] hover:text-white">✕</button>
      </div>
      <div className="text-[10px] text-center text-gba-accent font-mono mb-1">
        {frequency.toFixed(1)} MHz
      </div>
      <input
        type="range"
        min="1"
        max="200"
        step="0.1"
        value={frequency}
        onChange={handleFrequencyChange}
        className="w-full h-[6px] appearance-none bg-[#2a2a4a] rounded cursor-pointer"
        style={{ accentColor: "#ffcc00" }}
      />
      <div className="flex justify-between text-[5px] text-[#444] mt-[2px]">
        <span>1 MHz</span>
        <span>200 MHz</span>
      </div>
      {message && (
        <p className="text-[6px] text-gba-accent mt-1 leading-[9px] animate-pulse">
          {message}
        </p>
      )}
      <p className="text-[5px] text-[#333] mt-1 text-center">
        Frequences speciales: 10.5 / 20.5 / 42.0 / 151.0
      </p>
    </div>
  );
}
