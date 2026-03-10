import type { Command } from "./types";

const commands = new Map<string, Command>();
const aliases = new Map<string, string>();

export function registerCommand(command: Command) {
  commands.set(command.name, command);
}

export function registerAlias(alias: string, target: string) {
  aliases.set(alias, target);
}

export function getCommand(name: string): Command | undefined {
  const resolved = aliases.get(name) || name;
  return commands.get(resolved);
}

export function getAllCommands(): Command[] {
  return Array.from(commands.values());
}

export function getAliases(): Map<string, string> {
  return aliases;
}
