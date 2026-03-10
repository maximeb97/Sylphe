"use client";

import { useCallback } from "react";
import useTerminal from "@/hooks/useTerminal";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";

interface TerminalProps {
  onClose: () => void;
}

export default function Terminal({ onClose }: TerminalProps) {
  const { lines, cwd, executeCommand, navigateHistory, tabComplete } = useTerminal();

  const handleSubmit = useCallback(
    async (input: string) => {
      const shouldExit = await executeCommand(input);
      if (shouldExit) onClose();
    },
    [executeCommand, onClose]
  );

  return (
    <div
      className="flex flex-col bg-[#0a0a0a] min-h-[500px] h-full crt-effect relative"
      style={{ animation: "terminal-open 0.5s ease-out" }}
      onClick={(e) => {
        const input = (e.currentTarget as HTMLElement).querySelector("input");
        input?.focus();
      }}
    >
      {/* Terminal header bar */}
      <div className="flex items-center justify-between px-3 py-[6px] bg-[#1a1a1a] border-b border-[#333] relative z-20">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-[#33ff33]"
            style={{ animation: "pixel-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-[8px] text-[#33ff33] font-mono tracking-wider">
            SYLPHE TERMINAL v3.1.4
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-[10px] text-[#666] hover:text-[#ff4444] transition-colors font-mono px-2 leading-none"
        >
          [X]
        </button>
      </div>

      {/* Terminal body */}
      <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
        <TerminalOutput lines={lines} />
        <TerminalInput
          cwd={cwd}
          onSubmit={handleSubmit}
          onNavigateHistory={navigateHistory}
          onTabComplete={tabComplete}
        />
      </div>
    </div>
  );
}
