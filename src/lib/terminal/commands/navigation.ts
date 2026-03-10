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

export const treeCommand: Command = {
  name: "tree",
  description: "Afficher l'arborescence des fichiers",
  usage: "tree [chemin]",
  execute(args: string[], ctx: CommandContext) {
    const target = args[0] || ctx.cwd;
    const path = resolvePath(ctx.fs, ctx.cwd, target);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `tree: ${target}: Aucun fichier ou dossier de ce type` });
      return;
    }

    if (node.type === "file") {
      ctx.addLine({ type: "output", content: target });
      return;
    }

    ctx.addLine({ type: "output", content: path });
    let dirs = 0, files = 0;

    function printTree(n: typeof node, prefix: string) {
      if (!n || !n.children) return;
      const entries = Object.entries(n.children);
      entries.forEach(([name, child], i) => {
        const isLast = i === entries.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const suffix = child.type === "directory" ? "/" : "";
        ctx.addLine({ type: "output", content: `${prefix}${connector}${name}${suffix}` });
        if (child.type === "directory") {
          dirs++;
          printTree(child, prefix + (isLast ? "    " : "│   "));
        } else {
          files++;
        }
      });
    }

    printTree(node, "");
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: `${dirs} répertoires, ${files} fichiers` });
  },
};

export const findCommand: Command = {
  name: "find",
  description: "Rechercher des fichiers par nom",
  usage: "find <motif>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "find: argument manquant" });
      return;
    }

    const pattern = args[0].toLowerCase();
    const results: string[] = [];

    function search(node: typeof ctx.fs, currentPath: string) {
      if (node.type === "directory" && node.children) {
        for (const [name, child] of Object.entries(node.children)) {
          const fullPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
          if (name.toLowerCase().includes(pattern)) {
            results.push(fullPath);
          }
          if (child.type === "directory") {
            search(child, fullPath);
          }
        }
      }
    }

    search(ctx.fs, "");

    if (results.length === 0) {
      ctx.addLine({ type: "output", content: `Aucun résultat pour '${args[0]}'` });
    } else {
      for (const r of results) {
        ctx.addLine({ type: "output", content: r });
      }
      ctx.addLine({ type: "system", content: `${results.length} résultat(s) trouvé(s)` });
    }
  },
};

export const grepCommand: Command = {
  name: "grep",
  description: "Rechercher du texte dans un fichier",
  usage: "grep <motif> <fichier>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length < 2) {
      ctx.addLine({ type: "error", content: "grep: usage: grep <motif> <fichier>" });
      return;
    }

    const pattern = args[0].toLowerCase();
    const path = resolvePath(ctx.fs, ctx.cwd, args[1]);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `grep: ${args[1]}: Aucun fichier de ce type` });
      return;
    }

    if (node.type === "directory") {
      ctx.addLine({ type: "error", content: `grep: ${args[1]}: Est un dossier` });
      return;
    }

    const lines = (node.content || "").split("\n");
    let found = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(pattern)) {
        ctx.addLine({ type: "output", content: `${i + 1}: ${lines[i]}` });
        found++;
      }
    }

    if (found === 0) {
      ctx.addLine({ type: "output", content: `Aucune correspondance pour '${args[0]}'` });
    }
  },
};
