"use client";

import { useEffect, useState, useRef } from "react";
import { isWalkableInside, isInteractiveTile, TILE_SIZE, DOOR, WATER, PC_DESK } from "./tiles";
import { drawTile, drawSprite } from "./renderer";
import { findPath, Point } from "./pathfinding";

const TILE = TILE_SIZE;

export type CustomNPC = {
  id: string;
  x: number;
  y: number;
  sprite: string[][];
  type: "static" | "wander";
};

export default function CustomMapCanvas({
  className = "",
  mapData,
  npcs = [],
  playerSprite,
  initialPlayerX,
  initialPlayerY,
  season = "Spring",
  onInteract,
  onPlayerMove,
  onShowDialog,
}: {
  className?: string;
  mapData: number[][];
  npcs?: CustomNPC[];
  playerSprite: string[][];
  initialPlayerX: number;
  initialPlayerY: number;
  season?: "Winter" | "Spring" | "Summer" | "Autumn";
  onInteract?: (tile: number, x: number, y: number, npcId?: string) => void;
  onPlayerMove?: (x: number, y: number) => void;
  onShowDialog?: (text: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState({ x: initialPlayerX, y: initialPlayerY });
  const playerRef = useRef(player);
  const moveQueueRef = useRef<Point[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<Point | null>(null);
  const pendingInteractionRef = useRef<(() => void) | null>(null);

  const frameRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [bikeMode, setBikeMode] = useState(false);
  const [noclipMode, setNoclipMode] = useState(false);

  useEffect(() => {
    setPlayer({ x: initialPlayerX, y: initialPlayerY });
  }, [initialPlayerX, initialPlayerY]);

  useEffect(() => {
    const checkBike = () => setBikeMode(localStorage.getItem("sylphe_bike") === "true");
    checkBike();
    window.addEventListener("storage", checkBike);

    const toggleNoclip = () => setNoclipMode(true);
    window.addEventListener("sylphe_noclip_toggle", toggleNoclip);

    return () => {
      window.removeEventListener("storage", checkBike);
      window.removeEventListener("sylphe_noclip_toggle", toggleNoclip);
    };
  }, []);

  useEffect(() => { playerRef.current = player; }, [player]);

  // ── Helpers ────────────────────────────────────────────────
  const screenToTile = (clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return {
      x: Math.floor(((clientX - rect.left) * sx) / TILE),
      y: Math.floor(((clientY - rect.top) * sy) / TILE)
    };
  };

  // ── Auto-walk interval ────────────────────────────────────
  useEffect(() => {
    if (!isMoving) return;
    const step = () => {
      const queue = moveQueueRef.current;
      if (queue.length === 0) { setIsMoving(false); return; }

      const next = queue[0];
      setPlayer({ x: next.x, y: next.y });
      if (onPlayerMove) onPlayerMove(next.x, next.y);

      moveQueueRef.current = queue.slice(1);
      if (moveQueueRef.current.length === 0) {
        setIsMoving(false);
        if (pendingInteractionRef.current) {
          const cb = pendingInteractionRef.current;
          pendingInteractionRef.current = null;
          cb();
        }
      } else {
        animFrameRef.current = window.setTimeout(() => { step(); }, bikeMode ? 60 : 150);
      }
    };
    step();
    return () => clearTimeout(animFrameRef.current);
  }, [isMoving, bikeMode, onPlayerMove]);

  // ── Canvas render loop ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!mapData || mapData.length === 0) return;
    const viewW = mapData[0].length * TILE;
    const viewH = mapData.length * TILE;
    canvas.width = viewW;
    canvas.height = viewH;

    const render = () => {
      frameRef.current++;
      const frame = frameRef.current;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tiles
      for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
          drawTile(ctx, mapData[y][x], x, y, frame, season);
        }
      }

      // Player
      drawSprite(ctx, playerSprite, playerRef.current.x * TILE, playerRef.current.y * TILE, 0);

      // NPCs
      npcs.forEach(npc => {
        const bob = npc.type === "wander" ? Math.sin(frame * 0.1 + npc.x) * 1 : 0;
        drawSprite(ctx, npc.sprite, npc.x * TILE, npc.y * TILE, bob);
      });

      animFrameRef.current = window.requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [mapData, npcs, playerSprite, season]);

  // ── Keyboard controls ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (!mapData || mapData.length === 0) return;

      let { x, y } = playerRef.current;
      if (e.key === "ArrowUp" || e.key === "w") y -= 1;
      else if (e.key === "ArrowDown" || e.key === "s") y += 1;
      else if (e.key === "ArrowLeft" || e.key === "a") x -= 1;
      else if (e.key === "ArrowRight" || e.key === "d") x += 1;
      else return;

      if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[0].length) return;

      const targetNpc = npcs.find(npc => npc.x === x && npc.y === y);
      if (targetNpc) {
        if (onInteract) onInteract(-1, x, y, targetNpc.id);
        return;
      }

      const tile = mapData[y][x];
      // Use isWalkableInside blindly as simple check since it covers custom floors
      if (!noclipMode && !isWalkableInside(tile)) {
        if (onInteract) onInteract(tile, x, y);
        return;
      }

      setPlayer({ x, y });
      if (onPlayerMove) onPlayerMove(x, y);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapData, npcs, onInteract, noclipMode, onPlayerMove]);

  // ── Click handler ─────────────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = screenToTile(e.clientX, e.clientY);
    if (!pt || !mapData || mapData.length === 0) return;
    if (pt.y < 0 || pt.y >= mapData.length || pt.x < 0 || pt.x >= mapData[0].length) return;

    const clickedNpc = npcs.find(npc => npc.x === pt.x && npc.y === pt.y);

    const tile = mapData[pt.y][pt.x];
    if (clickedNpc || !isWalkableInside(tile)) {
      if (!noclipMode) {
        if (Math.abs(playerRef.current.x - pt.x) <= 1 && Math.abs(playerRef.current.y - pt.y) <= 1) {
          if (onInteract) onInteract(tile, pt.x, pt.y, clickedNpc?.id);
          return;
        }

        // walk to adjacent then interact
        const adj = [
          { x: pt.x, y: pt.y + 1 }, { x: pt.x - 1, y: pt.y },
          { x: pt.x + 1, y: pt.y }, { x: pt.x, y: pt.y - 1 }
        ].find(a => a.y >= 0 && a.y < mapData.length && a.x >= 0 && a.x < mapData[0].length && isWalkableInside(mapData[a.y][a.x]));

        if (adj) {
          const path = findPath({ x: playerRef.current.x, y: playerRef.current.y }, adj, mapData, "INSIDE");
          if (path.length > 0) {
            moveQueueRef.current = path;
            pendingInteractionRef.current = () => onInteract && onInteract(tile, pt.x, pt.y, clickedNpc?.id);
            setIsMoving(true);
          }
        }
        return;
      }
    }

    const path = noclipMode
      ? getStraightPath({ x: playerRef.current.x, y: playerRef.current.y }, pt)
      : findPath({ x: playerRef.current.x, y: playerRef.current.y }, pt, mapData, "INSIDE");

    if (path.length > 0) {
      moveQueueRef.current = path;
      if (clickedNpc || (!isWalkableInside(tile) && noclipMode)) {
        pendingInteractionRef.current = () => onInteract && onInteract(tile, pt.x, pt.y, clickedNpc?.id);
      }
      setIsMoving(true);
    }
  };

  const getStraightPath = (start: Point, end: Point) => {
    const p = [];
    let cx = start.x;
    let cy = start.y;
    while (cx !== end.x || cy !== end.y) {
      if (cx < end.x) cx++;
      else if (cx > end.x) cx--;
      else if (cy < end.y) cy++;
      else if (cy > end.y) cy--;
      p.push({ x: cx, y: cy });
    }
    return p;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setHoveredTile(screenToTile(e.clientX, e.clientY));
  };

  const cursorClass = (() => {
    if (!hoveredTile || !mapData || mapData.length === 0) return "cursor-pixel";
    if (hoveredTile.y < 0 || hoveredTile.y >= mapData.length || hoveredTile.x < 0 || hoveredTile.x >= mapData[0].length) return "cursor-pixel";
    const npcHovered = npcs.some(npc => npc.x === hoveredTile.x && npc.y === hoveredTile.y);
    if (npcHovered) return "cursor-pointer-pixel";
    // Check if tile is interactive
    const tile = mapData[hoveredTile.y][hoveredTile.x];
    if (!isWalkableInside(tile)) return "cursor-pointer-pixel"; // simplify
    return "cursor-pixel";
  })();

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredTile(null)}
      className={`w-full h-auto ${className} ${cursorClass}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
