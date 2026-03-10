"use client";

import { useState, useEffect, useCallback } from "react";

interface PixelChar {
  char: string;
  visible: boolean;
}

export default function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  className = "",
  forceComplete = false,
  onComplete,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  forceComplete?: boolean;
  onComplete?: () => void;
}) {
  const [chars, setChars] = useState<PixelChar[]>(
    text.split("").map((c) => ({ char: c, visible: false }))
  );
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (forceComplete && !done) {
      setChars((prev) => prev.map((c) => ({ ...c, visible: true })));
      setDone(true);
      onComplete?.();
    }
  }, [forceComplete, done, onComplete]);

  const tick = useCallback(() => {
    setChars((prev) => {
      const idx = prev.findIndex((c) => !c.visible);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], visible: true };
      if (idx === prev.length - 1) {
        setDone(true);
        onComplete?.();
      }
      return next;
    });
  }, [onComplete]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  }, [started, speed, tick]);

  return (
    <span className={className}>
      {chars.map((c, i) => (
        <span
          key={i}
          className={c.visible ? "opacity-100" : "opacity-0"}
          style={{ transition: "opacity 0.05s" }}
        >
          {c.char}
        </span>
      ))}
      {!done && started && (
        <span
          className="inline-block w-[8px] h-[12px] bg-gba-text ml-[2px] align-middle"
          style={{ animation: "blink-cursor 0.8s step-end infinite" }}
        />
      )}
    </span>
  );
}
