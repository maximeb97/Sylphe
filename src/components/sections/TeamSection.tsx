"use client";

import { useState } from "react";
import PixelSprite, { SCIENTIST_SPRITE } from "@/components/PixelSprite";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import useInView from "@/hooks/useInView";

const team = [
  { name: "DIRECTEUR", title: "Giovanni S.", level: 50, hp: 120, maxHp: 120, desc: "Le mystérieux directeur de la Sylphe Corp. Il supervise secrètement toutes les opérations de l'entreprise d'une main de fer." },
  { name: "CHERCHEUR", title: "Dr. Fuji", level: 45, hp: 85, maxHp: 100, desc: "Ancien dirigeant du laboratoire de Cramois'Île. Ses recherches sur le clonage et la génétique sont mondialement reconnues." },
  { name: "INGÉNIEUR", title: "Bill Tech", level: 42, hp: 45, maxHp: 90, desc: "Un génie de l'informatique responsable du système de stockage de PC. Il a un penchant étrange pour se transformer en Pokémon." },
  { name: "ANALYSTE", title: "Léa Data", level: 38, hp: 20, maxHp: 80, desc: "Experte en analyse de données. Elle optimise les chaînes de production des Poké Balls à la milliseconde près." },
];

export default function TeamSection() {
  const { ref, isVisible } = useInView(0.2);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

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
        {team.map((member, i) => (
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
                sprite={SCIENTIST_SPRITE}
                size={48}
                animate={selectedMember === i}
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-[8px] text-gba-text font-bold">{member.name}</div>
                    <div className="text-[7px] text-gba-accent">
                      {member.title}
                    </div>
                  </div>
                  <div className="text-[7px] text-gba-bg-darker">
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
          title={`PROFILE : ${team[selectedMember].title}`}
          description={team[selectedMember].desc}
        >
          <div className="flex items-center gap-4 mb-4 bg-gba-bg p-3 pixel-border">
            <PixelSprite sprite={SCIENTIST_SPRITE} size={64} animate />
            <div className="flex-1 space-y-3">
              <ProgressBar value={team[selectedMember].hp} max={team[selectedMember].maxHp} label="SANTÉ" />
              <ProgressBar value={team[selectedMember].level} max={100} label="EXPÉRIENCE" color="bg-gba-blue" />
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
