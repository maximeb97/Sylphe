"use client";

import { ReactNode } from "react";

export default function DialogBox({
  children,
  className = "",
  onClick,
  isClickable = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}) {
  return (
    <div
      className={`dialog-box ${className} ${isClickable ? "cursor-pointer-pixel" : ""}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="relative z-10">{children}</div>

      {/* Close indicator — animated arrow + label when clickable */}
      {isClickable ? (
        <div className="absolute bottom-[6px] right-[10px] flex items-center gap-1">
          <span
            className="text-[6px] text-gba-accent tracking-wider"
            style={{ animation: "pixel-pulse 1s ease-in-out infinite" }}
          >
            CLIQUER
          </span>
          <span
            className="text-gba-accent text-[10px]"
            style={{ animation: "npc-bounce 0.5s ease-in-out infinite" }}
          >
            ▼
          </span>
        </div>
      ) : (
        <div
          className="absolute bottom-[8px] right-[12px] text-gba-text text-[8px]"
          style={{ animation: "npc-bounce 1s ease-in-out infinite" }}
        >
          ▼
        </div>
      )}
    </div>
  );
}
