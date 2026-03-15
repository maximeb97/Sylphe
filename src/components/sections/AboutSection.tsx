"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelSprite, { SCIENTIST_SPRITE } from "@/components/PixelSprite";
import DialogBox from "@/components/DialogBox";
import useInView from "@/hooks/useInView";
import { setGameFlag } from "@/lib/gameState";

export default function AboutSection() {
  const router = useRouter();
  const { ref, isVisible } = useInView(0.2);
  const [profileTapCount, setProfileTapCount] = useState(0);
  const [hintUnlocked, setHintUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_museum_null_hint") === "true",
  );

  const handleProfileTap = () => {
    const nextTapCount = profileTapCount + 1;
    setProfileTapCount(nextTapCount);

    if (!hintUnlocked && nextTapCount >= 3) {
      setGameFlag("sylphe_museum_null_hint");
      setHintUnlocked(true);
    }

    if (nextTapCount >= 7) {
      router.push("/mt-moon-cavern");
    }
  };

  return (
    <section
      ref={ref}
      id="about"
      className="bg-gba-bg tile-bg p-4 md:p-6 relative"
    >
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ À PROPOS
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Left: NPC Scientist */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            animation: isVisible ? "slide-in-left 0.8s ease-out" : undefined,
          }}
        >
          <button
            type="button"
            onClick={handleProfileTap}
            className="cursor-pointer-pixel"
          >
            <PixelSprite sprite={SCIENTIST_SPRITE} size={96} />
          </button>
          <div className="mt-3 text-[7px] text-gba-bg-darker text-center">
            Prof. SYLPHE
            <br />
            <span className="text-gba-accent">Directeur de Recherche</span>
          </div>
          {hintUnlocked && (
            <div className="mt-2 text-[6px] text-gba-shadow text-center opacity-70">
              AILE N-ULL // badge visiteur relie a l&apos;identifiant 31415
            </div>
          )}
        </div>

        {/* Right: Dialog */}
        <div
          style={{
            animation: isVisible ? "slide-in-right 0.8s ease-out" : undefined,
          }}
        >
          <DialogBox>
            <p className="text-[8px] leading-[16px] text-gba-text mb-3">
              SYLPHE CORP. est la plus grande entreprise technologique du monde.
            </p>
            <p className="text-[8px] leading-[16px] text-gba-text mb-3">
              Nos recherches couvrent l&apos;intelligence artificielle, la
              biotechnologie et les systèmes de communication avancés.
            </p>
            <p className="text-[8px] leading-[16px] text-gba-accent">
              Notre mission : repousser les limites de l&apos;innovation.
            </p>
            {/* Hidden CSS secret - visible only by inspecting DOM or selecting all text */}
            <p
              className="text-[1px] leading-[1px] select-all"
              style={{ color: "transparent", userSelect: "text" }}
            >
              MEMO INTERNE SYLPHE — Le 11e etage abrite le Projet M. Mot de
              passe partiel: mansion.cinnabar.gov contient la suite. Commande
              terminal secrete: nano /etc/sylphe/containment.conf
            </p>
          </DialogBox>
        </div>
      </div>
    </section>
  );
}
