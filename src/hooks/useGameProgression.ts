"use client";

import { useEffect, useState } from "react";
import {
  getGameProgressionSnapshot,
  type GameProgressionSnapshot,
} from "@/lib/progression";

export function useGameProgression(): GameProgressionSnapshot {
  const [snapshot, setSnapshot] = useState<GameProgressionSnapshot>(() =>
    getGameProgressionSnapshot(),
  );

  useEffect(() => {
    const sync = () => {
      setSnapshot(getGameProgressionSnapshot());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("sylphe_state_change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("sylphe_state_change", sync);
    };
  }, []);

  return snapshot;
}