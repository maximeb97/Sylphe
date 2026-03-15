"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import GBAShell from "@/components/GBAShell";
import { useRouter } from "next/navigation";
import { setGameFlag } from "@/lib/gameState";
import { playGlitchSound } from "@/lib/audio";

const CAVE_W = 20;
const CAVE_H = 14;

// Cavern layout: walls = 1, floor = 0, fossil = 2, zubat_nest = 3, exit = 4
const CAVE_LAYOUT: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,1,0,0,1,1,0,1,0,0,1,0,1,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,0,3,1],
  [1,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,3,0,1,0,2,1,0,0,1,0,0,1,0,0,1],
  [1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,1,1,0,1,0,3,0,1,0,0,1,0,1,1,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,1],
  [1,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,4,4,1,1,1,1,1,1,1,1,1],
];

type FlashCircle = { x: number; y: number; radius: number; opacity: number; time: number };

export default function MtMoonCavern() {
  const router = useRouter();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [playerX, setPlayerX] = useState(10);
  const [playerY, setPlayerY] = useState(12);
  const [flashes, setFlashes] = useState<FlashCircle[]>([]);
  const [micActive, setMicActive] = useState(false);
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [discoveredTiles, setDiscoveredTiles] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const px = 10, py = 12;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx * dx + dy * dy <= 1) {
          const tx = px + dx, ty = py + dy;
          if (tx >= 0 && tx < CAVE_W && ty >= 0 && ty < CAVE_H) initial.add(`${tx},${ty}`);
        }
      }
    }
    return initial;
  });
  const [fossilsFound, setFossilsFound] = useState(0);
  const [zubatsDisturbed, setZubatsDisturbed] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const TILE = 12;

  // Reveal tiles around player
  const revealAroundPlayer = useCallback((px: number, py: number, radius: number) => {
    setDiscoveredTiles(prev => {
      const next = new Set(prev);
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy <= radius * radius) {
            const tx = px + dx;
            const ty = py + dy;
            if (tx >= 0 && tx < CAVE_W && ty >= 0 && ty < CAVE_H) {
              next.add(`${tx},${ty}`);
            }
          }
        }
      }
      return next;
    });
  }, []);

  // Request microphone access
  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
      setMicPermission("granted");
    } catch {
      setMicPermission("denied");
      setDialog("Le micro est inaccessible. Les Nosferapti ne peuvent pas vous entendre... La grotte restera noire.");
    }
  }, []);

  // Audio analysis loop - detect sound levels and create flash circles
  useEffect(() => {
    if (!micActive || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // If sound level is above threshold, create a flash
      if (avg > 30) {
        const intensity = Math.min(avg / 128, 1);
        const radius = Math.floor(2 + intensity * 5);
        setFlashes(prev => [...prev.slice(-4), {
          x: playerX,
          y: playerY,
          radius,
          opacity: 0.6 + intensity * 0.4,
          time: Date.now(),
        }]);
        revealAroundPlayer(playerX, playerY, radius);

        // Disturb nearby zubat nests
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const tx = playerX + dx;
            const ty = playerY + dy;
            if (tx >= 0 && tx < CAVE_W && ty >= 0 && ty < CAVE_H && CAVE_LAYOUT[ty][tx] === 3) {
              setZubatsDisturbed(prev => prev + 1);
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animRef.current);
  }, [micActive, playerX, playerY, revealAroundPlayer]);

  // Fade out flashes
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashes(prev => prev.filter(f => Date.now() - f.time < 1500));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Player position change — reveal tiles (called from movement handlers, not effect)
  const revealOnMove = useCallback((px: number, py: number) => {
    revealAroundPlayer(px, py, 1);
  }, [revealAroundPlayer]);

  const handleInteract = useCallback((px: number, py: number) => {
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
    for (const [dx, dy] of dirs) {
      const tx = px + dx, ty = py + dy;
      if (tx >= 0 && tx < CAVE_W && ty >= 0 && ty < CAVE_H) {
        if (CAVE_LAYOUT[ty][tx] === 1 && discoveredTiles.has(`${tx},${ty}`)) {
          setDialog("Les parois de la grotte sont humides. Des inscriptions anciennes y ont ete gravees par des dresseurs perdus.");
          return;
        }
      }
    }
  }, [discoveredTiles]);

  // Keyboard movement
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (dialog) return;
      let nx = playerX, ny = playerY;
      if (e.key === "ArrowUp") ny--;
      else if (e.key === "ArrowDown") ny++;
      else if (e.key === "ArrowLeft") nx--;
      else if (e.key === "ArrowRight") nx++;
      else if (e.key === " " || e.key === "z" || e.key === "Z") {
        // Interact with adjacent tile
        handleInteract(playerX, playerY);
        return;
      }
      else return;

      e.preventDefault();
      if (nx < 0 || nx >= CAVE_W || ny < 0 || ny >= CAVE_H) return;
      if (CAVE_LAYOUT[ny][nx] === 1) return;

      // Exit
      if (CAVE_LAYOUT[ny][nx] === 4) {
        setGameFlag("sylphe_cave_echo");
        router.push("/");
        return;
      }

      setPlayerX(nx);
      setPlayerY(ny);
      revealOnMove(nx, ny);
      if (CAVE_LAYOUT[ny][nx] === 2) {
        setFossilsFound(prev => {
          const next = prev + 1;
          if (next === 1) {
            setDialog("Un fossile ancien scintille dans la roche. Les Nosferapti avaient creuse autour pour le proteger.");
          } else {
            setGameFlag("sylphe_cave_echo");
            if (typeof window !== "undefined" && localStorage.getItem("sylphe_masterball_unlocked") === "true") {
              setGameFlag("sylphe_kabuto_captured");
              setDialog("Deuxième fossile: un Kabuto millénaire se reveille ! La Masterball le capture instantanement. Donnees geologiques archivees.");
            } else {
              setDialog("Deuxième fossile: l'empreinte d'un Kabuto millénaire. Les donnees geologiques s'enregistrent dans le terminal.");
            }
          }
          return next;
        });
      }

      // Zubat nest
      if (CAVE_LAYOUT[ny][nx] === 3) {
        playGlitchSound();
        setDialog("Un essaim de Nosferapti s'agite ! Votre bruit les a reveilles. Ils fuient dans les tenebres comme des echos.");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playerX, playerY, dialog, router, revealOnMove, handleInteract]);

  // Render the cavern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CAVE_W * TILE;
    canvas.height = CAVE_H * TILE;

    // Fill with pure black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw discovered tiles
    for (let y = 0; y < CAVE_H; y++) {
      for (let x = 0; x < CAVE_W; x++) {
        const key = `${x},${y}`;
        if (!discoveredTiles.has(key)) continue;

        // Calculate visibility from flashes
        let brightness = 0.15; // base dim glow for discovered tiles
        for (const flash of flashes) {
          const dist = Math.sqrt((x - flash.x) ** 2 + (y - flash.y) ** 2);
          if (dist <= flash.radius) {
            const age = (Date.now() - flash.time) / 1500;
            const fadedOpacity = flash.opacity * (1 - age);
            brightness = Math.max(brightness, fadedOpacity);
          }
        }

        const tile = CAVE_LAYOUT[y][x];
        if (tile === 1) {
          ctx.fillStyle = `rgba(60, 40, 20, ${brightness})`;
        } else if (tile === 2) {
          ctx.fillStyle = `rgba(200, 180, 100, ${brightness})`;
        } else if (tile === 3) {
          ctx.fillStyle = `rgba(100, 80, 160, ${brightness})`;
        } else if (tile === 4) {
          ctx.fillStyle = `rgba(248, 216, 48, ${brightness})`;
        } else {
          ctx.fillStyle = `rgba(80, 60, 40, ${brightness})`;
        }
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);

        // Draw grid lines
        ctx.strokeStyle = `rgba(30, 20, 10, ${brightness * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
      }
    }

    // Draw player
    const playerBrightness = 0.9;
    ctx.fillStyle = `rgba(136, 240, 88, ${playerBrightness})`;
    ctx.fillRect(playerX * TILE + 2, playerY * TILE + 2, TILE - 4, TILE - 4);

    // Glow effect around player
    const gradient = ctx.createRadialGradient(
      (playerX + 0.5) * TILE, (playerY + 0.5) * TILE, 2,
      (playerX + 0.5) * TILE, (playerY + 0.5) * TILE, TILE * 2
    );
    gradient.addColorStop(0, "rgba(136, 240, 88, 0.3)");
    gradient.addColorStop(1, "rgba(136, 240, 88, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect((playerX - 2) * TILE, (playerY - 2) * TILE, TILE * 5, TILE * 5);

    // Draw flash circles
    for (const flash of flashes) {
      const age = (Date.now() - flash.time) / 1500;
      const fadedOpacity = flash.opacity * (1 - age);
      if (fadedOpacity <= 0) continue;

      const grd = ctx.createRadialGradient(
        (flash.x + 0.5) * TILE, (flash.y + 0.5) * TILE, 0,
        (flash.x + 0.5) * TILE, (flash.y + 0.5) * TILE, flash.radius * TILE
      );
      grd.addColorStop(0, `rgba(200, 220, 255, ${fadedOpacity * 0.4})`);
      grd.addColorStop(0.7, `rgba(100, 130, 200, ${fadedOpacity * 0.15})`);
      grd.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc((flash.x + 0.5) * TILE, (flash.y + 0.5) * TILE, flash.radius * TILE, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [discoveredTiles, flashes, playerX, playerY]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  // Cleanup mic stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <GBAShell>
      <section className="relative bg-black h-full overflow-hidden">
        <div className="bg-[#0a0600] border-b border-[#1a1000] text-[#4a3a20] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 MONT SELENITE // PROFONDEUR -3</span>
          <span className="opacity-60 animate-pulse">
            {micActive ? "🎤 ECHOLOCALISATION ACTIVE" : "🔇 MICRO INACTIF"}
          </span>
        </div>

        {!micActive && micPermission !== "denied" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/95">
            <div className="text-[#4a3a20] text-[8px] text-center leading-[16px] mb-6 max-w-[200px]">
              <p className="mb-4">La grotte est plongée dans le noir absolu.</p>
              <p className="mb-4">Les Nosferapti utilisent l&apos;echolocalisation pour voir dans les tenebres...</p>
              <p className="text-[#6a5a40]">Activez votre microphone. Le son genere des flashs lumineux qui eclairent la grotte pendant quelques instants.</p>
            </div>
            <button
              onClick={startMic}
              className="gba-btn text-[8px] px-4 py-2 bg-[#1a1000] text-[#4a3a20] border border-[#2a2000] hover:bg-[#2a2000] transition-colors"
            >
              🎤 ACTIVER L&apos;ECHOLOCALISATION
            </button>
            <button
              onClick={() => {
                setMicPermission("denied");
                revealAroundPlayer(playerX, playerY, 1);
              }}
              className="mt-3 text-[6px] text-[#3a2a10] hover:text-[#5a4a30] transition-colors"
            >
              EXPLORER SANS MICRO (difficulte extreme)
            </button>
          </div>
        )}

        <div className="relative isolate h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="image-rendering-pixelated"
            style={{ imageRendering: "pixelated", width: CAVE_W * TILE * 2, height: CAVE_H * TILE * 2 }}
          />

          {/* Zubat indicator */}
          {zubatsDisturbed > 0 && (
            <div className="absolute top-2 right-2 z-20 border border-[#2a2000] bg-black/80 px-2 py-1 text-[6px] text-[#6858a8]">
              NOSFERAPTI DERANGES: {zubatsDisturbed}
            </div>
          )}

          {/* Fossil counter */}
          {fossilsFound > 0 && (
            <div className="absolute top-2 left-2 z-20 border border-[#2a2000] bg-black/80 px-2 py-1 text-[6px] text-[#c8b064]">
              FOSSILES: {fossilsFound}/2
            </div>
          )}

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity z-20">
              <DialogBox
                isClickable={isTypewriterDone}
                onClick={handleDialogClick}
              >
                <TypewriterText
                  key={dialog}
                  text={dialog}
                  speed={40}
                  forceComplete={forceComplete}
                  className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                  onComplete={() => setIsTypewriterDone(true)}
                />
              </DialogBox>
            </div>
          )}
        </div>
      </section>
    </GBAShell>
  );
}
