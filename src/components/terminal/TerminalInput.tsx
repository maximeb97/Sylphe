"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalInputProps {
  cwd: string;
  onSubmit: (input: string) => void;
  onNavigateHistory: (direction: "up" | "down") => string;
}

export default function TerminalInput({
  cwd,
  onSubmit,
  onNavigateHistory,
}: TerminalInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and refocus when clicking anywhere
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit(value);
        setValue("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = onNavigateHistory("up");
        setValue(prev);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = onNavigateHistory("down");
        setValue(next);
      }
    },
    [value, onSubmit, onNavigateHistory]
  );

  return (
    <div
      className="flex items-center px-3 py-2 border-t border-[#1a3a1a]"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-[9px] md:text-[10px] text-[#4af626] whitespace-nowrap mr-2 font-mono">
        {cwd} $
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-[#33ff33] text-[9px] md:text-[10px] font-mono outline-none caret-[#33ff33] min-w-0"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  );
}
