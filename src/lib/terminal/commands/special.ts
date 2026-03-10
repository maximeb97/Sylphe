import type { Command, CommandContext } from "../types";
import { resolvePath, getNode } from "../fileSystem";

export const hackCommand: Command = {
  name: "hack",
  description: "???",
  usage: "hack",
  execute(_args: string[], ctx: CommandContext) {
    const frames = [
      "Initialisation du protocole d'intrusion...",
      "Connexion au réseau ROCKET_NET...",
      "Bypass des pare-feu... [██████████] 100%",
      "Déchiffrement des données classifiées...",
      "",
      "ERREUR: CONTRE-MESURE DÉTECTÉE",
      "",
      "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒",
      "  ACCÈS REFUSÉ - NICE TRY ;)",
      "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒",
      "",
      "Le Prof. Chen vous surveille...",
    ];

    for (const line of frames) {
      ctx.addLine({ type: "system", content: line });
    }
  },
};

export const pokedexCommand: Command = {
  name: "pokedex",
  description: "Consulter le Pokédex",
  usage: "pokedex [numéro]",
  async execute(args: string[], ctx: CommandContext) {
    const id = args[0] || String(Math.floor(Math.random() * 151) + 1);
    const num = parseInt(id, 10);

    if (isNaN(num) || num < 1 || num > 1025) {
      ctx.addLine({ type: "error", content: "pokedex: numéro invalide (1-1025)" });
      return;
    }

    ctx.addLine({ type: "system", content: `Recherche du Pokémon #${num}...` });

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();

      const types = data.types
        .map((t: { type: { name: string } }) => t.type.name)
        .join(", ");

      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({ type: "output", content: `╔══════════════════════════════╗` });
      ctx.addLine({ type: "output", content: `║  #${String(data.id).padStart(4, "0")} ${data.name.toUpperCase().padEnd(22)}║` });
      ctx.addLine({ type: "output", content: `╠══════════════════════════════╣` });
      ctx.addLine({ type: "output", content: `║  Type:   ${types.padEnd(20)}║` });
      ctx.addLine({ type: "output", content: `║  Taille: ${(data.height / 10).toFixed(1).padEnd(5)}m${" ".repeat(14)}║` });
      ctx.addLine({ type: "output", content: `║  Poids:  ${(data.weight / 10).toFixed(1).padEnd(5)}kg${" ".repeat(13)}║` });
      ctx.addLine({ type: "output", content: `╚══════════════════════════════╝` });
    } catch {
      ctx.addLine({ type: "error", content: "pokedex: impossible de contacter le serveur" });
    }
  },
};

export const matrixCommand: Command = {
  name: "matrix",
  description: "Activer l'effet Matrix",
  usage: "matrix",
  execute(_args: string[], ctx: CommandContext) {
    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789ABCDEFZ";
    for (let i = 0; i < 15; i++) {
      let line = "";
      for (let j = 0; j < 40; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      ctx.addLine({ type: "system", content: line });
    }
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: "Wake up, Neo..." });
  },
};

export const runCommand: Command = {
  name: "run",
  description: "Exécuter un script",
  usage: "run <script.sh>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "run: argument manquant" });
      return;
    }

    const path = resolvePath(ctx.fs, ctx.cwd, args[0]);
    const node = getNode(ctx.fs, path);

    if (!node) {
      ctx.addLine({ type: "error", content: `run: ${args[0]}: Aucun fichier de ce type` });
      return;
    }

    if (node.type === "directory") {
      ctx.addLine({ type: "error", content: `run: ${args[0]}: Est un dossier` });
      return;
    }

    if (!node.executable) {
      ctx.addLine({ type: "error", content: `run: ${args[0]}: Permission refusée (non exécutable)` });
      return;
    }

    const content = node.content || "";
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || trimmed.startsWith("#!/")) continue;
      if (trimmed === "") continue;

      if (trimmed.startsWith("echo ")) {
        const text = trimmed
          .slice(5)
          .replace(/^['"]|['"]$/g, "");
        ctx.addLine({ type: "output", content: text });
      } else if (trimmed.startsWith("sleep ")) {
        // skip sleep in simulation
      } else {
        ctx.addLine({ type: "system", content: `> ${trimmed}` });
      }
    }
  },
};

export const exitCommand: Command = {
  name: "exit",
  description: "Fermer le terminal",
  usage: "exit",
  execute() {
    // Handled by the terminal component directly
  },
};
