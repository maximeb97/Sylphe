"use client";

import { useState } from "react";
import PokemonCaptureSequence from "@/components/PokemonCaptureSequence";
import {
  MEW_SPRITE,
  MEWTWO_SPRITE,
  FANTOMINUS_SPRITE,
  LAPRAS_SPRITE,
  ELECTRODE_SPRITE,
  MISSINGNO_SPRITE,
  KABUTO_SPRITE,
  ZUBAT_SPRITE,
} from "@/components/PixelSprite";

interface PokemonOption {
  label: string;
  name: string;
  sprite: string[][];
  accent: string;
  introText?: string;
}

const POKEMON_OPTIONS: PokemonOption[] = [
  {
    label: "MEW",
    name: "MEW",
    sprite: MEW_SPRITE,
    accent: "from-[#fff2fb] via-[#f8c5df] to-[#a9d8ff]",
    introText: "Un MEW sauvage\napparait !",
  },
  {
    label: "MEWTWO",
    name: "MEWTWO",
    sprite: MEWTWO_SPRITE,
    accent: "from-[#f3f0ff] via-[#cab8ff] to-[#98c8ff]",
    introText: "MEWTWO sort\nde l'ombre !",
  },
  {
    label: "FANTOMINUS",
    name: "FANTOMINUS",
    sprite: FANTOMINUS_SPRITE,
    accent: "from-[#eee8ff] via-[#b38cff] to-[#3a255f]",
  },
  {
    label: "LAPRAS",
    name: "LAPRAS",
    sprite: LAPRAS_SPRITE,
    accent: "from-[#ecfbff] via-[#9fd8ff] to-[#3d7bb0]",
  },
  {
    label: "ELECTRODE",
    name: "ELECTRODE",
    sprite: ELECTRODE_SPRITE,
    accent: "from-[#fff1f1] via-[#ff7272] to-[#7b1010]",
  },
  {
    label: "KABUTO",
    name: "KABUTO",
    sprite: KABUTO_SPRITE,
    accent: "from-[#f6ecd3] via-[#caa26f] to-[#7b5835]",
  },
  {
    label: "ZUBAT",
    name: "ZUBAT",
    sprite: ZUBAT_SPRITE,
    accent: "from-[#2a1a4a] via-[#5830a0] to-[#9060e0]",
  },
  {
    label: "MISSINGNO",
    name: "MISSINGNO",
    sprite: MISSINGNO_SPRITE,
    accent: "from-[#d8f8ff] to-[#6fa8ff]",
    introText: "Une anomalie\napparait !",
  },
];

export default function TestCapturePage() {
  const [selected, setSelected] = useState<PokemonOption>(POKEMON_OPTIONS[0]);
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);

  function start() {
    setRunKey((k) => k + 1);
    setRunning(true);
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6"
      style={{ background: "#1a1a2e", fontFamily: "'PressStart2P', monospace" }}
    >
      <p className="text-[9px] text-[#88b058] tracking-widest">
        ◆ PAGE DE TEST — CAPTURE ◆
      </p>

      {/* Pokemon selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {POKEMON_OPTIONS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setSelected(p);
              setRunning(false);
            }}
            className="border-[2px] px-2 py-1 text-[7px] transition-all"
            style={{
              borderColor: selected.label === p.label ? "#f8d830" : "#506850",
              color: selected.label === p.label ? "#f8d830" : "#88b058",
              background: selected.label === p.label ? "#283820" : "transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Preview container – matches GBA screen proportions */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 360,
          height: 520,
          border: "4px solid #384030",
          boxShadow: "inset 0 0 0 2px #506850, 6px 6px 0 #101018",
        }}
      >
        {running ? (
          <PokemonCaptureSequence
            key={runKey}
            pokemonName={selected.name}
            pokemonSprite={selected.sprite}
            accentClassName={selected.accent}
            introText={selected.introText}
            onComplete={() => setRunning(false)}
          />
        ) : (
          /* Idle screen */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#c8e0a8]">
            <p className="text-[7px] text-[#506850]">PRÊT</p>
            <p className="text-[10px] text-[#183018]">{selected.name}</p>
            <button
              onClick={start}
              className="border-[3px] border-[#384030] bg-[#88b058] px-4 py-2 text-[8px] text-[#e8f0d0] active:translate-y-[2px]"
              style={{ boxShadow: "3px 3px 0 #284028" }}
            >
              ▶ LANCER
            </button>
          </div>
        )}
      </div>

      <p className="text-[6px] text-[#384030]">
        DEV ONLY — ne pas indexer
      </p>
    </div>
  );
}
