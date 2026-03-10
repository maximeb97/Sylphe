"use client";

import { useEffect, useState, useRef } from "react";
import { TEAM_ROCKET_SPRITE, NEUTRAL_NPC_SPRITE } from "./PixelSprite";

// Tile types
const GRASS = 0;
const PATH = 1;
const TREE = 2;
const FLOWER = 3;
const WATER = 4;
const BUILDING = 5;
const DOOR = 6;
const SKY = 7;
const CLOUD = 8;
const WINDOW = 10;
const IN_FLOOR = 11;
const IN_WALL = 12;
const PC_DESK = 13;

const TILE_COLORS: Record<number, string> = {
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

const OUTSIDE_MAP: number[][] = [];
// 0-3: Sky
OUTSIDE_MAP.push([7, 7, 7, 8, 8, 7, 7, 7, 7, 8, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7]);
OUTSIDE_MAP.push([7, 7, 8, 8, 8, 8, 7, 7, 8, 8, 8, 7, 7, 8, 8, 8, 8, 7, 7, 7]);
OUTSIDE_MAP.push([7, 8, 8, 7, 7, 8, 7, 8, 8, 7, 8, 8, 8, 8, 7, 7, 8, 8, 7, 7]);
OUTSIDE_MAP.push([7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]);

// 4-22: Building
for (let i = 0; i < 19; i++) {
  if (i % 3 === 0) {
    OUTSIDE_MAP.push([7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7]);
  } else {
    OUTSIDE_MAP.push([7, 7, 7, 5, 10, 10, 10, 5, 10, 10, 10, 5, 10, 10, 10, 5, 5, 7, 7, 7]);
  }
}

OUTSIDE_MAP.push([7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7]);
OUTSIDE_MAP.push([7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7]);
OUTSIDE_MAP.push([2, 2, 5, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2]);

// Ground
OUTSIDE_MAP.push([2, 0, 0, 0, 3, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 3, 0, 2, 2, 2]);
OUTSIDE_MAP.push([0, 0, 3, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0]);
OUTSIDE_MAP.push([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
OUTSIDE_MAP.push([0, 3, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 3, 0, 0, 0]);
OUTSIDE_MAP.push([4, 4, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4]);
OUTSIDE_MAP.push([4, 4, 4, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4]);

const INSIDE_MAP: number[][] = [
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  [12, 12, 12, 12, 13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
];


export default function TileMap({
  className = "",
  onInteractPC,
}: {
  className?: string;
  onInteractPC?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<"OUTSIDE" | "INSIDE">("OUTSIDE");

  const [player, setPlayer] = useState({ x: 14, y: 29, sprite: NEUTRAL_NPC_SPRITE });
  const playerRef = useRef(player);

  const [npcs, setNpcs] = useState([
    { id: "rocket_guard", x: 7, y: 26, sprite: TEAM_ROCKET_SPRITE, type: "static", scene: "OUTSIDE" },
    { id: "rocket_patrol", x: 4, y: 28, sprite: TEAM_ROCKET_SPRITE, type: "wander", scene: "OUTSIDE" },
  ]);
  const npcsRef = useRef(npcs);
  const frameRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const sceneRef = useRef(scene);

  useEffect(() => {
    npcsRef.current = npcs;
  }, [npcs]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TILE = 12;
    const VIEW_WIDTH = OUTSIDE_MAP[0].length * TILE;
    const VIEW_HEIGHT = 12 * TILE; // Show 12 rows at a time

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    const drawSprite = (ctx: CanvasRenderingContext2D, sprite: string[][], x: number, y: number, offsetBob: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(x + 2, y + 10, 8, 2); // Shadow

      const pxSize = 1.33; // ~12 / 9
      for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
          if (sprite[r][c] !== ".") {
            ctx.fillStyle = sprite[r][c];
            ctx.fillRect(x + c * pxSize, y + r * pxSize - 2 + offsetBob, pxSize, pxSize);
          }
        }
      }
    };

    const draw = () => {
      frameRef.current++;
      const frame = frameRef.current;
      const currentMap = sceneRef.current === "OUTSIDE" ? OUTSIDE_MAP : INSIDE_MAP;

      // Calculate camera pan for outside only
      let cameraY = 0;
      if (sceneRef.current === "OUTSIDE") {
        const MAX_CAM_Y = (currentMap.length - 12) * TILE;
        const HOLD_FRAMES = 80;
        const PAN_FRAMES = 120;

        if (frame < HOLD_FRAMES) {
          cameraY = 0;
        } else if (frame < HOLD_FRAMES + PAN_FRAMES) {
          const progress = (frame - HOLD_FRAMES) / PAN_FRAMES;
          const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          cameraY = ease * MAX_CAM_Y;
        } else {
          cameraY = MAX_CAM_Y;
        }
      }

      ctx.fillStyle = sceneRef.current === "OUTSIDE" ? "#88c8f8" : "#000000"; // Sky default or dark
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(0, -cameraY);

      // Draw tiles
      for (let y = 0; y < currentMap.length; y++) {
        // Optimization: Only render visible rows
        if (y * TILE < cameraY - TILE || y * TILE > cameraY + VIEW_HEIGHT + TILE) continue;

        for (let x = 0; x < currentMap[y].length; x++) {
          const tile = currentMap[y][x];
          ctx.fillStyle = TILE_COLORS[tile];
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

          // Add detail to tiles
          if (tile === GRASS) {
            // Grass blades
            if ((x + y) % 3 === 0) {
              ctx.fillStyle = "#78a048";
              ctx.fillRect(x * TILE + 2, y * TILE + 4, 2, 2);
              ctx.fillRect(x * TILE + 7, y * TILE + 8, 2, 2);
            }
          } else if (tile === TREE) {
            ctx.fillStyle = "#385020";
            ctx.fillRect(x * TILE + 2, y * TILE + 2, 8, 6);
            ctx.fillStyle = "#68a040";
            ctx.fillRect(x * TILE + 3, y * TILE + 3, 6, 4);
            ctx.fillStyle = "#604020";
            ctx.fillRect(x * TILE + 5, y * TILE + 8, 2, 4);
          } else if (tile === FLOWER) {
            ctx.fillStyle = "#88b058";
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            const flowerColor = (x + y) % 2 === 0 ? "#f85858" : "#f8d830";
            ctx.fillStyle = flowerColor;
            const bobY = Math.sin(frame * 0.05 + x * 0.5) * 1;
            ctx.fillRect(x * TILE + 4, y * TILE + 3 + bobY, 4, 4);
            ctx.fillStyle = "#507030";
            ctx.fillRect(x * TILE + 5, y * TILE + 7, 2, 3);
          } else if (tile === WATER) {
            const shade = Math.sin(frame * 0.08 + x * 0.3 + y * 0.3) > 0 ? "#4888e8" : "#68a8f8";
            ctx.fillStyle = shade;
            ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
            ctx.fillStyle = "#88c8f8";
            const waveX = (frame * 0.3 + x * 3) % TILE;
            ctx.fillRect(x * TILE + waveX, y * TILE + 3, 3, 1);
          } else if (tile === BUILDING) {
            ctx.fillStyle = "#b0b0b0";
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
          } else if (tile === WINDOW) {
            ctx.fillStyle = "#b0b0b0";
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
            // specific window details
            ctx.fillStyle = "#5898f8";
            ctx.fillRect(x * TILE + 3, y * TILE + 3, 6, 6);
            ctx.fillStyle = "#384030";
            ctx.fillRect(x * TILE + 3, y * TILE + 5, 6, 1);
            ctx.fillRect(x * TILE + 5, y * TILE + 3, 1, 6);
          } else if (tile === DOOR) {
            ctx.fillStyle = "#b0b0b0";
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            const glow = Math.sin(frame * 0.06) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(248, 216, 48, ${glow})`;
            ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
          } else if (tile === PATH) {
            ctx.fillStyle = "#c0b868";
            if ((x + y) % 4 === 0) {
              ctx.fillRect(x * TILE + 3, y * TILE + 3, 2, 2);
            }
          } else if (tile === IN_WALL) {
            ctx.fillStyle = "#585870";
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            ctx.fillStyle = "#484860";
            ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
          } else if (tile === IN_FLOOR) {
            ctx.fillStyle = "#c0c0d8";
            // Checkered pattern
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = "#b0b0c8";
            }
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
          } else if (tile === PC_DESK) {
            // Desk shape
            ctx.fillStyle = "#a89078";
            ctx.fillRect(x * TILE, y * TILE + 4, TILE, 8);
            // PC Monitor
            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(x * TILE + 2, y * TILE - 2, 8, 6);
            // PC Screen
            ctx.fillStyle = "#384030";
            ctx.fillRect(x * TILE + 3, y * TILE - 1, 6, 4);
            // Random blinking pixel on screen
            if (Math.sin(frame * 0.2) > 0) {
              ctx.fillStyle = "#88b058";
              ctx.fillRect(x * TILE + 4, y * TILE, 2, 2);
            }
          }

          // Grid lines
          if (tile !== SKY && tile !== CLOUD && tile !== IN_WALL) {
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
            ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
          }
        }
      }

      // Draw Player
      const playerY = playerRef.current.y * TILE;
      if (playerY >= cameraY - TILE * 2 && playerY <= cameraY + VIEW_HEIGHT + TILE * 2) {
        drawSprite(ctx, playerRef.current.sprite, playerRef.current.x * TILE, playerY, 0);
      }

      // Draw NPCs for current scene
      npcsRef.current.forEach(npc => {
        if (npc.scene !== sceneRef.current) return;

        const npcY = npc.y * TILE;
        // Only render if visible
        if (npcY >= cameraY - TILE * 2 && npcY <= cameraY + VIEW_HEIGHT + TILE * 2) {
          const bob = npc.type === 'wander' ? Math.sin(frame * 0.1 + npc.x) * 1 : 0;
          drawSprite(ctx, npc.sprite, npc.x * TILE, npcY, bob);
        }
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);
  // Player Movement Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentMap = scene === "OUTSIDE" ? OUTSIDE_MAP : INSIDE_MAP;
      let { x, y } = playerRef.current;

      if (e.key === "ArrowUp" || e.key === "w") y -= 1;
      else if (e.key === "ArrowDown" || e.key === "s") y += 1;
      else if (e.key === "ArrowLeft" || e.key === "a") x -= 1;
      else if (e.key === "ArrowRight" || e.key === "d") x += 1;
      else return;

      const inBounds = y >= 0 && y < currentMap.length && x >= 0 && x < currentMap[0].length;
      if (!inBounds) return;

      const tile = currentMap[y][x];
      const walkableOutside = tile === GRASS || tile === PATH || tile === FLOWER || tile === DOOR;
      const walkableInside = tile === IN_FLOOR;
      const walkable = scene === "OUTSIDE" ? walkableOutside : walkableInside;

      if (walkable) {
        // Door transition
        if (scene === "OUTSIDE" && tile === DOOR) {
          setScene("INSIDE");
          setPlayer({ ...playerRef.current, x: 9, y: 10 }); // Teleport point inside
        } else {
          setPlayer({ ...playerRef.current, x, y });
        }
      }

      // Action / PC interaction
      if (scene === "INSIDE" && tile === PC_DESK && onInteractPC) {
        if (Math.abs(playerRef.current.x - x) <= 1 && Math.abs(playerRef.current.y - y) <= 1) {
          onInteractPC();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scene, onInteractPC]);

  // Click Movement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const drawX = (e.clientX - rect.left) * scaleX;
    let drawY = (e.clientY - rect.top) * scaleY;

    // Add back the camera offset if outside
    if (scene === "OUTSIDE") {
      const MAX_CAM_Y = (OUTSIDE_MAP.length - 12) * 12;
      const isPanFinished = frameRef.current >= 200;
      drawY += isPanFinished ? MAX_CAM_Y : 0;
    }

    const clickedX = Math.floor(drawX / 12);
    const clickedY = Math.floor(drawY / 12);

    const currentMap = scene === "OUTSIDE" ? OUTSIDE_MAP : INSIDE_MAP;
    const inBounds = clickedY >= 0 && clickedY < currentMap.length && clickedX >= 0 && clickedX < currentMap[0].length;

    if (inBounds) {
      const tile = currentMap[clickedY][clickedX];

      // PC Interaction check on click
      if (scene === "INSIDE" && tile === PC_DESK && onInteractPC) {
        // Only if relatively close
        if (Math.abs(playerRef.current.x - clickedX) <= 1 && Math.abs(playerRef.current.y - clickedY) <= 1) {
          onInteractPC();
        }
      }

      const walkable = scene === "OUTSIDE" ? (tile === GRASS || tile === PATH || tile === FLOWER || tile === DOOR) : (tile === IN_FLOOR);

      if (walkable) {
        if (scene === "OUTSIDE" && tile === DOOR) {
          setScene("INSIDE");
          setPlayer({ ...playerRef.current, x: 9, y: 10 });
        } else {
          setPlayer({ ...playerRef.current, x: clickedX, y: clickedY });
        }
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handleCanvasClick}
      className={`w-full h-auto ${className} cursor-pointer`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
