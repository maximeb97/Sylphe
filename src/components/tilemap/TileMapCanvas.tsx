"use client";

import { useEffect, useState, useRef } from "react";
import { TEAM_ROCKET_SPRITE, NEUTRAL_NPC_SPRITE, GHOST_SPRITE } from "../PixelSprite";
import { OUTSIDE_MAP, INSIDE_MAP } from "./maps";
import { DOOR, PC_DESK, TILE_SIZE, VIEW_ROWS, isWalkable, isInteractiveTile, KEY, GRASS, TREE, WATER } from "./tiles";
import { drawTile, drawSprite } from "./renderer";
import { findPath, Point } from "./pathfinding";

const TILE = TILE_SIZE;

export default function TileMapCanvas({
  className = "",
  onInteractPC,
  onShowDialog,
}: {
  className?: string;
  onInteractPC?: () => void;
  onShowDialog?: (text: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<"OUTSIDE" | "INSIDE">("OUTSIDE");
  const [player, setPlayer] = useState({ x: 14, y: 29, sprite: NEUTRAL_NPC_SPRITE });
  const playerRef = useRef(player);

  const [hasKey, setHasKey] = useState(false);
  const hasKeyRef = useRef(hasKey);
  const [outsideMap, setOutsideMap] = useState<number[][]>(OUTSIDE_MAP);
  const outsideMapRef = useRef(outsideMap);

  // Determine season
  const season = (() => {
    const m = new Date().getMonth();
    if (m === 11 || m <= 1) return "Winter";
    if (m >= 2 && m <= 4) return "Spring";
    if (m >= 5 && m <= 7) return "Summer";
    return "Autumn";
  })();

  useEffect(() => {
    const saved = localStorage.getItem("sylphe_has_key") === "true";
    setHasKey(saved);
    const newMap = OUTSIDE_MAP.map(r => [...r]);
    if (!saved) {
      newMap[29][16] = KEY; // placing key
    }
    setOutsideMap(newMap);
  }, []);

  // Movement
  const moveQueueRef = useRef<Point[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<Point | null>(null);
  const pendingInteractionRef = useRef<(() => void) | null>(null);

  // NPCs
  const npcs = useRef([
    { id: "rocket_guard", x: 7, y: 26, sprite: TEAM_ROCKET_SPRITE, type: "static" as const, scene: "OUTSIDE" as const },
    { id: "rocket_patrol", x: 4, y: 28, sprite: TEAM_ROCKET_SPRITE, type: "wander" as const, scene: "OUTSIDE" as const },
  ]);

  useEffect(() => {
    if (localStorage.getItem("sylphe_silph_scope") === "true") {
      const g1 = npcs.current.find(n => n.id === "ghost1");
      if (!g1) {
        npcs.current.push({ id: "ghost1", x: 14, y: 31, sprite: GHOST_SPRITE, type: "wander", scene: "OUTSIDE" });
        npcs.current.push({ id: "ghost2", x: 4, y: 32, sprite: GHOST_SPRITE, type: "wander", scene: "OUTSIDE" });
      }
    }
  }, []);

  const frameRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const sceneRef = useRef(scene);
  const treeClickCountRef = useRef(0);
  const waterClickCountRef = useRef(0);
  const stepsCountRef = useRef(0);

  const [bikeMode, setBikeMode] = useState(false);
  const [noclipMode, setNoclipMode] = useState(false);

  useEffect(() => {
    stepsCountRef.current = parseInt(localStorage.getItem("sylphe_steps") || "0", 10);

    const checkBike = () => {
      setBikeMode(localStorage.getItem("sylphe_bike") === "true");
    };
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
  useEffect(() => { sceneRef.current = scene; }, [scene]);
  useEffect(() => { hasKeyRef.current = hasKey; }, [hasKey]);
  useEffect(() => { outsideMapRef.current = outsideMap; }, [outsideMap]);

  // ── Helpers ────────────────────────────────────────────────
  const getMap = () => sceneRef.current === "OUTSIDE" ? outsideMapRef.current : INSIDE_MAP;

  const screenToTile = (clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;

    const drawX = (clientX - rect.left) * sx;
    let drawY = (clientY - rect.top) * sy;

    if (sceneRef.current === "OUTSIDE") {
      const maxCamY = (outsideMap.length - VIEW_ROWS) * TILE;
      if (frameRef.current >= 200) drawY += maxCamY;
    }

    return { x: Math.floor(drawX / TILE), y: Math.floor(drawY / TILE) };
  };

  // ── Auto-walk interval ────────────────────────────────────
  useEffect(() => {
    if (!isMoving) return;

    const step = () => {
      const queue = moveQueueRef.current;
      if (queue.length === 0) { setIsMoving(false); return; }

      const next = queue[0];
      const map = getMap();
      const tile = map[next.y]?.[next.x];

      // Key pickup
      if (sceneRef.current === "OUTSIDE" && tile === KEY) {
        setHasKey(true);
        localStorage.setItem("sylphe_has_key", "true");
        setOutsideMap(m => {
          const m2 = m.map(r => [...r]);
          if (m2[next.y]) m2[next.y][next.x] = GRASS;
          return m2;
        });
        if (onShowDialog) {
          onShowDialog("Vous avez trouvé la Carte d'Accès Sylphe Corp ! La porte principale est désormais déverrouillée.");
        }
      }

      // Door transitions
      if (sceneRef.current === "OUTSIDE" && tile === DOOR) {
        if (!hasKeyRef.current) {
          if (onShowDialog) onShowDialog("La porte est fermée... Il faut que je trouve la carte d'accès d'abord.");
          moveQueueRef.current = [];
          setIsMoving(false);
          return;
        }
        setScene("INSIDE");
        setPlayer({ ...playerRef.current, x: 9, y: 10 });
        moveQueueRef.current = [];
        setIsMoving(false);
        return;
      }
      if (sceneRef.current === "INSIDE" && tile === DOOR) {
        setScene("OUTSIDE");
        setPlayer({ ...playerRef.current, x: 9, y: 25 });
        moveQueueRef.current = [];
        setIsMoving(false);
        return;
      }

      setPlayer({ ...playerRef.current, x: next.x, y: next.y });

      // Easter egg: Step counter
      stepsCountRef.current += 1;
      localStorage.setItem("sylphe_steps", stepsCountRef.current.toString());
      if (stepsCountRef.current === 500 && onShowDialog) {
        onShowDialog("DING ! Vous avez fait 500 pas. Le système détecte la fin de votre session dans le Parc Safari... Oh attendez, on n'a plus cette feature.");
      }

      moveQueueRef.current = queue.slice(1);
      if (moveQueueRef.current.length === 0) {
        setIsMoving(false);
        if (pendingInteractionRef.current) {
          const cb = pendingInteractionRef.current;
          pendingInteractionRef.current = null;
          cb();
        }
      } else {
        animFrameRef.current = window.setTimeout(() => {
          step();
        }, bikeMode ? 60 : 150);
      }
    };

    // First step immediately, then at interval
    step();
    // The interval is now handled by the setTimeout in the step function itself
    // const id = setInterval(step, 120);
    // return () => clearInterval(id);
    return () => clearTimeout(animFrameRef.current);
  }, [isMoving, bikeMode]);

  // ── Canvas render loop ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const viewW = OUTSIDE_MAP[0].length * TILE;
    const viewH = VIEW_ROWS * TILE;
    canvas.width = viewW;
    canvas.height = viewH;

    const render = () => {
      frameRef.current++;
      const frame = frameRef.current;
      const currentMap = getMap();

      // Camera pan (outside only)
      let cameraY = 0;
      if (sceneRef.current === "OUTSIDE") {
        const maxCamY = (currentMap.length - VIEW_ROWS) * TILE;
        const HOLD = 80, PAN = 120;
        if (frame < HOLD) cameraY = 0;
        else if (frame < HOLD + PAN) {
          const p = (frame - HOLD) / PAN;
          cameraY = (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2) * maxCamY;
        } else cameraY = maxCamY;
      }

      // Clear
      ctx.fillStyle = sceneRef.current === "OUTSIDE" ? "#88c8f8" : "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(0, -cameraY);

      // Tiles
      for (let y = 0; y < currentMap.length; y++) {
        if (y * TILE < cameraY - TILE || y * TILE > cameraY + viewH + TILE) continue;
        for (let x = 0; x < currentMap[y].length; x++) {
          drawTile(ctx, currentMap[y][x], x, y, frame, season);
        }
      }

      // Player
      const py = playerRef.current.y * TILE;
      if (py >= cameraY - TILE * 2 && py <= cameraY + viewH + TILE * 2) {
        drawSprite(ctx, playerRef.current.sprite, playerRef.current.x * TILE, py, 0);
      }

      // NPCs
      npcs.current.forEach(npc => {
        if (npc.scene !== sceneRef.current) return;
        const ny = npc.y * TILE;
        if (ny >= cameraY - TILE * 2 && ny <= cameraY + viewH + TILE * 2) {
          const bob = npc.type === "wander" ? Math.sin(frame * 0.1 + npc.x) * 1 : 0;
          drawSprite(ctx, npc.sprite, npc.x * TILE, ny, bob);
        }
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── Keyboard controls ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map = scene === "OUTSIDE" ? outsideMap : INSIDE_MAP;
      let { x, y } = playerRef.current;

      if (e.key === "ArrowUp" || e.key === "w") y -= 1;
      else if (e.key === "ArrowDown" || e.key === "s") y += 1;
      else if (e.key === "ArrowLeft" || e.key === "a") x -= 1;
      else if (e.key === "ArrowRight" || e.key === "d") x += 1;
      else return;

      if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return;

      // Check NPC collision
      const targetNpc = npcs.current.find(npc => npc.x === x && npc.y === y && npc.scene === scene);
      if (targetNpc && onShowDialog) {
        if (targetNpc.id === "rocket_guard") {
          onShowDialog("Hé, toi ! Ne t'approche pas trop près ! On surveille le bâtiment... euh, pour Sylphe Corp bien sûr.");
        } else if (targetNpc.id === "rocket_patrol") {
          onShowDialog("Je me demande ce que le Boss mijote à l'intérieur... il m'a dit de faire les cent pas ici en attendant.");
        } else if (targetNpc.id.startsWith("ghost")) {
          onShowDialog("Va-t-en... Le clone #150 nous a détruits...");
        }
        return; // blocked from walking
      }

      const tile = map[y][x];
      if (!noclipMode && !isWalkable(tile, scene)) {
        // PC interaction on walk-into
        if (scene === "INSIDE" && tile === PC_DESK && onInteractPC) onInteractPC();
        return;
      }

      // Key pickup
      if (scene === "OUTSIDE" && tile === KEY) {
        setHasKey(true);
        localStorage.setItem("sylphe_has_key", "true");
        setOutsideMap(m => {
          const m2 = m.map(r => [...r]);
          if (m2[y]) m2[y][x] = GRASS;
          return m2;
        });
        if (onShowDialog) onShowDialog("Vous avez trouvé la Carte d'Accès Sylphe Corp ! La porte principale est désormais déverrouillée.");
      }

      // Door transitions
      if (tile === DOOR) {
        if (scene === "OUTSIDE") {
          if (!hasKeyRef.current) {
            if (onShowDialog) onShowDialog("La porte est fermée... Il faut que je trouve la carte d'accès d'abord.");
            return;
          }
          setScene("INSIDE");
          setPlayer({ ...playerRef.current, x: 9, y: 10 });
        } else {
          setScene("OUTSIDE");
          setPlayer({ ...playerRef.current, x: 9, y: 25 });
        }
        moveQueueRef.current = [];
        setIsMoving(false);
        return;
      }

      setPlayer({ ...playerRef.current, x, y });

      // Easter egg: Step counter
      stepsCountRef.current += 1;
      localStorage.setItem("sylphe_steps", stepsCountRef.current.toString());
      if (stepsCountRef.current === 500 && onShowDialog) {
        onShowDialog("DING ! Vous avez fait 500 pas. Le système détecte la fin de votre session dans le Parc Safari... Oh attendez, on n'a plus cette feature.");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scene, outsideMap, onInteractPC, onShowDialog, noclipMode]);

  // ── Click handler ─────────────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = screenToTile(e.clientX, e.clientY);
    if (!pt) return;

    const map = scene === "OUTSIDE" ? outsideMap : INSIDE_MAP;
    if (pt.y < 0 || pt.y >= map.length || pt.x < 0 || pt.x >= map[0].length) return;

    // Check NPC clicks first
    const clickedNpc = npcs.current.find(npc => npc.x === pt.x && npc.y === pt.y && npc.scene === scene);
    if (clickedNpc && onShowDialog) {
      if (clickedNpc.id === "rocket_guard") {
        onShowDialog("Hé, toi ! Ne t'approche pas trop près ! On surveille le bâtiment... euh, pour Sylphe Corp bien sûr.");
      } else if (clickedNpc.id === "rocket_patrol") {
        onShowDialog("Je me demande ce que le Boss mijote à l'intérieur... il m'a dit de faire les cent pas ici en attendant.");
      } else if (clickedNpc.id.startsWith("ghost")) {
        onShowDialog("Va-t-en... Le clone #150 nous a détruits...");
      }
      return;
    }

    const tile = map[pt.y][pt.x];

    // Check Easter Eggs on Non-Walkable interactive tiles
    if (tile === WATER) {
      waterClickCountRef.current += 1;
      if (waterClickCountRef.current >= 10) {
        if (waterClickCountRef.current >= 20) {
          onShowDialog?.("Vous apercevez un vieux camion rouillé gisant dans les profondeurs... Vous cherchez en dessous, mais il n'y a rien.");
        } else if (localStorage.getItem("sylphe_masterball_unlocked") === "true") {
          onShowDialog?.("Un étrange Pokémon rose flotte... Vous lancez la Masterball ! MEW est capturé et rejoint l'équipe !");
          localStorage.setItem("sylphe_mew_captured", "true");
          window.dispatchEvent(new Event("storage"));
        } else {
          onShowDialog?.("Un étrange Pokémon rose flotte au deçà de la surface. Vous avez découvert MEW !! (si seulement vous aviez une Masterball...)");
        }
        waterClickCountRef.current = 0;
      } else {
        onShowDialog?.("L'eau est limpide. Oh attendez, on dirait bien qu'il y a un Magicarpe au fond...");
      }
      return;
    }
    if (tile === TREE) {
      treeClickCountRef.current += 1;
      if (treeClickCountRef.current >= 5) {
        if (localStorage.getItem("sylphe_cali_unlocked") === "true") {
          onShowDialog?.("Un PIKACHU pixelisé sauvage apparaît ! ... Ah non, ce n'est qu'un oiseau étrange.");
        } else {
          onShowDialog?.("Vous trouvez une petite plume grise sous les feuilles... Cali veillera sur l'équipe pour toujours.");
          localStorage.setItem("sylphe_cali_unlocked", "true");
          window.dispatchEvent(new Event("storage"));
        }
        treeClickCountRef.current = 0;
      } else {
        onShowDialog?.("Un bel arbre feuillu et robuste. Vous ne pouvez pas couper ce petit buisson avec la CS Coupe.");
      }
      return;
    }

    // PC interaction: walk to adjacent tile, then callback
    if (scene === "INSIDE" && tile === PC_DESK && onInteractPC) {
      if (Math.abs(playerRef.current.x - pt.x) <= 1 && Math.abs(playerRef.current.y - pt.y) <= 1) {
        onInteractPC();
        return;
      }

      const adjacentTiles = [
        { x: pt.x, y: pt.y + 1 },
        { x: pt.x - 1, y: pt.y },
        { x: pt.x + 1, y: pt.y },
        { x: pt.x, y: pt.y - 1 },
      ];

      for (const adj of adjacentTiles) {
        if (adj.y < 0 || adj.y >= map.length || adj.x < 0 || adj.x >= map[0].length) continue;
        if (!noclipMode && !isWalkable(map[adj.y][adj.x], scene)) continue;

        const path = noclipMode ? getStraightPath({ x: playerRef.current.x, y: playerRef.current.y }, adj) : findPath(
          { x: playerRef.current.x, y: playerRef.current.y },
          adj,
          map,
          scene,
        );

        if (path.length > 0) {
          pendingInteractionRef.current = onInteractPC;
          moveQueueRef.current = path;
          setIsMoving(true);
          return;
        }
      }
      return;
    }

    if (!noclipMode && !isWalkable(tile, scene)) return;

    const path = noclipMode ? getStraightPath({ x: playerRef.current.x, y: playerRef.current.y }, pt) : findPath(
      { x: playerRef.current.x, y: playerRef.current.y },
      pt,
      map,
      scene,
    );

    if (path.length > 0) {
      moveQueueRef.current = path;
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

  // ── Mouse hover ───────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = screenToTile(e.clientX, e.clientY);
    setHoveredTile(pt);
  };

  const cursorClass = (() => {
    if (!hoveredTile) return "cursor-pixel";
    const map = scene === "OUTSIDE" ? outsideMap : INSIDE_MAP;
    if (hoveredTile.y < 0 || hoveredTile.y >= map.length || hoveredTile.x < 0 || hoveredTile.x >= map[0].length) return "cursor-pixel";

    const npcHovered = npcs.current.some(npc => npc.x === hoveredTile.x && npc.y === hoveredTile.y && npc.scene === scene);
    if (npcHovered) return "cursor-pointer-pixel";

    return isInteractiveTile(map[hoveredTile.y][hoveredTile.x], scene) ? "cursor-pointer-pixel" : "cursor-pixel";
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
