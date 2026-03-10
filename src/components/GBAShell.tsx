"use client";

import { useEffect, useState } from "react";

export default function GBAShell({ children }: { children: React.ReactNode }) {
  const [powered, setPowered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPowered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#1a1a2e]">
      {/* GBA Device outer shell */}
      <div className="w-full max-w-4xl">
        {/* Top bezel */}
        <div className="bg-[#4a4a6a] rounded-t-[24px] pt-6 px-6 pb-0 border-t-4 border-l-4 border-r-4 border-[#3a3a5a] relative">
          {/* Power LED */}
          <div className="absolute top-3 left-8 flex items-center gap-2">
            <div
              className={`w-[8px] h-[8px] rounded-full transition-colors duration-500 ${
                powered ? "bg-[#88f058] shadow-[0_0_8px_#88f058]" : "bg-[#404040]"
              }`}
            />
            <span className="text-[6px] text-[#8888aa] uppercase tracking-wider">
              Power
            </span>
          </div>

          {/* Screen area */}
          <div className="bg-[#2a2a3a] rounded-t-lg p-3 border-2 border-[#222]">
            <div
              className={`gba-screen scanlines relative overflow-hidden rounded transition-all duration-700 ${
                powered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animation: powered ? "screen-on 0.8s ease-out" : undefined,
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Bottom bezel with controls */}
        <div className="bg-[#4a4a6a] rounded-b-[24px] px-6 pt-4 pb-6 border-b-4 border-l-4 border-r-4 border-[#3a3a5a]">
          <div className="flex items-center justify-between">
            {/* D-Pad */}
            <div className="relative w-[72px] h-[72px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-t-sm border border-[#222]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-b-sm border border-[#222]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-l-sm border border-[#222]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#2a2a3a] rounded-r-sm border border-[#222]" />
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
                <div className="w-[32px] h-[32px] rounded-full bg-[#8858a8] border-2 border-[#6a4088] shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold rotate-[25deg]">B</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 -mt-3">
                <div className="w-[32px] h-[32px] rounded-full bg-[#8858a8] border-2 border-[#6a4088] shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold rotate-[25deg]">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start/Select */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <div className="w-[28px] h-[10px] bg-[#3a3a5a] rounded-full border border-[#2a2a4a]" />
              <span className="text-[5px] text-[#6a6a8a] uppercase">Select</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[28px] h-[10px] bg-[#3a3a5a] rounded-full border border-[#2a2a4a]" />
              <span className="text-[5px] text-[#6a6a8a] uppercase">Start</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
