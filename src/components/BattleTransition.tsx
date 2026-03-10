"use client";

import { useEffect, useState } from "react";

export default function BattleTransition({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 300),
      setTimeout(() => setStep(3), 500),
      setTimeout(() => setStep(4), 700),
      setTimeout(() => {
        setStep(5);
        onComplete();
      }, 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (step >= 5) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Horizontal bars sweep */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-gba-text"
          style={{
            left: i % 2 === 0 ? (step >= 2 ? "0%" : "-100%") : undefined,
            right: i % 2 !== 0 ? (step >= 2 ? "0%" : "-100%") : undefined,
            top: `${i * 12.5}%`,
            width: step >= 2 ? "100%" : "0%",
            height: "12.5%",
            transition: `all 0.3s ease-in ${i * 0.03}s`,
          }}
        />
      ))}

      {/* Flash */}
      {step >= 1 && step < 4 && (
        <div
          className="absolute inset-0 bg-gba-white"
          style={{
            opacity: step === 1 ? 0.8 : step === 2 ? 0.4 : 0,
            transition: "opacity 0.15s",
          }}
        />
      )}
    </div>
  );
}
