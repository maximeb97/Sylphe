"use client";

import { useState } from "react";
import TileMap from "@/components/TileMap";
import TypewriterText from "@/components/TypewriterText";
import DialogBox from "@/components/DialogBox";
import useInView from "@/hooks/useInView";

export default function HeroSection({
  onOpenTerminal,
}: {
  onOpenTerminal?: () => void;
}) {
  const { ref, isVisible } = useInView(0.1);
  const [showIntroDialog, setShowIntroDialog] = useState(true);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);

  const handleTypewriterComplete = () => {
    setIsTypewriterDone(true);
  };

  const handleDismissDialog = () => {
    if (isTypewriterDone) {
      setShowIntroDialog(false);
    }
  };

  return (
    <section ref={ref} className="relative bg-gba-bg tile-bg pixel-grid">
      {/* Top bar - Location header */}
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-4 py-2 flex justify-between items-center">
        <span>📍 JADIELLE CITY</span>
        <span className="opacity-60">SYLPHE CORP. HQ</span>
      </div>

      {/* Tile Map */}
      <div className="relative">
        <TileMap className="opacity-90" onInteractPC={onOpenTerminal} />

        {/* Overlay dialog */}
        {showIntroDialog && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-700 ${isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
              }`}
          >
            <DialogBox 
              isClickable={isTypewriterDone}
              onClick={handleDismissDialog}
            >
              <TypewriterText
                text="Bienvenue à SYLPHE CORP. ! Nous sommes le leader mondial de la recherche technologique."
                speed={40}
                className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                onComplete={handleTypewriterComplete}
              />
            </DialogBox>
          </div>
        )}
      </div>
    </section>
  );
}
