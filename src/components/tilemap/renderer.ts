import {
  GRASS,
  TREE,
  FLOWER,
  WATER,
  BUILDING,
  WINDOW,
  DOOR,
  PATH,
  IN_WALL,
  IN_FLOOR,
  PC_DESK,
  SKY,
  CLOUD,
  KEY,
  TILE_COLORS,
  TILE_SIZE,
  ROCKET_FLOOR,
  ROCKET_CRATE,
  BOSS_DESK,
  CYBER_FLOOR,
  CYBER_WALL,
  GLITCH_TILE,
  GLITCH_WALL,
  VAT_BG,
  POKEBALL_FLOOR,
  POKEBALL_WALL,
  CERULEAN_FLOOR,
  CERULEAN_WALL,
  CERULEAN_WATER,
  CERULEAN_STAIRS,
  CRYO_FLOOR,
  CRYO_WALL,
  SUBWAY_PLATFORM,
  SUBWAY_TRACK,
  SUBWAY_WALL,
  PRINTER_FLOOR,
  PRINTER_WALL,
} from "./tiles";

const TILE = TILE_SIZE;

/**
 * Draws all tile details for a single cell.
 */
export function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  x: number,
  y: number,
  frame: number,
  season: "Winter" | "Spring" | "Summer" | "Autumn" = "Spring"
) {
  // Base color
  let baseColor = TILE_COLORS[tile] || "#000000";
  if (season === "Winter") {
    if (tile === GRASS || tile === FLOWER || tile === TREE || tile === KEY) baseColor = "#f0f8ff";
    else if (tile === PATH) baseColor = "#e0e8f0";
  } else if (season === "Autumn") {
    if (tile === GRASS || tile === FLOWER || tile === TREE || tile === KEY) baseColor = "#c8a060";
    else if (tile === PATH) baseColor = "#d8c090";
  } else if (season === "Summer") {
    if (tile === GRASS || tile === FLOWER || tile === TREE || tile === KEY) baseColor = "#98d898";
    else if (tile === PATH) baseColor = "#d8c090";
  }

  ctx.fillStyle = baseColor;
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

  switch (tile) {
    case GRASS:
      if ((x + y) % 3 === 0) {
        ctx.fillStyle =
          season === "Winter"
            ? "#d0d8e0"
            : season === "Autumn"
              ? "#a88040"
              : "#78a048";
        ctx.fillRect(x * TILE + 2, y * TILE + 4, 2, 2);
        ctx.fillRect(x * TILE + 7, y * TILE + 8, 2, 2);
      }
      break;

    case TREE:
      ctx.fillStyle =
        season === "Winter"
          ? "#d0d8e0"
          : season === "Autumn"
            ? "#884010"
            : "#385020";
      ctx.fillRect(x * TILE + 2, y * TILE + 2, 8, 6);
      ctx.fillStyle =
        season === "Winter"
          ? "#ffffff"
          : season === "Autumn"
            ? "#c86018"
            : "#68a040";
      ctx.fillRect(x * TILE + 3, y * TILE + 3, 6, 4);
      ctx.fillStyle = "#604020";
      ctx.fillRect(x * TILE + 5, y * TILE + 8, 2, 4);
      break;

    case FLOWER: {
      const flowerColor =
        season === "Winter"
          ? "#a0d0f0"
          : (x + y) % 2 === 0
            ? "#f85858"
            : "#f8d830";
      ctx.fillStyle = flowerColor;
      const bobY = Math.sin(frame * 0.05 + x * 0.5) * 1;
      ctx.fillRect(x * TILE + 4, y * TILE + 3 + bobY, 4, 4);
      ctx.fillStyle =
        season === "Winter"
          ? "#c0d0e0"
          : season === "Autumn"
            ? "#a88040"
            : "#507030";
      ctx.fillRect(x * TILE + 5, y * TILE + 7, 2, 3);
      break;
    }

    case KEY: {
      const bobY = Math.sin(frame * 0.05 + x * 0.5) * 1;
      ctx.fillStyle = "#FFD700"; // gold
      ctx.fillRect(x * TILE + 3, y * TILE + 5 + bobY, 6, 2);
      ctx.fillRect(x * TILE + 2, y * TILE + 4 + bobY, 2, 4);
      let holeColor = "#88b058";
      if (season === "Winter") holeColor = "#f0f8ff";
      else if (season === "Autumn") holeColor = "#c8a060";
      ctx.fillStyle = holeColor;
      ctx.fillRect(x * TILE + 2, y * TILE + 5 + bobY, 1, 2);
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(x * TILE + 6, y * TILE + 7 + bobY, 1, 2);
      ctx.fillRect(x * TILE + 8, y * TILE + 7 + bobY, 1, 2);
      break;
    }

    case WATER: {
      const shade =
        Math.sin(frame * 0.08 + x * 0.3 + y * 0.3) > 0 ? "#4888e8" : "#68a8f8";
      ctx.fillStyle = shade;
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = "#88c8f8";
      const waveX = (frame * 0.3 + x * 3) % TILE;
      ctx.fillRect(x * TILE + waveX, y * TILE + 3, 3, 1);
      break;
    }

    case BUILDING:
      ctx.fillStyle = "#b0b0b0";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;

    case WINDOW:
      ctx.fillStyle = "#b0b0b0";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = "#5898f8";
      ctx.fillRect(x * TILE + 3, y * TILE + 3, 6, 6);
      ctx.fillStyle = "#384030";
      ctx.fillRect(x * TILE + 3, y * TILE + 5, 6, 1);
      ctx.fillRect(x * TILE + 5, y * TILE + 3, 1, 6);
      break;

    case DOOR: {
      ctx.fillStyle = "#b0b0b0";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      const glow = Math.sin(frame * 0.06) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(248, 216, 48, ${glow})`;
      ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
      break;
    }

    case PATH:
      ctx.fillStyle = "#c0b868";
      if ((x + y) % 4 === 0) {
        ctx.fillRect(x * TILE + 3, y * TILE + 3, 2, 2);
      }
      break;

    case IN_WALL:
      ctx.fillStyle = "#585870";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#484860";
      ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
      break;

    case IN_FLOOR:
      ctx.fillStyle = (x + y) % 2 === 0 ? "#b0b0c8" : "#c0c0d8";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;

    case PC_DESK:
      // Desk
      ctx.fillStyle = "#a89078";
      ctx.fillRect(x * TILE, y * TILE + 4, TILE, 8);
      // Desk highlight
      ctx.fillStyle = "#b8a088";
      ctx.fillRect(x * TILE + 1, y * TILE + 5, TILE - 2, 2);
      // Monitor body
      ctx.fillStyle = "#d0d0d0";
      ctx.fillRect(x * TILE + 1, y * TILE - 3, 10, 7);
      // Monitor bezel
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(x * TILE + 2, y * TILE - 2, 8, 5);
      // Screen
      ctx.fillStyle = "#0a2a0a";
      ctx.fillRect(x * TILE + 3, y * TILE - 1, 6, 4);
      // Blinking cursor / screen content
      if (Math.sin(frame * 0.15) > 0) {
        ctx.fillStyle = "#33ff33";
        ctx.fillRect(x * TILE + 4, y * TILE, 2, 1);
      }
      if (Math.sin(frame * 0.15 + 1) > 0) {
        ctx.fillStyle = "#33ff33";
        ctx.fillRect(x * TILE + 4, y * TILE + 1, 4, 1);
      }
      // Screen glow
      ctx.fillStyle = `rgba(51, 255, 51, ${0.05 + Math.sin(frame * 0.08) * 0.03})`;
      ctx.fillRect(x * TILE + 2, y * TILE - 3, 8, 8);
      // Monitor stand
      ctx.fillStyle = "#a0a0a0";
      ctx.fillRect(x * TILE + 5, y * TILE + 3, 2, 2);
      break;

    case ROCKET_FLOOR:
      // Subtle pulse
      const rPulse = Math.sin(frame * 0.05) * 5;
      ctx.fillStyle =
        (x + y) % 2 === 0
          ? `rgb(${26 + rPulse}, ${26}, ${26})`
          : `rgb(${34 + rPulse}, ${34}, ${34})`;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;
    case ROCKET_CRATE:
      ctx.fillStyle = "#3a2a1a";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#503a20";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;
    case BOSS_DESK:
      ctx.fillStyle = "#400000";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#ff3333";
      ctx.fillRect(
        x * TILE + 1,
        y * TILE + Math.sin(frame * 0.1) * 2 + 5,
        2,
        2,
      );
      break;
    case CYBER_FLOOR: {
      // Dynamic color shifting blue/red as requested
      const phase = Math.sin(frame * 0.05 + x * 0.5 + y * 0.5);
      const r = Math.floor(128 + 127 * phase);
      const b = Math.floor(128 - 127 * phase);
      ctx.fillStyle = `rgba(${r}, 0, ${b}, 0.2)`;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

      ctx.strokeStyle =
        phase > 0 ? "rgba(255, 0, 85, 0.4)" : "rgba(0, 255, 255, 0.4)";
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
      break;
    }
    case CYBER_WALL:
      ctx.fillStyle =
        Math.random() > 0.05
          ? Math.sin(frame * 0.05 + y) > 0
            ? "#00ffff"
            : "#ff0055"
          : "#ffffff";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;
    case GLITCH_TILE:
    case GLITCH_WALL:
      ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if (Math.random() > 0.8) {
        ctx.fillStyle = Math.random() > 0.5 ? "magenta" : "cyan";
        ctx.fillRect(
          x * TILE + Math.random() * TILE,
          y * TILE + Math.random() * TILE,
          4,
          4,
        );
      }
      break;
    case VAT_BG:
      ctx.fillStyle = "#005533";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;
    case POKEBALL_FLOOR:
    case POKEBALL_WALL: {
      const isWall = tile === POKEBALL_WALL;
      // Fixed bottom tiles to be white/gray instead of red if requested
      let color = "#ffffff";
      if (y < 5) color = "#cc0000";
      else if (y === 5 || y === 6) color = "#000000";

      if (isWall) {
        if (y < 5) color = "#880000";
        else if (y === 5 || y === 6) color = "#222222";
        else color = "#aaaaaa";
      }

      ctx.fillStyle = color;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

      // Button animation
      if (y >= 4 && y <= 7 && x >= 8 && x <= 11) {
        const isCenter = (y === 5 || y === 6) && (x === 9 || x === 10);
        if (isCenter && Math.sin(frame * 0.1) > 0) {
          ctx.fillStyle = "#ffaaaa"; // pulsing button
        } else {
          ctx.fillStyle = isCenter ? "#ffffff" : "#000000";
        }
        if (!((x === 8 || x === 11) && (y === 4 || y === 7))) {
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
      }
      break;
    }

    case CERULEAN_FLOOR:
      ctx.fillStyle = (x + y) % 5 === 0 ? "#a8a898" : "#b0b0a0";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;

    case CERULEAN_WALL:
      ctx.fillStyle = "#404030";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#505040";
      ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
      break;

    case CERULEAN_WATER: {
      const wShade = Math.sin(frame * 0.1 + x) > 0 ? "#3070e0" : "#4080f0";
      ctx.fillStyle = wShade;
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      break;
    }

    case CERULEAN_STAIRS:
      ctx.fillStyle = "#c0c0b0";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#606050";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x * TILE + 1, y * TILE + 2 + i * 2, TILE - 2, 1);
      }
      break;

    case CRYO_FLOOR:
      ctx.fillStyle = (x + y) % 2 === 0 ? "#1b364b" : "#203d54";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = `rgba(176, 230, 255, ${0.08 + Math.max(0, Math.sin(frame * 0.05 + x * 0.4 + y * 0.3)) * 0.1})`;
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;

    case CRYO_WALL:
      ctx.fillStyle = "#081521";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#123047";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = "rgba(180, 240, 255, 0.12)";
      ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, 1);
      break;

    case SUBWAY_PLATFORM:
      ctx.fillStyle = (x + y) % 2 === 0 ? "#383847" : "#404050";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "rgba(130, 130, 170, 0.18)";
      ctx.fillRect(x * TILE, y * TILE + TILE - 3, TILE, 2);
      break;

    case SUBWAY_TRACK:
      ctx.fillStyle = "#23232d";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#56566b";
      ctx.fillRect(x * TILE + 1, y * TILE + 3, TILE - 2, 1);
      ctx.fillRect(x * TILE + 1, y * TILE + TILE - 4, TILE - 2, 1);
      ctx.fillStyle = "#353542";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x * TILE + 2 + i * 3, y * TILE + 4, 1, TILE - 8);
      }
      break;

    case SUBWAY_WALL:
      ctx.fillStyle = "#14141f";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#222232";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;

    case PRINTER_FLOOR:
      ctx.fillStyle = (x + y) % 2 === 0 ? "#2d2930" : "#342f37";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;

    case PRINTER_WALL:
      ctx.fillStyle = "#17141a";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      ctx.fillStyle = "#231f27";
      ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
      break;
  }

  // Subtle grid lines (skip sky/cloud/wall/cyber)
  if (
    tile !== SKY &&
    tile !== CLOUD &&
    tile !== IN_WALL &&
    tile !== CYBER_FLOOR &&
    tile !== POKEBALL_WALL &&
    tile !== GLITCH_WALL &&
    tile !== CRYO_WALL &&
    tile !== SUBWAY_WALL &&
    tile !== PRINTER_WALL
  ) {
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
  }
}

/**
 * Draws a sprite on the canvas.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string[][],
  x: number,
  y: number,
  offsetBob: number
) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x + 2, y + 10, 8, 2);

  const pxSize = 1.33; // ~12 / 9
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      if (sprite[r][c] !== ".") {
        ctx.fillStyle = sprite[r][c];
        ctx.fillRect(x + c * pxSize, y + r * pxSize - 2 + offsetBob, pxSize, pxSize);
      }
    }
  }
}
