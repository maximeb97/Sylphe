"use client";

export type WeatherType =
  | "acid-rain"
  | "cyber-aurora"
  | "spectral-fog"
  | "clear";

export interface WeatherState {
  type: WeatherType;
  label: string;
  detail: string;
}

const WEATHER_CHECK_INTERVAL = 30000;

function readFlag(key: string): boolean {
  return (
    typeof window !== "undefined" && localStorage.getItem(key) === "true"
  );
}

export function rollWeather(): WeatherState {
  const hasRocket = readFlag("sylphe_rocket_mode");
  const hasPorygonEcho = readFlag("sylphe_porygon_echo");
  const hasSilphScope = readFlag("sylphe_silph_scope");

  const roll = Math.random();

  if (hasSilphScope && roll < 0.12) {
    return {
      type: "spectral-fog",
      label: "BROUILLARD SPECTRAL",
      detail:
        "Le Scope Sylphe reagit. Des residus de memoire flottent dans l'air — fantomes de donnees jamais effacees.",
    };
  }

  if (hasRocket && roll < 0.22) {
    return {
      type: "acid-rain",
      label: "PLUIE ACIDE ROCKET",
      detail:
        "Precipitation toxique signee Team Rocket. Les emissions du labo corrompu contaminent l'atmosphere locale.",
    };
  }

  if (hasPorygonEcho && roll < 0.30) {
    return {
      type: "cyber-aurora",
      label: "AURORE CYBERNETIQUE",
      detail:
        "Porygon projette des fragments de cyberespace dans le ciel. Les donnees numériques forment une aurore boreale digitale.",
    };
  }

  return { type: "clear", label: "", detail: "" };
}

export function startWeatherCycle(
  onChange: (weather: WeatherState) => void,
): () => void {
  const initial = rollWeather();
  onChange(initial);

  const interval = setInterval(() => {
    onChange(rollWeather());
  }, WEATHER_CHECK_INTERVAL);

  return () => clearInterval(interval);
}
