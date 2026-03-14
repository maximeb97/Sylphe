"use client";

import { useState, useEffect } from "react";
import PixelSprite, { SCIENTIST_SPRITE, COCKATIEL_SPRITE, MISSINGNO_SPRITE, PLAYER_SPRITE, TEAM_ROCKET_SPRITE, MEW_SPRITE, BOSS_SPRITE, GHOST_SPRITE } from "@/components/PixelSprite";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import useInView from "@/hooks/useInView";
import { getAgeByDate } from "@/lib/terminal/utils/date";

const team = [
  { name: "BOSS", title: "Giovanni", level: 99, hp: 999, maxHp: 999, desc: "Le véritable boss de la Sylphe, tapi dans les ombres.", sprite: BOSS_SPRITE },
  { name: "DEVELOPPEUR", title: "Maxime B.", level: getAgeByDate(new Date("1997-03-10")), hp: 120, maxHp: 120, desc: "Le créateur du Sylphe OS. Il supervise le code et passe son temps à tuer les bugs à l'aide de sa fidèle mascotte.", sprite: PLAYER_SPRITE },
  // TODO: Future idée
  // { name: "FANTÔME", title: "L'esprit de Cali", level: 99, hp: 0, maxHp: 1, desc: "Une plume trouvée par terre... L'esprit d'une mascotte qui veillera sur vous pour toujours.", sprite: GHOST_SPRITE },
  { name: "MASCOTTE", title: "Yuan Yuan", level: getAgeByDate(new Date("2025-07-07")), hp: 80, maxHp: 80, desc: "La perruche calopsitte de la compagnie. Protège l'équipe des bugs en picorant les câbles. Aime passionnément les graines.", sprite: COCKATIEL_SPRITE },
  { name: "???", title: "M?ssingN0", level: 145, hp: 0, maxHp: 0, desc: "An\u00A0er\u00A0ror ha\u00A0s\u00A0occ\u00A0ur\u00A0red. System d\u00A0at\u00A0a corr\u00A0up\u00A0ted. $!1011..#..", sprite: MISSINGNO_SPRITE },
  { name: "LÉGENDE", title: "Mew", level: 5, hp: 30, maxHp: 30, desc: "Un Pokémon mythique extrêmement rare. Il semble contenir l'ADN de tous les Pokémon existants. Il a été trouvé en train de nager avec des Magicarpes.", sprite: MEW_SPRITE },
];

export default function TeamSection() {
  const { ref, isVisible } = useInView(0.2);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showMissingNo, setShowMissingNo] = useState(false);
  const [showMew, setShowMew] = useState(false);
  const [showGiovanni, setShowGiovanni] = useState(false);
  const [showCali, setShowCali] = useState(false);

  // Easter Egg check
  useEffect(() => {
    const checkEggs = () => {
      setShowMissingNo(localStorage.getItem("sylphe_missingno_unlocked") === "true");
      setShowMew(localStorage.getItem("sylphe_mew_captured") === "true");
      setShowGiovanni(localStorage.getItem("sylphe_giovanni_unlocked") === "true");
      setShowCali(localStorage.getItem("sylphe_cali_unlocked") === "true");
    };
    checkEggs();
    window.addEventListener("storage", checkEggs);
    return () => window.removeEventListener("storage", checkEggs);
  }, []);

  const visibleTeam = team.filter((m) => {
    if (m.name === "BOSS") return showGiovanni;
    if (m.name === "FANTÔME") return showCali;
    if (m.name === "???") return showMissingNo;
    if (m.title === "Mew") return showMew;
    return true;
  });

  return (
    <section
      ref={ref}
      id="team"
      className="bg-gba-bg-dark tile-bg p-4 md:p-6"
    >
      <div className="bg-gba-text text-gba-gold text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ ÉQUIPE
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {visibleTeam.map((member, i) => (
          <button
            key={i}
            onClick={() => setSelectedMember(i)}
            className="dialog-box text-left hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(40,64,40,1)] transition-transform"
            style={{
              animation: isVisible
                ? `slide-in-up 0.5s ease-out ${i * 0.15}s both`
                : undefined,
            }}
          >
            <div className="flex items-start gap-3">
              <PixelSprite
                sprite={member.sprite || SCIENTIST_SPRITE}
                size={48}
                animate={selectedMember === i}
                className={member.name === "???" ? "hue-rotate-[120deg] mix-blend-difference" : ""}
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className={`text-[8px] font-bold ${member.name === "???" ? "text-red-500 blur-[0.5px]" : "text-gba-text"}`}>{member.name}</div>
                    <div className="text-[7px] text-gba-accent">
                      {member.title}
                    </div>
                  </div>
                  <div className={`text-[7px] ${member.name === "???" ? "text-red-500 line-through" : "text-gba-bg-darker"}`}>
                    Lv{member.level}
                  </div>
                </div>

                <ProgressBar value={member.hp} max={member.maxHp} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Team Member Modal */}
      {selectedMember !== null && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title={visibleTeam[selectedMember].name === "???" ? "$!#& M?S S INGN0 ¤" : `PROFILE : ${visibleTeam[selectedMember].title}`}
          description={visibleTeam[selectedMember].desc}
        >
          <div className={`flex items-center gap-4 mb-4 bg-gba-bg p-3 pixel-border ${visibleTeam[selectedMember].name === "???" ? "animate-pulse blur-[1px] rotate-1 hue-rotate-180" : ""}`}>
            <PixelSprite sprite={visibleTeam[selectedMember].sprite || SCIENTIST_SPRITE} size={64} animate />
            <div className="flex-1 space-y-3">
              <ProgressBar value={visibleTeam[selectedMember].hp} max={visibleTeam[selectedMember].maxHp || 1} label={visibleTeam[selectedMember].name === "???" ? "E R R OR" : "SANTÉ"} />
              <ProgressBar value={visibleTeam[selectedMember].level} max={100} label={visibleTeam[selectedMember].name === "???" ? "L V L" : "EXPÉRIENCE"} color="bg-gba-blue" />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setSelectedMember(null)}>
              RETOUR
            </Button>
            <Button blinkingArrow onClick={() => setSelectedMember(null)}>
              RECRUTER
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
