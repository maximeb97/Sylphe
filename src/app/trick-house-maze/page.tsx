"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMusic } from "@/hooks/useMusic";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { setGameFlag } from "@/lib/gameState";

const MAZE_W = 11;
const MAZE_H = 11;

// 0 = floor, 1 = wall, 2 = trap (Team Rocket), 3 = exit, 4 = item
const MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,2,1,0,1],
  [1,0,1,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,1,1,1],
  [1,4,0,0,0,0,0,0,2,0,1],
  [1,1,1,0,1,1,1,1,0,1,1],
  [1,0,0,0,0,2,0,0,0,0,3],
  [1,1,1,1,1,1,1,1,1,1,1],
];

const TILE = 20;

export default function TrickHouseMaze() {
  const { actions } = useMusic();
  const [ballX, setBallX] = useState(1);
  const [ballY, setBallY] = useState(1);
  const [trapsHit, setTrapsHit] = useState(0);
  const [itemFound, setItemFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dialog, setDialog] = useState<string | null>("Maison Piege de la Team Rocket ! Inclinez votre appareil pour guider la Pokeball. Evitez les dalles rouges.");
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [hasGyro, setHasGyro] = useState(false);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const lastUpdate = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect gyroscope: only enable if actual events fire
  useEffect(() => {
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") return;

    let activated = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null && e.gamma === null) return;
      if (!activated) {
        activated = true;
        setHasGyro(true);
      }
      setVelocity({
        vx: (e.gamma ?? 0) / 30,
        vy: (e.beta ?? 0) / 30,
      });
    };

    // iOS 13+ requires permission
    const dOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (dOE.requestPermission) {
      dOE.requestPermission().then((response: string) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      }).catch(() => { /* permission denied, keyboard fallback stays */ });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const moveBall = useCallback((nx: number, ny: number) => {
    if (nx < 0 || nx >= MAZE_W || ny < 0 || ny >= MAZE_H) return;
    if (MAZE[ny][nx] === 1) return;

    setBallX(nx);
    setBallY(ny);

    if (MAZE[ny][nx] === 2) {
      setTrapsHit(prev => prev + 1);
      actions.activateTemporarySequence("danger-trap", 1);
      setDialog("PIEGE ROCKET ! Courant electrique detecte. La Pokeball est repoussee !");
      // Push back to previous position
      setTimeout(() => {
        setBallX(prev => Math.max(1, Math.min(MAZE_W - 2, prev)));
        setBallY(prev => Math.max(1, Math.min(MAZE_H - 2, prev)));
      }, 500);
    } else if (MAZE[ny][nx] === 4 && !itemFound) {
      setItemFound(true);
      setGameFlag("sylphe_trick_house_item");
      actions.playOneShot("sfx-puzzle");
      setDialog("Un plan de la Maison Piege ! Document interne de la Team Rocket. Les coordonnees d'une base secrete y figurent.");
    } else if (MAZE[ny][nx] === 3) {
      setCompleted(true);
      setGameFlag("sylphe_trick_house_complete");
      actions.playOneShot("sfx-puzzle");
      setDialog("Sortie trouvee ! Vous avez traverse la Maison Piege de la Team Rocket. Les donnees du labyrinthe sont archivees.");
    }
  }, [itemFound]);

  // Keyboard fallback for desktop
  useEffect(() => {
    if (hasGyro) return;

    const handleKey = (e: KeyboardEvent) => {
      if (completed || dialog) return;
      let nx = ballX, ny = ballY;
      if (e.key === "ArrowUp") ny--;
      else if (e.key === "ArrowDown") ny++;
      else if (e.key === "ArrowLeft") nx--;
      else if (e.key === "ArrowRight") nx++;
      else return;
      e.preventDefault();
      moveBall(nx, ny);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hasGyro, ballX, ballY, completed, dialog, moveBall]);

  // Physics update for gyroscope
  useEffect(() => {
    if (!hasGyro || completed) return;

    const physics = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - lastUpdate.current) / 1000, 0.1);
      lastUpdate.current = now;

      const nx = Math.round(ballX + velocity.vx * dt * 5);
      const ny = Math.round(ballY + velocity.vy * dt * 5);
      if (nx !== ballX || ny !== ballY) {
        moveBall(nx, ny);
      }
    }, 100);

    return () => clearInterval(physics);
  }, [hasGyro, velocity, ballX, ballY, completed, moveBall]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = MAZE_W * TILE;
    canvas.height = MAZE_H * TILE;

    for (let y = 0; y < MAZE_H; y++) {
      for (let x = 0; x < MAZE_W; x++) {
        const tile = MAZE[y][x];
        if (tile === 1) ctx.fillStyle = "#384030";
        else if (tile === 2) ctx.fillStyle = "#8b1a1a";
        else if (tile === 3) ctx.fillStyle = "#f8d830";
        else if (tile === 4) ctx.fillStyle = "#5898f8";
        else ctx.fillStyle = "#a0522d";
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

        ctx.strokeStyle = "#2a2a1a";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
      }
    }

    // Draw ball
    ctx.fillStyle = completed ? "#88f058" : "#e8f0d0";
    ctx.beginPath();
    ctx.arc((ballX + 0.5) * TILE, (ballY + 0.5) * TILE, TILE * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#384030";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pokeball line
    ctx.strokeStyle = "#f85858";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo((ballX + 0.15) * TILE, (ballY + 0.5) * TILE);
    ctx.lineTo((ballX + 0.85) * TILE, (ballY + 0.5) * TILE);
    ctx.stroke();
  }, [ballX, ballY, completed]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  return (
    <GBAShell>
      <section className="relative bg-[#2a1a0a] h-full overflow-hidden">
        <div className="bg-[#1a0a00] border-b border-[#3a2a1a] text-[#8a6a4a] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 MAISON PIEGE // TEAM ROCKET</span>
          <span className="opacity-60">PIEGES: {trapsHit} | {hasGyro ? "🔄 GYRO" : "⌨️ CLAVIER"}</span>
        </div>

        <div className="relative isolate h-full flex flex-col items-center justify-center gap-2">
          {!hasGyro && (
            <p className="text-[6px] text-[#6a4a2a] mb-1">Utilisez les fleches du clavier pour deplacer la Pokeball</p>
          )}
          <canvas
            ref={canvasRef}
            style={{ imageRendering: "pixelated", width: MAZE_W * TILE * 2, height: MAZE_H * TILE * 2 }}
            className="border-2 border-[#3a2a1a]"
          />

          {completed && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-[#1a0a00]/90 border border-[#f8d830] px-4 py-2 text-[8px] text-[#f8d830] animate-pulse">
              LABYRINTHE COMPLETE !
            </div>
          )}
        </div>

        {dialog && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
              <TypewriterText
                key={dialog} text={dialog} speed={40} forceComplete={forceComplete}
                className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                onComplete={() => setIsTypewriterDone(true)}
              />
            </DialogBox>
          </div>
        )}
      </section>
    </GBAShell>
  );
}
