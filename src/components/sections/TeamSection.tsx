"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PixelSprite, {
  SCIENTIST_SPRITE,
  COCKATIEL_SPRITE,
  MISSINGNO_SPRITE,
  PLAYER_SPRITE,
  MEW_SPRITE,
  MEWTWO_SPRITE,
  PORYGON_SPRITE,
  BOSS_SPRITE,
  NEUTRAL_NPC_SPRITE,
  KABUTO_SPRITE,
  FANTOMINUS_SPRITE,
  LAPRAS_SPRITE,
  ELECTRODE_SPRITE,
} from "@/components/PixelSprite";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import useInView from "@/hooks/useInView";
import { getAgeByDate } from "@/lib/terminal/utils/date";

const team = [
  {
    name: "BOSS",
    title: "Giovanni",
    level: 99,
    hp: 999,
    maxHp: 999,
    desc: "Le véritable boss de la Sylphe, tapi dans les ombres.",
    sprite: BOSS_SPRITE,
  },
  {
    name: "VISITEUR",
    title: "??",
    level: "??",
    hp: 120,
    maxHp: 120,
    desc: "Un visiteur mystérieux dont l'identité est inconnue. Il semble être un expert en informatique, mais personne ne sait comment il est arrivé ici ni ce qu'il veut.",
    sprite: NEUTRAL_NPC_SPRITE,
  },
  {
    name: "DEVELOPPEUR",
    title: "Maxime B.",
    level: getAgeByDate(new Date("1997-03-10")),
    hp: 120,
    maxHp: 120,
    desc: "Le créateur du Sylphe OS. Il supervise le code et passe son temps à tuer les bugs à l'aide de sa fidèle mascotte.",
    sprite: PLAYER_SPRITE,
  },
  // TODO: Future idée
  // { name: "FANTÔME", title: "L'esprit de Cali", level: 99, hp: 0, maxHp: 1, desc: "Une plume trouvée par terre... L'esprit d'une mascotte qui veillera sur vous pour toujours.", sprite: GHOST_SPRITE },
  {
    name: "MASCOTTE",
    title: "Yuan Yuan",
    level: getAgeByDate(new Date("2025-07-07")),
    hp: 80,
    maxHp: 80,
    desc: "La perruche calopsitte de la compagnie. Protège l'équipe des bugs en picorant les câbles. Aime passionnément les graines.",
    sprite: COCKATIEL_SPRITE,
  },
  {
    name: "???",
    title: "M?ssingN0",
    level: 145,
    hp: 0,
    maxHp: 0,
    desc: "An\u00A0er\u00A0ror ha\u00A0s\u00A0occ\u00A0ur\u00A0red. System d\u00A0at\u00A0a corr\u00A0up\u00A0ted. $!1011..#..",
    sprite: MISSINGNO_SPRITE,
  },
  {
    name: "LÉGENDE",
    title: "Mew",
    level: 5,
    hp: 30,
    maxHp: 30,
    desc: "Un Pokémon mythique extrêmement rare. Il semble contenir l'ADN de tous les Pokémon existants. Il a été trouvé en train de nager avec des Magicarpes.",
    sprite: MEW_SPRITE,
  },
  {
    name: "CLONE",
    title: "Mewtwo",
    level: 70,
    hp: 106,
    maxHp: 106,
    desc: "Le clone #150 capture dans la Chambre 042. Sa puissance psychique continue de troubler les senseurs du batiment.",
    sprite: MEWTWO_SPRITE,
  },
  {
    name: "ANOMALIE",
    title: "Porygon Echo",
    level: 42,
    hp: 77,
    maxHp: 77,
    desc: "Residus d'un transfert depuis le noeud 42. Ce Porygon ne vit ni vraiment dans le cyber-espace, ni vraiment dans la Pokeball.",
    sprite: PORYGON_SPRITE,
  },
  {
    name: "FOSSILE",
    title: "Kabuto",
    level: 37,
    hp: 54,
    maxHp: 54,
    desc: "Fossile reveille dans les profondeurs du Mont Selenite. Son exosquelette retient encore la memoire humide de la grotte.",
    sprite: KABUTO_SPRITE,
  },
  {
    name: "SPECTRE",
    title: "Fantominus",
    level: 28,
    hp: 36,
    maxHp: 36,
    desc: "Condensation violette recueillie dans le Miroir Spectral. Il flotte comme une erreur de lumiere qui aurait decide de rester.",
    sprite: FANTOMINUS_SPRITE,
  },
  {
    name: "NAVETTE",
    title: "Lapras",
    level: 44,
    hp: 92,
    maxHp: 92,
    desc: "Prototype logistique du 11e etage, exfiltre avec les derniers survivants de maintenance.",
    sprite: LAPRAS_SPRITE,
  },
  {
    name: "SURCHARGE",
    title: "Electrode",
    level: 41,
    hp: 60,
    maxHp: 60,
    desc: "Batterie vivante capturee au coeur d'une surcharge du 11e etage. Son humeur reste aussi stable que les circuits Rocket.",
    sprite: ELECTRODE_SPRITE,
  },
];

export default function TeamSection() {
  const router = useRouter();
  const { ref, isVisible } = useInView(0.2);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showMissingNo, setShowMissingNo] = useState(false);
  const [showMew, setShowMew] = useState(false);
  const [showMewtwo, setShowMewtwo] = useState(false);
  const [showPorygonEcho, setShowPorygonEcho] = useState(false);
  const [showGiovanni, setShowGiovanni] = useState(false);
  const [showCali, setShowCali] = useState(false);
  const [showKabuto, setShowKabuto] = useState(false);
  const [showFantominus, setShowFantominus] = useState(false);
  const [showLapras, setShowLapras] = useState(false);
  const [showElectrode, setShowElectrode] = useState(false);
  const [maximeRescued, setMaximeRescued] = useState(false);
  const [hasArchivePortal, setHasArchivePortal] = useState(false);
  const [porygonSyncCount, setPorygonSyncCount] = useState(0);
  const [giovanniTapCount, setGiovanniTapCount] = useState(0);

  // Easter Egg check
  useEffect(() => {
    const checkEggs = () => {
      setShowMissingNo(localStorage.getItem("sylphe_missingno_unlocked") === "true");
      setShowMew(localStorage.getItem("sylphe_mew_captured") === "true");
      setShowMewtwo(localStorage.getItem("sylphe_mewtwo_captured") === "true");
      setShowPorygonEcho(
        localStorage.getItem("sylphe_porygon_echo") === "true",
      );
      setShowGiovanni(localStorage.getItem("sylphe_giovanni_unlocked") === "true");
      setShowCali(localStorage.getItem("sylphe_cali_unlocked") === "true");
      setShowKabuto(localStorage.getItem("sylphe_kabuto_captured") === "true");
      setShowFantominus(localStorage.getItem("sylphe_fantominus_captured") === "true");
      setShowLapras(localStorage.getItem("sylphe_lapras_captured") === "true");
      setShowElectrode(localStorage.getItem("sylphe_electrode_captured") === "true");
      setMaximeRescued(localStorage.getItem("sylphe_maxime_rescued") === "true");
      setHasArchivePortal(
        localStorage.getItem("sylphe_archive_debug") === "true" ||
          localStorage.getItem("sylphe_hall_of_fame") === "true",
      );
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
    if (m.title === "Mewtwo") return showMewtwo;
    if (m.title === "Porygon Echo") return showPorygonEcho;
    if (m.title === "Kabuto") return showKabuto;
    if (m.title === "Fantominus") return showFantominus;
    if (m.title === "Lapras") return showLapras;
    if (m.title === "Electrode") return showElectrode;
    return true;
  });

  const handleMemberClick = (memberIndex: number) => {
    const member = visibleTeam[memberIndex];
    if (!member) return;

    if (member.title === "Porygon Echo") {
      const nextSyncCount = porygonSyncCount + 1;
      setPorygonSyncCount(nextSyncCount);
      setSelectedMember(memberIndex);

      if (hasArchivePortal && nextSyncCount >= 4) {
        setPorygonSyncCount(0);
        router.push("/hall-of-fame");
      }
      return;
    }

    if (member.name === "BOSS") {
      const nextTap = giovanniTapCount + 1;
      setGiovanniTapCount(nextTap);
      setSelectedMember(memberIndex);
      if (nextTap >= 3) {
        router.push("/employee-login");
      }
      return;
    }

    setPorygonSyncCount(0);
    setSelectedMember(memberIndex);
  };

  return (
    <section ref={ref} id="team" className="bg-gba-bg-dark tile-bg p-4 md:p-6">
      <div className="bg-gba-text text-gba-gold text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ ÉQUIPE
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {visibleTeam.map((member, i) => (
          <button
            key={i}
            onClick={() => handleMemberClick(i)}
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
                className={
                  member.name === "???"
                    ? "hue-rotate-[120deg] mix-blend-difference"
                    : ""
                }
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div
                      className={`text-[8px] font-bold ${member.name === "???" ? "text-red-500 blur-[0.5px]" : "text-gba-text"}`}
                    >
                      {member.name}
                    </div>
                    <div className="text-[7px] text-gba-accent">
                      {member.title}
                    </div>
                  </div>
                  <div
                    className={`text-[7px] ${member.name === "???" ? "text-red-500 line-through" : "text-gba-bg-darker"}`}
                  >
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
          title={
            visibleTeam[selectedMember].name === "???"
              ? "$!#& M?S S INGN0 ¤"
              : `PROFILE : ${visibleTeam[selectedMember].title}`
          }
          description={visibleTeam[selectedMember].desc}
        >
          <div
            className={`flex items-center gap-4 mb-4 bg-gba-bg p-3 pixel-border ${visibleTeam[selectedMember].name === "???" ? "animate-pulse blur-[1px] rotate-1 hue-rotate-180" : ""}`}
          >
            <PixelSprite
              sprite={visibleTeam[selectedMember].sprite || SCIENTIST_SPRITE}
              size={64}
              animate
            />
            <div className="flex-1 space-y-3">
              <ProgressBar
                value={visibleTeam[selectedMember].hp}
                max={visibleTeam[selectedMember].maxHp || 1}
                label={
                  visibleTeam[selectedMember].name === "???"
                    ? "E R R OR"
                    : "SANTÉ"
                }
              />
              <ProgressBar
                value={parseInt(`${visibleTeam[selectedMember].level}`) || 0}
                max={100}
                label={
                  visibleTeam[selectedMember].name === "???"
                    ? "L V L"
                    : "EXPÉRIENCE"
                }
                color="bg-gba-blue"
              />
            </div>
          </div>

          {visibleTeam[selectedMember].title === "Porygon Echo" && (
            <div className="mb-4 bg-gba-bg p-3 pixel-border text-[7px] leading-[14px] text-gba-text">
              {hasArchivePortal
                ? `SYNC ARCHIVE: ${porygonSyncCount}/4 impulsions. Continuez a cliquer pour ouvrir directement l'archive.`
                : "Porygon Echo trouve encore une archive fermee quelque part dans le systeme."}
            </div>
          )}

          {visibleTeam[selectedMember].name === "DEVELOPPEUR" && (
            <div className="mb-4 bg-gba-bg p-3 pixel-border text-[7px] leading-[14px] text-gba-text">
              {maximeRescued
                ? "Signal stable: la signature principale du developpeur a ete recuperee au 11e etage."
                : "Signal duplique: une copie de supervision se montre ici, mais la signature stable du developpeur reste prisonniere au 11e etage."}
            </div>
          )}

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
