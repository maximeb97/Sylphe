"use client";

import { useEffect, useRef } from "react";
import type { TerminalLine } from "@/lib/terminal/types";

export default function TerminalOutput({ lines }: { lines: TerminalLine[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [lines]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-[#4af626]";
      case "output":
        return "text-[#33ff33]";
      case "error":
        return "text-[#ff4444]";
      case "system":
        return "text-[#44aaff]";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 font-mono terminal-scroll">
      {lines.map(line => (
        <div
          key={line.id}
          className={`text-[9px] md:text-[10px] leading-[16px] whitespace-pre-wrap break-all ${getLineColor(line.type)}`}
          dangerouslySetInnerHTML={{ __html: line.content || "\u00A0" }}
        >
          {/* {line.content || "\u00A0"} */}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
