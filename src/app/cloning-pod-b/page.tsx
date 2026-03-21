"use client";

import { useState, useEffect, useRef } from "react";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { setGameFlag } from "@/lib/gameState";
import { useMusic } from "@/hooks/useMusic";

const POD_LABEL = "B";
const PARTNER_LABEL = "A";
const CHANNEL_NAME = "sylphe-cloning-pod";

type PodMessage = {
  pod: string;
  action: "ready" | "stabilize" | "synced";
  timestamp: number;
};

export default function CloningPodB() {
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

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() } as PodMessage);

    channel.onmessage = (event: MessageEvent<PodMessage>) => {
      const msg = event.data;
      if (msg.pod === PARTNER_LABEL) {
        if (msg.action === "ready" && !partnerConnected) {
          setPartnerConnected(true);
          setDialog("Pod A detecte ! Les deux cuves sont en ligne. Synchronisez la stabilisation !");
          channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() });
        } else if (msg.action === "stabilize") {
          if (stabilizeTimerRef.current) {
            channel.postMessage({ pod: POD_LABEL, action: "synced", timestamp: Date.now() });
            setSynced(true);
            setGameFlag("sylphe_pod_synced");
            actions.clearTemporarySequence();
            actions.playOneShot("sfx-puzzle");
            setDialog("SYNCHRONISATION ADN REUSSIE ! Les sequences genomiques sont stables !");
          } else {
            setDialog("Pod A a lance la stabilisation ! Appuyez dans les 3 secondes !");
            stabilizeTimerRef.current = setTimeout(() => {
              setDialog("Desynchronisation. Recommencez.");
              setStabilizing(false);
              stabilizeTimerRef.current = null;
            }, 3000);
          }
        } else if (msg.action === "synced") {
          setSynced(true);
          setGameFlag("sylphe_pod_synced");
          actions.clearTemporarySequence();
          actions.playOneShot("sfx-puzzle");
          setDialog("SYNCHRONISATION CONFIRMEE depuis le Pod A !");
        }
      }
    };

    const pingInterval = setInterval(() => {
      channel.postMessage({ pod: POD_LABEL, action: "ready", timestamp: Date.now() });
    }, 3000);

    return () => {
      clearInterval(pingInterval);
      channel.close();
      if (stabilizeTimerRef.current) clearTimeout(stabilizeTimerRef.current);
    };
  }, [partnerConnected]);

  const handleStabilize = () => {
    if (synced || !partnerConnected) return;
    setStabilizing(true);
    actions.activateTemporarySequence("alarm");
    channelRef.current?.postMessage({ pod: POD_LABEL, action: "stabilize", timestamp: Date.now() });
    setDialog("Stabilisation lancee depuis le Pod B !");
    setCountdown(3);
    stabilizeTimerRef.current = setTimeout(() => {
      if (!synced) {
        setDialog("Desynchronisation. Le Pod A n'a pas repondu.");
        setStabilizing(false);
        setCountdown(null);
        stabilizeTimerRef.current = null;
      }
    }, 3000);
  };

  useEffect(() => {
    if (countdown === null || countdown <= 0 || synced) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, synced]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 240;
    canvas.height = 140;

    const draw = () => {
      ctx.fillStyle = "#1a0a0a";
      ctx.fillRect(0, 0, 240, 140);

      ctx.strokeStyle = synced ? "#ff6644" : "#442200";
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 10, 100, 120);

      const fillLevel = synced ? 120 : 40 + Math.sin(Date.now() / 500) * 10;
      const grad = ctx.createLinearGradient(70, 130 - fillLevel, 70, 130);
      grad.addColorStop(0, synced ? "rgba(255, 102, 68, 0.3)" : "rgba(100, 50, 0, 0.2)");
      grad.addColorStop(1, synced ? "rgba(255, 102, 68, 0.6)" : "rgba(100, 50, 0, 0.4)");
      ctx.fillStyle = grad;
      ctx.fillRect(72, 130 - fillLevel, 96, fillLevel);

      for (let i = 0; i < 6; i++) {
        const bx = 80 + (i * 15) + Math.sin(Date.now() / 400 + i) * 5;
        const by = 130 - ((Date.now() / 20 + i * 30) % 100);
        ctx.fillStyle = "rgba(255, 102, 68, 0.4)";
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (synced && dnaProgress > 10) {
        for (let i = 0; i < dnaProgress; i += 5) {
          const y = 20 + (i / 100) * 100;
          const x1 = 120 + Math.sin(i / 10 + Date.now() / 200) * 20;
          const x2 = 120 - Math.sin(i / 10 + Date.now() / 200) * 20;
          ctx.fillStyle = "#ff6644";
          ctx.beginPath();
          ctx.arc(x1, y, 2, 0, Math.PI * 2);
          ctx.arc(x2, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = synced ? "#ff6644" : "#442200";
      ctx.font = "8px monospace";
      ctx.fillText(`POD ${POD_LABEL}`, 10, 20);
      ctx.fillText(partnerConnected ? `POD ${PARTNER_LABEL}: CONNECTE` : `POD ${PARTNER_LABEL}: ABSENT`, 10, 35);
      if (synced) {
        ctx.fillStyle = "#ff6644";
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
      <section className="relative bg-[#1a0a0a] h-full overflow-hidden">
        <div className="bg-[#100505] border-b border-[#2a0a0a] text-[#aa4422] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 CUVE DE CLONAGE — POD B</span>
          <span className="opacity-60 animate-pulse">
            {synced ? "✓ SYNCHRONISE" : partnerConnected ? "⟐ POD A DETECTE" : "… RECHERCHE POD A…"}
          </span>
        </div>

        <div className="relative isolate h-full flex flex-col items-center justify-center gap-3">
          <canvas
            ref={canvasRef}
            style={{ imageRendering: "pixelated", width: 480, height: 280 }}
            className="border border-[#2a0a0a]"
          />
          {!synced && (
            <button
              onClick={handleStabilize}
              disabled={!partnerConnected || stabilizing}
              className={`gba-btn text-[8px] px-4 py-2 transition-colors ${
                partnerConnected && !stabilizing
                  ? "bg-[#2a0a0a] text-[#ff6644] border border-[#aa4422] hover:bg-[#3a1a1a]"
                  : "bg-[#1a0a0a] text-[#3a1a0a] border border-[#2a0a0a] cursor-not-allowed"
              }`}
            >
              {stabilizing ? "⏳ EN COURS..." : "⚡ STABILISER L'ADN"}
            </button>
          )}
          <p className="text-[6px] text-[#442200] max-w-[240px] text-center leading-[12px]">
            {synced
              ? "Clone stabilise. Donnees genomiques archivees."
              : "Ouvrez /cloning-pod-a dans un autre onglet."}
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
