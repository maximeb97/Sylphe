"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { TerminalLine, CommandContext, FSNode } from "@/lib/terminal/types";
import { createFileSystem } from "@/lib/terminal/fileSystem";
import { getCommand } from "@/lib/terminal/commandRegistry";
import { registerAllCommands } from "@/lib/terminal/commands";

let commandsRegistered = false;

export default function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [cwd, setCwd] = useState("/home/user");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fsRef = useRef<FSNode | null>(null);
  const nextId = useRef(0);

  // Initialize FS and commands once
  useEffect(() => {
    if (!commandsRegistered) {
      registerAllCommands();
      commandsRegistered = true;
    }
    if (!fsRef.current) {
      fsRef.current = createFileSystem();
    }
  }, []);

  // Show welcome message on first mount
  useEffect(() => {
    const welcome: Omit<TerminalLine, "id">[] = [
      { type: "system", content: "╔══════════════════════════════════════╗" },
      { type: "system", content: "║     SYLPHE CORP. TERMINAL v3.1.4    ║" },
      { type: "system", content: "║   Accès autorisé uniquement.        ║" },
      { type: "system", content: "╚══════════════════════════════════════╝" },
      { type: "output", content: "" },
      { type: "system", content: "Tapez 'help' pour la liste des commandes." },
      { type: "system", content: "Tapez 'exit' pour fermer le terminal." },
      { type: "output", content: "" },
    ];

    setLines(welcome.map((l) => ({ ...l, id: nextId.current++ })));
  }, []);

  const addLine = useCallback((line: Omit<TerminalLine, "id">) => {
    setLines((prev) => [...prev, { ...line, id: nextId.current++ }]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const executeCommand = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return false;

      // Add input line
      addLine({ type: "input", content: `${cwd} $ ${trimmed}` });

      // Add to history
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      // Parse command
      const parts = trimmed.split(/\s+/);
      const cmdName = parts[0];
      const args = parts.slice(1);

      // Check for exit
      if (cmdName === "exit") return true;

      // History command special handling
      if (cmdName === "history") {
        setHistory((prev) => {
          for (let i = 0; i < prev.length; i++) {
            addLine({ type: "output", content: `  ${(i + 1).toString().padStart(4)}  ${prev[i]}` });
          }
          return prev;
        });
        return false;
      }

      const command = getCommand(cmdName);
      if (!command) {
        addLine({
          type: "error",
          content: `${cmdName}: commande introuvable. Tapez 'help' pour la liste.`,
        });
        return false;
      }

      const ctx: CommandContext = {
        fs: fsRef.current!,
        cwd,
        env: { USER: "user", HOME: "/home/user", SHELL: "/bin/sylphe-sh" },
        addLine,
        setCwd,
        clearLines,
      };

      await command.execute(args, ctx);
      return false;
    },
    [cwd, addLine, clearLines]
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (history.length === 0) return "";

      let newIndex: number;
      if (direction === "up") {
        newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      } else {
        newIndex = historyIndex === -1 ? -1 : Math.min(history.length - 1, historyIndex + 1);
        if (historyIndex === history.length - 1) {
          setHistoryIndex(-1);
          return "";
        }
      }

      setHistoryIndex(newIndex);
      return history[newIndex] || "";
    },
    [history, historyIndex]
  );

  return {
    lines,
    cwd,
    executeCommand,
    navigateHistory,
  };
}
