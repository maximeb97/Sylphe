"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMusic } from "@/hooks/useMusic";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { setGameFlag } from "@/lib/gameState";

const SYMBOLS = ["🔴", "🔵", "⭐", "💎", "7️⃣", "🟢"];
const REEL_COUNT = 3;
const SPIN_DURATION = 1500;

function readFlag(key: string) {
  return typeof window !== "undefined" && localStorage.getItem(key) === "true";
}

export default function CasinoGameCorner() {
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>("Bienvenue au Casino clandestin de Celadopole. Les machines a sous sont alimentees par Porygon.");
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [reels, setReels] = useState<number[]>([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [coins, setCoins] = useState(100);
  const [plays, setPlays] = useState(0);
  const [ransomware, setRansomware] = useState(false);
  const [porygonZUnlocked, setPorygonZUnlocked] = useState(false);
  const animRefs = useRef<ReturnType<typeof setInterval>[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (readFlag("sylphe_casino_porygon_z")) setPorygonZUnlocked(true);
    if (readFlag("sylphe_rocket_ransomware")) setRansomware(true);
  }, []);

  const checkWin = useCallback((finalReels: number[], totalPlays: number) => {
    const allSame = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
    const twoSame = finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2];

    if (allSame && finalReels[0] === 4) {
      setCoins(prev => prev + 777);
      actions.activateTemporarySequence("jackpot-frenzy", 4);
      if (!porygonZUnlocked) {
        setPorygonZUnlocked(true);
        setGameFlag("sylphe_casino_porygon_z");
        setDialog("JACKPOT 777 ! Mode PORYGON-Z debloque dans le Terminal ! Le Porygon originel a subi une mise a jour instable...");
      } else {
        setDialog("JACKPOT 777 ! +777 jetons !");
      }
    } else if (allSame) {
      setCoins(prev => prev + 100);
      setDialog("Triple combo ! +100 jetons !");
    } else if (twoSame) {
      setCoins(prev => prev + 20);
    }

    if (totalPlays >= 10 && !readFlag("sylphe_rocket_ransomware")) {
      setTimeout(() => {
        setRansomware(true);
        setGameFlag("sylphe_rocket_ransomware");
        setDialog("⚠ ALERTE SECURITE ⚠ Logiciel malveillant Team Rocket detecte ! RANÇONGICIEL installe. Certains menus sont temporairement verrouilles. Payez 9999 jetons ou tapez 'defrag' dans le terminal.");
      }, 1000);
    }
  }, [porygonZUnlocked]);

  const spin = useCallback(() => {
    if (spinning || coins < 10 || ransomware) return;
    setCoins(prev => prev - 10);
    setSpinning(true);
    actions.playOneShot("sfx-slot");
    const newPlays = plays + 1;
    setPlays(newPlays);

    animRefs.current.forEach(clearInterval);
    animRefs.current = [];

    for (let r = 0; r < REEL_COUNT; r++) {
      const interval = setInterval(() => {
        setReels(prev => {
          const next = [...prev];
          next[r] = Math.floor(Math.random() * SYMBOLS.length);
          return next;
        });
      }, 80);
      animRefs.current.push(interval);

      setTimeout(() => {
        clearInterval(interval);
        if (r === REEL_COUNT - 1) {
          setTimeout(() => {
            setSpinning(false);
            setReels(prev => {
              const final = prev;
              checkWin(final, newPlays);
              return final;
            });
          }, 100);
        }
      }, SPIN_DURATION + r * 400);
    }
  }, [spinning, coins, plays, ransomware, checkWin]);

  // Animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 240;
    canvas.height = 160;

    const draw = () => {
      ctx.fillStyle = ransomware ? "#1a0000" : "#0a0a1a";
      ctx.fillRect(0, 0, 240, 160);

      // Floor tiles
      for (let x = 0; x < 240; x += 16) {
        for (let y = 100; y < 160; y += 16) {
          ctx.fillStyle = (x + y) % 32 === 0 ? "#1a1a3a" : "#15152a";
          ctx.fillRect(x, y, 16, 16);
        }
      }

      // Slot machine body
      ctx.fillStyle = ransomware ? "#330000" : "#2a2a4a";
      ctx.fillRect(60, 15, 120, 80);
      ctx.strokeStyle = ransomware ? "#ff0000" : "#ffcc00";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 15, 120, 80);

      // Reel windows
      for (let r = 0; r < 3; r++) {
        ctx.fillStyle = "#111";
        ctx.fillRect(72 + r * 34, 25, 28, 35);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(72 + r * 34, 25, 28, 35);
      }

      // Lever
      ctx.fillStyle = "#888";
      ctx.fillRect(185, 30, 4, 40);
      ctx.fillStyle = spinning ? "#ff4444" : "#ff0000";
      ctx.beginPath();
      ctx.arc(187, 28, 6, 0, Math.PI * 2);
      ctx.fill();

      // Coin counter
      ctx.fillStyle = "#ffcc00";
      ctx.font = "7px monospace";
      ctx.fillText(`JETONS: ${coins}`, 65, 105);

      // Neon lights
      const t = Date.now() / 200;
      for (let i = 0; i < 8; i++) {
        const on = Math.sin(t + i) > 0;
        ctx.fillStyle = on ? (ransomware ? "#ff0000" : "#ffcc00") : "#333";
        ctx.fillRect(62 + i * 15, 12, 8, 3);
        ctx.fillRect(62 + i * 15, 95, 8, 3);
      }

      if (ransomware) {
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold 9px monospace";
        const blink = Math.sin(Date.now() / 300) > 0;
        if (blink) ctx.fillText("ROCKET RANSOMWARE", 62, 140);
      }

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [coins, spinning, ransomware]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  return (
    <GBAShell>
      <section className="relative bg-[#0a0a1a] h-full overflow-hidden">
        <div className="bg-[#0a0a15] border-b border-[#1a1a3a] text-[#ffcc00] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 CASINO CLANDESTIN — CELADOPOLE</span>
          <span className="opacity-60">
            {ransomware ? "🔴 INFECTE" : porygonZUnlocked ? "✓ PORYGON-Z" : `💰 ${coins}`}
          </span>
        </div>

        <div className="relative isolate h-full flex flex-col items-center justify-center gap-2 pb-16">
          <canvas
            ref={canvasRef}
            style={{ imageRendering: "pixelated", width: 480, height: 320 }}
            className="border border-[#1a1a3a]"
          />

          {/* Reel display overlay */}
          <div className="absolute top-[76px] left-1/2 -translate-x-1/2 flex gap-[12px]">
            {reels.map((sym, i) => (
              <div key={i} className={`w-[56px] h-[70px] flex items-center justify-center text-[24px] ${spinning ? "animate-pulse" : ""}`}>
                {SYMBOLS[sym]}
              </div>
            ))}
          </div>

          {!ransomware && (
            <button
              onClick={spin}
              disabled={spinning || coins < 10}
              className={`gba-btn text-[8px] px-6 py-2 transition-colors ${
                !spinning && coins >= 10
                  ? "bg-[#1a1a3a] text-[#ffcc00] border border-[#ffcc00] hover:bg-[#2a2a4a]"
                  : "bg-[#0a0a15] text-[#333] border border-[#1a1a3a] cursor-not-allowed"
              }`}
            >
              {spinning ? "⏳ EN COURS..." : `🎰 JOUER (10 jetons)`}
            </button>
          )}

          <p className="text-[6px] text-[#555] text-center px-4 leading-[10px]">
            {ransomware
              ? "Machine verrouillee. Tapez 'defrag' dans le terminal pour nettoyer le virus."
              : `Parties jouees: ${plays}/10 | Triple 7 = Porygon-Z`}
          </p>
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
