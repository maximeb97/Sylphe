"use client";

import { useState } from "react";
import PixelSprite, {
  MASTERBALL_SPRITE,
  POKEBALL_SPRITE,
  BUILDING_SPRITE,
} from "@/components/PixelSprite";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import useInView from "@/hooks/useInView";

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

export default function ProductsSection() {
  const { ref, isVisible } = useInView(0.2);
  const [selectedItem, setSelectedItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
