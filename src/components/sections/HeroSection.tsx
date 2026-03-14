"use client";

import { useState, useEffect } from "react";
import TileMap from "@/components/TileMap";
import PixelSprite, { MASTERBALL_SPRITE } from "@/components/PixelSprite";
import TypewriterText from "@/components/TypewriterText";
import DialogBox from "@/components/DialogBox";
import useInView from "@/hooks/useInView";
import useKonamiCode from "@/hooks/useKonamiCode";

export default function HeroSection({
  onOpenTerminal,
}: {
  onOpenTerminal?: () => void;
}) {
  const { ref, isVisible } = useInView(0.1);
  const [dialogText, setDialogText] = useState<string | null>(
    "Bienvenue à SYLPHE CORP. ! Nous sommes le leader mondial de la recherche technologique."
  );
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRocketMode, setIsRocketMode] = useState(false);
  const [hasMasterball, setHasMasterball] = useState(false);
  const [isRich, setIsRich] = useState(false);
  const [nightModeClicks, setNightModeClicks] = useState(0);

  useEffect(() => {
    const checkEggs = () => {
      setIsRocketMode(localStorage.getItem("sylphe_rocket_mode") === "true");
      setHasMasterball(localStorage.getItem("sylphe_masterball_unlocked") === "true");
      setIsRich(localStorage.getItem("sylphe_rich") === "true");

      if (localStorage.getItem("sylphe_night_mode") === "true") {
        document.body.classList.add("night-mode");
      }
    };
    checkEggs();
    window.addEventListener("storage", checkEggs);
    return () => window.removeEventListener("storage", checkEggs);
  }, []);

  useKonamiCode(() => {
    handleShowDialog("CODE KONAMI ACCEPTÉ. INJECTION DE 1 000 000 POKÉDOLLARS... ET ACTIVATION DE LA ROTATION DU QG !");
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 5000);
  });

  const handleTypewriterComplete = () => {
    setIsTypewriterDone(true);
  };

  const handleDialogClick = () => {
    if (isTypewriterDone) {
      setDialogText(null);
      setIsTypewriterDone(false);
      setForceComplete(false);
    } else {
      setForceComplete(true);
    }
  };

  const handleNightModeClick = () => {
    const newClicks = nightModeClicks + 1;
    setNightModeClicks(newClicks);
    if (newClicks >= 5) {
      const isNight = localStorage.getItem("sylphe_night_mode") === "true";
      if (isNight) {
        localStorage.setItem("sylphe_night_mode", "false");
        document.body.classList.remove("night-mode");
        handleShowDialog("Le soleil se lève sur Jadielle !");
      } else {
        localStorage.setItem("sylphe_night_mode", "true");
        document.body.classList.add("night-mode");
        handleShowDialog("La nuit tombe soudainement. Bonne nuit zZz...");
      }
      setNightModeClicks(0);
    }
  };

  const handleShowDialog = (text: string) => {
    setDialogText(text);
    setIsTypewriterDone(false);
    setForceComplete(false);
  };

  return (
    <section ref={ref} className={`relative tile-bg pixel-grid ${isRocketMode ? "bg-red-950" : "bg-gba-bg"}`}>
      {/* Top bar - Location header */}
      <div className={`${isRocketMode ? "bg-red-900 border-b-2 border-red-700 text-red-100" : "bg-gba-bg-darker text-gba-white"} text-[8px] px-4 py-2 flex justify-between items-center z-10 relative cursor-pointer select-none`} onClick={handleNightModeClick}>
        <span>📍 JADIELLE CITY</span>
        <div className="flex items-center gap-2">
          {isRich && <span className="text-yellow-400">♦ 999 999 ₽</span>}
          {hasMasterball && <PixelSprite sprite={MASTERBALL_SPRITE} size={12} animate={false} />}
          <span className="opacity-60">{isRocketMode ? "TEAM ROCKET HQ" : "SYLPHE CORP. HQ"}</span>
        </div>
      </div>

      {/* Tile Map */}
      <div className={`relative transition-transform duration-[5000ms] ease-in-out ${isSpinning ? 'rotate-[3600deg]' : ''}`}>
        <TileMap
          className="opacity-90"
          onInteractPC={onOpenTerminal}
          onShowDialog={handleShowDialog}
        />

        {/* Overlay dialog */}
        {dialogText !== null && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-700 ${isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
              }`}
          >
            <DialogBox
              isClickable={isTypewriterDone}
              onClick={handleDialogClick}
            >
              <TypewriterText
                key={dialogText}
                text={dialogText}
                speed={40}
                forceComplete={forceComplete}
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
