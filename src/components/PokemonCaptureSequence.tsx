"use client";

import { useEffect, useMemo, useState } from "react";
import PixelSprite, { MASTERBALL_SPRITE, NEUTRAL_NPC_SPRITE } from "@/components/PixelSprite";
import TypewriterText from "@/components/TypewriterText";

// Time each step stays visible before auto-advancing (ms)
const STEP_DELAYS = [2600, 2200, 700, 1500, 1500, 1500, 2600];

export default function PokemonCaptureSequence({
  pokemonName,
  pokemonSprite,
  accentClassName = "from-[#d8f8ff] to-[#6fa8ff]",
  introText,
  onComplete,
}: {
  pokemonName: string;
  pokemonSprite: string[][];
  accentClassName?: string;
  introText?: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  // Track which step has finished typing; textDone resets automatically when step changes
  const [typingDoneStep, setTypingDoneStep] = useState(-1);
  const textDone = typingDoneStep === step;

  const messages = useMemo(
    () => [
      introText || `Un ${pokemonName} sauvage\napparait !`,
      "Le programme lance\nune MASTERBALL !",
      "La capsule file\ndans l'air...",
      "...Clac !",
      "...Clac !",
      "...Clac !",
      `${pokemonName}\nest capture !`,
    ],
    [introText, pokemonName],
  );

  useEffect(() => {
    if (step >= messages.length - 1) {
      const doneTimer = window.setTimeout(() => onComplete(), 1800);
      return () => window.clearTimeout(doneTimer);
    }

    const timer = window.setTimeout(() => {
      setStep(current => current + 1);
    }, STEP_DELAYS[step]);

    return () => window.clearTimeout(timer);
  }, [messages.length, onComplete, step]);

  const showWildPokemon = step <= 1;
  const showFlyingBall = step === 2;
  const showCaptureBall = step >= 3;
  const isCaptureDone = step >= 6;

  const shakeClass =
    step === 3
      ? "animate-[capture-shake-left_0.4s_linear_infinite]"
      : step === 4
        ? "animate-[capture-shake-right_0.4s_linear_infinite]"
        : step === 5
          ? "animate-[capture-shake-left_0.4s_linear_infinite]"
          : "";

  return (
    <div
      className="absolute inset-0 z-[70] flex flex-col"
      style={{ fontFamily: "'PressStart2P', monospace", background: "#e8f0d0" }}
    >
      {/* ── Battle arena ── */}
      <div
        className={`relative flex-1 overflow-hidden bg-gradient-to-b ${accentClassName}`}
      >
        {/* Scanlines CRT overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.045) 3px, rgba(0,0,0,0.045) 4px)",
          }}
        />

        {/* Horizon ground line */}
        <div className="absolute inset-x-0 bottom-[38%] h-[3px] bg-black/20" />

        {/* Enemy Pokemon platform (top-right) */}
        <div className="absolute right-[10%] top-[43%] h-7 w-28 -translate-y-[55%] rounded-[50%] border-2 border-[#384030]/45 bg-[#c8aa70]/80" />

        {/* Player platform (bottom-left) */}
        <div className="absolute bottom-[20%] left-[6%] h-9 w-36 rounded-[50%] border-2 border-[#384030]/45 bg-[#98c870]/80" />

        {/* Wild Pokemon sprite */}
        {showWildPokemon && (
          <div className="absolute right-[12%] top-[8%] animate-[float_2.2s_ease-in-out_infinite]">
            <PixelSprite sprite={pokemonSprite} size={80} animate={false} />
          </div>
        )}

        {/* Masterball in flight */}
        {showFlyingBall && (
          <div className="absolute left-[18%] top-[56%] animate-[masterball-throw_0.6s_ease-out_forwards]">
            <PixelSprite sprite={MASTERBALL_SPRITE} size={30} animate={false} />
          </div>
        )}

        {/* Capture ball – shaking or still */}
        {showCaptureBall && (
          <div className={`absolute right-[18%] top-[28%] ${shakeClass}`}>
            <PixelSprite sprite={MASTERBALL_SPRITE} size={44} animate={false} />
            {isCaptureDone && (
              <span
                className="absolute -right-1 -top-2 text-[14px] leading-none text-[#f8d830]"
                style={{
                  animation: "pixel-pulse 0.5s ease-in-out infinite",
                  textShadow: "1px 1px 0 #384030",
                }}
              >
                ✦
              </span>
            )}
          </div>
        )}

        {/* Player NPC sprite */}
        <div className="absolute bottom-[20%] left-[10%] -translate-y-full">
          <PixelSprite
            sprite={NEUTRAL_NPC_SPRITE}
            size={72}
            animate={false}
            className="-scale-x-100"
          />
        </div>

        {/* Wild Pokemon status box – top-left */}
        <div
          className="absolute left-3 top-3 min-w-[115px] border-[3px] border-[#506850] bg-[#e8f0d0] px-3 py-2"
          style={{ boxShadow: "inset 0 0 0 2px #88b058, 3px 3px 0 #284028" }}
        >
          <p className="mb-0.5 text-[6px] leading-[10px] text-[#506850]">
            SAUVAGE
          </p>
          <p className="mb-2 text-[8px] font-bold leading-[12px] text-[#183018]">
            {pokemonName.toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[6px] text-[#506850]">PV</span>
            <div className="h-[5px] w-16 border border-[#384030] bg-[#c0d890]">
              <div className="h-full bg-[#48c030]" style={{ width: "88%" }} />
            </div>
          </div>
        </div>

        {/* Player status box – bottom-right */}
        <div
          className="absolute bottom-[42%] right-3 min-w-[105px] border-[3px] border-[#506850] bg-[#e8f0d0] px-3 py-2 text-right"
          style={{ boxShadow: "inset 0 0 0 2px #88b058, 3px 3px 0 #284028" }}
        >
          <p className="mb-0.5 text-[6px] leading-[10px] text-[#506850]">
            JOUEUR
          </p>
          <p className="text-[7px] leading-[12px] text-[#183018]">
            MASTERBALL ×1
          </p>
        </div>
      </div>

      {/* ── Dialog panel ── */}
      <div
        className="relative min-h-[82px] border-t-[4px] border-[#506850] bg-[#e8f0d0] px-5 py-3"
        style={{ boxShadow: "inset 0 3px 0 #88b058" }}
      >
        {/* Inner pixel border */}
        <div className="pointer-events-none absolute inset-[4px] border-[2px] border-[#88b058]" />

        <div className="relative px-1 pt-1">
          <TypewriterText
            key={step}
            text={messages[step]}
            speed={36}
            className="whitespace-pre-line text-[8px] leading-[18px] text-[#183018]"
            onComplete={() => setTypingDoneStep(step)}
          />
          {textDone && step < messages.length - 1 && (
            <span
              className="absolute bottom-0 right-0 text-[10px] text-[#384030]"
              style={{ animation: "blink-cursor 0.7s step-end infinite" }}
            >
              ▼
            </span>
          )}
        </div>
      </div>
    </div>
  );
}