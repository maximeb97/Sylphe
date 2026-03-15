"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [saveTapCount, setSaveTapCount] = useState(0);

  return (
    <footer className="bg-gba-text text-center py-6 px-4 relative overflow-hidden">
      {/* Decorative pixel border */}
      <div className="flex justify-center gap-1 mb-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[4px] h-[4px]"
            style={{
              backgroundColor:
                i % 3 === 0 ? "#f8d830" : i % 3 === 1 ? "#f85858" : "#5898f8",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="text-[7px] text-gba-bg-darker leading-[14px]">
        <div className="mb-2">
          <span className="text-gba-gold">SYLPHE CORP.</span> © 2026
        </div>
        <div className="text-[6px] text-gba-shadow">
          Propulsé par la technologie de KANTO
        </div>
        <div className="mt-2 text-[6px] text-gba-shadow">
          ▲ Appuyez sur START pour sauvegarder ▲
        </div>
        <button
          type="button"
          onClick={() => {
            const next = saveTapCount + 1;
            setSaveTapCount(next);
            if (next >= 8) router.push("/pc-bill");
          }}
          className="mt-3 text-[5px] text-gba-shadow opacity-40 cursor-pointer-pixel"
        >
          ██ DONNÉES SAUVEGARDÉES ██ N&apos;ÉTEIGNEZ PAS ██
        </button>
        {saveTapCount >= 4 && (
          <div className="mt-2 text-[5px] text-gba-gold opacity-60">
            miroir discret: certains badges corporate repondent trop bien a
            l&apos;ID 31415
          </div>
        )}
      </div>

      {/* Bottom pixel line */}
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[4px] h-[4px]"
            style={{
              backgroundColor:
                i % 3 === 0 ? "#f8d830" : i % 3 === 1 ? "#f85858" : "#5898f8",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Hidden CSS secrets - only visible via DOM inspection or Ctrl+A */}
      <div
        style={{
          color: "transparent",
          fontSize: "1px",
          lineHeight: "1px",
          userSelect: "text",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        JOURNAL DE BORD — DR FUJI — Le sujet 150 montre des capacites psychiques
        depassant toute mesure. Giovanni insiste pour accelerer. Mot de passe
        casino: les triple 7 cachent Porygon-Z. Verifiez /humans.txt pour le
        dernier message du developpeur piege. Les cuves de clonage sont au poste 42.
        Le miroir spectral detecte trois spectres. La maison piege requiert un badge securite.
        L&apos;intranet Rocket ne se montre qu&apos;a Giovanni.
      </div>
    </footer>
  );
}
