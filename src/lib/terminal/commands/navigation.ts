import type { Command, CommandContext } from "../types";
import { resolvePath, getNode } from "../fileSystem";

export const lsCommand: Command = {
  name: "ls",
  description: "Lister le contenu d'un répertoire",
  usage: "ls [chemin]",
  execute(args: string[], ctx: CommandContext) {
    const target = args[0] || ctx.cwd;
    const path = resolvePath(ctx.fs, ctx.cwd, target);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `ls: ${target}: Aucun fichier ou dossier de ce type` });
      return;
    }

    if (node.type === "file") {
      ctx.addLine({ type: "output", content: target });
      return;
    }

    const entries = Object.entries(node.children || {});
    if (entries.length === 0) {
      return;
    }

    const showAll = args.includes("-a") || args.includes("-la");
    const longFormat = args.includes("-l") || args.includes("-la");

    const items: string[] = [];
    if (showAll) {
      items.push(".", "..");
    }

    for (const [name, child] of entries) {
      if (!showAll && name.startsWith(".")) continue;

      if (longFormat) {
        const typeFlag = child.type === "directory" ? "d" : "-";
        const execFlag = child.executable ? "x" : "-";
        const size = child.content ? child.content.length.toString().padStart(6) : "  4096";
        items.push(`${typeFlag}rwxr-${execFlag}r-${execFlag}  1 user sylphe ${size} Mar 10  2026 ${name}${child.type === "directory" ? "/" : ""}`);
      } else {
        items.push(child.type === "directory" ? `${name}/` : name);
      }
    }

    if (longFormat) {
      ctx.addLine({ type: "output", content: `total ${entries.length}` });
      for (const item of items) {
        ctx.addLine({ type: "output", content: item });
      }
    } else {
      ctx.addLine({ type: "output", content: items.join("  ") });
    }
  },
};

export const cdCommand: Command = {
  name: "cd",
  description: "Changer de répertoire",
  usage: "cd [chemin]",
  execute(args: string[], ctx: CommandContext) {
    const target = args[0] || "/home/user";
    const path = resolvePath(ctx.fs, ctx.cwd, target);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `cd: ${target}: Aucun fichier ou dossier de ce type` });
      return;
    }

    if (node.type !== "directory") {
      ctx.addLine({ type: "error", content: `cd: ${target}: N'est pas un dossier` });
      return;
    }

    ctx.setCwd(path);
  },
};

export const pwdCommand: Command = {
  name: "pwd",
  description: "Afficher le répertoire courant",
  usage: "pwd",
  execute(_args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "output", content: ctx.cwd });
  },
};
