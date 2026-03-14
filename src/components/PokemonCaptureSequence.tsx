"use client";

import { useEffect, useMemo, useState } from "react";
import PixelSprite, { MASTERBALL_SPRITE, NEUTRAL_NPC_SPRITE } from "@/components/PixelSprite";

const STEP_DELAYS = [900, 800, 500, 500, 500, 1000, 900];

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

  const messages = useMemo(
    () => [
      introText || `Un ${pokemonName} sauvage apparait !`,
      "Le programme lance une MASTERBALL !",
      "La capsule file dans l'air.",
      "...Clac !",
      "...Clac !",
      "...Clac !",
      `${pokemonName} est capture !`,
    ],
    [introText, pokemonName]
  );

  useEffect(() => {
    if (step >= messages.length - 1) {
      const doneTimer = window.setTimeout(() => onComplete(), 900);
      return () => window.clearTimeout(doneTimer);
    }

    const timer = window.setTimeout(() => {
      setStep((current) => current + 1);
    }, STEP_DELAYS[step]);

    return () => window.clearTimeout(timer);
  }, [messages.length, onComplete, step]);

  const showWildPokemon = step <= 1;
  const showFlyingBall = step === 2;
  const showCaptureBall = step >= 3;
  const shakeClass = step === 3 ? "animate-[capture-shake-left_0.28s_linear_infinite]" : step === 4 ? "animate-[capture-shake-right_0.28s_linear_infinite]" : step === 5 ? "animate-[capture-shake-left_0.28s_linear_infinite]" : "";

  return (
    <div className="absolute inset-0 z-[70] flex flex-col bg-white text-black">
      <div className={`relative flex-1 overflow-hidden bg-gradient-to-b ${accentClassName}`}>
        <div className="absolute inset-x-0 top-[18%] mx-auto h-12 w-40 rounded-[50%] border-2 border-black/20 bg-white/35" />
        <div className="absolute inset-x-0 bottom-[18%] mx-auto h-16 w-48 rounded-[50%] border-2 border-black/20 bg-[#d8c890]/70" />

        {showWildPokemon && (
          <div className="absolute right-[16%] top-[18%] animate-[float_1.6s_ease-in-out_infinite]">
            <PixelSprite sprite={pokemonSprite} size={88} animate={false} />
          </div>
        )}

        {showFlyingBall && (
          <div className="absolute left-[18%] top-[56%] animate-[masterball-throw_0.45s_ease-out_forwards]">
            <PixelSprite sprite={MASTERBALL_SPRITE} size={34} animate={false} />
          </div>
        )}

        {showCaptureBall && (
          <div className={`absolute right-[18%] top-[28%] ${shakeClass}`}>
            <PixelSprite sprite={MASTERBALL_SPRITE} size={44} animate={false} />
          </div>
        )}

        <div className="absolute left-[10%] bottom-[22%]">
          <PixelSprite sprite={NEUTRAL_NPC_SPRITE} size={82} animate={false} className="-scale-x-100" />
        </div>

        <div className="absolute left-4 top-4 rounded border-2 border-black bg-white/85 px-3 py-2 text-[8px] leading-[14px]">
          <p className="mb-1">SAUVAGE</p>
          <p>{pokemonName.toUpperCase()}</p>
        </div>

        <div className="absolute right-4 bottom-24 rounded border-2 border-black bg-white/85 px-3 py-2 text-[8px] leading-[14px] text-right">
          <p className="mb-1">PLAYER</p>
          <p>MASTERBALL x1</p>
        </div>
      </div>

      <div className="border-t-4 border-black bg-white px-4 py-3 min-h-[86px]">
        <p className="text-[8px] leading-[16px]">{messages[step]}</p>
      </div>
    </div>
  );
}