"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DialogBox from "@/components/DialogBox";
import {
  getUnlockedInventoryItems,
  getVisitedMaps,
  InventoryItemDefinition,
  MapDefinition,
} from "@/lib/gameState";

type StartMenuTab = "inventory" | "map";

export default function StartMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<StartMenuTab>("inventory");
  const [inventoryItems, setInventoryItems] = useState<InventoryItemDefinition[]>([]);
  const [visitedMaps, setVisitedMaps] = useState<MapDefinition[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const refresh = () => {
      setInventoryItems(getUnlockedInventoryItems());
      setVisitedMaps(getVisitedMaps());
    };

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("sylphe_state_change", refresh as EventListener);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("sylphe_state_change", refresh as EventListener);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px] overflow-auto">
      <DialogBox className="w-full max-w-2xl !bg-[#d8e8c0]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] text-gba-text">MENU START</p>
            <p className="mt-2 text-[7px] leading-[14px] text-gba-bg-darker">
              Synthese des objets recuperes et des zones deja explorees.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[8px] text-gba-accent hover:text-gba-text transition-colors"
          >
            FERMER
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTab("inventory")}
            className={`border-2 px-3 py-2 text-[8px] transition-colors ${
              tab === "inventory"
                ? "border-gba-text bg-gba-text text-gba-white"
                : "border-gba-window-border bg-gba-bg text-gba-text"
            }`}
          >
            INVENTAIRE{" "}
            {inventoryItems.length > 0 ? `(${inventoryItems.length})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setTab("map")}
            className={`border-2 px-3 py-2 text-[8px] transition-colors ${
              tab === "map"
                ? "border-gba-text bg-gba-text text-gba-white"
                : "border-gba-window-border bg-gba-bg text-gba-text"
            }`}
          >
            MAP {visitedMaps.length > 0 ? `(${visitedMaps.length})` : ""}
          </button>
        </div>

        <div className="min-h-[250px] border-2 border-gba-window-border bg-gba-white/60 px-3 py-3">
          {tab === "inventory" ? (
            inventoryItems.length > 0 ? (
              <div className="space-y-3">
                {inventoryItems.map(item => (
                  <div
                    key={item.key}
                    className="border-b border-gba-bg-dark/60 pb-3 last:border-b-0 last:pb-0"
                  >
                    <p className="text-[8px] text-gba-text">▶ {item.name}</p>
                    <p className="mt-2 text-[7px] leading-[14px] text-gba-bg-darker">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[8px] leading-[16px] text-gba-bg-darker">
                Aucun objet important detecte. Fouille davantage le terminal et
                les zones secretes.
              </p>
            )
          ) : visitedMaps.length > 0 ? (
            <div className="space-y-2">
              {visitedMaps.map(map => (
                <button
                  key={map.href}
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(map.href);
                  }}
                  className="w-full border-2 border-gba-window-border bg-gba-bg px-3 py-3 text-left text-[8px] text-gba-text transition-colors hover:bg-gba-bg-dark hover:text-gba-white"
                >
                  ▶ {map.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[8px] leading-[16px] text-gba-bg-darker">
              La cartographie est vide. Visite une zone pour l ajouter ici.
            </p>
          )}
        </div>
      </DialogBox>
    </div>
  );
}