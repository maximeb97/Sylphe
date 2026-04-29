"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelSprite, {
  MASTERBALL_SPRITE,
  POKEBALL_SPRITE,
  BUILDING_SPRITE,
} from "@/components/PixelSprite";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import useInView from "@/hooks/useInView";
import { setGameFlag } from "@/lib/gameState";

type Product = {
  name: string;
  desc: string;
  fullDesc: string;
  sprite?: string[][];
  imageSrc?: string;
  imageAlt?: string;
  stat: string;
  price: string;
  buyLabel?: string;
  actionHref?: string;
  onClick?: () => void;
  openInNewTab?: boolean;
};

function ProductArtwork({
  sprite,
  imageSrc,
  imageAlt,
  size,
  animate,
}: {
  sprite?: string[][];
  imageSrc?: string;
  imageAlt: string;
  size: number;
  animate?: boolean;
}) {
  if (imageSrc) {
    return (
      <div
        className="relative self-center shrink-0 overflow-hidden pixel-border bg-gba-bg"
        style={{
          width: size,
          height: size,
          animation: animate ? "float 3s ease-in-out infinite" : undefined,
        }}
      >
        {/* The artwork source can be a local path or arbitrary external URL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-contain"
          style={{
            imageRendering: "pixelated",
            filter: "contrast(1.08) saturate(0.92)",
          }}
        />
      </div>
    );
  }

  if (!sprite) return null;

  return <PixelSprite sprite={sprite} size={size} animate={animate} />;
}

const products: Product[] = [
  {
    name: "NexVid",
    desc: "Upscale et appliquez des effets à vos vidéos en temps réel",
    fullDesc:
      "NexVid est une extension de navigateur qui permet d'upscale des vidéo en temps réel grâce à une technologie de super-résolution basée sur l'IA. Améliorez la qualité de vos vidéos préférées sans effort.",
    sprite: MASTERBALL_SPRITE,
    stat: "Chrome / Firefox",
    price: "GRATUIT",
    buyLabel: "VISITER",
    actionHref: process.env.NEXT_PUBLIC_NEXVID_URL,
    openInNewTab: true,
    imageSrc: "/img/nexvid.png",
    imageAlt: "NexVid",
  },
  {
    name: "ReClyp",
    desc: "Enregistrer des clips de votre écran et montez les dans votre navigateur",
    fullDesc:
      "ReClyp est un outil de capture d'écran avancé qui vous permet d'enregistrer des clips vidéo de votre écran, de les éditer et de les monter directement dans votre navigateur. Parfait pour créer du contenu rapidement et facilement.",
    sprite: MASTERBALL_SPRITE,
    stat: "Chrome / Firefox",
    price: "GRATUIT / 29 P₽ pour version Pro",
    buyLabel: "VISITER",
    actionHref: process.env.NEXT_PUBLIC_RECLYP_URL,
    openInNewTab: true,
    imageSrc: "/img/reclyp.png",
    imageAlt: "ReClyp",
  },
  {
    name: "FragBin",
    desc: "Un pastebin, en plus moderne !",
    fullDesc:
      "FragBin est un service de partage de code moderne qui permet de stocker et partager des extraits de code facilement. Idéal pour les développeurs qui veulent collaborer rapidement et efficacement.",
    sprite: MASTERBALL_SPRITE,
    stat: "★★★★★",
    price: "GRATUIT",
    buyLabel: "VISITER",
    actionHref: process.env.NEXT_PUBLIC_FRAGBIN_URL,
    openInNewTab: true,
    imageSrc: "/img/fragbin.png",
    imageAlt: "FragBin",
  },
  {
    name: "Browmi",
    desc: "Adoptez un animal virtuel",
    fullDesc:
      "Adoptez un Browmon, un animal de compagnie virtuel qui vit dans votre navigateur. Prenez soin de lui, jouez avec lui et regardez-le grandir au fil du temps. Un compagnon numérique pour égayer vos journées en ligne.",
    sprite: MASTERBALL_SPRITE,
    stat: "★★★★★",
    price: "GRATUIT",
    buyLabel: "VISITER",
    actionHref: process.env.NEXT_PUBLIC_BROWMI_URL,
    openInNewTab: true,
    imageSrc: "/img/browmi.png",
    imageAlt: "Browmi",
  },
  {
    name: "MASTER BALL",
    desc: "Notre produit phare. Technologie de capture ultime avec un taux de réussite de 100%.",
    fullDesc:
      "La Master Ball est le fruit de décennies de recherche par la Sylphe SARL. Elle garantit la capture de n'importe quel Pokémon sauvage sans exception. Un véritable chef-d'œuvre technologique réservé à l'élite.",
    sprite: MASTERBALL_SPRITE,
    stat: "ATK ★★★★★",
    price: "100,000 P₽",
  },
  {
    name: "POKE BALL",
    desc: "La solution classique et fiable. Idéale pour les besoins quotidiens.",
    fullDesc:
      "L'outil de capture standard utilisé par les dresseurs du monde entier. Bien qu'elle n'ait pas le taux de réussite d'une Master Ball, son rapport qualité-prix en fait le produit d'entrée de gamme parfait.",
    sprite: POKEBALL_SPRITE,
    stat: "ATK ★★★☆☆",
    price: "200 P₽",
  },
  {
    name: "SCOPE SYLPHE",
    desc: "Dispositif de détection avancé. Révèle ce qui est invisible à l'œil nu.",
    fullDesc:
      "Le Scope Sylphe utilise des ondes à haute fréquence pour identifier les formes de vie invisibles, notamment les spectres. Indispensable pour l'exploration de la Tour Pokémon à Lavanville.",
    sprite: BUILDING_SPRITE,
    stat: "DEF ★★★★☆",
    price: "PAS À VENDRE",
  },
];

export default function ProductsSection() {
  const router = useRouter();
  const { ref, isVisible } = useInView(0.2);
  const [selectedItem, setSelectedItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scopeInspectCount, setScopeInspectCount] = useState(0);
  const [lavenderHintUnlocked, setLavenderHintUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_lavender_hint") === "true",
  );

  const selectedProduct = products[selectedItem];

  const handleAction = (product: Product) => {
    if (product.onClick) {
      product.onClick();
      return;
    }

    if (!product.actionHref) {
      setIsModalOpen(false);
      return;
    }

    if (product.actionHref.startsWith("/")) {
      router.push(product.actionHref);
      return;
    }

    if (product.openInNewTab ?? true) {
      window.open(product.actionHref, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.assign(product.actionHref);
  };

  const getActionLabel = (product: Product) =>
    product.onClick || product.actionHref
      ? (product.buyLabel ?? "ACHETER")
      : "ACHETER";

  const handleProductOpen = (index: number) => {
    setSelectedItem(index);
    setIsModalOpen(true);

    if (index !== 5) return;

    const nextCount = scopeInspectCount + 1;
    setScopeInspectCount(nextCount);

    if (!lavenderHintUnlocked && nextCount >= 3) {
      setGameFlag("sylphe_lavender_hint");
      setLavenderHintUnlocked(true);
    }

    if (nextCount >= 5) {
      router.push("/spectre-mirror");
    }
  };

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
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Item bag style layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {products.map((product, i) => (
            <button
              key={i}
              onClick={() => handleProductOpen(i)}
              className={`dialog-box text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(40,64,40,1)] ${
                selectedItem === i ? "ring-2 ring-gba-accent" : ""
              }`}
              style={{
                animation: isVisible
                  ? `slide-in-up 0.6s ease-out ${i * 0.15}s both`
                  : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <ProductArtwork
                  sprite={product.sprite}
                  imageSrc={product.imageSrc}
                  imageAlt={product.name}
                  size={48}
                  animate
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
          <span
            className="text-gba-accent"
            style={{ animation: "pixel-pulse 2s infinite" }}
          >
            {lavenderHintUnlocked
              ? "POSTE 7 // LAVANVILLE"
              : "CLIQUEZ POUR DÉTAILS"}
          </span>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct.name}
        description={selectedProduct.fullDesc}
      >
        <div className="flex justify-center mb-4">
          <ProductArtwork
            sprite={selectedProduct.sprite}
            imageSrc={selectedProduct.imageSrc}
            imageAlt={selectedProduct.name}
            size={64}
            animate
          />
        </div>

        <div className="bg-gba-bg p-2 mb-4 pixel-border">
          <div className="flex justify-between text-[8px] text-gba-text mb-2">
            <span>PRIX:</span>
            <span className="text-gba-blue">{selectedProduct.price}</span>
          </div>
          {selectedProduct.stat.includes("★") && (
            <div className="flex justify-between text-[8px] text-gba-text">
              <span>PUISSANCE:</span>
              <span className="text-gba-accent">
                {selectedProduct.stat.split(" ")[1]}
              </span>
            </div>
          )}
        </div>

        {selectedProduct.name === "SCOPE SYLPHE" && lavenderHintUnlocked && (
          <div className="bg-gba-bg p-2 mb-4 pixel-border text-[7px] leading-[14px] text-gba-text">
            Frequence spectrale supplementaire detectee: POKEGEAR 0800-SYLPHE,
            poste 7. Le miroir de Lavanville interne n&apos;est pas liste au
            catalogue.
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            ANNULER
          </Button>
          <Button blinkingArrow onClick={() => handleAction(selectedProduct)}>
            {getActionLabel(selectedProduct)}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
