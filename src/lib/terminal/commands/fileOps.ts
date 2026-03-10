import type { Command, CommandContext } from "../types";
import { resolvePath, getNode, getParentAndName } from "../fileSystem";

export const catCommand: Command = {
  name: "cat",
  description: "Afficher le contenu d'un fichier",
  usage: "cat <fichier>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "cat: argument manquant" });
      return;
    }

    const path = resolvePath(ctx.fs, ctx.cwd, args[0]);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `cat: ${args[0]}: Aucun fichier ou dossier de ce type` });
      return;
    }

    if (node.type === "directory") {
      ctx.addLine({ type: "error", content: `cat: ${args[0]}: Est un dossier` });
      return;
    }

    const lines = (node.content || "").split("\n");
    for (const line of lines) {
      ctx.addLine({ type: "output", content: line });
    }
  },
};

export const touchCommand: Command = {
  name: "touch",
  description: "Créer un fichier vide",
  usage: "touch <fichier>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "touch: argument manquant" });
      return;
    }

    const path = resolvePath(ctx.fs, ctx.cwd, args[0]);
    const result = getParentAndName(ctx.fs, path);

    if (!result) {
      ctx.addLine({ type: "error", content: `touch: impossible de créer '${args[0]}'` });
      return;
    }

    if (!result.parent.children![result.name]) {
      result.parent.children![result.name] = {
        name: result.name,
        type: "file",
        content: "",
      };
    }
  },
};

export const mkdirCommand: Command = {
  name: "mkdir",
  description: "Créer un répertoire",
  usage: "mkdir <répertoire>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "mkdir: argument manquant" });
      return;
    }

    const path = resolvePath(ctx.fs, ctx.cwd, args[0]);
    const result = getParentAndName(ctx.fs, path);

    if (!result) {
      ctx.addLine({ type: "error", content: `mkdir: impossible de créer '${args[0]}'` });
      return;
    }

    if (result.parent.children![result.name]) {
      ctx.addLine({ type: "error", content: `mkdir: ${args[0]}: Le fichier existe déjà` });
      return;
    }

    result.parent.children![result.name] = {
      name: result.name,
      type: "directory",
      children: {},
    };
  },
};

export const rmCommand: Command = {
  name: "rm",
  description: "Supprimer un fichier ou répertoire",
  usage: "rm [-r] <fichier>",
  execute(args: string[], ctx: CommandContext) {
    const recursive = args.includes("-r") || args.includes("-rf");
    const targets = args.filter((a) => !a.startsWith("-"));

    if (targets.length === 0) {
      ctx.addLine({ type: "error", content: "rm: argument manquant" });
      return;
    }

    for (const target of targets) {
      const path = resolvePath(ctx.fs, ctx.cwd, target);
      const node = getNode(ctx.fs, path);

      if (!node) {
        ctx.addLine({ type: "error", content: `rm: ${target}: Aucun fichier ou dossier de ce type` });
        continue;
      }

      if (node.type === "directory" && !recursive) {
        ctx.addLine({ type: "error", content: `rm: ${target}: Est un dossier (utilisez -r)` });
        continue;
      }

      const result = getParentAndName(ctx.fs, path);
      if (result) {
        delete result.parent.children![result.name];
      }
    }
  },
};
