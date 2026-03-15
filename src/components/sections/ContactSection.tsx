"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TypewriterText from "@/components/TypewriterText";
import DialogBox from "@/components/DialogBox";
import PokemonMenu from "@/components/PokemonMenu";
import useInView from "@/hooks/useInView";
import { setGameFlag } from "@/lib/gameState";

export default function ContactSection() {
  const router = useRouter();
  const { ref, isVisible } = useInView(0.2);
  const [pokegearTapCount, setPokegearTapCount] = useState(0);
  const hasLavenderHint =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_lavender_hint") === "true";
  const hasMirrorUnlocked =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_lavender_mirror_unlocked") === "true";

  const handlePokegearTap = () => {
    if (!hasLavenderHint || hasMirrorUnlocked) return;

    const nextCount = pokegearTapCount + 1;
    setPokegearTapCount(nextCount);

    if (nextCount >= 4) {
      setGameFlag("sylphe_lavender_mirror_unlocked");
      router.push("/lavender-mirror");
    }
  };

  return (
    <section ref={ref} id="contact" className="bg-gba-bg tile-bg p-4 md:p-6">
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ CONTACT
      </div>

      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Info */}
          <DialogBox>
            <TypewriterText
              text="Vous souhaitez nous contacter ? Notre équipe est à votre écoute !"
              speed={30}
              delay={isVisible ? 300 : 99999}
              className="text-[8px] leading-[16px] text-gba-text block mb-4"
            />

            <div className="space-y-3 text-[7px] text-gba-text">
              <div className="flex items-center gap-2">
                <span className="text-gba-accent">⬤</span>
                <span>JADIELLE CITY, KANTO</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gba-blue">⬤</span>
                <span>contact@sylphe-corp.kanto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gba-gold">⬤</span>
                <button
                  type="button"
                  onClick={handlePokegearTap}
                  className={
                    hasLavenderHint ? "cursor-pointer-pixel" : "cursor-default"
                  }
                >
                  {hasLavenderHint
                    ? `POKEGEAR: 0800-SYLPHE poste 7 (${pokegearTapCount}/4)`
                    : "POKÉGEAR: 0800-SYLPHE"}
                </button>
              </div>
            </div>

            {hasLavenderHint && !hasMirrorUnlocked && (
              <div className="mt-4 text-[6px] text-gba-shadow">
                Une vieille ligne de Lavanville repond encore. Les postes
                oublies n&apos;ont jamais ete retires du central.
              </div>
            )}
          </DialogBox>

          {/* Navigation Menu */}
          <PokemonMenu
            items={[
              { label: "ACCUEIL", href: "#" },
              { label: "À PROPOS", href: "#about" },
              { label: "PRODUITS", href: "#products" },
              { label: "STATISTIQUES", href: "#stats" },
              { label: "ÉQUIPE", href: "#team" },
              { label: "SAUVEGARDER", href: "#" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
