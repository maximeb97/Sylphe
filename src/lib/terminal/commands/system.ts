import type { Command, CommandContext } from "../types";
import { getAllCommands } from "../commandRegistry";

export const helpCommand: Command = {
  name: "help",
  description: "Afficher l'aide des commandes",
  usage: "help [commande]",
  execute(args: string[], ctx: CommandContext) {
    if (args[0]) {
      const cmd = getAllCommands().find((c) => c.name === args[0]);
      if (!cmd) {
        ctx.addLine({ type: "error", content: `help: commande inconnue '${args[0]}'` });
        return;
      }
      ctx.addLine({ type: "output", content: `${cmd.name} - ${cmd.description}` });
      if (cmd.usage) {
        ctx.addLine({ type: "output", content: `Usage: ${cmd.usage}` });
      }
      return;
    }

    ctx.addLine({ type: "system", content: "=== COMMANDES DISPONIBLES ===" });
    ctx.addLine({ type: "output", content: "" });

    const cmds = getAllCommands().sort((a, b) => a.name.localeCompare(b.name));
    for (const cmd of cmds) {
      ctx.addLine({
        type: "output",
        content: `  ${cmd.name.padEnd(12)} ${cmd.description}`,
      });
    }

    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: "Tapez 'help <commande>' pour plus de détails." });
  },
};

export const clearCommand: Command = {
  name: "clear",
  description: "Effacer l'écran du terminal",
  usage: "clear",
  execute(_args: string[], ctx: CommandContext) {
    ctx.clearLines();
  },
};

export const echoCommand: Command = {
  name: "echo",
  description: "Afficher du texte",
  usage: "echo <texte>",
  execute(args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "output", content: args.join(" ") });
  },
};

export const whoamiCommand: Command = {
  name: "whoami",
  description: "Afficher l'utilisateur courant",
  usage: "whoami",
  execute(_args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "output", content: ctx.env.USER || "user" });
  },
};

export const dateCommand: Command = {
  name: "date",
  description: "Afficher la date et l'heure",
  usage: "date",
  execute(_args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "output", content: new Date().toLocaleString("fr-FR") });
  },
};

export const unameCommand: Command = {
  name: "uname",
  description: "Afficher les informations système",
  usage: "uname [-a]",
  execute(args: string[], ctx: CommandContext) {
    if (args.includes("-a")) {
      ctx.addLine({
        type: "output",
        content: "SylpheOS 3.1.4 sylphe-mainframe x86_pokemon GNU/Kanto",
      });
    } else {
      ctx.addLine({ type: "output", content: "SylpheOS" });
    }
  },
};

export const historyCommand: Command = {
  name: "history",
  description: "Afficher l'historique des commandes",
  usage: "history",
  // Actual implementation is in useTerminal hook
  execute() {},
};

export const envCommand: Command = {
  name: "env",
  description: "Afficher les variables d'environnement",
  usage: "env",
  execute(_args: string[], ctx: CommandContext) {
    const vars: Record<string, string> = {
      ...ctx.env,
      PATH: "/usr/local/bin:/usr/bin:/bin",
      TERM: "sylphe-256color",
      LANG: "fr_FR.UTF-8",
      PWD: ctx.cwd,
      HOSTNAME: "sylphe-mainframe",
      OS: "SylpheOS 3.1.4",
      EDITOR: "vi",
      PAGER: "less",
    };
    for (const [key, value] of Object.entries(vars)) {
      ctx.addLine({ type: "output", content: `${key}=${value}` });
    }
  },
};

export const hostnameCommand: Command = {
  name: "hostname",
  description: "Afficher le nom de la machine",
  usage: "hostname",
  execute(_args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "output", content: "sylphe-mainframe" });
  },
};

export const neofetchCommand: Command = {
  name: "neofetch",
  description: "Afficher les informations syst\u00e8me",
  usage: "neofetch",
  execute(_args: string[], ctx: CommandContext) {
    const art = [
      "       ___       ",
      "      /   \\      ",
      "     / S C \\     ",
      "    / SYLPHE\\    ",
      "   /  CORP.  \\   ",
      "  /___________\\  ",
      "  |  |     |  |  ",
      "  |__|     |__|  ",
    ];
    const info = [
      `user@sylphe-mainframe`,
      `-------------------`,
      `OS: SylpheOS 3.1.4 (Kanto Build 151)`,
      `Host: Sylphe Mainframe MK-II`,
      `Kernel: pokemon-6.1.51`,
      `Shell: sylphe-sh 3.14`,
      `Terminal: SYLPHE TERMINAL v3.1.4`,
      `CPU: PokeProcessor 151-core @ 4.2GHz`,
    ];
    for (let i = 0; i < Math.max(art.length, info.length); i++) {
      const left = (art[i] || "").padEnd(20);
      const right = info[i] || "";
      ctx.addLine({
        type: i < art.length ? "system" : "output",
        content: `${left}${right}`,
      });
    }
  },
};
