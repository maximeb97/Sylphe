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
};

/* ===== Tile rendering size ===== */
export const TILE_SIZE = 12;
export const VIEW_ROWS = 12;

/* ===== Walkability helpers ===== */
export function isWalkableOutside(tile: number): boolean {
  return tile === GRASS || tile === PATH || tile === FLOWER || tile === DOOR || tile === KEY;
}

export function isWalkableInside(tile: number): boolean {
  return tile === IN_FLOOR || tile === DOOR;
}

export function isWalkable(tile: number, scene: "OUTSIDE" | "INSIDE"): boolean {
  return scene === "OUTSIDE" ? isWalkableOutside(tile) : isWalkableInside(tile);
}

export function isDoor(tile: number): boolean {
  return tile === DOOR;
}

export function isInteractiveTile(tile: number, scene: "OUTSIDE" | "INSIDE"): boolean {
  return tile === DOOR || tile === PC_DESK || tile === KEY || tile === TREE || tile === WATER || isWalkable(tile, scene);
}
