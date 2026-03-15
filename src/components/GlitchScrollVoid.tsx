"use client";

import { useState, useEffect, useRef } from "react";

function readFlag(key: string) {
  return typeof window !== "undefined" && localStorage.getItem(key) === "true";
}

export default function GlitchScrollVoid() {
  const [active] = useState(() => readFlag("sylphe_prototype_151") || readFlag("sylphe_archive_debug"));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const missingnos = useRef<{ x: number; y: number; dx: number; dy: number; size: number; frame: number }[]>([]);

  useEffect(() => {
    if (active) {
      missingnos.current = Array.from({ length: 12 }, () => ({
        x: Math.random() * 240,
        y: Math.random() * 300,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
        size: 6 + Math.floor(Math.random() * 10),
        frame: Math.floor(Math.random() * 100),
      }));
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 240;
    canvas.height = 300;

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 240, 300);

      // Stars
      for (let i = 0; i < 50; i++) {
        const sx = (i * 73 + Date.now() / 100) % 240;
        const sy = (i * 37 + Date.now() / 200) % 300;
        ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.sin(Date.now() / 500 + i) * 0.1})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Glitch lines
      if (Math.random() > 0.95) {
        const gy = Math.random() * 300;
        ctx.fillStyle = `rgba(255,0,0,${Math.random() * 0.3})`;
        ctx.fillRect(0, gy, 240, 2);
      }

      // MissingNos
      for (const m of missingnos.current) {
        m.x += m.dx;
        m.y += m.dy;
        m.frame++;
        if (m.x < 0 || m.x > 240) m.dx *= -1;
        if (m.y < 0 || m.y > 300) m.dy *= -1;

        // Draw MissingNo as glitchy block
        const s = m.size;
        for (let px = 0; px < s; px++) {
          for (let py = 0; py < s; py++) {
            if (Math.random() > 0.4) {
              const r = (m.frame + px * 7 + py * 13) % 256;
              const g = (m.frame * 3 + px * 11 + py * 5) % 100;
              const b = (m.frame * 7 + px * 3 + py * 17) % 150;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              ctx.fillRect(Math.floor(m.x + px), Math.floor(m.y + py), 1, 1);
            }
          }
        }
      }

      // Text
      ctx.fillStyle = "#333";
      ctx.font = "6px monospace";
      ctx.fillText("ZONE GLITCH — VIDE INTERSIDERAL", 40, 20);
      ctx.fillStyle = "#220000";
      ctx.fillText("Les MissingNos errent ici...", 55, 290);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <div className="w-full flex flex-col items-center py-4 bg-black">
      <canvas
        ref={canvasRef}
        style={{ imageRendering: "pixelated", width: 480, height: 600 }}
      />
      <p className="text-[6px] text-[#220000] mt-2 animate-pulse">
        Vous etes alle trop loin. Il n&apos;y a rien ici. Seulement des fragments.
      </p>
    </div>
  );
}
