export type InventoryItemDefinition = {
  key: string;
  name: string;
  detail: string;
};

export type MapDefinition = {
  href: string;
  name: string;
  unlockKey?: string;
};

const VISITED_MAPS_KEY = "sylphe_visited_maps";
const LAST_ROUTE_KEY = "sylphe_last_route";
const LAST_ROUTE_AT_KEY = "sylphe_last_route_at";

const CORE_ROUTE_PATHS = [
  "/",
  "/rocket-hq",
  "/giovanni-office",
  "/cyberspace",
  "/glitch-city",
  "/mew-cloning-chamber-042",
  "/pokeball",
  "/cerulean-cave",
];

export const INVENTORY_ITEMS: InventoryItemDefinition[] = [
  {
    key: "sylphe_has_key",
    name: "CARTE D'ACCES SYLPHE",
    detail: "Badge magnetique vole au rez-de-chaussee.",
  },
  {
    key: "sylphe_masterball_unlocked",
    name: "MASTERBALL",
    detail: "Prototype de capture absolue, taux de reussite: 100%.",
  },
  {
    key: "sylphe_silph_scope",
    name: "SCOPE SYLPHE",
    detail: "Capteur spectral pour lire les residus de clones.",
  },
  {
    key: "sylphe_prototype_151",
    name: "ARCHIVE PROTOTYPE 151",
    detail: "Memoire residuelle d'un sujet originel jamais catalogue.",
  },
  {
    key: "sylphe_archive_debug",
    name: "MODE ARCHIVE DEBUG",
    detail:
      "Console de supervision activee au plus profond des archives Sylphe.",
  },
  {
    key: "sylphe_white_room_hint",
    name: "INDICE WHITE ROOM",
    detail:
      "Residus extraits du Hall of Fame: WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE.",
  },
  {
    key: "sylphe_archive_151_reconciled",
    name: "CONCORDANCE 151",
    detail:
      "L'archive originelle a cesse de se fragmenter. La White Room repond maintenant sans hostilite.",
  },
  {
    key: "sylphe_null_badge",
    name: "BADGE NULL",
    detail:
      "Badge de visite provenant d'une aile corporate effacee des plans publics.",
  },
  {
    key: "sylphe_mirror_tag",
    name: "MIRROR TAG",
    detail:
      "Plaque memorielle issue du Miroir de Lavanville interne. Elle force les archives a lire les noms effaces.",
  },
  {
    key: "sylphe_porygon_echo",
    name: "PORYGON ECHO",
    detail:
      "Fragment numerique detourne depuis le noeud 42 jusque dans la Masterball blanche.",
  },
  {
    key: "sylphe_mewtwo_captured",
    name: "MEWTWO (CAPTURED)",
    detail: "Clone #150 stabilise a l'interieur d'une Masterball.",
  },
  {
    key: "sylphe_mew_captured",
    name: "MEW (CAPTURED)",
    detail: "Pokemon mythique detecte sous la surface puis securise.",
  },
  {
    key: "sylphe_system_pass",
    name: "PASS SYSTEME (RED)",
    detail: "Autorisation transmise au coeur du systeme par le champion final.",
  },
];

export const MAP_DEFINITIONS: MapDefinition[] = [
  { href: "/", name: "ACCUEIL" },
  { href: "/rocket-hq", name: "ROCKET-HQ", unlockKey: "sylphe_rocket_mode" },
  {
    href: "/giovanni-office",
    name: "BUREAU GIOVANNI",
    unlockKey: "sylphe_giovanni_unlocked",
  },
  { href: "/cyberspace", name: "CYBERSPACE" },
  {
    href: "/glitch-city",
    name: "GLITCH CITY",
    unlockKey: "sylphe_missingno_unlocked",
  },
  {
    href: "/mew-cloning-chamber-042",
    name: "CHAMBRE 042",
    unlockKey: "sylphe_mew_unlocked",
  },
  {
    href: "/pokeball",
    name: "MASTERBALL INTERIEURE",
    unlockKey: "sylphe_masterball_unlocked",
  },
  {
    href: "/cerulean-cave",
    name: "GROTTE AZUREE",
    unlockKey: "sylphe_mewtwo_captured",
  },
  {
    href: "/hall-of-fame",
    name: "HALL OF FAME",
    unlockKey: "sylphe_hall_of_fame",
  },
  {
    href: "/beneath-stairs",
    name: "BENEATH STAIRS",
    unlockKey: "sylphe_beneath_stairs_unlocked",
  },
  {
    href: "/white-room",
    name: "WHITE ROOM",
    unlockKey: "sylphe_white_room_unlocked",
  },
  {
    href: "/museum-null",
    name: "MUSEE NULL",
    unlockKey: "sylphe_museum_null_unlocked",
  },
  {
    href: "/lavender-mirror",
    name: "LAVENDER MIRROR",
    unlockKey: "sylphe_lavender_mirror_unlocked",
  },
];

function readVisitedMaps(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(VISITED_MAPS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(entry => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

export function emitGameStateChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("sylphe_state_change"));
}

export function setGameFlag(key: string, value: string = "true") {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
  emitGameStateChange();
}

export function markMapVisited(pathname: string) {
  if (typeof window === "undefined") return;
  const normalizedPath = pathname || "/";
  const current = readVisitedMaps();

  localStorage.setItem(LAST_ROUTE_KEY, normalizedPath);
  localStorage.setItem(LAST_ROUTE_AT_KEY, Date.now().toString());

  if (current.includes(normalizedPath)) return;

  localStorage.setItem(
    VISITED_MAPS_KEY,
    JSON.stringify([...current, normalizedPath]),
  );
  emitGameStateChange();
}

export function getLastVisitedRoute(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_ROUTE_KEY);
}

export function hasRecentCyberVisit(maxAgeMs: number = 120000): boolean {
  if (typeof window === "undefined") return false;

  const lastRoute = localStorage.getItem(LAST_ROUTE_KEY);
  const lastRouteAt = Number(localStorage.getItem(LAST_ROUTE_AT_KEY) || "0");
  if (lastRoute !== "/cyberspace" || !lastRouteAt) return false;

  return Date.now() - lastRouteAt <= maxAgeMs;
}

export function getUnlockedInventoryItems(): InventoryItemDefinition[] {
  if (typeof window === "undefined") return [];
  return INVENTORY_ITEMS.filter(
    item => localStorage.getItem(item.key) === "true",
  );
}

export function getVisitedMaps(): MapDefinition[] {
  if (typeof window === "undefined") return [];
  const visited = new Set(readVisitedMaps());

  return MAP_DEFINITIONS.filter(map => {
    if (!visited.has(map.href)) return false;
    if (!map.unlockKey) return true;
    return localStorage.getItem(map.unlockKey) === "true";
  });
}

export function hasCompletedCeruleanPrerequisites(): boolean {
  if (typeof window === "undefined") return false;

  const requiredFlags = [
    "sylphe_has_key",
    "sylphe_rocket_mode",
    "sylphe_giovanni_unlocked",
    "sylphe_missingno_unlocked",
    "sylphe_masterball_unlocked",
    "sylphe_silph_scope",
    "sylphe_mew_unlocked",
    "sylphe_mew_captured",
    "sylphe_mewtwo_captured",
  ];

  return requiredFlags.every(flag => localStorage.getItem(flag) === "true");
}

export function hasVisitedEveryCoreRoute(): boolean {
  if (typeof window === "undefined") return false;
  const visited = new Set(readVisitedMaps());
  return CORE_ROUTE_PATHS.every(route => visited.has(route));
}

export function canUnlockArchiveDebug(): boolean {
  if (typeof window === "undefined") return false;

  const requiredFlags = [
    "sylphe_red_defeated",
    "sylphe_system_pass",
    "sylphe_prototype_151",
    "sylphe_masterball_unlocked",
    "sylphe_mew_captured",
    "sylphe_mewtwo_captured",
  ];

  return (
    requiredFlags.every(flag => localStorage.getItem(flag) === "true") &&
    hasVisitedEveryCoreRoute()
  );
}