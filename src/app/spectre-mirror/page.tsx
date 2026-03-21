"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import BattleTransition from "@/components/BattleTransition";
import { setGameFlag } from "@/lib/gameState";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import PokemonCaptureSequence from "@/components/PokemonCaptureSequence";
import TypewriterText from "@/components/TypewriterText";
import { FANTOMINUS_SPRITE, SPECTRUM_SPRITE } from "@/components/PixelSprite";

const GHOSTS = [
  { name: "ECTOPLASMA", x: 0.3, y: 0.4, size: 40 },
  { name: "SPECTRUM", x: 0.65, y: 0.55, size: 35 },
  { name: "FANTOMINUS", x: 0.5, y: 0.7, size: 30 },
];

export default function SpectreMirror() {
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [ghostIndex, setGhostIndex] = useState(-1);
  const [ghostsSpotted, setGhostsSpotted] = useState<Set<string>>(new Set());
  const [showGhost, setShowGhost] = useState(false);
  const [showBattleTransition, setShowBattleTransition] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<
    "fantominus" | "spectrum" | null
  >(null);
  const [hasFantominus, setHasFantominus] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_fantominus_captured") === "true",
  );
  const [hasSpectrum, setHasSpectrum] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_spectrum_captured") === "true",
  );
  // Lavender Emergency Line: if player called poste 7 and came here quickly
  const [isEmergencyLine, setIsEmergencyLine] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Check Lavender Emergency Line condition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lavenderUnlocked =
      localStorage.getItem("sylphe_lavender_mirror_unlocked") === "true";
    const lastRoute = localStorage.getItem("sylphe_last_route");
    const lastRouteAt = Number(
      localStorage.getItem("sylphe_last_route_at") || "0",
    );
    const isRecentLavender =
      lastRoute === "/lavender-mirror" && Date.now() - lastRouteAt < 120000;
    if (lavenderUnlocked && isRecentLavender && !hasSpectrum) {
      setIsEmergencyLine(true);
    }
  }, [hasSpectrum]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 240, height: 160 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setPermission("granted");
      setDialog("Le miroir s'allume... Le Scope Sylphe detecte des residus spectraux dans votre reflet. Restez immobile.");
    } catch {
      setPermission("denied");
      setDialog("Camera inaccessible. Les spectres fuient la lumiere artificielle de votre ecran.");
    }
  }, []);

  // Apply gameboy filter + ghost overlay
  useEffect(() => {
    if (!cameraActive) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 240;
    canvas.height = 160;

    const render = () => {
      if (video.readyState < 2) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      // Draw video frame
      ctx.drawImage(video, 0, 0, 240, 160);

      // Apply Gameboy green tint
      const imageData = ctx.getImageData(0, 0, 240, 160);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        // Map to 4-shade GB palette
        let shade: number;
        if (gray < 64) shade = 0;
        else if (gray < 128) shade = 1;
        else if (gray < 192) shade = 2;
        else shade = 3;

        const palette = [
          [24, 48, 24],   // darkest
          [80, 112, 48],  // dark
          [136, 176, 88], // light
          [200, 224, 168],// lightest
        ];

        data[i] = palette[shade][0];
        data[i + 1] = palette[shade][1];
        data[i + 2] = palette[shade][2];
      }

      // Add scanlines
      for (let y = 0; y < 160; y += 2) {
        for (let x = 0; x < 240; x++) {
          const idx = (y * 240 + x) * 4;
          data[idx] = Math.max(0, data[idx] - 15);
          data[idx + 1] = Math.max(0, data[idx + 1] - 15);
          data[idx + 2] = Math.max(0, data[idx + 2] - 15);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Draw ghost if visible
      if (showGhost && ghostIndex >= 0) {
        const ghost = GHOSTS[ghostIndex];
        const gx = ghost.x * 240;
        const gy = ghost.y * 160;
        const gs = ghost.size;

        // Ghost body (semi-transparent dark shape)
        ctx.globalAlpha = 0.25 + Math.sin(Date.now() / 300) * 0.1;
        ctx.fillStyle = "#1a0a2a";
        ctx.beginPath();
        ctx.ellipse(gx, gy, gs, gs * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ghost eyes
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#f85858";
        ctx.beginPath();
        ctx.arc(gx - gs * 0.25, gy - gs * 0.2, 3, 0, Math.PI * 2);
        ctx.arc(gx + gs * 0.25, gy - gs * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animRef.current);
  }, [cameraActive, showGhost, ghostIndex]);

  // Random ghost appearances
  useEffect(() => {
    if (!cameraActive) return;

    const spawnGhost = () => {
      const idx = Math.floor(Math.random() * GHOSTS.length);
      setGhostIndex(idx);
      setShowGhost(true);

      // Ghost appears for 2-4 seconds
      const duration = 2000 + Math.random() * 2000;
      setTimeout(() => {
        setShowGhost(false);
      }, duration);
    };

    // First ghost after 3-6 seconds
    const firstTimer = setTimeout(spawnGhost, 3000 + Math.random() * 3000);

    // Then every 6-12 seconds
    const interval = setInterval(spawnGhost, 6000 + Math.random() * 6000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [cameraActive]);

  // Capture ghost when clicking during appearance
  const handleCapture = () => {
    if (showGhost && ghostIndex >= 0) {
      const ghost = GHOSTS[ghostIndex];
      const nextSpotted = new Set(ghostsSpotted);
      nextSpotted.add(ghost.name);
      setGhostsSpotted(nextSpotted);
      setShowGhost(false);
      actions.playOneShot("sfx-ghost");
      setDialog(`Spectre detecte: ${ghost.name} ! Le Scope Sylphe enregistre l'empreinte residuelle dans les archives.`);

      if (nextSpotted.size >= GHOSTS.length) {
        setGameFlag("sylphe_spectre_mirror_complete");
        const hasMasterball =
          typeof window !== "undefined" &&
          localStorage.getItem("sylphe_masterball_unlocked") === "true";

        // Lavender Emergency Line: capture Spectrum corporate instead
        if (isEmergencyLine && hasMasterball && !hasSpectrum) {
          setTimeout(() => {
            setCaptureTarget("spectrum");
            setShowBattleTransition(true);
          }, 1200);
        } else if (hasMasterball && !hasFantominus) {
          setTimeout(() => {
            setCaptureTarget("fantominus");
            setShowBattleTransition(true);
          }, 1200);
        } else {
          setTimeout(() => {
            setDialog(
              "Tous les spectres ont ete documentes. Le miroir revele un reflet different: le votre porte maintenant la marque du Scope.",
            );
          }, 3000);
        }
      }
    }
  };

  const handleFantominusCaptureComplete = useCallback(() => {
    setCaptureTarget(null);
    setHasFantominus(true);
    setGameFlag("sylphe_fantominus_captured");
    actions.playOneShot("sfx-capture");
    setDialog(
      "Le reflet se condense en une seule respiration violette. FANTOMINUS est capture, et le miroir garde votre contour en archive.",
    );
  }, [actions]);

  const handleSpectrumCaptureComplete = useCallback(() => {
    setCaptureTarget(null);
    setHasSpectrum(true);
    setGameFlag("sylphe_spectrum_captured");
    actions.playOneShot("sfx-capture");
    setDialog(
      "Le SPECTRUM CORPORATE se solidifie. Cette variante rare porte les memoires des employes de Sylphe Corp. effaces des registres. La ligne d'urgence de Lavanville l'a attire hors du miroir.",
    );
  }, [actions]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  return (
    <GBAShell>
      <section className="relative bg-[#0a0a12] h-full overflow-hidden">
        <div className="bg-[#12121a] border-b border-[#2a2a3a] text-[#6a6a9a] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 MIROIR SPECTRAL // SCOPE ACTIF</span>
          <span className="opacity-60">
            SPECTRES: {ghostsSpotted.size}/{GHOSTS.length}
          </span>
        </div>

        {!cameraActive && permission !== "denied" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a12]/95">
            <div className="text-[#6a6a9a] text-[8px] text-center leading-[16px] mb-6 max-w-[220px]">
              <p className="mb-4">
                Le Scope Sylphe vibre. Il detecte des anomalies spectrales dans
                cette zone.
              </p>
              <p className="mb-4">
                Pour les voir, le Scope doit analyser votre environnement reel
                via la camera.
              </p>
              <p className="text-[#4a4a7a]">
                Un filtre Gameboy sera applique. Cliquez sur les spectres quand
                ils apparaissent derriere vous.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="gba-btn text-[8px] px-4 py-2 bg-[#1a1a2a] text-[#6a6a9a] border border-[#3a3a5a] hover:bg-[#2a2a3a] transition-colors"
            >
              📷 ACTIVER LE SCOPE SPECTRAL
            </button>
          </div>
        )}

        {permission === "denied" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0a12]/95">
            <p className="text-[#4a4a7a] text-[8px]">
              Camera requise pour le miroir spectral.
            </p>
            <Link
              href="/"
              className="mt-4 text-[#6a6a9a] text-[7px] hover:text-[#8a8aba]"
            >
              RETOUR AU HALL
            </Link>
          </div>
        )}

        <div
          className="relative isolate h-full flex items-center justify-center"
          onClick={handleCapture}
        >
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas
            ref={canvasRef}
            className="border-2 border-[#2a2a3a] cursor-pointer"
            style={{ imageRendering: "pixelated", width: 480, height: 320 }}
          />

          {showBattleTransition && (
            <BattleTransition
              onComplete={() => setShowBattleTransition(false)}
            />
          )}

          {captureTarget === "fantominus" && !showBattleTransition && (
            <PokemonCaptureSequence
              pokemonName="Fantominus"
              pokemonSprite={FANTOMINUS_SPRITE}
              accentClassName="from-[#eee8ff] via-[#b38cff] to-[#3a255f]"
              introText="Tous les residus spectraux fusionnent enfin. Une forme stable ose se montrer derriere vous."
              onComplete={handleFantominusCaptureComplete}
            />
          )}

          {captureTarget === "spectrum" && !showBattleTransition && (
            <PokemonCaptureSequence
              pokemonName="Spectrum Corporate"
              pokemonSprite={SPECTRUM_SPRITE}
              accentClassName="from-[#d8c8f8] via-[#9868c8] to-[#2a1a4a]"
              introText="La ligne d'urgence de Lavanville resonne encore. Un SPECTRUM CORPORATE se materialise — variante rare, portant les souvenirs des employes effaces de Sylphe Corp."
              onComplete={handleSpectrumCaptureComplete}
            />
          )}

          {/* CRT effect overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-20 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[length:100%_3px]" />

          {showGhost && ghostIndex >= 0 && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-[6px] text-red-500 animate-pulse">
              ⚠ ANOMALIE SPECTRALE DETECTEE — CLIQUEZ POUR CAPTURER
            </div>
          )}
        </div>

        {dialog && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
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
      </section>
    </GBAShell>
  );
}
