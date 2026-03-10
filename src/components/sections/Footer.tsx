export default function Footer() {
  return (
    <footer className="bg-gba-text text-center py-6 px-4 relative overflow-hidden">
      {/* Decorative pixel border */}
      <div className="flex justify-center gap-1 mb-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[4px] h-[4px]"
            style={{
              backgroundColor: i % 3 === 0 ? "#f8d830" : i % 3 === 1 ? "#f85858" : "#5898f8",
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
        <div className="mt-3 text-[5px] text-gba-shadow opacity-40">
          ██ DONNÉES SAUVEGARDÉES ██ N&apos;ÉTEIGNEZ PAS ██
        </div>
      </div>

      {/* Bottom pixel line */}
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[4px] h-[4px]"
            style={{
              backgroundColor: i % 3 === 0 ? "#f8d830" : i % 3 === 1 ? "#f85858" : "#5898f8",
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </footer>
  );
}
