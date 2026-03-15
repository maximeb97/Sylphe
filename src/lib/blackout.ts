"use client";

/**
 * Blackout Sylphe — Rare global event.
 * During a few seconds the entire GBA screen goes to black,
 * except a faint silhouette of captured Pokémon inside the Pokeball.
 * Triggers randomly under specific conditions.
 */

function readFlag(key: string): boolean {
  return (
    typeof window !== "undefined" && localStorage.getItem(key) === "true"
  );
}

export interface BlackoutInfo {
  active: boolean;
  survivors: string[];
  message: string;
}

function getCapturedSurvivors(): string[] {
  const names: string[] = [];
  if (readFlag("sylphe_mew_captured")) names.push("MEW");
  if (readFlag("sylphe_mewtwo_captured")) names.push("MEWTWO");
  if (readFlag("sylphe_porygon_echo")) names.push("PORYGON ECHO");
  return names;
}

export function shouldTriggerBlackout(): boolean {
  if (typeof window === "undefined") return false;

  // Must have at least one captured entity
  const survivors = getCapturedSurvivors();
  if (survivors.length === 0) return false;

  // Don't trigger on special pages
  const path = window.location.pathname;
  if (
    path === "/hall-of-fame" ||
    path === "/white-room" ||
    path === "/beneath-stairs"
  )
    return false;

  // Already triggered recently? (cooldown 5 min)
  const lastBlackout = Number(
    localStorage.getItem("sylphe_last_blackout") || "0",
  );
  if (Date.now() - lastBlackout < 300000) return false;

  // 3% chance on page load
  return Math.random() < 0.03;
}

export function getBlackoutInfo(): BlackoutInfo {
  const survivors = getCapturedSurvivors();
  const messages = [
    "COUPURE SECTEUR. Les systemes Sylphe sont hors-ligne.",
    "ALIMENTATION INTERROMPUE. Le confinement tient... pour l'instant.",
    "BLACKOUT SYLPHE. Les capteurs ne detectent que les entites deja liberees.",
    "PANNE GENERALISEE. Seuls les sujets en Masterball persistent.",
  ];

  return {
    active: true,
    survivors,
    message: messages[Math.floor(Math.random() * messages.length)],
  };
}

export function recordBlackout(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sylphe_last_blackout", Date.now().toString());
}

export const BLACKOUT_DURATION = 4500;
