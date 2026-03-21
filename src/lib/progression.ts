import {
  BOSS_SPRITE,
  COCKATIEL_SPRITE,
  ELECTRODE_SPRITE,
  FANTOMINUS_SPRITE,
  KABUTO_SPRITE,
  LAPRAS_ARCHIVE_SPRITE,
  LAPRAS_SPRITE,
  MEW_SPRITE,
  MEWTWO_SPRITE,
  MISSINGNO_SPRITE,
  PORYGON_SPRITE,
  SPECTRUM_SPRITE,
} from "@/components/PixelSprite";
import {
  getUnlockedInventoryItems,
  getVisitedMaps,
  hasRecentCyberVisit,
  readGameFlags,
  type InventoryItemDefinition,
  type MapDefinition,
} from "@/lib/gameState";

type SpriteMatrix = string[][];

export type PokeballDialogContext = {
  capturedCount: number;
  hasMew: boolean;
  hasPrototype151: boolean;
  hasTriangulatedBiosphere: boolean;
};

export type PokeballInteractionDefinition = {
  cryId?: number;
  oneShot?: string;
  temporarySequence?: string;
  dialog: (context: PokeballDialogContext) => string;
};

export type PokeballOccupantDefinition = {
  id: string;
  x: number;
  y: number;
  sprite: SpriteMatrix;
  type: "wander" | "static";
  interaction: PokeballInteractionDefinition;
};

export type CaptureProgressionDefinition = {
  key: string;
  name: string;
  sprite: SpriteMatrix;
  hallNote: string;
  pokeball?: PokeballOccupantDefinition;
};

export type WitnessProgressionDefinition = {
  key: string;
  name: string;
  sprite: SpriteMatrix;
  hallNote: string;
  pokeball?: PokeballOccupantDefinition;
};

export type EventProgressionDefinition = {
  key: string;
  title: string;
  detail: string;
};

export type ProgressionFlagState = Record<string, boolean>;

export type GameProgressionSnapshot = {
  flags: ProgressionFlagState;
  inventory: InventoryItemDefinition[];
  visitedMaps: MapDefinition[];
  capturedPokemon: CaptureProgressionDefinition[];
  archiveWitnesses: WitnessProgressionDefinition[];
  unlockedEvents: EventProgressionDefinition[];
  pokeballOccupants: PokeballOccupantDefinition[];
  pokeballDialogContext: PokeballDialogContext;
  capturedCount: number;
  hasArchiveDebug: boolean;
  hasHallOfFameAccess: boolean;
  hasPorygonEcho: boolean;
  hasPrototype151: boolean;
  hasTriangulatedBiosphere: boolean;
  hasWhiteRoomHint: boolean;
};

export const CAPTURE_PROGRESSIONS: CaptureProgressionDefinition[] = [
  {
    key: "sylphe_mew_captured",
    name: "MEW",
    sprite: MEW_SPRITE,
    hallNote: "Sujet mythique stabilise apres capture aquatique.",
    pokeball: {
      id: "mew",
      x: 7,
      y: 5,
      sprite: MEW_SPRITE,
      type: "wander",
      interaction: {
        cryId: 151,
        oneShot: "sfx-dialog",
        dialog: ({ hasTriangulatedBiosphere }) =>
          hasTriangulatedBiosphere
            ? "Mew glisse d'un point d'ancrage a l'autre. La biosphere triangulee semble repondre a ses mouvements."
            : "Mew voltige joyeusement dans cet espace infini...",
      },
    },
  },
  {
    key: "sylphe_mewtwo_captured",
    name: "MEWTWO",
    sprite: MEWTWO_SPRITE,
    hallNote: "Clone #150 conserve dans la Masterball blanche.",
    pokeball: {
      id: "mewtwo",
      x: 13,
      y: 5,
      sprite: MEWTWO_SPRITE,
      type: "wander",
      interaction: {
        cryId: 150,
        temporarySequence: "bio-surge",
        dialog: ({ hasPrototype151, hasTriangulatedBiosphere }) =>
          hasTriangulatedBiosphere
            ? "Mewtwo ne force plus sa cage. Le clone #150 inspecte les lignes de force reliees a Mew et Porygon."
            : hasPrototype151
              ? "Mewtwo tourne autour de l'echo 151 sans jamais l'atteindre. Le clone semble reconnaitre son origine."
              : "Mewtwo flotte en silence. La Masterball interieure est devenue sa salle de contention volontaire.",
      },
    },
  },
  {
    key: "sylphe_kabuto_captured",
    name: "KABUTO",
    sprite: KABUTO_SPRITE,
    hallNote: "Fossile reveille dans le Mont Selenite puis securise.",
    pokeball: {
      id: "kabuto",
      x: 5,
      y: 8,
      sprite: KABUTO_SPRITE,
      type: "wander",
      interaction: {
        cryId: 140,
        dialog: () =>
          "Kabuto dessine des demi-lunes fossiles dans la poussiere claire de la capsule. Il explore les bords comme une maree miniature.",
      },
    },
  },
  {
    key: "sylphe_fantominus_captured",
    name: "FANTOMINUS",
    sprite: FANTOMINUS_SPRITE,
    hallNote: "Capture effectuee dans le Miroir Spectral sur variante standard.",
    pokeball: {
      id: "fantominus",
      x: 14,
      y: 3,
      sprite: FANTOMINUS_SPRITE,
      type: "wander",
      interaction: {
        cryId: 92,
        dialog: () =>
          "Fantominus se condense puis s'effiloche contre la coque interieure. Meme ici, il prefere les angles morts.",
      },
    },
  },
  {
    key: "sylphe_lapras_captured",
    name: "LOKHLASS",
    sprite: LAPRAS_SPRITE,
    hallNote: "Prototype docile exfiltre du 11e etage.",
    pokeball: {
      id: "lapras",
      x: 4,
      y: 4,
      sprite: LAPRAS_SPRITE,
      type: "wander",
      interaction: {
        cryId: 131,
        dialog: () =>
          "Lapras glisse en silence dans la Masterball blanche. La capsule ressemble maintenant a un quai de maintenance minuscule et vivant.",
      },
    },
  },
  {
    key: "sylphe_electrode_captured",
    name: "ELECTRODE",
    sprite: ELECTRODE_SPRITE,
    hallNote: "Batterie vivante capturee pendant la surcharge du 11e etage.",
    pokeball: {
      id: "electrode",
      x: 15,
      y: 8,
      sprite: ELECTRODE_SPRITE,
      type: "wander",
      interaction: {
        cryId: 101,
        dialog: () =>
          "Electrode roule nerveusement le long de la coque interieure. Meme capture, il traite encore la Pokeball comme un tableau electrique a court-circuiter.",
      },
    },
  },
  {
    key: "sylphe_lapras_archive_captured",
    name: "LOKHLASS ARCHIVE",
    sprite: LAPRAS_ARCHIVE_SPRITE,
    hallNote: "Archive cryogenique vivante extraite de la chambre froide.",
    pokeball: {
      id: "lapras-archive",
      x: 3,
      y: 6,
      sprite: LAPRAS_ARCHIVE_SPRITE,
      type: "wander",
      interaction: {
        cryId: 131,
        dialog: () =>
          "Lokhlass Archive flotte dans un halo de givre numerique. Des fragments de sauvegardes anciennes scintillent autour de sa carapace comme des flocons de memoire.",
      },
    },
  },
  {
    key: "sylphe_spectrum_captured",
    name: "SPECTRUM CORPORATE",
    sprite: SPECTRUM_SPRITE,
    hallNote: "Variante rare attiree hors du miroir par la ligne d'urgence.",
    pokeball: {
      id: "spectrum",
      x: 16,
      y: 4,
      sprite: SPECTRUM_SPRITE,
      type: "wander",
      interaction: {
        cryId: 93,
        dialog: () =>
          "Le Spectrum Corporate oscille entre visible et transparent. Les visages des employes effaces de Sylphe Corp. apparaissent fugitivement dans sa brume violette.",
      },
    },
  },
];

export const ARCHIVE_WITNESS_PROGRESSIONS: WitnessProgressionDefinition[] = [
  {
    key: "sylphe_missingno_unlocked",
    name: "MISSINGNO",
    sprite: MISSINGNO_SPRITE,
    hallNote: "Anomalie ayant fracture l'inventaire et revele le Scope Sylphe.",
  },
  {
    key: "sylphe_porygon_echo",
    name: "PORYGON ECHO",
    sprite: PORYGON_SPRITE,
    hallNote: "Residus de SYLPHE_NET transites clandestinement vers l'interieur de la capsule.",
    pokeball: {
      id: "porygon",
      x: 10,
      y: 7,
      sprite: PORYGON_SPRITE,
      type: "wander",
      interaction: {
        cryId: 137,
        dialog: ({ hasTriangulatedBiosphere }) =>
          hasTriangulatedBiosphere
            ? "Porygon triangule la capsule depuis le noeud 42. Les trois presences convertissent la Pokeball en biosphere auto-cartographiee."
            : "Porygon materialise une passerelle de donnees dans la Pokeball blanche. Les archives suggerent maintenant la commande terminale `archive-debug`.",
      },
    },
  },
  {
    key: "sylphe_giovanni_unlocked",
    name: "GIOVANNI",
    sprite: BOSS_SPRITE,
    hallNote: "Presence archivee du commanditaire du Projet M.",
  },
  {
    key: "sylphe_cali_unlocked",
    name: "CALI",
    sprite: COCKATIEL_SPRITE,
    hallNote: "Messagere improbable surviveuse des couches de tests internes.",
  },
];

export const EVENT_PROGRESSIONS: EventProgressionDefinition[] = [
  {
    key: "sylphe_archive_debug",
    title: "ARCHIVE DEBUG",
    detail: "Le Hall of Fame est monte depuis la supervision profonde.",
  },
  {
    key: "sylphe_maxime_rescued",
    title: "EXFILTRATION MAXIME",
    detail: "Le 11e etage a relache son dernier captif.",
  },
  {
    key: "sylphe_null_badge",
    title: "BADGE NULL",
    detail: "L'aile effacee du musee est desormais reconnue par le systeme.",
  },
  {
    key: "sylphe_mirror_tag",
    title: "MIRROR TAG",
    detail: "Le Miroir de Lavanville force les archives a relire les noms effaces.",
  },
  {
    key: "sylphe_archive_151_reconciled",
    title: "CONCORDANCE 151",
    detail: "La White Room a cesse de fragmenter l'archive originelle.",
  },
  {
    key: "sylphe_forensics_complete",
    title: "RAPPORT FORENSICS",
    detail: "Les trois chronologies du Projet M ont ete recroisees.",
  },
  {
    key: "sylphe_watermark_revealed",
    title: "FILIGRANE REVELE",
    detail: "L'impression a expose CRYO-FUJI-151 et l'acces a /cold-storage.",
  },
  {
    key: "sylphe_subway_archive_found",
    title: "ARCHIVES LOGISTIQUES",
    detail: "Le tunnel fantome a livre ses documents internes.",
  },
  {
    key: "sylphe_printer_room_complete",
    title: "SALLE D'IMPRESSION TRACEE",
    detail: "Les imprimantes et la dechiqueteuse ont ete integralement depouillees.",
  },
  {
    key: "sylphe_spectre_mirror_complete",
    title: "MIROIR SPECTRAL VIDE",
    detail: "Les trois spectres ont ete forces de se manifester.",
  },
  {
    key: "sylphe_white_room_hint",
    title: "INDICE WHITE ROOM",
    detail: "Le Hall of Fame a conserve le chemin persistant vers l'archive originelle.",
  },
  {
    key: "sylphe_triangulated_biosphere",
    title: "BIOSPHERE TRIANGULEE",
    detail: "Mew, Mewtwo et Porygon ont stabilise un biotope interne rare.",
  },
];

const POKEBALL_SYSTEM_OCCUPANTS: PokeballOccupantDefinition[] = [
  {
    id: "echo151",
    x: 10,
    y: 3,
    sprite: MEW_SPRITE,
    type: "static",
    interaction: {
      temporarySequence: "bio-surge",
      dialog: ({ hasMew }) =>
        hasMew
          ? "L'archive 151 se tait. Le sujet originel a finalement retrouve une forme stable."
          : "Une silhouette blanche clignote dans la coque: 'Je n'etais pas le clone. J'etais le modele.'",
    },
  },
];

const PROGRESSION_FLAG_KEYS = Array.from(
  new Set([
    ...CAPTURE_PROGRESSIONS.map(entry => entry.key),
    ...ARCHIVE_WITNESS_PROGRESSIONS.map(entry => entry.key),
    ...EVENT_PROGRESSIONS.map(entry => entry.key),
    "sylphe_hall_of_fame",
    "sylphe_prototype_151",
  ]),
);

function getUnlockedEntries<T extends { key: string }>(
  entries: T[],
  flags: ProgressionFlagState,
): T[] {
  return entries.filter(entry => flags[entry.key]);
}

export function getProgressionFlagState(): ProgressionFlagState {
  return readGameFlags(PROGRESSION_FLAG_KEYS);
}

export function getUnlockedCapturedPokemon(
  flags: ProgressionFlagState = getProgressionFlagState(),
): CaptureProgressionDefinition[] {
  return getUnlockedEntries(CAPTURE_PROGRESSIONS, flags);
}

export function getUnlockedArchiveWitnesses(
  flags: ProgressionFlagState = getProgressionFlagState(),
): WitnessProgressionDefinition[] {
  return getUnlockedEntries(ARCHIVE_WITNESS_PROGRESSIONS, flags);
}

export function getUnlockedProgressionEvents(
  flags: ProgressionFlagState = getProgressionFlagState(),
): EventProgressionDefinition[] {
  return getUnlockedEntries(EVENT_PROGRESSIONS, flags);
}

export function getPokeballOccupants(options?: {
  flags?: ProgressionFlagState;
  hasRecentCyberVisit?: boolean;
}): PokeballOccupantDefinition[] {
  const flags = options?.flags ?? getProgressionFlagState();
  const allowTransientPorygon = options?.hasRecentCyberVisit ?? hasRecentCyberVisit();
  const unlockedCaptures = getUnlockedCapturedPokemon(flags)
    .flatMap(entry => (entry.pokeball ? [entry.pokeball] : []));
  const unlockedWitnesses = ARCHIVE_WITNESS_PROGRESSIONS.flatMap(entry => {
    if (!entry.pokeball) return [];
    if (entry.key === "sylphe_porygon_echo") {
      return flags[entry.key] || allowTransientPorygon ? [entry.pokeball] : [];
    }
    return flags[entry.key] ? [entry.pokeball] : [];
  });
  const systemOccupants = flags.sylphe_prototype_151 ? POKEBALL_SYSTEM_OCCUPANTS : [];

  return [...unlockedCaptures, ...systemOccupants, ...unlockedWitnesses];
}

export function getGameProgressionSnapshot(): GameProgressionSnapshot {
  const flags = getProgressionFlagState();
  const capturedPokemon = getUnlockedCapturedPokemon(flags);
  const archiveWitnesses = getUnlockedArchiveWitnesses(flags);
  const unlockedEvents = getUnlockedProgressionEvents(flags);
  const hasPorygonEcho = flags.sylphe_porygon_echo || hasRecentCyberVisit();
  const hasTriangulatedBiosphere =
    flags.sylphe_mew_captured && flags.sylphe_mewtwo_captured && hasPorygonEcho;
  const capturedCount = capturedPokemon.length;
  const pokeballDialogContext: PokeballDialogContext = {
    capturedCount,
    hasMew: flags.sylphe_mew_captured,
    hasPrototype151: flags.sylphe_prototype_151,
    hasTriangulatedBiosphere,
  };

  return {
    flags,
    inventory: getUnlockedInventoryItems(),
    visitedMaps: getVisitedMaps(),
    capturedPokemon,
    archiveWitnesses,
    unlockedEvents,
    pokeballOccupants: getPokeballOccupants({
      flags,
      hasRecentCyberVisit: hasPorygonEcho,
    }),
    pokeballDialogContext,
    capturedCount,
    hasArchiveDebug: flags.sylphe_archive_debug,
    hasHallOfFameAccess: flags.sylphe_hall_of_fame,
    hasPorygonEcho,
    hasPrototype151: flags.sylphe_prototype_151,
    hasTriangulatedBiosphere,
    hasWhiteRoomHint: flags.sylphe_white_room_hint,
  };
}