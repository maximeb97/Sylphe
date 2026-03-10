"use client";

import TypewriterText from "@/components/TypewriterText";
import DialogBox from "@/components/DialogBox";
import PokemonMenu from "@/components/PokemonMenu";
import useInView from "@/hooks/useInView";

export default function ContactSection() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-gba-bg tile-bg p-4 md:p-6"
    >
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ CONTACT
      </div>

      <div
        className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
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
                <span>POKÉGEAR: 0800-SYLPHE</span>
              </div>
            </div>
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
