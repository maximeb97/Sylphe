"use client";

import { useEffect, useState } from "react";
import { WeatherState, startWeatherCycle } from "@/lib/weather";

export default function WeatherOverlay() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const stop = startWeatherCycle((w) => {
      setWeather(w);
      if (w.type !== "clear") {
        setShowLabel(true);
        const t = setTimeout(() => setShowLabel(false), 6000);
        return () => clearTimeout(t);
      }
    });
    return stop;
  }, []);

  if (!weather || weather.type === "clear") return null;

  return (
    <>
      {/* Weather visual overlay */}
      {weather.type === "acid-rain" && (
        <div className="weather-acid-rain absolute inset-0 pointer-events-none z-30" />
      )}
      {weather.type === "cyber-aurora" && (
        <div className="weather-cyber-aurora absolute inset-0 pointer-events-none z-30" />
      )}
      {weather.type === "spectral-fog" && (
        <div className="weather-spectral-fog absolute inset-0 pointer-events-none z-30" />
      )}

      {/* Weather notification */}
      {showLabel && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-40 border-2 border-gba-window-border bg-white/90 px-3 py-2 text-[7px] leading-[14px] text-gba-text max-w-[220px] text-center"
          style={{ animation: "weather-fade 6s ease-in-out forwards" }}
        >
          <p className="font-bold">{weather.label}</p>
          <p className="mt-1 text-gba-bg-darker">{weather.detail}</p>
        </div>
      )}
    </>
  );
}
