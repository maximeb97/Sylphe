import type { Command, CommandContext } from "../types";
import { resolvePath, getNode } from "../fileSystem";
import {
  canUnlockArchiveDebug,
  getUnlockedInventoryItems,
  getVisitedMaps,
  setGameFlag,
} from "../../gameState";
import { getSylphedexEntries } from "../../sylphedex";

function readFlag(key: string) {
  return typeof window !== "undefined" && localStorage.getItem(key) === "true";
}

function printProjectMChronicle(ctx: CommandContext) {
  const timeline = [
    "[PROJET M][CHRONOLOGIE COMPLETE]",
    "1996.07 // Extraction de donnees genetiques instables sur le sujet MEW.",
    "1996.11 // Creation du clone #150 sous financement ROCKET_NET.",
    "1997.02 // Echec des premiers confinements. Le sujet 151 reste masque hors catalogue.",
    "2026.02 // Fragment 7382 transite dans CYBERSPACE via Porygon.",
    "2026.02 // Fragment 4B9F fuit depuis GLITCH CITY avec l'anomalie MissingNo.",
    "2026.03 // Le terminal recompose 7382-4B9F et rouvre la Chambre 042.",
    "2026.03 // RED transmet le PASS SYSTEME. Les archives profondes passent en mode supervision.",
    "[NOTE] Le sujet 151 n'est pas une sauvegarde. C'est la matrice que le clone #150 n'a jamais pu effacer.",
  ];

  for (const line of timeline) {
    ctx.addLine({
      type: line.startsWith("[NOTE]") ? "output" : "system",
      content: line,
    });
  }
}

function getContainmentReport() {
  const unresolved: string[] = [];

  if (!readFlag("sylphe_missingno_unlocked")) {
    unresolved.push("GLITCH-0x9F4C: anomalie MissingNo non stabilisee. Piste: surveiller les zones corrompues.");
  }
  if (!readFlag("sylphe_silph_scope")) {
    unresolved.push("SCOPE-S: brouillard spectral illisible. Piste: parler a l'anomalie qui manipule l'inventaire.");
  }
  if (!readFlag("sylphe_mew_unlocked")) {
    unresolved.push("CHAMBRE-042: acces verrouille. Piste: reunir les deux fragments du code labo.");
  }
  if (!readFlag("sylphe_mew_captured")) {
    unresolved.push("SUJET-151A: entite aquatique libre sur la carte principale.");
  }
  if (!readFlag("sylphe_mewtwo_captured")) {
    unresolved.push("SUJET-150: clone principal encore actif en Chambre 042.");
  }
  if (!readFlag("sylphe_prototype_151")) {
    unresolved.push("ARCHIVE-151: signature originelle absente. Piste: auditer /var/log/system.log.");
  }
  if (!readFlag("sylphe_red_defeated")) {
    unresolved.push("SANCTUAIRE-RED: superviseur final non neutralise en Grotte Azuree.");
  }
  if (!readFlag("sylphe_archive_debug")) {
    unresolved.push("ARCHIVE-DEBUG: Hall of Fame non monte. Piste: verifier inventory, map et RED.");
  }
  if (readFlag("sylphe_white_room_hint") && !readFlag("sylphe_beneath_stairs_unlocked")) {
    unresolved.push("BENEATH-STAIRS: acces parasite localise en Grotte Azuree, sous l'escalier principal.");
  }
  if (readFlag("sylphe_beneath_stairs_unlocked") && !readFlag("sylphe_white_room_unlocked")) {
    unresolved.push("WHITE-ROOM: membrane blanche detectee mais non ouverte. Piste: activer la console residuelle sous l'escalier.");
  }
  if (readFlag("sylphe_white_room_unlocked") && !readFlag("sylphe_archive_151_reconciled")) {
    unresolved.push("ARCHIVE-151/WHITE-ROOM: confrontation finale non resolue. Piste: ecouter la memoire originelle jusqu'au bout.");
  }
  if (
    readFlag("sylphe_museum_null_unlocked") &&
    !readFlag("sylphe_null_badge")
  ) {
    unresolved.push(
      "MUSEE-NULL: aile annexe ouverte mais archive de visite non recuperee. Piste: inspecter le socle central et les profils effaces.",
    );
  }
  if (
    readFlag("sylphe_lavender_mirror_unlocked") &&
    !readFlag("sylphe_mirror_tag")
  ) {
    unresolved.push(
      "LAVENDER-MIRROR: miroir spectral ouvert, mais la plaque memoriale n'a pas encore ete ramenee du reflet.",
    );
  }

  return unresolved;
}

function printChecksumReport(ctx: CommandContext) {
  const lines = [
    "[CHECKSUM] PUBLIC_ARCHIVE != NULL_ARCHIVE",
    "public.employees = 2547 // null.employees = 17 profils retires",
    "public.projects = 894 // null.projects = 1 aile effacee des visites",
  ];

  if (readFlag("sylphe_silph_scope")) {
    lines.push(
      "scope.overlay = ACTIVE // les cartels du Musee Null montrent des noms rayes plutot que des trophées.",
    );
  }
  if (readFlag("sylphe_prototype_151")) {
    lines.push(
      "subject.compare(150,151) = mismatch // 151 correspond a la matrice, 150 au produit mediatise.",
    );
  }
  if (readFlag("sylphe_archive_151_reconciled")) {
    lines.push(
      "white_room.status = reconciled // l'archive originelle ne fuit plus dans les zones vides.",
    );
  }

  for (const line of lines) {
    ctx.addLine({ type: "system", content: line });
  }
}

export const hackCommand: Command = {
  name: "hack",
  description: "???",
  usage: "hack",
  hidden: true,
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

    if (host.toLowerCase() === "mansion.cinnabar.gov") {
      ctx.addLine({
        type: "system",
        content: `PING ${host} (10.0.151.42): 56 data bytes`,
      });
      ctx.addLine({
        type: "output",
        content: `64 bytes from ${host}: icmp_seq=1 ttl=42 time=151.00 ms`,
      });
      ctx.addLine({
        type: "output",
        content: `64 bytes from ${host}: icmp_seq=2 ttl=42 time=ERROR ms`,
      });
      ctx.addLine({
        type: "error",
        content: "⚠ Paquet corrompu intercepte — fragment Base64 detecte:",
      });

      const drFujiNotes = [
        {
          encoded:
            "TGUgY2xvbmUgIzE1MCBtb250cmUgZGVzIHNpZ25lcyBkJ2luc3RhYmlsaXRl",
          decoded: "Le clone #150 montre des signes d'instabilite",
        },
        {
          encoded:
            "TCdBRE4gZGUgTWV3IGVzdCBpbmNvbXBsZXQuIElsIG1hbnF1ZSBsZSBmcmFnbWVudCA3Mzgy",
          decoded: "L'ADN de Mew est incomplet. Il manque le fragment 7382",
        },
        {
          encoded:
            "R2lvdmFubmkgdmV1dCB1bmUgYXJtZS4gSmUgdmV1eCBzYXV2ZXIgbW9uIGZpbHM=",
          decoded: "Giovanni veut une arme. Je veux sauver mon fils",
        },
        {
          encoded: "U2kgdm91cyBsaXNleiBjZWNpLCBsZSBQcm9qZXQgTSBhIGVjaG91ZQ==",
          decoded: "Si vous lisez ceci, le Projet M a echoue",
        },
        {
          encoded:
            "TGUgU3VqZXQgMTUxIGVzdCBsYSBtYXRyaWNlLiBJbCBuZSBkb2l0IHBhcyBldHJlIGNsb25l",
          decoded: "Le Sujet 151 est la matrice. Il ne doit pas etre clone",
        },
      ];

      const note = drFujiNotes[Math.floor(Math.random() * drFujiNotes.length)];
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({
        type: "system",
        content: `[PAQUET CORROMPU] ${note.encoded}`,
      });
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({
        type: "output",
        content: `Decodage Base64: "${note.decoded}"`,
      });
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({
        type: "system",
        content: "— Notes du Dr. Fuji, Manoir Pokemon, Cramois'Ile —",
      });

      if (!readFlag("sylphe_dr_fuji_notes")) {
        setGameFlag("sylphe_dr_fuji_notes");
        ctx.addLine({ type: "system", content: "" });
        ctx.addLine({
          type: "system",
          content: "✦ Objet obtenu: NOTES DU DR FUJI",
        });
      }
      return;
    }

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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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
  hidden: true,
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

export const archiveDebugCommand: Command = {
  name: "archive-debug",
  description: "Activer les archives profondes",
  usage: "archive-debug",
  hidden: true,
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;
    const alreadyUnlocked = readFlag("sylphe_archive_debug");

    if (!canUnlockArchiveDebug()) {
      ctx.addLine({
        type: "error",
        content:
          "Acces refuse: les archives profondes exigent RED, le PASS SYSTEME, l'archive 151 et l'ensemble des zones visitees.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Conseil: utilise `inventory` et `map` pour verifier l'etat du dossier.",
      });
      return;
    }

    setGameFlag("sylphe_archive_debug");
    setGameFlag("sylphe_hall_of_fame");
    setGameFlag("sylphe_project_m_logs");
    ctx.addLine({
      type: "system",
      content: "[ARCHIVE DEBUG] Canaux historiques synchronises.",
    });
    ctx.addLine({
      type: "system",
      content: "[ARCHIVE DEBUG] Hall of Fame monte sur /hall-of-fame.",
    });
    ctx.addLine({
      type: "output",
      content:
        "Les archives completent le roster, l'inventaire et la cartographie en une seule memoire.",
    });
    printProjectMChronicle(ctx);
    ctx.addLine({
      type: "output",
      content: alreadyUnlocked
        ? "Chronologie Projet M rehydratee. /hall-of-fame reste disponible."
        : "Chargement du Hall of Fame...",
    });
    if (alreadyUnlocked) {
      return;
    }
    setTimeout(() => {
      window.location.href = "/hall-of-fame";
    }, 5000);
  },
};

export const containmentCommand: Command = {
  name: "containment",
  description: "Diagnostic clandestin des anomalies",
  usage: "containment",
  hidden: true,
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    const unresolved = getContainmentReport();

    ctx.addLine({ type: "system", content: "--- DIAGNOSTIC CONTAINMENT ---" });
    if (unresolved.length === 0) {
      ctx.addLine({
        type: "output",
        content: "Toutes les anomalies critiques sont actuellement contenues.",
      });
      if (readFlag("sylphe_white_room_hint")) {
        ctx.addLine({
          type: "system",
          content: "Signal parasite detecte: WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE",
        });
      } else {
        ctx.addLine({
          type: "system",
          content: "Un residu persiste pourtant sous les escaliers de la Grotte Azuree.",
        });
      }
      return;
    }

    unresolved.forEach((entry, index) => {
      ctx.addLine({ type: "output", content: ` ${index + 1}. ${entry}` });
    });

    if (readFlag("sylphe_project_m_logs")) {
      ctx.addLine({
        type: "system",
        content: "Les journaux complets du Projet M sont montes en memoire via archive-debug.",
      });
    }
  },
};

export const checksumCommand: Command = {
  name: "checksum",
  description: "Comparer l'archive publique et la couche nulle",
  usage: "checksum",
  hidden: true,
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    if (!readFlag("sylphe_null_badge")) {
      ctx.addLine({
        type: "error",
        content:
          "CHECKSUM INCOMPLET: aucune archive de visite NULL n'est chargee.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Indice: certaines statistiques corporate encaissent mal les clics repetes.",
      });
      return;
    }

    ctx.addLine({
      type: "system",
      content: "--- VERIFICATION DE L'INTEGRITE CORPORATE ---",
    });
    printChecksumReport(ctx);
    ctx.addLine({
      type: "output",
      content:
        "Le Musee Null confirme qu'une part du patrimoine Sylphe a ete museifiee puis effacee.",
    });
  },
};

export const requiemCommand: Command = {
  name: "requiem",
  description: "Relire les noms effaces du miroir de Lavanville",
  usage: "requiem",
  hidden: true,
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    if (!readFlag("sylphe_mirror_tag")) {
      ctx.addLine({
        type: "error",
        content: "REQUiem ERROR: aucune plaque memorielle chargee.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Indice: le Scope Sylphe n'etait pas seulement destine aux tours Pokemon officielles.",
      });
      return;
    }

    const memorial = [
      "[LAVENDER MIRROR // MEMORIAL BUFFER]",
      "EMPLOYEE_04 // efface des brochures apres evacuation de l'aile spectrale.",
      "GUIDE_02 // a continue les visites meme apres la fermeture officielle.",
      "CURATOR_NULL // a renomme la salle 'miroir' pour eviter le mot 'tour'.",
      "GHOST_GUARDIAN // origine inconnue, comportement calque sur un deuil pokemon ancien.",
    ];

    memorial.forEach(line => ctx.addLine({ type: "system", content: line }));

    if (readFlag("sylphe_silph_scope")) {
      ctx.addLine({
        type: "output",
        content:
          "Le Scope confirme que le miroir ne montre jamais des fantomes anonymes: il montre des noms qu'on a retire des rapports.",
      });
    }
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

/* ================================================================
   DEFRAG — Porygon defragmentation mini-game
   ================================================================ */

const DEFRAG_GRID_W = 16;
const DEFRAG_GRID_H = 6;
const DEFRAG_PHASES = 4;

function makeCorruptedGrid(): string[][] {
  const glyphs = "░▒▓█▄▀■□◘◙♦♣♠•◄►▲▼«»┼╬╫╪┤├┬┴│─";
  const clean = "∙";
  const grid: string[][] = [];
  for (let y = 0; y < DEFRAG_GRID_H; y++) {
    const row: string[] = [];
    for (let x = 0; x < DEFRAG_GRID_W; x++) {
      row.push(
        Math.random() < 0.65
          ? glyphs[Math.floor(Math.random() * glyphs.length)]
          : clean,
      );
    }
    grid.push(row);
  }
  return grid;
}

function defragPass(
  grid: string[][],
  phase: number,
): { grid: string[][]; recovered: string } {
  const fragments = [
    "7382..OK",
    "4B9F..OK",
    "PRJM..OK",
    "151@..OK",
  ];
  const clean = "∙";
  const next = grid.map((row) => [...row]);
  let cleaned = 0;
  for (let y = 0; y < DEFRAG_GRID_H; y++) {
    for (let x = 0; x < DEFRAG_GRID_W; x++) {
      if (next[y][x] !== clean && Math.random() < 0.4 + phase * 0.15) {
        next[y][x] = clean;
        cleaned++;
      }
    }
  }
  return { grid: next, recovered: fragments[phase] || `BLK${cleaned}` };
}

function renderGrid(grid: string[][]): string[] {
  const border = "+" + "─".repeat(DEFRAG_GRID_W) + "+";
  const lines = [border];
  for (const row of grid) {
    lines.push("|" + row.join("") + "|");
  }
  lines.push(border);
  return lines;
}

export const defragCommand: Command = {
  name: "defrag",
  description: "Defragmenter les donnees de Glitch City",
  usage: "defrag",
  hidden: true,
  async execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    if (!readFlag("sylphe_porygon_echo")) {
      ctx.addLine({
        type: "error",
        content:
          "ERREUR: Aucun agent numerique connecte. Porygon Echo requis.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Indice: un echo persiste dans le cyberespace, noeud 42.",
      });
      return;
    }

    if (!readFlag("sylphe_missingno_unlocked")) {
      ctx.addLine({
        type: "error",
        content:
          "ERREUR: Aucune donnee corrompue detectee. La zone Glitch City n'est pas ouverte.",
      });
      return;
    }

    if (readFlag("sylphe_defrag_complete")) {
      ctx.addLine({
        type: "system",
        content:
          "[PORYGON] Defragmentation deja terminee. La commande `reconstruct` reste disponible.",
      });
      return;
    }

    ctx.addLine({
      type: "system",
      content: "[PORYGON ECHO] Connexion au noeud 42...",
    });
    ctx.addLine({
      type: "system",
      content: "Initialisation du protocole de defragmentation...",
    });
    ctx.addLine({ type: "output", content: "" });

    let grid = makeCorruptedGrid();

    const delay = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, ms));

    // Show initial corrupted state
    ctx.addLine({
      type: "system",
      content: "ETAT INITIAL — Secteurs corrompus detectes:",
    });
    for (const line of renderGrid(grid)) {
      ctx.addLine({ type: "output", content: line });
    }

    for (let phase = 0; phase < DEFRAG_PHASES; phase++) {
      await delay(1200);
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({
        type: "system",
        content: `[PASSE ${phase + 1}/${DEFRAG_PHASES}] Porygon scanne le secteur...`,
      });

      const result = defragPass(grid, phase);
      grid = result.grid;

      await delay(800);

      for (const line of renderGrid(grid)) {
        ctx.addLine({ type: "output", content: line });
      }

      ctx.addLine({
        type: "system",
        content: `Fragment recupere: ${result.recovered}`,
      });

      // Progress bar
      const pct = Math.round(((phase + 1) / DEFRAG_PHASES) * 100);
      const filled = Math.round(pct / 5);
      const bar =
        "[" + "█".repeat(filled) + "░".repeat(20 - filled) + "] " + pct + "%";
      ctx.addLine({ type: "output", content: bar });
    }

    await delay(1000);
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({
      type: "system",
      content: "═══════════════════════════════════",
    });
    ctx.addLine({
      type: "system",
      content: "DEFRAGMENTATION TERMINEE",
    });
    ctx.addLine({
      type: "system",
      content: "═══════════════════════════════════",
    });
    ctx.addLine({
      type: "output",
      content:
        "Porygon a restaure les blocs de donnees corrompus par MissingNo.",
    });
    ctx.addLine({
      type: "output",
      content:
        "Fragments rassembles: 7382 + 4B9F + PROJET_M + SUJET_151",
    });
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({
      type: "system",
      content:
        "[PORYGON] J'ai trouve quelque chose dans les debris. Nouvelle commande deverrouillee: `reconstruct`.",
    });
    ctx.addLine({
      type: "output",
      content:
        "Tapez `reconstruct` pour reconstituer les archives defragmentees.",
    });

    setGameFlag("sylphe_defrag_complete");
  },
};

/* ================================================================
   RECONSTRUCT — Hidden command unlocked by defrag
   ================================================================ */

export const reconstructCommand: Command = {
  name: "reconstruct",
  description: "Reconstituer les archives defragmentees",
  usage: "reconstruct",
  hidden: true,
  execute(_args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    if (!readFlag("sylphe_defrag_complete")) {
      ctx.addLine({
        type: "error",
        content: "ERREUR: Aucune donnee defragmentee disponible.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Indice: Porygon pourrait restaurer les secteurs corrompus de Glitch City.",
      });
      return;
    }

    ctx.addLine({
      type: "system",
      content: "[RECONSTRUCT] Assemblage des blocs recuperes...",
    });
    ctx.addLine({ type: "output", content: "" });

    const archive = [
      "╔════════════════════════════════════════╗",
      "║   ARCHIVES DEFRAGMENTEES — PORYGON     ║",
      "╠════════════════════════════════════════╣",
      "║  BLOC 1: Code Labo 7382               ║",
      "║    > Genere dans le Cyberespace        ║",
      "║    > Transmis via reseau SYLPHE_NET    ║",
      "║                                        ║",
      "║  BLOC 2: Code Labo 4B9F               ║",
      "║    > Extrait de Glitch City            ║",
      "║    > Corrompu par MissingNo            ║",
      "║                                        ║",
      "║  BLOC 3: Manifeste PROJET_M            ║",
      "║    > Objectif: cloner le sujet 151     ║",
      "║    > Resultat: clone #150 (Mewtwo)     ║",
      "║    > Le modele original a survecu.      ║",
      "║                                        ║",
      "║  BLOC 4: Note du Dr Fuji (supprimee)   ║",
      "║    > 'Le sujet 151 n'est pas un echec. ║",
      "║    >  C'est la matrice vivante que le   ║",
      "║    >  clone n'a jamais pu remplacer.'   ║",
      "║                                        ║",
      "║  BLOC 5: Metadonnees Porygon           ║",
      "║    > Le noeud 42 contient encore des    ║",
      "║    > residus du transfert initial.      ║",
      "║    > Porygon garde une copie de la      ║",
      "║    > cartographie pre-corruption.       ║",
      "╚════════════════════════════════════════╝",
    ];

    for (const line of archive) {
      ctx.addLine({ type: "output", content: line });
    }

    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({
      type: "system",
      content:
        "[PORYGON] Les donnees sont reconstituees. La verite sur le Projet M etait enfouie dans les octets corrompus.",
    });

    if (readFlag("sylphe_prototype_151")) {
      ctx.addLine({
        type: "system",
        content:
          "[NOTE] L'archive 151 confirme la note du Dr Fuji. La matrice et le clone ne sont pas interchangeables.",
      });
    }
  },
};

/* ================================================================
   SYLPHEDEX — Faux Pokédex interne Sylphe Corp.
   ================================================================ */

export const sylphedexCommand: Command = {
  name: "sylphedex",
  description: "Consulter le Pokedex interne Sylphe",
  usage: "sylphedex [sujet]",
  hidden: true,
  execute(args: string[], ctx: CommandContext) {
    if (typeof window === "undefined") return;

    const entries = getSylphedexEntries();

    if (entries.length === 0) {
      ctx.addLine({
        type: "error",
        content: "SYLPHEDEX VIDE: aucun sujet enregistre.",
      });
      ctx.addLine({
        type: "system",
        content:
          "Indice: explorez les zones anomaliques pour alimenter la base.",
      });
      return;
    }

    const query = args.join(" ").toUpperCase();

    if (query) {
      const match = entries.find(
        (e) =>
          e.name.toUpperCase().includes(query) ||
          e.id.toUpperCase().includes(query),
      );
      if (!match) {
        ctx.addLine({
          type: "error",
          content: `SYLPHEDEX: Aucune entree trouvee pour '${args.join(" ")}'.`,
        });
        ctx.addLine({
          type: "system",
          content: `Sujets disponibles: ${entries.map((e) => e.name).join(", ")}`,
        });
        return;
      }
      printSylphedexEntry(match, ctx);
      return;
    }

    // List all entries
    ctx.addLine({
      type: "system",
      content: "╔══════════════════════════════════════╗",
    });
    ctx.addLine({
      type: "system",
      content: "║       SYLPHEDEX — BASE INTERNE       ║",
    });
    ctx.addLine({
      type: "system",
      content: "║      Sylphe Corp. // Confidentiel     ║",
    });
    ctx.addLine({
      type: "system",
      content: "╠══════════════════════════════════════╣",
    });

    for (const entry of entries) {
      const tag = entry.restricted ? " [RESTREINT]" : "";
      ctx.addLine({
        type: "output",
        content: `║  ${entry.id.padEnd(8)} ${entry.name.padEnd(18)}${tag.padEnd(12)}║`,
      });
    }

    ctx.addLine({
      type: "system",
      content: "╚══════════════════════════════════════╝",
    });
    ctx.addLine({
      type: "output",
      content: `${entries.length} sujet(s) enregistre(s). Tapez 'sylphedex <nom>' pour le detail.`,
    });
  },
};

function printSylphedexEntry(
  entry: ReturnType<typeof getSylphedexEntries>[number],
  ctx: CommandContext,
) {
  ctx.addLine({
    type: "system",
    content: "╔══════════════════════════════════════════╗",
  });
  ctx.addLine({
    type: "system",
    content: `║  ${entry.id}  ${entry.name.padEnd(30)}║`,
  });
  ctx.addLine({
    type: "system",
    content: "╠══════════════════════════════════════════╣",
  });
  ctx.addLine({
    type: "output",
    content: `║  Type: ${entry.type.padEnd(34)}║`,
  });
  ctx.addLine({
    type: "output",
    content: `║  Class: ${entry.classification}`,
  });
  ctx.addLine({
    type: "output",
    content: `║  Statut: ${entry.status}`,
  });

  if (entry.restricted) {
    ctx.addLine({
      type: "error",
      content: "║  ⚠ FICHE RESTREINTE — Niveau d'accès élevé requis",
    });
  }

  ctx.addLine({
    type: "system",
    content: "╠══════════════════════════════════════════╣",
  });
  ctx.addLine({ type: "system", content: "║  NOTES:" });
  for (const note of entry.notes) {
    ctx.addLine({ type: "output", content: `║    ${note}` });
  }
  ctx.addLine({
    type: "system",
    content: "╚══════════════════════════════════════════╝",
  });
}

export const nanoCommand: Command = {
  name: "nano",
  description: "Editeur de fichier textuel",
  usage: "nano <fichier>",
  hidden: true,
  execute(args: string[], ctx: CommandContext) {
    const target = args[0];
    if (!target) {
      ctx.addLine({ type: "error", content: "Usage: nano <fichier>" });
      return;
    }

    const resolved = resolvePath(ctx.fs, ctx.cwd, target);
    const node = getNode(ctx.fs, resolved);

    if (!node) {
      ctx.addLine({
        type: "error",
        content: `nano: ${target}: Fichier introuvable`,
      });
      return;
    }

    if (node.type === "directory") {
      ctx.addLine({
        type: "error",
        content: `nano: ${target}: Est un repertoire`,
      });
      return;
    }

    const isContainmentConf = resolved === "/etc/sylphe/containment.conf";

    ctx.addLine({
      type: "system",
      content: "╔══════════════════════════════════════╗",
    });
    ctx.addLine({
      type: "system",
      content: `║  GNU nano 7.2  —  ${target.slice(0, 20).padEnd(20)}║`,
    });
    ctx.addLine({
      type: "system",
      content: "╠══════════════════════════════════════╣",
    });

    const content = node.content || "";
    const lines = content.split("\n");
    for (const line of lines) {
      ctx.addLine({ type: "output", content: `║  ${line}` });
    }

    ctx.addLine({
      type: "system",
      content: "╠══════════════════════════════════════╣",
    });
    ctx.addLine({
      type: "system",
      content: "║  ^O Enregistrer  ^X Quitter         ║",
    });
    ctx.addLine({
      type: "system",
      content: "╚══════════════════════════════════════╝",
    });

    if (isContainmentConf) {
      ctx.addLine({ type: "output", content: "" });
      ctx.addLine({
        type: "system",
        content: "Pour modifier status=ON en OFF, tapez: nano-edit off",
      });
      ctx.addLine({
        type: "error",
        content: "⚠ ATTENTION: Cela coupera le courant du systeme.",
      });
    }
  },
};

export const nanoEditCommand: Command = {
  name: "nano-edit",
  description: "Modifier le confinement",
  usage: "nano-edit <on|off>",
  hidden: true,
  execute(args: string[], ctx: CommandContext) {
    const value = args[0]?.toLowerCase();
    if (value !== "on" && value !== "off") {
      ctx.addLine({ type: "error", content: "Usage: nano-edit <on|off>" });
      return;
    }

    if (value === "off") {
      ctx.addLine({
        type: "system",
        content: "[containment.conf] status=ON → status=OFF",
      });
      ctx.addLine({ type: "system", content: "" });
      ctx.addLine({ type: "error", content: "⚠ ALERTE CRITIQUE ⚠" });
      ctx.addLine({
        type: "error",
        content: "Systeme de confinement DESACTIVE.",
      });
      ctx.addLine({
        type: "system",
        content: "Les barrieres du sous-sol cedent...",
      });
      ctx.addLine({
        type: "system",
        content: "Anomalies temporelles en cours de liberation...",
      });
      ctx.addLine({ type: "system", content: "" });

      const glitch = [
        "▓▒░ SIGNAL PERDU ░▒▓",
        "...",
        "...",
        "Reconnexion en cours...",
        "",
        "Le courant est revenu. Mais quelque chose a change.",
        "Les fantomes circulent librement.",
        "Le Sujet 151 murmure dans les murs.",
      ];
      for (const line of glitch) {
        ctx.addLine({
          type:
            line.includes("▓") || line.includes("ALERTE") ? "error" : "system",
          content: line,
        });
      }

      setGameFlag("sylphe_containment_off");
    } else {
      ctx.addLine({
        type: "system",
        content: "[containment.conf] status=OFF → status=ON",
      });
      ctx.addLine({
        type: "system",
        content:
          "Confinement retabli. Les barrieres sont en cours de reparation.",
      });
    }
  },
};

export const analyzeSampleCommand: Command = {
  name: "analyze_sample",
  description: "Analyser un echantillon spectral",
  usage: "analyze_sample",
  hidden: true,
  execute(args: string[], ctx: CommandContext) {
    if (!readFlag("sylphe_spectral_feather")) {
      ctx.addLine({ type: "error", content: "Aucun echantillon a analyser." });
      ctx.addLine({
        type: "output",
        content:
          "Indice: Certains artefacts du <a href='/museum-null' style='color: blue;'>Musee Null</a> peuvent etre glisses ici...",
      });
      return;
    }

    ctx.addLine({ type: "system", content: "Analyse spectrale en cours..." });
    ctx.addLine({ type: "system", content: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%" });
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({ type: "system", content: "RESULTATS:" });
    ctx.addLine({
      type: "output",
      content: "Type: Plume Spectrale (categorie: ARTEFACT FANTOME)",
    });
    ctx.addLine({
      type: "output",
      content: "Provenance: Aile NULL du Musee Sylphe",
    });
    ctx.addLine({
      type: "output",
      content: "Resonance: Frequence de Lavanville (10.5 GHz)",
    });
    ctx.addLine({
      type: "output",
      content: "ADN residuel: Compatible Sujet 151-ALPHA",
    });
    ctx.addLine({ type: "output", content: "" });
    ctx.addLine({
      type: "system",
      content: "L'artefact vibre a la frequence des morts.",
    });
    ctx.addLine({
      type: "system",
      content: "Le Dr. Fuji l'utilisait pour communiquer avec les spectres.",
    });

    setGameFlag("sylphe_sample_analyzed");
  },
};
