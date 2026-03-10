import type { FSNode } from "./types";

function file(content: string, executable = false): FSNode {
  return { name: "", type: "file", content, executable };
}

function dir(children: Record<string, FSNode>): FSNode {
  const node: FSNode = { name: "", type: "directory", children: {} };
  for (const [name, child] of Object.entries(children)) {
    node.children![name] = { ...child, name };
  }
  return node;
}

export function createFileSystem(): FSNode {
  return dir({
    home: dir({
      user: dir({
        ".bashrc": file('export PS1="sylphe@terminal:$ "\nalias ll="ls -la"'),
        "readme.txt": file(
          "=== BIENVENUE SUR LE TERMINAL SYLPHE ===\n\n" +
            "Vous avez trouvé le terminal secret de Sylphe Corp.\n" +
            "Explorez les fichiers pour découvrir nos secrets...\n\n" +
            "Tapez 'help' pour voir les commandes disponibles."
        ),
        ".profile": file(
          "# Profil utilisateur Sylphe\nexport LANG=fr_FR.UTF-8\nexport EDITOR=vi\nalias ll='ls -la'\nalias cls='clear'\n\n# Message du jour\ncat /etc/motd"
        ),
        "notes.txt": file(
          "TODO:\n" +
            "- Finir le projet MEWTWO\n" +
            "- Vérifier les logs du Scope Sylphe\n" +
            "- Ne pas oublier de nourrir les Pokémon du labo"
        ),
        downloads: dir({
          "rapport_q1_2026.pdf": file("[FICHIER BINAIRE - Rapport trimestriel Q1 2026 - 2.4 Mo]"),
          "photo_equipe.png": file("[FICHIER BINAIRE - Photo d'équipe Sylphe Corp - 856 Ko]"),
          "budget_secret.xlsx": file("[FICHIER PROTÉGÉ - Accès refusé - Contactez l'administrateur]"),
        }),
        projects: dir({
          sylphe: dir({
            "README.md": file(
              "# Projet SYLPHE\n\n" +
                "Application corporative de Sylphe Corp.\n" +
                "Stack: Next.js + TypeScript + Tailwind CSS\n\n" +
                "## Lancement\n" +
                "```\nnpm run dev\n```"
            ),
            src: dir({
              "main.ts": file(
                '// Point d\'entrée principal\nconsole.log("Initialisation de Sylphe Corp...");\n\nimport { startServer } from "./server";\nstartServer(3000);'
              ),
              "server.ts": file(
                "export function startServer(port: number) {\n" +
                  '  console.log(`Serveur démarré sur le port ${port}`);\n' +
                  "}"
              ),
            }),
          }),
          secret: dir({
            "hint.txt": file(
              "Le mot de passe du labo est quelque part dans /var/log...\n" +
                "Essayez la commande 'hack' si vous êtes courageux."
            ),
            ".hidden_key": file("SYLPHE-KEY-2026-MEWTWO-APPROVED"),
          }),
        }),
      }),
    }),
    etc: dir({
      motd: file(
        "╔══════════════════════════════════════╗\n" +
          "║     SYLPHE CORP. TERMINAL v3.1.4    ║\n" +
          "║   Accès autorisé uniquement.        ║\n" +
          "║   Toute intrusion sera signalée.    ║\n" +
          "╚══════════════════════════════════════╝"
      ),
      hostname: file("sylphe-mainframe"),
      version: file("SylpheOS 3.1.4 (Kanto Build 151)"),
    }),
    var: dir({
      log: dir({
        "system.log": file(
          "[2026-01-15 08:00] System boot complete\n" +
            "[2026-01-15 08:01] Services started: 42\n" +
            "[2026-02-20 14:32] WARNING: Unauthorized access attempt from ROCKET_NET\n" +
            "[2026-02-20 14:33] Firewall activated. Threat neutralized.\n" +
            "[2026-03-01 09:00] Backup complete. Password: pr0t0type_151\n" +
            "[2026-03-10 03:14] Anomaly detected in Sector 7..."
        ),
        "access.log": file(
          "user@sylphe login 2026-03-10 08:00\n" +
            "admin@sylphe login 2026-03-09 23:45\n" +
            "root@sylphe sudo 2026-03-09 23:46 -- CLASSIFIED"
        ),
      }),
    }),
    bin: dir({
      scripts: dir({
        "hello.sh": file(
          "#!/bin/bash\n# Un script d'accueil\necho '   _____ __  __   __    ____  __  __  ______'\necho '  / ___// / / /  / /   / __ \\/ / / / / ____/'\necho '  \\__ \\/ /_/ /  / /   / /_/ / /_/ / / __/   '\necho ' ___/ / __  /  / /___/ ____/ __  / / /___   '\necho '/____/_/ /_/  /_____/_/   /_/ /_/ /_____/   '\necho ''\necho 'Bienvenue, dresseur.'",
          true
        ),
        "scan.sh": file(
          "#!/bin/bash\n# Scanner réseau Sylphe\necho 'Scanning réseau Sylphe Corp...'\nsleep 1\necho 'Hôtes détectés:'\necho '  192.168.1.1   - sylphe-gateway'\necho '  192.168.1.10  - sylphe-mainframe'\necho '  192.168.1.42  - labo-mewtwo (RESTRICTED)'\necho '  192.168.1.151 - pokedex-server'\necho '  192.168.1.??  - ??? (signal inconnu)'\necho 'Scan terminé.'",
          true
        ),
        "matrix.sh": file(
          "#!/bin/bash\n# Affiche un effet Matrix\necho 'Initialisation de la matrice...'",
          true
        ),
        "pokemon.sh": file(
          "#!/bin/bash\n# Pokémon aléatoire\necho 'Recherche dans le Pokédex...'\necho 'Tapez: pokedex [1-1025] pour chercher un Pokémon'",
          true
        ),
        "rocket.sh": file(
          "#!/bin/bash\n# Message secret de la Team Rocket\necho ''\necho '  ██████╗  ██████╗  ██████╗██╗  ██╗███████╗████████╗'\necho '  ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝'\necho '  ██████╔╝██║   ██║██║     █████╔╝ █████╗     ██║   '\necho '  ██╔══██╗██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   '\necho '  ██║  ██║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   '\necho '  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   '\necho ''\necho 'Préparez-vous aux problèmes...'\necho 'Et faites-les doubles !'\necho ''\necho '- Jessie & James, agents infiltrés'",
          true
        ),
      }),
    }),
    tmp: dir({
      "scratch.txt": file("fichier temporaire - rien d'intéressant ici"),
    }),
    dev: dir({
      null: file(""),
      random: file("01001101 01000101 01010111 01010100 01010111 01001111"),
    }),
    usr: dir({
      local: dir({
        bin: dir({
          "neofetch": file("#!/bin/bash\n# System information display\necho 'SylpheOS Neofetch'", true),
        }),
      }),
    }),
  });
}

export function resolvePath(fs: FSNode, cwd: string, target: string): string {
  let parts: string[];

  if (target.startsWith("/")) {
    parts = target.split("/").filter(Boolean);
  } else {
    parts = [...cwd.split("/").filter(Boolean), ...target.split("/").filter(Boolean)];
  }

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  return "/" + resolved.join("/");
}

export function getNode(fs: FSNode, path: string): FSNode | null {
  if (path === "/" || path === "") return fs;

  const parts = path.split("/").filter(Boolean);
  let current = fs;

  for (const part of parts) {
    if (current.type !== "directory" || !current.children?.[part]) {
      return null;
    }
    current = current.children[part];
  }

  return current;
}

export function getParentAndName(
  fs: FSNode,
  path: string
): { parent: FSNode; name: string } | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const name = parts.pop()!;
  const parentPath = "/" + parts.join("/");
  const parent = getNode(fs, parentPath);

  if (!parent || parent.type !== "directory") return null;
  return { parent, name };
}
