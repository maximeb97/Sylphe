function readFlag(key: string): boolean {
  return (
    typeof window !== "undefined" && localStorage.getItem(key) === "true"
  );
}

export interface SylphedexEntry {
  id: string;
  name: string;
  type: string;
  classification: string;
  status: string;
  notes: string[];
  restricted: boolean;
}

export function getSylphedexEntries(): SylphedexEntry[] {
  const hasMew = readFlag("sylphe_mew_captured");
  const hasMewtwo = readFlag("sylphe_mewtwo_captured");
  const hasPrototype = readFlag("sylphe_prototype_151");
  const hasMissingno = readFlag("sylphe_missingno_unlocked");
  const hasScope = readFlag("sylphe_silph_scope");
  const hasPorygon = readFlag("sylphe_porygon_echo");
  const hasReconciled = readFlag("sylphe_archive_151_reconciled");
  const hasNullBadge = readFlag("sylphe_null_badge");

  const entries: SylphedexEntry[] = [];

  // MEW
  entries.push({
    id: "#151",
    name: "MEW",
    type: "PSY",
    classification: "SUJET ORIGINEL / MATRICE GENETIQUE",
    status: hasMew
      ? "CAPTURE — Securise dans la Masterball blanche."
      : "LIBRE — Derniere detection sous la surface aquatique de la carte Sylphe.",
    notes: [
      "Specimen original a partir duquel le clone #150 a ete derive.",
      hasMew
        ? "Le sujet flotte librement a l'interieur de la capsule de confinement."
        : "Insaisissable. Repond aux sollicitations repetees sur les surfaces aquatiques.",
      ...(hasPrototype
        ? [
            "[ARCHIVE 151] La signature genetique de Mew correspond a la matrice originelle du Projet M.",
            hasReconciled
              ? "[CONCORDANCE] L'archive 151 a cesse de se fragmenter. Mew reconnu comme modele stable."
              : "[INSTABILITE] L'archive signale une divergence entre le sujet vivant et ses copies numeriques.",
          ]
        : []),
    ],
    restricted: false,
  });

  // MEWTWO
  entries.push({
    id: "#150",
    name: "MEWTWO",
    type: "PSY",
    classification: "CLONE INSTABLE / PROJET M — ESSAI #42",
    status: hasMewtwo
      ? "CAPTURE — Confinement volontaire dans la Masterball blanche."
      : "ACTIF — En cuve de stase, Chambre 042.",
    notes: [
      "Clone derive de la matrice Mew. Financement Team Rocket confirme.",
      hasMewtwo
        ? "Le clone ne force plus sa cage. Semble avoir accepte un equilibre precaire."
        : "Empreinte psychique massive detectee. La cuve contient a peine le sujet.",
      ...(hasPrototype
        ? [
            "[NOTE LABO] Les tentatives #01 a #41 ont echoue. Le Dr Fuji notait que la matrice (151) est plus stable que le produit (150).",
          ]
        : []),
      ...(hasMew && hasMewtwo
        ? [
            "[OBSERVATION] Mew et Mewtwo cohabitent sans hostilite dans la Masterball. Le clone semble reconnaitre son origine.",
          ]
        : []),
    ],
    restricted: false,
  });

  // MISSINGNO
  if (hasMissingno) {
    entries.push({
      id: "#0x9F4C",
      name: "MISSINGN0",
      type: "OISEAU/NORMAL [CORROMPU]",
      classification: "ANOMALIE DE DONNEES / ENTITE HORS-INDEX",
      status: "NON CONFINE — Se deplace librement dans les secteurs corrompus.",
      notes: [
        "Entite non repertoriee officiellement. Adresse memoire: 0x9F4C.",
        "Duplication d'objets confirmee: les inventaires a proximite se multiplient (x128).",
        hasScope
          ? "[SCOPE] Le Scope Sylphe reagit violemment a proximite. Les residus spectraux saturent le capteur."
          : "Aucun capteur spectral disponible pour analyse approfondie.",
        "Glitch City reste instable. MissingNo semble etre la cause et non le symptome.",
        ...(hasNullBadge
          ? [
              "[BADGE NULL] Le <a href='/museum-null' style='color: blue;'>Musee Null</a> confirme que MissingNo etait repertorie dans l'aile effacee avant purge du catalogue.",
            ]
          : []),
      ],
      restricted: true,
    });
  }

  // PROTOTYPE 151
  if (hasPrototype) {
    entries.push({
      id: "#pr0t0",
      name: "ARCHIVE 151",
      type: "INCONNU",
      classification: "MEMOIRE RESIDUELLE / SUJET PRE-CATALOGUE",
      status: hasReconciled
        ? "RECONCILIE — La memoire originelle ne fuit plus dans les zones vides."
        : "INSTABLE — Fragmentation continue dans les marges du systeme.",
      notes: [
        "Ce n'est pas un Pokemon. C'est la signature genetique qui precedait toutes les autres.",
        "Le sujet 151 existe avant le catalogue. Il a ete volontairement omis des rapports finaux.",
        hasReconciled
          ? "La confrontation en White Room a stabilise l'archive. La concordance est permanente."
          : "L'archive continue de repandre des fragments dans les zones vides du systeme de fichiers.",
        "[CONFIDENTIEL] Le Dr Fuji savait que 151 etait la matrice. Le rapport final a ete supprime.",
      ],
      restricted: true,
    });
  }

  // PORYGON
  if (hasPorygon) {
    entries.push({
      id: "#137-E",
      name: "PORYGON ECHO",
      type: "NORMAL [NUMERIQUE]",
      classification: "FRAGMENT DETOURNE / NOEUD 42",
      status:
        "SEMI-PERSISTANT — Se materialise dans la Masterball blanche apres visite cyber.",
      notes: [
        "Porygon original numerise par Sylphe Corp. pour patrouiller le cyberespace interne.",
        "Un echo de ses donnees a fui le noeud 42 et se retrouve parfois dans la Pokeball interieure.",
        "La commande `archive-debug` semble liee a la passerelle de donnees que Porygon projette.",
        ...(hasMew && hasMewtwo
          ? [
              "[TRIANGULATION] Quand Mew, Mewtwo et Porygon cohabitent, la capsule entre en etat de biosphere triangulee.",
            ]
          : []),
      ],
      restricted: false,
    });
  }

  // CUBONE SPECTRAL — Lavender Mirror
  if (readFlag("sylphe_mirror_tag")) {
    entries.push({
      id: "#105-G",
      name: "GARDIEN OSSEUX",
      type: "SOL [SPECTRAL]",
      classification: "ENTITE MEMORIELLE / MIROIR DE LAVANVILLE",
      status:
        "LIE AU MIROIR — Ne quitte pas la frequence spectrale de Lavanville.",
      notes: [
        "Ce Ossatueur n'est pas mort au sens classique. Il hante le Miroir en tant que gardien des noms effaces.",
        "La plaque memorielle qu'il remet porte les identites retirees des rapports publics Sylphe.",
        "La commande `requiem` lit ces noms. Le gardien semble soulagé a chaque recitation.",
      ],
      restricted: true,
    });
  }

  return entries;
}
