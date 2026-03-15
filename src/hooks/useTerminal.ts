"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { TerminalLine, CommandContext, FSNode } from "@/lib/terminal/types";
import { createFileSystem, resolvePath, getNode } from "@/lib/terminal/fileSystem";
import { getCommand, getAllCommands } from "@/lib/terminal/commandRegistry";
import { registerAllCommands } from "@/lib/terminal/commands";

let commandsRegistered = false;

function getVisibleCommands() {
  return getAllCommands().filter(command => !command.hidden);
}

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

  const tabComplete = useCallback(
    (input: string): string => {
      const parts = input.split(/\s+/);

      if (parts.length <= 1) {
        // Complete command name
        const partial = parts[0] || "";
        const allCmds = getVisibleCommands();
        const matches = allCmds.filter((c) => c.name.startsWith(partial));
        if (matches.length === 1) return matches[0].name + " ";
        if (matches.length > 1) {
          addLine({ type: "output", content: matches.map((c) => c.name).join("  ") });
          const prefix = matches.reduce((a, b) => {
            let i = 0;
            while (i < a.name.length && i < b.name.length && a.name[i] === b.name[i]) i++;
            return { ...a, name: a.name.slice(0, i) };
          });
          return prefix.name;
        }
        return input;
      }

      // Complete file/directory path
      const lastArg = parts[parts.length - 1];
      const dirPart = lastArg.includes("/")
        ? lastArg.slice(0, lastArg.lastIndexOf("/") + 1)
        : "";
      const filePart = lastArg.includes("/")
        ? lastArg.slice(lastArg.lastIndexOf("/") + 1)
        : lastArg;

      const lookupDir = dirPart
        ? resolvePath(fsRef.current!, cwd, dirPart)
        : cwd;
      const node = getNode(fsRef.current!, lookupDir);

      if (!node || node.type !== "directory") return input;

      const entries = Object.keys(node.children || {});
      const matches = entries.filter((name) => name.startsWith(filePart));

      if (matches.length === 1) {
        const match = matches[0];
        const child = node.children![match];
        const suffix = child.type === "directory" ? "/" : " ";
        const newParts = [...parts.slice(0, -1), dirPart + match + suffix];
        return newParts.join(" ");
      }

      if (matches.length > 1) {
        addLine({ type: "output", content: matches.join("  ") });
        const commonPrefix = matches.reduce((a, b) => {
          let i = 0;
          while (i < a.length && i < b.length && a[i] === b[i]) i++;
          return a.slice(0, i);
        });
        const newParts = [...parts.slice(0, -1), dirPart + commonPrefix];
        return newParts.join(" ");
      }

      return input;
    },
    [cwd, addLine]
  );

  return {
    lines,
    cwd,
    executeCommand,
    navigateHistory,
    tabComplete,
  };
}
