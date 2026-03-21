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
  const hasKabuto = readFlag("sylphe_kabuto_captured");
  const hasFantominus = readFlag("sylphe_fantominus_captured");
  const hasLapras = readFlag("sylphe_lapras_captured");
  const hasElectrode = readFlag("sylphe_electrode_captured");
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

  if (hasKabuto) {
    entries.push({
      id: "#140",
      name: "KABUTO",
      type: "ROCHE/EAU",
      classification: "FOSSILE REACTIVE / MONT SELENITE",
      status:
        "CAPTURE — Stabilise apres reveil dans les galeries profondes du Mont Selenite.",
      notes: [
        "Specimen reveille au voisinage d'un fossile vivant enfoui sous les nids de Nosferapti.",
        "Le sujet reagit violemment aux percussions et a l'echolocalisation du site.",
        hasPrototype
          ? "[ARCHIVE 151] Les couches geologiques du Mont Selenite stockent des traces plus anciennes que les journaux du Projet M."
          : "Les carapaces fossiles semblent avoir conserve une memoire acoustique de la grotte.",
      ],
      restricted: false,
    });
  }

  if (hasFantominus) {
    entries.push({
      id: "#092",
      name: "FANTOMINUS",
      type: "SPECTRE/POISON",
      classification: "RESIDU CAPTURE / MIROIR SPECTRAL",
      status:
        "CAPTURE — Le reflet du sujet a ete verrouille avant dissipation complete.",
      notes: [
        "Fantominus n'etait visible qu'a travers le filtre du Scope Sylphe et la camera du miroir.",
        "Sa forme enregistrable n'apparait qu'apres documentation complete des autres spectres du lieu.",
        hasScope
          ? "[SCOPE] Le signal spectral reste lisible meme en dehors du miroir."
          : "Le sujet refuse toute lecture en l'absence du Scope Sylphe.",
      ],
      restricted: false,
    });
  }

  if (hasLapras) {
    entries.push({
      id: "#131",
      name: "LAPRAS",
      type: "EAU/GLACE",
      classification: "SUJET LOGISTIQUE / 11F MAINTENANCE",
      status:
        "CAPTURE — Exfiltre du 11e etage apres liberation du developpeur retenu en maintenance.",
      notes: [
        "Lapras servait de porteur docile entre les laboratoires et les baies serveur du 11e etage.",
        "Le sujet est reste volontairement pres de la cellule de maintenance jusqu'a l'ouverture des verrous.",
        "Les techniciens Rocket notaient qu'il comprenait mieux les alarmes que leurs propres agents.",
      ],
      restricted: false,
    });
  }

  if (hasElectrode) {
    entries.push({
      id: "#101",
      name: "ELECTRODE",
      type: "ELECTRIK",
      classification: "BATTERIE DE SECURITE / 11F OVERLOAD",
      status:
        "CAPTURE — Isolé apres surcharge volontaire du reseau de maintenance du 11e etage.",
      notes: [
        "Utilise comme accumulateur vivant dans les baies critiques du 11e etage.",
        "Le sujet n'apparait qu'apres liberation du developpeur, relance des circuits et coupure coordonnee des trois noeuds.",
        "Les archives Rocket le decrivent comme une securite d'urgence. Maxime parlait plutot d'une pile avec de l'humeur.",
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

  // LOKHLASS ARCHIVE — Cold Storage
  if (readFlag("sylphe_lapras_archive_captured")) {
    entries.push({
      id: "#131-A",
      name: "LOKHLASS ARCHIVE",
      type: "EAU / GLACE [ARCHIVE]",
      classification: "SPECIMEN CRYOGENIQUE / SERVEUR DE SAUVEGARDE",
      status:
        "CAPTURE — Extrait de la chambre froide cryogenique apres degel force.",
      notes: [
        "Variante archivistique de Lokhlass, fusionne avec les serveurs de sauvegarde depuis 1997.",
        "Porte la memoire de milliers de parties interrompues, gelees en boucle infinie.",
        "Le degel peut etre provoque par souffle au micro ou par la frequence 5.0 MHz de la Radio Pokematos.",
        hasScope
          ? "Le Scope detecte des fragments de donnees de sauvegarde dans son aura glaciale."
          : "Son corps semble contenir des cristaux de donnees numeriques.",
      ],
      restricted: true,
    });
  }

  // SPECTRUM CORPORATE — Lavender Emergency Line
  if (readFlag("sylphe_spectrum_captured")) {
    entries.push({
      id: "#93-C",
      name: "SPECTRUM CORPORATE",
      type: "POISON / SPECTRE [CORPORATE]",
      classification: "VARIANTE RARE / LIGNE D'URGENCE LAVANVILLE",
      status:
        "CAPTURE — Materialise via la Ligne d'Urgence de Lavanville dans le Miroir Spectral.",
      notes: [
        "Ce Spectrum n'est pas un pokemon sauvage. Il s'agit d'une empreinte psychique collective des employes effaces de Sylphe Corp.",
        "Il ne se manifeste que si le joueur appelle le poste 7 (Lavender Mirror) puis rejoint immediatement le Miroir Spectral.",
        "Sa capture remplace celle de Fantominus lors de cette variante rare.",
        hasNullBadge
          ? "Le Badge NULL confirme que ces employes existaient dans l'aile effacee du Musee."
          : "L'identite exacte des employes qu'il represente reste inconnue.",
      ],
      restricted: true,
    });
  }

  return entries;
}
