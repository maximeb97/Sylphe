"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const GHOST_ROUTES = [
  { href: "/mt-moon-cavern", label: "GROTTE SELENITE", icon: "🦇" },
  { href: "/spectre-mirror", label: "MIROIR SPECTRAL", icon: "👻" },
  { href: "/lavender-mirror", label: "LAVANVILLE", icon: "💀" },
  { href: "/cold-storage", label: "CHAMBRE FROIDE", icon: "❄️" },
  { href: "/silph-subway", label: "TUNNEL SYLPHE", icon: "🚇" },
];

export default function MidnightGhosts() {
  const [isMidnight, setIsMidnight] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkMidnight = () => {
      const hour = new Date().getHours();
      const isNight = hour === 0 || hour === 23;
      setIsMidnight(isNight);
      if (isNight) {
        setTimeout(() => setVisible(true), 2000);
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isMidnight || !visible) return null;

  return (
    <div className="flex gap-2 ml-2 items-center">
      {GHOST_ROUTES.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="text-[6px] text-[#330033] hover:text-[#660066] transition-colors animate-pulse"
          title={route.label}
        >
          {route.icon}
        </Link>
      ))}
    </div>
  );
}
