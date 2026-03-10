"use client";

export default function PokemonMenu({
  items,
  className = "",
}: {
  items: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={`dialog-box ${className}`}>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.href}
              className="pokemon-menu-item block text-[10px] leading-relaxed text-gba-text hover:text-gba-accent transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
