"use client";

import { useState, useCallback } from "react";
import { useMusic } from "@/hooks/useMusic";
import GBAShell from "@/components/GBAShell";
import Terminal from "@/components/terminal/Terminal";
import RadioPokematos from "@/components/RadioPokematos";
import MidnightGhosts from "@/components/MidnightGhosts";
import GlitchScrollVoid from "@/components/GlitchScrollVoid";
import GeolocationEasterEgg from "@/components/GeolocationEasterEgg";
import NotificationGhost from "@/components/NotificationGhost";
import {
  TitleScreen,
  HeroSection,
  AboutSection,
  ProductsSection,
  StatsSection,
  TeamSection,
  ContactSection,
  Footer,
} from "@/components/sections";

export default function Home() {
  const [showTransition, setShowTransition] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { actions } = useMusic();

  const handleStart = useCallback(() => {
    setShowTransition(true);
    // Flash effect
    setTimeout(() => {
      setGameStarted(true);
      setShowTransition(false);
    }, 600);
  }, []);

  const handleOpenTerminal = useCallback(() => {
    setTerminalOpen(true);
    // Calmer music when terminal is open: drop drums
    actions.toggleSequence("drums");
  }, [actions]);

  const handleCloseTerminal = useCallback(() => {
    setTerminalOpen(false);
    // Restore drums when terminal closes
    actions.toggleSequence("drums");
  }, [actions]);

  return (
    <GBAShell
      overlay={
        terminalOpen ? <Terminal onClose={handleCloseTerminal} /> : undefined
      }
    >
      {/* Screen transition flash */}
      {showTransition && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-gba-white"
              style={{
                top: `${i * 16.67}%`,
                left: i % 2 === 0 ? "0" : undefined,
                right: i % 2 !== 0 ? "0" : undefined,
                width: "100%",
                height: "16.67%",
                animation: `fade-in 0.15s ease-out ${i * 0.05}s both`,
              }}
            />
          ))}
        </div>
      )}

      {!gameStarted ? (
        <TitleScreen onStart={handleStart} />
      ) : (
        <div
          className="relative"
          style={{ animation: "screen-on 0.5s ease-out" }}
        >
          {/* Top HUD bar */}
          <div className="sticky top-0 z-40 bg-gba-text text-gba-white text-[7px] px-3 py-[6px] flex justify-between items-center">
            <span className="text-gba-gold">SYLPHE CORP.</span>
            <div className="flex gap-3 items-center">
              <MidnightGhosts />
              {[
                { label: "INFO", href: "#about" },
                { label: "ITEMS", href: "#products" },
                { label: "STATS", href: "#stats" },
                { label: "TEAM", href: "#team" },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-gba-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <RadioPokematos />
            </div>
          </div>

          <GeolocationEasterEgg />
          <NotificationGhost />
          <HeroSection onOpenTerminal={handleOpenTerminal} />
          <AboutSection />
          <ProductsSection />
          <StatsSection />
          <TeamSection />
          <ContactSection />
          <Footer />
          <GlitchScrollVoid />
        </div>
      )}
    </GBAShell>
  );
}
