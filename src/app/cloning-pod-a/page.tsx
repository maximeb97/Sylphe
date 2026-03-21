"use client";

import { useState, useEffect, useRef } from "react";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { setGameFlag } from "@/lib/gameState";
import { useMusic } from "@/hooks/useMusic";

const POD_LABEL = "A";
const PARTNER_LABEL = "B";
const CHANNEL_NAME = "sylphe-cloning-pod";

type PodMessage = {
  pod: string;
  action: "ready" | "stabilize" | "synced";
  timestamp: number;
};

export default function CloningPodA() {
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(null);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [stabilizing, setStabilizing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dnaProgress, setDnaProgress] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stabilizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Initialize BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    // Announce presence
    channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() } as PodMessage);

    channel.onmessage = (event: MessageEvent<PodMessage>) => {
      const msg = event.data;
      if (msg.pod === PARTNER_LABEL) {
        if (msg.action === "ready" && !partnerConnected) {
          setPartnerConnected(true);
          setDialog("Pod B detecte ! Les deux cuves de clonage sont connectees. Lancez la stabilisation simultanement !");
          // Reply with our ready signal
          channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() });
        } else if (msg.action === "stabilize") {
          // Partner started stabilization - check if we're also stabilizing
          if (stabilizeTimerRef.current) {
            // Both stabilized within timeframe!
            channel.postMessage({ pod: POD_LABEL, action: "synced", timestamp: Date.now() });
            setSynced(true);
            setGameFlag("sylphe_pod_synced");
            actions.clearTemporarySequence();
            actions.playOneShot("sfx-puzzle");
            setDialog("SYNCHRONISATION ADN REUSSIE ! Les deux cuves se stabilisent parfaitement. Le clone est viable !");
          } else {
            setDialog("Pod B a lance la stabilisation ! Appuyez MAINTENANT sur STABILISER dans les 3 secondes !");
            // Wait 3 seconds max
            const timeout = setTimeout(() => {
              setDialog("Desynchronisation. Le clone est instable. Recommencez en appuyant dans les 3 secondes.");
              setStabilizing(false);
            }, 3000);
            stabilizeTimerRef.current = timeout;
          }
        } else if (msg.action === "synced") {
          setSynced(true);
          setGameFlag("sylphe_pod_synced");
          actions.clearTemporarySequence();
          actions.playOneShot("sfx-puzzle");
          setDialog("SYNCHRONISATION CONFIRMEE ! Le clone est stable. La sequence de clonage est archivee.");
        }
      }
    };

    // Periodic ready ping
    const pingInterval = setInterval(() => {
      channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() });
    }, 3000);

    return () => {
      clearInterval(pingInterval);
      channel.close();
      if (stabilizeTimerRef.current) clearTimeout(stabilizeTimerRef.current);
    };
  }, [partnerConnected]);

  // Stabilize button handler
  const handleStabilize = () => {
    if (synced || !partnerConnected) return;
    setStabilizing(true);
    actions.activateTemporarySequence("alarm", 4);
    actions.activateTemporarySequence("clone-pulse", 4);
    channelRef.current?.postMessage({ pod: POD_LABEL, action: "stabilize", timestamp: Date.now() });
    setDialog("Stabilisation lancee depuis le Pod A ! Le Pod B doit faire de meme dans les 3 prochaines secondes...");
    
    // Start countdown
    setCountdown(3);

    // Give partner 3 seconds
    stabilizeTimerRef.current = setTimeout(() => {
      if (!synced) {
        setDialog("Desynchronisation. Le clone est instable. Le Pod B n'a pas repondu a temps.");
        setStabilizing(false);
        setCountdown(null);
        stabilizeTimerRef.current = null;
      }
    }, 3000);
  };

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0 || synced) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, synced]);

  // DNA animation
  useEffect(() => {
    if (synced) {
      const interval = setInterval(() => {
        setDnaProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [synced]);

  // Pod animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 240;
    canvas.height = 140;

    const draw = () => {
      ctx.fillStyle = "#0a1a0a";
      ctx.fillRect(0, 0, 240, 140);

      // Draw pod tube
      ctx.strokeStyle = synced ? "#00ff88" : "#004422";
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 10, 100, 120);

      // Liquid fill
      const fillLevel = synced ? 120 : 40 + Math.sin(Date.now() / 500) * 10;
      const grad = ctx.createLinearGradient(70, 130 - fillLevel, 70, 130);
      grad.addColorStop(0, synced ? "rgba(0, 255, 136, 0.3)" : "rgba(0, 100, 50, 0.2)");
      grad.addColorStop(1, synced ? "rgba(0, 255, 136, 0.6)" : "rgba(0, 100, 50, 0.4)");
      ctx.fillStyle = grad;
      ctx.fillRect(72, 130 - fillLevel, 96, fillLevel);

      // Bubbles
      for (let i = 0; i < 6; i++) {
        const bx = 80 + (i * 15) + Math.sin(Date.now() / 400 + i) * 5;
        const by = 130 - ((Date.now() / 20 + i * 30) % 100);
        ctx.fillStyle = "rgba(0, 255, 136, 0.4)";
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // DNA helix (when synced)
      if (synced && dnaProgress > 10) {
        for (let i = 0; i < dnaProgress; i += 5) {
          const y = 20 + (i / 100) * 100;
          const x1 = 120 + Math.sin(i / 10 + Date.now() / 200) * 20;
          const x2 = 120 - Math.sin(i / 10 + Date.now() / 200) * 20;
          ctx.fillStyle = "#00ff88";
          ctx.beginPath();
          ctx.arc(x1, y, 2, 0, Math.PI * 2);
          ctx.arc(x2, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pod label
      ctx.fillStyle = synced ? "#00ff88" : "#004422";
      ctx.font = "8px monospace";
      ctx.fillText(`POD ${POD_LABEL}`, 10, 20);
      ctx.fillText(partnerConnected ? `POD ${PARTNER_LABEL}: CONNECTE` : `POD ${PARTNER_LABEL}: ABSENT`, 10, 35);

      if (synced) {
        ctx.fillStyle = "#00ff88";
        ctx.fillText("ADN STABILISE", 10, 55);
        ctx.fillText(`${dnaProgress}%`, 10, 70);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [partnerConnected, synced, dnaProgress]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  return (
    <GBAShell>
      <section className="relative bg-[#0a1a0a] h-full overflow-hidden">
        <div className="bg-[#051005] border-b border-[#0a2a0a] text-[#00aa44] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 CUVE DE CLONAGE — POD A</span>
          <span className="opacity-60 animate-pulse">
            {synced ? "✓ SYNCHRONISE" : partnerConnected ? "⟐ POD B DETECTE" : "… RECHERCHE POD B…"}
          </span>
        </div>

        <div className="relative isolate h-full flex flex-col items-center justify-center gap-3">
          <canvas
            ref={canvasRef}
            style={{ imageRendering: "pixelated", width: 480, height: 280 }}
            className="border border-[#0a2a0a]"
          />

          {!synced && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleStabilize}
                disabled={!partnerConnected || stabilizing}
                className={`gba-btn text-[8px] px-4 py-2 transition-colors ${
                  partnerConnected && !stabilizing
                    ? "bg-[#0a2a0a] text-[#00ff88] border border-[#00aa44] hover:bg-[#0a3a0a]"
                    : "bg-[#0a1a0a] text-[#003a1a] border border-[#0a2a0a] cursor-not-allowed"
                }`}
              >
                {stabilizing ? "⏳ EN COURS..." : "⚡ STABILISER L'ADN"}
              </button>
              {countdown !== null && (
                <span className="text-[12px] text-[#ff4444] font-bold animate-pulse">{countdown}</span>
              )}
            </div>
          )}

          <p className="text-[6px] text-[#004422] max-w-[240px] text-center leading-[12px]">
            {synced
              ? "Clone stabilise avec succes. Les archives genomiques sont enregistrees."
              : "Ouvrez un second onglet sur /cloning-pod-b et lancez la stabilisation dans les deux pod en moins de 3 secondes."
            }
          </p>
        </div>

        {dialog && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
                <TypewriterText
                  key={dialog} text={dialog} speed={40} forceComplete={forceComplete}
                  className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                  onComplete={() => setIsTypewriterDone(true)}
                />
              </DialogBox>
            </div>
          </div>
        )}
      </section>
    </GBAShell>
  );
}
