"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useInView from "@/hooks/useInView";
import { setGameFlag } from "@/lib/gameState";

export default function StatsSection() {
  const router = useRouter();
  const { ref, isVisible } = useInView(0.2);
  const [counters, setCounters] = useState({ emp: 0, proj: 0, rev: 0 });
  const [museumHintUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_museum_null_hint") === "true",
  );
  const [museumCardTaps, setMuseumCardTaps] = useState(0);
  const [museumUnlocked, setMuseumUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_museum_null_unlocked") === "true",
  );

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
    { label: "EMPLOYÉS", value: 1, max: 1, color: "bg-[#58a858]" },
    { label: "PROJETS", value: counters.proj, max: 1000, color: "bg-gba-blue" },
    { label: "SATISFACTION", value: counters.rev, max: 100, color: "bg-gba-accent" },
  ];

  const handleTrainerCardClick = () => {
    if (!museumHintUnlocked || museumUnlocked) return;

    const nextTaps = museumCardTaps + 1;
    setMuseumCardTaps(nextTaps);

    if (nextTaps >= 5) {
      setGameFlag("sylphe_museum_null_unlocked");
      setMuseumUnlocked(true);
      router.push("/museum-null");
    }
  };

  const [badgeTaps, setBadgeTaps] = useState<Record<string, number>>({});

  const handleBadgeClick = (badge: string) => {
    const next = (badgeTaps[badge] || 0) + 1;
    setBadgeTaps(prev => ({ ...prev, [badge]: next }));
    if (badge === "Sécurité" && next >= 4) router.push("/trick-house-maze");
    if (badge === "Quantique" && next >= 4) router.push("/casino-game-corner");
  };

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
          <button
            type="button"
            onClick={handleTrainerCardClick}
            className={`w-full text-center mb-4 ${museumHintUnlocked ? "cursor-pointer-pixel" : "cursor-default"}`}
          >
            <div className="text-[10px] text-gba-text mb-1">SYLPHE CORP.</div>
            <div className="text-[7px] text-gba-bg-darker">
              {museumHintUnlocked ? "ID No. 31415 // AILE N-ULL" : "ID No. 31415"}
              &nbsp;│&nbsp; KANTO REGION
            </div>
            {museumHintUnlocked && !museumUnlocked && (
              <div className="mt-2 text-[6px] text-gba-shadow opacity-70">
                checksum visiteur: {museumCardTaps}/5
              </div>
            )}
          </button>

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
                <button
                  type="button"
                  key={i}
                  onClick={() => handleBadgeClick(badge)}
                  className="bg-gba-bg-darker text-gba-gold text-[6px] px-2 py-1 pixel-border"
                  style={{
                    animation: isVisible
                      ? `fade-in 0.3s ease-out ${0.5 + i * 0.1}s both`
                      : undefined,
                  }}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {museumUnlocked && (
            <div className="mt-5 pt-3 border-t-2 border-gba-bg-dark text-[6px] text-gba-shadow">
              MUSEE NULL synchronise. Une aile corporate non listee a ete ajoutee aux visites possibles.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
