"use client";

import { useMemo, useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BattleTransition from "@/components/BattleTransition";
import DialogBox from "@/components/DialogBox";
import PokemonCaptureSequence from "@/components/PokemonCaptureSequence";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import GBAShell from "@/components/GBAShell";
import {
  ELECTRODE_SPRITE,
  LAPRAS_SPRITE,
  NEUTRAL_NPC_SPRITE,
  PLAYER_SPRITE,
} from "@/components/PixelSprite";
import { IN_FLOOR, IN_WALL, PC_DESK } from "@/components/tilemap/tiles";
import { setGameFlag } from "@/lib/gameState";

const MAP_W = 20;
const MAP_H = 12;
const NODE_COORDS = {
  west: { x: 4, y: 2 },
  north: { x: 10, y: 2 },
  east: { x: 15, y: 3 },
} as const;

const buildFloorMap = (cellOpen: boolean): number[][] =>
  Array(MAP_H)
    .fill(0)
    .map((_, y) =>
      Array(MAP_W)
        .fill(0)
        .map((__, x) => {
          if (y === MAP_H - 1 && x >= 8 && x <= 11) return IN_FLOOR;
          if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return IN_WALL;
          if ((x === 4 && y === 2) || (x === 10 && y === 2) || (x === 15 && y === 3)) return PC_DESK;
          if (x >= 14 && x <= 17 && y >= 6 && y <= 9) {
            if (cellOpen && x === 14 && y === 8) return IN_FLOOR;
            return x === 14 || x === 17 || y === 6 || y === 9 ? IN_WALL : IN_FLOOR;
          }
          if (x === 7 && y >= 5 && y <= 9) return IN_WALL;
          return IN_FLOOR;
        }),
    );

export default function EleventhFloor() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(
    "11F // canal maintenance ouvert. Quelqu'un a garde ce couloir alimente uniquement pour retenir une seule personne.",
  );
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_11f_access") === "true",
  );
  const [activatedNodes, setActivatedNodes] = useState<Set<string>>(new Set());
  const [showBattleTransition, setShowBattleTransition] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<"lapras" | "electrode" | null>(null);
  const [maximeRescued, setMaximeRescued] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_maxime_rescued") === "true",
  );
  const [laprasCaptured, setLaprasCaptured] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_lapras_captured") === "true",
  );
  const [electrodeCaptured, setElectrodeCaptured] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_electrode_captured") === "true",
  );
  const [disabledBreakers, setDisabledBreakers] = useState<Set<string>>(new Set());
  const [overloadStartedAt, setOverloadStartedAt] = useState<number | null>(null);

  const hasCredentials =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_intranet_complete") === "true" &&
    localStorage.getItem("sylphe_bill_email") === "true";
  const hasMasterball =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_masterball_unlocked") === "true";
  const hasTrickHouseClear =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_trick_house_complete") === "true";
  const hasTrickHouseItem =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_trick_house_item") === "true";
  const hasPokeFlute =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_pokeflute_played") === "true";
  const hasCaveEcho =
    typeof window !== "undefined" &&
    localStorage.getItem("sylphe_cave_echo") === "true";
  const canTriggerOverloadQuest =
    maximeRescued &&
    hasTrickHouseClear &&
    hasTrickHouseItem &&
    hasPokeFlute &&
    hasCaveEcho &&
    !electrodeCaptured;
  const isCellOpen = activatedNodes.size >= 3 || maximeRescued;
  const floorMap = useMemo(() => buildFloorMap(isCellOpen), [isCellOpen]);

  const npcs = useMemo<CustomNPC[]>(() => {
    const current: CustomNPC[] = [
      {
        id: "maxime",
        x: 16,
        y: 8,
        sprite: PLAYER_SPRITE,
        type: "static",
      },
    ];

    if (activatedNodes.size >= 3 || maximeRescued) {
      current.push({
        id: "lapras",
        x: 4,
        y: 7,
        sprite: LAPRAS_SPRITE,
        type: laprasCaptured ? "static" : "wander",
      });
    }

    return current;
  }, [activatedNodes.size, laprasCaptured, maximeRescued]);

  const activateNode = (nodeId: string) => {
    if (activatedNodes.has(nodeId)) {
      setDialog(`NOEUD ${nodeId.toUpperCase()} deja relance. Les ventilateurs de ce secteur tournent de nouveau.`);
      return;
    }

    setActivatedNodes(prev => {
      const next = new Set(prev);
      next.add(nodeId);
      const nextCount = next.size;
      actions.playOneShot("sfx-puzzle");
      if (nextCount >= 3) {
        actions.activateTemporarySequence("breach-alarm", 8);
      }
      setDialog(
        nextCount >= 3
            ? "Trois noeuds stabilises. La cellule de maintenance cede enfin, et un Lokhlass quitte son angle mort pour surveiller le couloir."
          : `NOEUD ${nodeId.toUpperCase()} relance (${nextCount}/3). Le champ magnétique de la cellule faiblit.`,
      );
      return next;
    });
  };

  const disableBreaker = (breakerId: string) => {
    const now = Date.now();
    const elapsed = overloadStartedAt ? now - overloadStartedAt : 0;

    if (disabledBreakers.has(breakerId)) {
      setDialog(`DISJONCTEUR ${breakerId.toUpperCase()} deja coupe. La surcharge continue de monter.`);
      return;
    }

    if (overloadStartedAt && elapsed > 20000) {
      setDisabledBreakers(new Set([breakerId]));
      setOverloadStartedAt(now);
      setDialog(`Fenetre de surcharge depassee. Sequence reinitialisee sur ${breakerId.toUpperCase()} (1/3).`);
      return;
    }

    const next = new Set(disabledBreakers);
    next.add(breakerId);
    if (!overloadStartedAt) setOverloadStartedAt(now);
    setDisabledBreakers(next);

    if (next.size >= 3) {
      setDisabledBreakers(new Set());
      setOverloadStartedAt(null);
      actions.clearTemporarySequence();
      if (hasMasterball) {
        setCaptureTarget("electrode");
        setShowBattleTransition(true);
      } else {
        setDialog("Les trois disjoncteurs cèdent. Un Electrode de securite jaillit du reseau, puis s'echappe avant toute contention.");
      }
      return;
    }

    setDialog(`DISJONCTEUR ${breakerId.toUpperCase()} coupe (${next.size}/3). Il reste moins de 20 secondes.`);
  };

  const handleInteract = (
    tile: number,
    x: number,
    y: number,
    npcId?: string,
  ) => {
    setIsTypewriterDone(false);
    setForceComplete(false);

    if (npcId === "maxime") {
      if (activatedNodes.size < 3 && !maximeRescued) {
        setDialog(
          "MAXIME: Ils ont fragmente mes sorties sur trois baies. Relance les noeuds du couloir et cette prison corporate cessera enfin de faire semblant d'etre un bureau.",
        );
        return;
      }

      if (!maximeRescued) {
        setMaximeRescued(true);
        setGameFlag("sylphe_maxime_rescued");
        setDialog(
          "MAXIME: Merci. J'ai laisse un canal maintenance stable vers le 11e. Lokhlass transportait mes sauvegardes et refusait de quitter l'etage tant que j'y restais. Et en dessous... au -3, il y a une chambre froide (/cold-storage) avec des sauvegardes gelees depuis 1997.",
        );
        return;
      }

      setDialog(
        laprasCaptured
          ? "MAXIME: Le 11e etage ne retiendra plus personne. Lokhlass a enfin accepte l'exfiltration."
          : "MAXIME: Lokhlass tournait autour de cette cellule depuis des jours. Avec la Masterball, tu peux clore proprement cette evacuation.",
      );
      if (canTriggerOverloadQuest) {
        setDialog(
          "MAXIME: Le plan de la Maison Piege et l'echo du Mont Selenite concordent. Joue l'air de la Pokeflute, puis coupe les trois disjoncteurs en moins de 20 secondes. Rocket gardait ici une batterie vivante.",
        );
      }
      return;
    }

    if (npcId === "lapras") {
      if (!maximeRescued) {
        setDialog("Lokhlass surveille encore la cellule. Il ne partira pas avant l'ouverture complete du secteur.");
      } else if (laprasCaptured) {
        setDialog("Lokhlass a deja quitte l'etage. Son ancienne trajectoire reste gravee dans la poussiere bleue du carrelage.");
      } else if (hasMasterball) {
        setCaptureTarget("lapras");
        setShowBattleTransition(true);
      } else {
        setDialog("Lokhlass baisse la tete et attend. Il n'acceptera de quitter les serveurs qu'avec une vraie capsule de confinement.");
      }
      return;
    }

    if (tile === PC_DESK) {
      if (x === NODE_COORDS.west.x && y === NODE_COORDS.west.y) {
        if (!maximeRescued) activateNode("west");
        else if (canTriggerOverloadQuest) disableBreaker("west");
        else setDialog("Noeud OUEST stabilise. Le plan Rocket le mentionnait aussi comme coupe-circuit d'urgence.");
      } else if (x === NODE_COORDS.north.x && y === NODE_COORDS.north.y) {
        if (!maximeRescued) activateNode("north");
        else if (canTriggerOverloadQuest) disableBreaker("north");
        else setDialog("Noeud NORD stabilise. Sans le signal Pokeflute et l'echo de la grotte, cette baie ne fait que semblant d'etre ordinaire.");
      } else if (x === NODE_COORDS.east.x && y === NODE_COORDS.east.y) {
        if (!maximeRescued) activateNode("east");
        else if (canTriggerOverloadQuest) disableBreaker("east");
        else setDialog("Noeud EST stabilise. Maxime affirme qu'il alimente encore quelque chose de trop nerveux pour etre un simple serveur.");
      } else {
        setDialog(
          "Baie serveur hors-plan. Les journaux parlent d'archives envoyees vers le Musee Null et d'une supervision humaine jamais signee.",
        );
      }
      return;
    }

    if (tile === IN_WALL) {
      setDialog(
        activatedNodes.size >= 3
          ? "Le blindage du 11e etage s'est enfin atténué. La prison ressemblait surtout a une erreur persistante de l'organigramme."
          : "Les murs vibrent encore. Toute cette aile consomme de l'energie uniquement pour garder une cellule en apparence vide.",
      );
    }
  };

  const handlePlayerMove = (_x: number, y: number) => {
    if (y >= MAP_H - 1) {
      router.push("/");
    }
  };

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordInput.trim().toUpperCase() === "MYUUTSU") {
      setAccessGranted(true);
      setGameFlag("sylphe_11f_access");
      setDialog("Mot de passe maintenance accepte. Les ascenseurs de service du 11e etage redemarrent sans journal officiel.");
      return;
    }

    setDialog("Mot de passe refuse. Leo l'a laisse dans un brouillon supprime, pas dans l'intranet Rocket.");
  };

  const handleCaptureComplete = () => {
    actions.playOneShot("sfx-capture");
    if (captureTarget === "lapras") {
      setCaptureTarget(null);
      setLaprasCaptured(true);
      setGameFlag("sylphe_lapras_captured");
      setDialog("Lokhlass accepte enfin l'exfiltration. La Masterball verrouille le dernier trajet du 11e etage.");
      return;
    }

    if (captureTarget === "electrode") {
      setCaptureTarget(null);
      setElectrodeCaptured(true);
      setGameFlag("sylphe_electrode_captured");
      setDialog("La surcharge se replie sur elle-meme. ELECTRODE est capture, et le 11e etage perd enfin son dernier coeur agressif.");
    }
  };

  const handleDialogClick = () => {
    if (isTypewriterDone) {
      setDialog(null);
      setIsTypewriterDone(false);
      setForceComplete(false);
    } else {
      setForceComplete(true);
    }
  };

  if (!hasCredentials) {
    return (
      <GBAShell>
        <section className="flex h-full flex-col items-center justify-center bg-[#080b14] p-6 text-center">
          <h1 className="mb-4 text-[10px] text-[#7db8ff]">11F // ACCES REFUSE</h1>
          <p className="max-w-[220px] text-[7px] leading-[14px] text-[#9aa7c7]">
            Cet ascenseur de service est reserve au personnel de maintenance.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-[7px]">
            <Link href="/employee-login" className="text-[#7db8ff] underline">
              Ouvrir l&apos;intranet Rocket
            </Link>
            <Link href="/pc-bill" className="text-[#7db8ff] underline">
              Relire les emails supprimes de Leo
            </Link>
          </div>
        </section>
      </GBAShell>
    );
  }

  if (!accessGranted) {
    return (
      <GBAShell>
        <section className="flex h-full flex-col items-center justify-center bg-[#080b14] p-6 text-center">
          <div className="mb-6 flex items-center gap-3 text-[#7db8ff]">
            <div className="rounded border border-[#27406c] bg-[#10213b] p-2">
              <TypewriterText
                text="Maintenance Elevator // 11F"
                speed={24}
                className="text-[8px] leading-[14px]"
              />
            </div>
          </div>
          <form onSubmit={handleUnlock} className="flex w-full max-w-[180px] flex-col gap-3">
            <input
              value={passwordInput}
              onChange={event => setPasswordInput(event.target.value)}
              placeholder="mot de passe"
              className="border border-[#335577] bg-[#08111f] px-3 py-2 text-center text-[8px] text-[#d8e7ff] outline-none placeholder:text-[#5f6b84]"
            />
            <button type="submit" className="border border-[#335577] bg-[#10213b] px-3 py-2 text-[8px] text-[#7db8ff] hover:bg-[#17305a]">
              OUVRIR L&apos;ASCENSEUR
            </button>
          </form>
          <Link href="/pc-bill" className="mt-4 text-[6px] text-[#7db8ff] underline">
            Si vous devez accéder à ce niveau, demandez a Leo.
          </Link>
          {dialog && <p className="mt-4 max-w-[220px] text-[7px] leading-[14px] text-[#9aa7c7]">{dialog}</p>}
        </section>
      </GBAShell>
    );
  }

  return (
    <GBAShell>
      <section className="relative h-full overflow-hidden bg-[#0d1018]">
        <div className={`relative z-10 flex items-center justify-between border-b px-4 py-2 text-[8px] ${canTriggerOverloadQuest ? "border-[#6b1d1d] bg-[#261111] text-[#ff9e9e]" : "border-[#1e2c43] bg-[#111826] text-[#7db8ff]"}`}>
          <span>📍 SYLPHE 11F // MAINTENANCE</span>
          <span>{canTriggerOverloadQuest ? `OVERLOAD: ${disabledBreakers.size}/3` : `NOEUDS: ${activatedNodes.size}/3`}</span>
        </div>

        <div className={`absolute inset-0 ${canTriggerOverloadQuest ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,80,80,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,210,80,0.1),transparent_25%)]" : "bg-[radial-gradient(circle_at_20%_20%,rgba(84,129,255,0.15),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,255,200,0.08),transparent_25%)]"}`} />

        <div className="relative isolate h-full">
          <CustomMapCanvas
            mapData={floorMap}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={10}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="h-auto w-full hue-rotate-[8deg] saturate-110"
          />

          {showBattleTransition && (
            <BattleTransition onComplete={() => setShowBattleTransition(false)} />
          )}

          {captureTarget === "lapras" && !showBattleTransition && (
            <PokemonCaptureSequence
              pokemonName="Lokhlass"
              pokemonSprite={LAPRAS_SPRITE}
              accentClassName="from-[#ecfbff] via-[#9fd8ff] to-[#3d7bb0]"
              introText="Lokhlass ne defend pas cet etage. Il attendait simplement une sortie et un temoin de confiance."
              onComplete={handleCaptureComplete}
            />
          )}

          {captureTarget === "electrode" && !showBattleTransition && (
            <PokemonCaptureSequence
              pokemonName="Electrode"
              pokemonSprite={ELECTRODE_SPRITE}
              accentClassName="from-[#fff1f1] via-[#ff7272] to-[#7b1010]"
              introText="Les trois disjoncteurs tombent ensemble. Une batterie vivante ricane dans les gaines avant de bondir hors du tableau."
              onComplete={handleCaptureComplete}
            />
          )}

          {!canTriggerOverloadQuest && <div className={`absolute left-2 bottom-12 z-20 max-w-[160px] border px-3 py-2 text-[6px] leading-[12px] ${canTriggerOverloadQuest ? "border-[#6b1d1d] bg-[#2a1111]/90 text-[#ffb2b2]" : "border-[#335577] bg-[#08111f]/90 text-[#9aa7c7]"}`}>
            MOTIF DE RETENTION: supervision humaine non conforme. Le developpeur refusait de signer la version finale du Projet M.
          </div>}

          {dialog && (
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
              <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
                <TypewriterText
                  key={dialog}
                  text={dialog}
                  speed={40}
                  forceComplete={forceComplete}
                  className="block text-[8px] leading-[18px] text-gba-text md:text-[9px]"
                  onComplete={() => setIsTypewriterDone(true)}
                />
              </DialogBox>
            </div>
          )}
        </div>
      </section>
    </GBAShell>
  );
}