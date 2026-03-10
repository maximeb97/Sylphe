"use client";

import PixelSprite, { SCIENTIST_SPRITE } from "@/components/PixelSprite";
import DialogBox from "@/components/DialogBox";
import useInView from "@/hooks/useInView";

export default function AboutSection() {
  const { ref, isVisible } = useInView(0.2);

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
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Left: NPC Scientist */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            animation: isVisible ? "slide-in-left 0.8s ease-out" : undefined,
          }}
        >
          <PixelSprite sprite={SCIENTIST_SPRITE} size={96} />
          <div className="mt-3 text-[7px] text-gba-bg-darker text-center">
            Prof. SYLPHE
            <br />
            <span className="text-gba-accent">Directeur de Recherche</span>
          </div>
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
              Nos recherches couvrent l&apos;intelligence artificielle, la biotechnologie
              et les systèmes de communication avancés.
            </p>
            <p className="text-[8px] leading-[16px] text-gba-accent">
              Notre mission : repousser les limites de l&apos;innovation.
            </p>
          </DialogBox>
        </div>
      </div>
    </section>
  );
}
