"use client";

import { useState, useEffect, useCallback } from "react";
import GBAShell from "@/components/GBAShell";
import TypewriterText from "@/components/TypewriterText";
import DialogBox from "@/components/DialogBox";
import PokemonMenu from "@/components/PokemonMenu";
import PixelSprite, {
  BUILDING_SPRITE,
  POKEBALL_SPRITE,
  SCIENTIST_SPRITE,
  MASTERBALL_SPRITE,
} from "@/components/PixelSprite";
import StarField from "@/components/StarField";
import TileMap from "@/components/TileMap";
import useInView from "@/hooks/useInView";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";

/* ==============================
   TITLE SCREEN
   ============================== */
function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showPress, setShowPress] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPress(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px] bg-gba-text tile-bg overflow-hidden">
      <StarField />

      {/* Logo */}
      <div
        className="relative z-10 text-center"
        style={{ animation: "slide-in-up 1s ease-out" }}
      >
        <div className="mb-2">
          <PixelSprite sprite={BUILDING_SPRITE} size={112} className="mx-auto" />
        </div>

        <h1
          className="text-gba-gold text-[18px] md:text-[22px] leading-tight tracking-wider mb-1"
          style={{
            textShadow: "2px 2px 0 #a08820, 4px 4px 0 #604810",
          }}
        >
          SYLPHE
        </h1>
        <h2
          className="text-gba-white text-[10px] md:text-[12px] tracking-[6px]"
          style={{
            textShadow: "1px 1px 0 #384030",
          }}
        >
          CORPORATION
        </h2>

        <div className="mt-4 text-[7px] text-gba-bg-dark tracking-wider">
          ─── La Technologie du Futur ───
        </div>
      </div>

      {/* Press Start */}
      {showPress && (
        <button
          onClick={onStart}
          className="relative z-10 mt-10 text-[9px] text-gba-white tracking-wider"
          style={{ animation: "pixel-pulse 1.5s ease-in-out infinite" }}
        >
          ▶ PRESS START ◀
        </button>
      )}

      {/* Version tag */}
      <div className="absolute bottom-4 right-4 text-[6px] text-gba-bg-darker z-10">
        v3.1.4
      </div>
      <div className="absolute bottom-4 left-4 text-[6px] text-gba-bg-darker z-10">
        © 2026 SYLPHE
      </div>
    </div>
  );
}

/* ==============================
   HERO SECTION (OVERWORLD)
   ============================== */
function HeroSection() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-gba-bg tile-bg pixel-grid">
      {/* Top bar - Location header */}
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-4 py-2 flex justify-between items-center">
        <span>📍 JADIELLE CITY</span>
        <span className="opacity-60">SYLPHE CORP. HQ</span>
      </div>

      {/* Tile Map */}
      <div className="relative">
        <TileMap className="opacity-90" />

        {/* Overlay dialog */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-700 ${isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
            }`}
        >
          <DialogBox>
            <TypewriterText
              text="Bienvenue à SYLPHE CORP. ! Nous sommes le leader mondial de la recherche technologique."
              speed={40}
              className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
            />
          </DialogBox>
        </div>
      </div>
    </section>
  );
}

/* ==============================
   ABOUT SECTION
   ============================== */
function AboutSection() {
  const { ref, isVisible } = useInView(0.2);

  return (
    <section
      ref={ref}
      id="about"
      className="bg-gba-bg tile-bg p-4 md:p-6 relative"
    >
      {/* Section header like Pokemon menu header */}
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

/* ==============================
   PRODUCTS/SERVICES (ITEMS MENU)
   ============================== */
function ProductsSection() {
  const { ref, isVisible } = useInView(0.2);
  const [selectedItem, setSelectedItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      name: "MASTER BALL",
      desc: "Notre produit phare. Technologie de capture ultime avec un taux de réussite de 100%.",
      fullDesc: "La Master Ball est le fruit de décennies de recherche par la Sylphe SARL. Elle garantit la capture de n'importe quel Pokémon sauvage sans exception. Un véritable chef-d'œuvre technologique réservé à l'élite.",
      sprite: MASTERBALL_SPRITE,
      stat: "ATK ★★★★★",
      price: "100,000 P₽"
    },
    {
      name: "POKE BALL",
      desc: "La solution classique et fiable. Idéale pour les besoins quotidiens.",
      fullDesc: "L'outil de capture standard utilisé par les dresseurs du monde entier. Bien qu'elle n'ait pas le taux de réussite d'une Master Ball, son rapport qualité-prix en fait le produit d'entrée de gamme parfait.",
      sprite: POKEBALL_SPRITE,
      stat: "ATK ★★★☆☆",
      price: "200 P₽"
    },
    {
      name: "SCOPE SYLPHE",
      desc: "Dispositif de détection avancé. Révèle ce qui est invisible à l'œil nu.",
      fullDesc: "Le Scope Sylphe utilise des ondes à haute fréquence pour identifier les formes de vie invisibles, notamment les spectres. Indispensable pour l'exploration de la Tour Pokémon à Lavanville.",
      sprite: BUILDING_SPRITE,
      stat: "DEF ★★★★☆",
      price: "NON À VENDRE"
    },
  ];

  return (
    <section
      ref={ref}
      id="products"
      className="bg-gba-bg-dark tile-bg p-4 md:p-6 relative"
    >
      <div className="bg-gba-text text-gba-gold text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ PRODUITS
      </div>

      <div
        className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Item bag style layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {products.map((product, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedItem(i);
                setIsModalOpen(true);
              }}
              className={`dialog-box text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(40,64,40,1)] ${selectedItem === i
                ? "ring-2 ring-gba-accent"
                : ""
                }`}
              style={{
                animation: isVisible
                  ? `slide-in-up 0.6s ease-out ${i * 0.15}s both`
                  : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <PixelSprite
                  sprite={product.sprite}
                  size={48}
                  animate={true}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-gba-text font-bold mb-1">
                    {selectedItem === i && (
                      <span
                        className="inline-block mr-1 text-gba-accent"
                        style={{
                          animation: "menu-arrow 0.6s ease-in-out infinite",
                        }}
                      >
                        ▶
                      </span>
                    )}
                    {product.name}
                  </div>
                  <div className="text-[7px] text-gba-bg-darker leading-[12px]">
                    {product.desc}
                  </div>
                  <div className="mt-2 text-[7px] text-gba-accent">
                    {product.stat}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom info bar */}
        <div className="mt-3 dialog-box text-[7px] text-gba-text flex justify-between">
          <span>
            ITEM {selectedItem + 1}/{products.length}
          </span>
          <span className="text-gba-accent" style={{ animation: "pixel-pulse 2s infinite" }}>
            CLIQUEZ POUR DÉTAILS
          </span>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={products[selectedItem].name}
        description={products[selectedItem].fullDesc}
      >
        <div className="flex justify-center mb-4">
          <PixelSprite sprite={products[selectedItem].sprite} size={64} animate />
        </div>

        <div className="bg-gba-bg p-2 mb-4 pixel-border">
          <div className="flex justify-between text-[8px] text-gba-text mb-2">
            <span>PRIX:</span>
            <span className="text-gba-blue">{products[selectedItem].price}</span>
          </div>
          <div className="flex justify-between text-[8px] text-gba-text">
            <span>PUISSANCE:</span>
            <span className="text-gba-accent">{products[selectedItem].stat.split(' ')[1]}</span>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            ANNULER
          </Button>
          <Button blinkingArrow onClick={() => setIsModalOpen(false)}>
            ACHETER
          </Button>
        </div>
      </Modal>
    </section>
  );
}

/* ==============================
   STATS SECTION (POKEMON STATS)
   ============================== */
function StatsSection() {
  const { ref, isVisible } = useInView(0.2);
  const [counters, setCounters] = useState({ emp: 0, proj: 0, rev: 0 });

  useEffect(() => {
    if (!isVisible) return;
    const targets = { emp: 2547, proj: 894, rev: 99 };
    const duration = 2000;
    const steps = 40;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        emp: Math.round(targets.emp * progress),
        proj: Math.round(targets.proj * progress),
        rev: Math.round(targets.rev * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  const stats = [
    { label: "EMPLOYÉS", value: counters.emp, max: 3000, color: "bg-[#58a858]" },
    { label: "PROJETS", value: counters.proj, max: 1000, color: "bg-gba-blue" },
    { label: "SATISFACTION", value: counters.rev, max: 100, color: "bg-gba-accent" },
  ];

  return (
    <section
      ref={ref}
      id="stats"
      className="bg-gba-bg tile-bg p-4 md:p-6"
    >
      <div className="bg-gba-bg-darker text-gba-white text-[8px] px-3 py-2 mb-4 pixel-border inline-block">
        ▶ STATISTIQUES
      </div>

      <div
        className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="dialog-box">
          {/* Pokemon trainer card style */}
          <div className="text-center mb-4">
            <div className="text-[10px] text-gba-text mb-1">SYLPHE CORP.</div>
            <div className="text-[7px] text-gba-bg-darker">
              ID No. 31415 &nbsp;│&nbsp; KANTO REGION
            </div>
          </div>

          {/* HP-style bars */}
          <div className="space-y-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  animation: isVisible
                    ? `slide-in-left 0.5s ease-out ${i * 0.2}s both`
                    : undefined,
                }}
              >
                <div className="flex justify-between text-[7px] text-gba-text mb-1">
                  <span>{stat.label}</span>
                  <span>
                    {stat.value}
                    {stat.max === 100 ? "%" : ""}
                  </span>
                </div>
                <div className="h-[8px] bg-gba-border rounded-none overflow-hidden pixel-border">
                  <div
                    className={`h-full ${stat.color} transition-all duration-1000 ease-out`}
                    style={{
                      width: isVisible
                        ? `${(stat.value / stat.max) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Badges row */}
          <div className="mt-5 pt-3 border-t-2 border-gba-bg-dark">
            <div className="text-[7px] text-gba-bg-darker mb-2">BADGES</div>
            <div className="flex gap-2 flex-wrap">
              {[
                "Innovation",
                "IA",
                "Biotech",
                "Sécurité",
                "Cloud",
                "Quantique",
                "Nano",
                "Énergie",
              ].map((badge, i) => (
                <div
                  key={i}
                  className="bg-gba-bg-darker text-gba-gold text-[6px] px-2 py-1 pixel-border"
                  style={{
                    animation: isVisible
                      ? `fade-in 0.3s ease-out ${0.5 + i * 0.1}s both`
                      : undefined,
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==============================
   TEAM SECTION
   ============================== */
function TeamSection() {
  const { ref, isVisible } = useInView(0.2);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const team = [
    { name: "DIRECTEUR", title: "Giovanni S.", level: 50, hp: 120, maxHp: 120, desc: "Le mystérieux directeur de la Sylphe Corp. Il supervise secrètement toutes les opérations de l'entreprise d'une main de fer." },
    { name: "CHERCHEUR", title: "Dr. Fuji", level: 45, hp: 85, maxHp: 100, desc: "Ancien dirigeant du laboratoire de Cramois'Île. Ses recherches sur le clonage et la génétique sont mondialement reconnues." },
    { name: "INGÉNIEUR", title: "Bill Tech", level: 42, hp: 45, maxHp: 90, desc: "Un génie de l'informatique responsable du système de stockage de PC. Il a un penchant étrange pour se transformer en Pokémon." },
    { name: "ANALYSTE", title: "Léa Data", level: 38, hp: 20, maxHp: 80, desc: "Experte en analyse de données. Elle optimise les chaînes de production des Poké Balls à la milliseconde près." },
  ];

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

/* ==============================
   CONTACT SECTION
   ============================== */
function ContactSection() {
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

/* ==============================
   FOOTER
   ============================== */
function Footer() {
  return (
    <footer className="bg-gba-text text-center py-4 px-4">
      <div className="text-[7px] text-gba-bg-darker leading-[14px]">
        <div className="mb-2">
          <span className="text-gba-gold">SYLPHE CORP.</span> © 2026
        </div>
        <div className="text-[6px] text-gba-shadow">
          Propulsé par la technologie de KANTO
        </div>
        <div className="mt-2 text-[6px] text-gba-shadow opacity-50">
          ───── FIN ─────
        </div>
      </div>
    </footer>
  );
}

/* ==============================
   MAIN PAGE
   ============================== */
export default function Home() {
  const [showTransition, setShowTransition] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntroDialog, setShowIntroDialog] = useState(false);
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [isPCModalOpen, setIsPCModalOpen] = useState(false);

  const handleStart = useCallback(() => {
    setShowTransition(true);
    // Flash effect
    setTimeout(() => {
      setGameStarted(true);
      setShowTransition(false);
      setTimeout(() => {
        setShowIntroDialog(true);
      }, 4500); // Wait for the camera pan down
    }, 600);
  }, []);

  const handleDismissIntroDialog = useCallback(() => {
    setShowIntroDialog(false);
  }, []);

  const handleTypewriterComplete = useCallback(() => {
    setIsTypewriterDone(true);
  }, []);

  const handleInteractPC = useCallback(() => {
    setIsPCModalOpen(true);
  }, []);

  const handleClosePCModal = useCallback(() => {
    setIsPCModalOpen(false);
  }, []);

  return (
    <GBAShell>
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
            <div className="flex gap-3">
              {[
                { label: "INFO", href: "#about" },
                { label: "ITEMS", href: "#products" },
                { label: "STATS", href: "#stats" },
                { label: "TEAM", href: "#team" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-gba-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <HeroSection />
          <AboutSection />
          <ProductsSection />
          <StatsSection />
          <TeamSection />
          <ContactSection />
          <Footer />
        </div>
      )}
    </GBAShell>
  );
}
