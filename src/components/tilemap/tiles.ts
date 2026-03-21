/* ===== Tile Type Constants ===== */
export const GRASS = 0;
export const PATH = 1;
export const TREE = 2;
export const FLOWER = 3;
export const WATER = 4;
export const BUILDING = 5;
export const DOOR = 6;
export const SKY = 7;
export const CLOUD = 8;
export const WINDOW = 10;
export const IN_FLOOR = 11;
export const IN_WALL = 12;
export const PC_DESK = 13;
export const KEY = 14;

// Custom Easter Egg Tiles
export const ROCKET_FLOOR = 20;
export const ROCKET_CRATE = 21;
export const BOSS_DESK = 22;
export const CYBER_FLOOR = 23;
export const CYBER_WALL = 24;
export const GLITCH_TILE = 25;
export const GLITCH_WALL = 26;
export const VAT_BG = 27;
export const POKEBALL_FLOOR = 28;
export const POKEBALL_WALL = 29;
export const CERULEAN_FLOOR = 30;
export const CERULEAN_WALL = 31;
export const CERULEAN_WATER = 32;
export const CERULEAN_STAIRS = 33;

// Phase 8+ Tiles
export const CAVERN_FLOOR = 34;
export const CAVERN_WALL = 35;
export const CASINO_FLOOR = 36;
export const CASINO_MACHINE = 37;
export const RETRO_FLOOR = 38;
export const RETRO_WALL = 39;
export const TRICK_FLOOR = 40;
export const TRICK_TRAP = 41;
export const MIRROR_FLOOR = 42;
export const CLONE_POD = 43;
export const LOGIN_FLOOR = 44;
export const LOGIN_DESK = 45;
export const CRYO_FLOOR = 46;
export const CRYO_WALL = 47;
export const SUBWAY_PLATFORM = 48;
export const SUBWAY_TRACK = 49;
export const SUBWAY_WALL = 50;
export const PRINTER_FLOOR = 51;
export const PRINTER_WALL = 52;

/* ===== Tile-to-color mapping ===== */
export const TILE_COLORS: Record<number, string> = {
  [GRASS]: "#88b058",
  [PATH]: "#d0c878",
  [TREE]: "#507030",
  [FLOWER]: "#c8e0a8",
  [WATER]: "#5898f8",
  [BUILDING]: "#c8c8c8",
  [DOOR]: "#f8d830",
  [SKY]: "#88c8f8",
  [CLOUD]: "#ffffff",
  [WINDOW]: "#5898f8",
  [IN_FLOOR]: "#c0c0d8",
  [IN_WALL]: "#585870",
  [PC_DESK]: "#a0a8b0",
  [CERULEAN_FLOOR]: "#b0b0a0",
  [CERULEAN_WALL]: "#505040",
  [CERULEAN_WATER]: "#4080f0",
  [CERULEAN_STAIRS]: "#e0e0d0",
  [CAVERN_FLOOR]: "#2a1a0a",
  [CAVERN_WALL]: "#1a0a00",
  [CASINO_FLOOR]: "#8b1a1a",
  [CASINO_MACHINE]: "#d4af37",
  [RETRO_FLOOR]: "#008080",
  [RETRO_WALL]: "#404040",
  [TRICK_FLOOR]: "#a0522d",
  [TRICK_TRAP]: "#ff4500",
  [MIRROR_FLOOR]: "#1a1a2e",
  [CLONE_POD]: "#00ff88",
  [LOGIN_FLOOR]: "#e8e8e8",
  [LOGIN_DESK]: "#6a6a8a",
  [CRYO_FLOOR]: "#193044",
  [CRYO_WALL]: "#0a1622",
  [SUBWAY_PLATFORM]: "#3a3a4a",
  [SUBWAY_TRACK]: "#24242d",
  [SUBWAY_WALL]: "#171724",
  [PRINTER_FLOOR]: "#2d2a2f",
  [PRINTER_WALL]: "#18161b",
};

/* ===== Tile rendering size ===== */
export const TILE_SIZE = 12;
export const VIEW_ROWS = 12;

/* ===== Walkability helpers ===== */
export function isWalkableOutside(tile: number): boolean {
  return tile === GRASS || tile === PATH || tile === FLOWER || tile === DOOR || tile === KEY;
}

export function isWalkableInside(tile: number): boolean {
  return (
    tile === IN_FLOOR ||
    tile === DOOR ||
    tile === ROCKET_FLOOR ||
    tile === CYBER_FLOOR ||
    tile === GLITCH_TILE ||
    tile === POKEBALL_FLOOR ||
    tile === VAT_BG ||
    tile === CERULEAN_FLOOR ||
    tile === CERULEAN_STAIRS ||
    tile === CAVERN_FLOOR ||
    tile === CASINO_FLOOR ||
    tile === RETRO_FLOOR ||
    tile === TRICK_FLOOR ||
    tile === MIRROR_FLOOR ||
    tile === LOGIN_FLOOR ||
    tile === CRYO_FLOOR ||
    tile === SUBWAY_PLATFORM ||
    tile === SUBWAY_TRACK ||
    tile === PRINTER_FLOOR
  );
}

export function isWalkable(tile: number, scene: "OUTSIDE" | "INSIDE"): boolean {
  return scene === "OUTSIDE" ? isWalkableOutside(tile) : isWalkableInside(tile);
}

export function isDoor(tile: number): boolean {
  return tile === DOOR;
}

export function isInteractiveTile(tile: number, scene: "OUTSIDE" | "INSIDE"): boolean {
  return (
    tile === DOOR ||
    tile === PC_DESK ||
    tile === BOSS_DESK ||
    tile === ROCKET_CRATE ||
    tile === CYBER_WALL ||
    tile === GLITCH_WALL ||
    tile === KEY ||
    tile === TREE ||
    tile === WATER ||
    tile === CASINO_MACHINE ||
    tile === TRICK_TRAP ||
    tile === CLONE_POD ||
    tile === LOGIN_DESK ||
    tile === CAVERN_WALL ||
    isWalkable(tile, scene)
  );
}
