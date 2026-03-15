"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import StartMenu from "@/components/StartMenu";
import { markMapVisited } from "@/lib/gameState";
import {
  shouldTriggerBlackout,
  getBlackoutInfo,
  recordBlackout,
  BLACKOUT_DURATION,
  type BlackoutInfo,
} from "@/lib/blackout";

export default function GBAShell({
  children,
  overlay,
}: {
  children: React.ReactNode;
  overlay?: React.ReactNode;
}) {
  const [powered, setPowered] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [blackout, setBlackout] = useState<BlackoutInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setPowered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    markMapVisited(pathname);
  }, [pathname]);

  // Blackout Sylphe — rare event
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (shouldTriggerBlackout()) {
          const info = getBlackoutInfo();
          setBlackout(info);
          recordBlackout();
          setTimeout(() => setBlackout(null), BLACKOUT_DURATION);
        }
      },
      3000 + Math.random() * 8000,
    ); // random delay after page load
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const tagName = document.activeElement?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") return;
      if (event.key !== "Enter" || overlay) return;

      event.preventDefault();
      setStartMenuOpen(current => !current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overlay]);

  const dispatchVirtualInput = (
    key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
  ) => {
    if (overlay) return;
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#1a1a2e]">
      {/* GBA Device outer shell */}
      <div className="w-full max-w-4xl">
        {/* Shoulder buttons */}
        <div className="flex justify-between px-4 mb-[-2px] relative z-10">
          <div className="w-[48px] h-[12px] bg-[#3a3a5a] rounded-t-md border-t-2 border-l-2 border-r-2 border-[#2a2a4a] flex items-center justify-center">
            <span className="text-[5px] text-[#6a6a8a]">L</span>
          </div>
          <div className="w-[48px] h-[12px] bg-[#3a3a5a] rounded-t-md border-t-2 border-l-2 border-r-2 border-[#2a2a4a] flex items-center justify-center">
            <span className="text-[5px] text-[#6a6a8a]">R</span>
          </div>
        </div>

        {/* Top bezel */}
        <div className="bg-[#4a4a6a] rounded-t-[24px] pt-6 px-6 pb-0 border-t-4 border-l-4 border-r-4 border-[#3a3a5a] relative">
          {/* Power LED */}
          <div className="absolute top-3 left-8 flex items-center gap-2">
            <div
              className={`w-[8px] h-[8px] rounded-full transition-colors duration-500 ${
                powered
                  ? "bg-[#88f058] shadow-[0_0_8px_#88f058]"
                  : "bg-[#404040]"
              }`}
            />
            <span className="text-[6px] text-[#8888aa] uppercase tracking-wider">
              Power
            </span>
          </div>

          {/* Screen area */}
          <div className="bg-[#2a2a3a] rounded-t-lg p-3 border-2 border-[#222] relative">
            {/* Screen glare */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.03] to-transparent rounded-t-lg pointer-events-none z-[70]" />

            <div
              className={`gba-screen scanlines relative overflow-hidden rounded transition-all duration-700 ${
                powered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animation: powered ? "screen-on 0.8s ease-out" : undefined,
              }}
            >
              {/* Blackout Sylphe overlay */}
              {blackout && (
                <div
                  className="absolute inset-0 z-[80] bg-black flex flex-col items-center justify-center"
                  style={{ animation: "blackout-flash 0.3s ease-in-out" }}
                >
                  <p className="text-[7px] text-red-900 animate-pulse mb-3 px-4 text-center">
                    {blackout.message}
                  </p>
                  {blackout.survivors.length > 0 && (
                    <div className="text-[6px] text-green-900 text-center space-y-1">
                      <p>ENTITES PERSISTANTES:</p>
                      {blackout.survivors.map(name => (
                        <p key={name} className="text-green-700 animate-pulse">
                          {name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Overlay (terminal) replaces visible content */}
              {overlay && <div className="relative z-[60]">{overlay}</div>}
              <StartMenu
                isOpen={startMenuOpen && !overlay}
                onClose={() => setStartMenuOpen(false)}
              />
              <div style={{ display: overlay ? "none" : undefined }}>
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bezel with controls */}
        <div className="bg-[#4a4a6a] rounded-b-[24px] px-6 pt-4 pb-6 border-b-4 border-l-4 border-r-4 border-[#3a3a5a]">
          <div className="flex items-center justify-between">
            {/* D-Pad */}
            <div className="relative w-[72px] h-[72px]">
              <button
                type="button"
                aria-label="Move up"
                disabled={Boolean(overlay)}
                onClick={() => dispatchVirtualInput("ArrowUp")}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-t-sm border border-[#222] active:bg-[#3a3a4a] transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                aria-label="Move down"
                disabled={Boolean(overlay)}
                onClick={() => dispatchVirtualInput("ArrowDown")}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-b-sm border border-[#222] active:bg-[#3a3a4a] transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                aria-label="Move left"
                disabled={Boolean(overlay)}
                onClick={() => dispatchVirtualInput("ArrowLeft")}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-l-sm border border-[#222] active:bg-[#3a3a4a] transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                aria-label="Move right"
                disabled={Boolean(overlay)}
                onClick={() => dispatchVirtualInput("ArrowRight")}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-r-sm border border-[#222] active:bg-[#3a3a4a] transition-colors disabled:opacity-50"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#2a2a3a] border border-[#222]" />
            </div>

            {/* Label */}
            <div className="text-[8px] text-[#6a6a8a] text-center uppercase tracking-[3px]">
              Sylphe Corp
              <br />
              <span className="text-[6px] tracking-[1px]">ADVANCE</span>
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-3 -rotate-[25deg]">
              <div className="flex flex-col items-center gap-1">
                <div className="w-[32px] h-[32px] rounded-full bg-[#8858a8] border-2 border-[#6a4088] shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] active:translate-y-[1px] transition-all">
                  <span className="text-[8px] text-white font-bold rotate-[25deg]">
                    B
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 -mt-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[#8858a8] border-2 border-[#6a4088] shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] active:translate-y-[1px] transition-all">
                  <span className="text-[8px] text-white font-bold rotate-[25deg]">
                    A
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Start/Select */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-[28px] h-[10px] bg-[#3a3a5a] rounded-full border border-[#2a2a4a] active:bg-[#4a4a6a] transition-colors" />
              <span className="text-[5px] text-[#6a6a8a] uppercase">
                Select
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Open start menu"
                disabled={Boolean(overlay)}
                onClick={() => setStartMenuOpen(current => !current)}
                className={`w-[28px] h-[10px] rounded-full border transition-colors ${overlay ? "bg-[#2b2b3b] border-[#252535] opacity-50 cursor-not-allowed" : "bg-[#3a3a5a] border-[#2a2a4a] hover:bg-[#4a4a6a] cursor-pointer-pixel"}`}
              />
              <span className="text-[5px] text-[#6a6a8a] uppercase">Start</span>
            </div>
          </div>

          {/* Speaker grills */}
          <div className="flex justify-end mt-3 pr-2">
            <div className="flex flex-col gap-[3px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[2px] bg-[#3a3a5a] rounded-full"
                  style={{
                    width: `${18 + i * 3}px`,
                    marginLeft: `${(4 - i) * 1.5}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
