"use client";

import { ReactNode } from "react";

export default function DialogBox({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`dialog-box ${className}`}>
      <div className="relative z-10">{children}</div>
      {/* Bottom-right arrow indicator */}
      <div
        className="absolute bottom-[8px] right-[12px] text-gba-text text-[8px]"
        style={{ animation: "npc-bounce 1s ease-in-out infinite" }}
      >
        ▼
      </div>
    </div>
  );
}
