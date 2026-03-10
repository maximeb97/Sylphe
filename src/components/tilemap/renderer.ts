import {
  GRASS, TREE, FLOWER, WATER, BUILDING, WINDOW, DOOR,
  PATH, IN_WALL, IN_FLOOR, PC_DESK, SKY, CLOUD,
  TILE_COLORS, TILE_SIZE,
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
  frame: number
) {
  // Base color
  ctx.fillStyle = TILE_COLORS[tile];
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

  switch (tile) {
    case GRASS:
      if ((x + y) % 3 === 0) {
        ctx.fillStyle = "#78a048";
        ctx.fillRect(x * TILE + 2, y * TILE + 4, 2, 2);
        ctx.fillRect(x * TILE + 7, y * TILE + 8, 2, 2);
      }
      break;

    case TREE:
      ctx.fillStyle = "#385020";
      ctx.fillRect(x * TILE + 2, y * TILE + 2, 8, 6);
      ctx.fillStyle = "#68a040";
      ctx.fillRect(x * TILE + 3, y * TILE + 3, 6, 4);
      ctx.fillStyle = "#604020";
      ctx.fillRect(x * TILE + 5, y * TILE + 8, 2, 4);
      break;

    case FLOWER: {
      ctx.fillStyle = "#88b058";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      const flowerColor = (x + y) % 2 === 0 ? "#f85858" : "#f8d830";
      ctx.fillStyle = flowerColor;
      const bobY = Math.sin(frame * 0.05 + x * 0.5) * 1;
      ctx.fillRect(x * TILE + 4, y * TILE + 3 + bobY, 4, 4);
      ctx.fillStyle = "#507030";
      ctx.fillRect(x * TILE + 5, y * TILE + 7, 2, 3);
      break;
    }

    case WATER: {
      const shade = Math.sin(frame * 0.08 + x * 0.3 + y * 0.3) > 0 ? "#4888e8" : "#68a8f8";
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
  }

  // Subtle grid lines (skip sky/cloud/wall)
  if (tile !== SKY && tile !== CLOUD && tile !== IN_WALL) {
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
