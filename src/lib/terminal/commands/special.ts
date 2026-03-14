import type { Command, CommandContext } from "../types";
import { resolvePath, getNode } from "../fileSystem";
import { getUnlockedInventoryItems, getVisitedMaps, setGameFlag } from "../../gameState";

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

export const sudoCommand: Command = {
  name: "sudo",
  description: "Ex\u00e9cuter en tant que superutilisateur",
  usage: "sudo <commande>",
  execute(args: string[], ctx: CommandContext) {
    if (args.length === 0) {
      ctx.addLine({ type: "error", content: "sudo: argument manquant" });
      return;
    }
    ctx.addLine({ type: "system", content: "[sudo] Mot de passe pour user :" });
    ctx.addLine({ type: "error", content: "V\u00e9rification..." });
    ctx.addLine({ type: "error", content: "\u2588\u2588\u2588 ACC\u00c8S REFUS\u00c9 \u2588\u2588\u2588" });
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: "Cet incident sera signal\u00e9 au Prof. Chen." });
  },
};

export const pingCommand: Command = {
  name: "ping",
  description: "Tester la connectivit\u00e9 r\u00e9seau",
  usage: "ping <h\u00f4te>",
  execute(args: string[], ctx: CommandContext) {
    const host = args[0] || "sylphe-mainframe";
    ctx.addLine({ type: "system", content: `PING ${host} (192.168.1.42): 56 data bytes` });

    const responses = [
      { time: "1.24", ttl: 64 },
      { time: "0.89", ttl: 64 },
      { time: "1.02", ttl: 64 },
      { time: "42.00", ttl: 42 },
    ];

    for (const r of responses) {
      ctx.addLine({
        type: "output",
        content: `64 bytes from ${host}: icmp_seq=1 ttl=${r.ttl} time=${r.time} ms`,
      });
    }

    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: `--- ${host} statistiques ---` });
    ctx.addLine({ type: "output", content: "4 paquets transmis, 4 re\u00e7us, 0% perte" });

    if (host.toLowerCase().includes("rocket") || host.toLowerCase().includes("mewtwo")) {
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({ type: "error", content: "\u26a0 ALERTE: Activit\u00e9 suspecte d\u00e9tect\u00e9e sur ce r\u00e9seau" });
    }
  },
};

export const missingnoCommand: Command = {
  name: "missingno",
  description: "???",
  usage: "missingno",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_missingno_unlocked", "true");
      window.dispatchEvent(new Event("storage"));
    }
    const frames = [
      "...",
      "An anomaly has been detected.",
      "Data corruption at 0x9F4C.",
      "The glitch is now part of the team.",
    ];
    for (const line of frames) {
      ctx.addLine({ type: "system", content: line });
    }
  },
};

export const rocketCommand: Command = {
  name: "rocket",
  description: "Acc\u00e9der au protocole R",
  usage: "rocket",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_rocket_mode", "true");
      window.dispatchEvent(new Event("storage"));
    }
    ctx.addLine({ type: "error", content: "Protocole ROCKET activ\u00e9." });
    ctx.addLine({ type: "error", content: "Nous sommes de retour pour vous jouer un mauvais tour..." });
  },
};

export const masterballCommand: Command = {
  name: "masterball",
  description: "Capture garantie",
  usage: "masterball",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_masterball_unlocked", "true");
      window.dispatchEvent(new Event("storage"));
    }
    ctx.addLine({ type: "system", content: "Master Ball acquise !" });
    ctx.addLine({ type: "system", content: "Vous pourrez capturer n'importe quel bug sans \u00e9chouer." });
  },
};

export const noclipCommand: Command = {
  name: "noclip",
  description: "Désactiver les collisions",
  usage: "noclip",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("sylphe_noclip_toggle"));
    }
    ctx.addLine({ type: "system", content: "NOCLIP ACTIVÉ." });
    ctx.addLine({ type: "output", content: "Attention: vous risquez de tomber dans les Backrooms (Glitch City)." });
  },
};

export const lsdCommand: Command = {
  name: "lsd",
  description: "???",
  usage: "lsd",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      document.body.classList.add("acid-mode");
      setTimeout(() => {
        document.body.classList.remove("acid-mode");
      }, 60000);
    }
    ctx.addLine({ type: "system", content: "Woah, les couleurs sont bizarres..." });
  },
};

export const bikeCommand: Command = {
  name: "bike",
  description: "Obtenir une bicyclette",
  usage: "bike",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_bike", "true");
      window.dispatchEvent(new Event("storage"));
    }
    ctx.addLine({ type: "system", content: "Bicyclette obtenue !" });
    ctx.addLine({ type: "output", content: "Vous irez maintenant 2x plus vite sur le terrain." });
  },
};

export const motherlodeCommand: Command = {
  name: "motherlode",
  description: "Injection financière",
  usage: "motherlode",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_rich", "true");
      window.dispatchEvent(new Event("storage"));
    }
    ctx.addLine({ type: "system", content: "Fonds injectés." });
  },
};

export const doomCommand: Command = {
  name: "doom",
  description: "Lancer DOOM",
  usage: "doom",
  execute(args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "error", content: "ERREUR 12: Pas assez de mémoire RAM." });
    ctx.addLine({ type: "error", content: "Sylphe OS prend déjà toute la mémoire pour le rendu du background." });
  },
};

export const coffeeCommand: Command = {
  name: "coffee",
  description: "Faire un café",
  usage: "coffee",
  async execute(args: string[], ctx: CommandContext) {
    ctx.addLine({ type: "system", content: "Demande de préparation de café envoyée au serveur..." });

    try {
      const res = await fetch("/api/coffee");
      const data = await res.json();

      if (res.status === 418) {
        ctx.addLine({ type: "error", content: data.message });
      } else {
        ctx.addLine({ type: "output", content: `Status: ${res.status} - ${data.message || 'Café prêt ?'}` });
      }

      const secret = res.headers.get("X-Sylphe-Secret");
      const devMsg = res.headers.get("X-Developer-Msg");
      if (secret) {
        ctx.addLine({ type: "system", content: `[HEADER CACHÉ] : ${secret}` });
      }
      if (devMsg) {
        ctx.addLine({ type: "system", content: `[NOTE LABO] : ${devMsg}` });
      }
    } catch {
      ctx.addLine({ type: "error", content: "Erreur réseau: Impossible de contacter la machine à café." });
    }
  },
};

export const giovanniCommand: Command = {
  name: "giovanni",
  description: "Accès direction",
  usage: "giovanni",
  execute(args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sylphe_giovanni_unlocked", "true");
      window.dispatchEvent(new Event("storage"));
    }
    ctx.addLine({ type: "system", content: "Boss Mode: ACTIVÉ." });
    ctx.addLine({ type: "output", content: "Bienvenue, Monsieur." });
  },
};

export const prototype151Command: Command = {
  name: "pr0t0type_151",
  description: "Resonance memoire classee",
  usage: "pr0t0type_151",
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window !== "undefined") {
      setGameFlag("sylphe_prototype_151");
    }

    ctx.addLine({ type: "system", content: "[ARCHIVE 151] Signature genetique reconnue." });
    ctx.addLine({ type: "system", content: "[ARCHIVE 151] La Masterball blanche repond a un sujet originel non catalogue." });
    ctx.addLine({ type: "output", content: "Une resonance s'installe dans les zones vides du systeme." });
    ctx.addLine({ type: "output", content: "Nouvel objet ajoute: ARCHIVE PROTOTYPE 151." });
  },
};

export const inventoryCommand: Command = {
  name: "inventory",
  description: "Afficher les objets ramassés",
  usage: "inventory",
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    ctx.addLine({ type: "system", content: "--- INVENTAIRE SYLPHE OS ---" });
    const items = getUnlockedInventoryItems();

    if (items.length === 0) {
      ctx.addLine({ type: "output", content: " Votre inventaire est vide." });
    } else {
      for (const item of items) {
        ctx.addLine({ type: "output", content: ` [x] ${item.name}` });
      }
    }

    ctx.addLine({ type: "output", content: "" });
  },
};

export const mapCommand: Command = {
  name: "map",
  description: "Afficher les zones débloquées",
  usage: "map",
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    ctx.addLine({ type: "system", content: "--- CARTOGRAPHIE SYSTÈME ---" });

    const maps = getVisitedMaps();

    if (maps.length === 0) {
      ctx.addLine({ type: "output", content: " - AUCUNE ZONE ENREGISTREE" });
    } else {
      for (const map of maps) {
        ctx.addLine({ type: "output", content: ` - ${map.name} (VISITEE)` });
      }
    }
    ctx.addLine({ type: "output", content: "" });
  },
};
