"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMusic } from "@/hooks/useMusic";
import { markMapVisited, setGameFlag } from "@/lib/gameState";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import CustomMapCanvas, { CustomNPC } from "@/components/tilemap/CustomMapCanvas";
import {
  CABINET_SPRITE,
  NEUTRAL_NPC_SPRITE,
  PAPER_STACK_SPRITE,
  PRINT_MACHINE_SPRITE,
  SHREDDER_SPRITE,
} from "@/components/PixelSprite";
import { PRINTER_FLOOR, PRINTER_WALL } from "@/components/tilemap/tiles";

const MAP_W = 18;
const MAP_H = 12;

const PRINTER_MAP: number[][] = Array.from({ length: MAP_H }, (_, y) =>
  Array.from({ length: MAP_W }, (_, x) => {
    if (y === MAP_H - 1 && x >= 8 && x <= 9) return PRINTER_FLOOR;
    if (x === 0 || x === MAP_W - 1 || y === 0 || y === MAP_H - 1) return PRINTER_WALL;
    return PRINTER_FLOOR;
  }),
);

type PrinterDoc = {
  id: string;
  title: string;
  content: string;
  hasWatermark: boolean;
};

const PRINTER_DOCS: PrinterDoc[] = [
  {
    id: "memo-lobby",
    title: "MEMO — ACCUEIL SYLPHE CORP.",
    content: "Rappel: les badges d'acces doivent etre portes en permanence. Le service de securite signale des intrusions non autorisees dans les sous-sols. Les employes sont pries de ne pas emprunter le tunnel logistique sans autorisation ecrite du Dr Fuji.",
    hasWatermark: false,
  },
  {
    id: "report-cryo",
    title: "RAPPORT — ANOMALIE CRYOGENIQUE",
    content: "Les serveurs de sauvegarde de la chambre froide LVL -3 ont enregistre un pic thermique anormal. Les donnees de sauvegarde de 8 Pokemon sont en boucle infinie depuis 1997. Le systeme de refroidissement contient une entite biologique non cataloguee (voir ref: LOKHLASS ARCHIVE).",
    hasWatermark: true,
  },
  {
    id: "blueprint-secret",
    title: "PLAN ARCHITECTURAL — SOUS-SOL (CLASSIFIE)",
    content: "Ce document contient les plans du sous-sol de Sylphe Corp. Le tunnel logistique (SYLPHE SUBWAY) relie le hall principal au Musee Null via la voie B. Un embranchement secondaire mene a la Chambre Froide (LVL -3). ATTENTION: Ce plan a ete supprime des archives officielles sur ordre du Directeur.",
    hasWatermark: true,
  },
  {
    id: "fuji-draft",
    title: "BROUILLON — DR FUJI (NON ENVOYE)",
    content: "Je ne peux plus continuer a pretendre que le Projet M est sous controle. Le clone 150 est instable. Le sujet 151 refuse l'effacement memoriel. Et maintenant, les sauvegardes gelees commencent a se reveiller d'elles-memes. Si quelqu'un lit cette note apres mon depart, cherchez le mot de passe dans le filigrane. Il ouvre ce que le Directeur a voulu oublier.",
    hasWatermark: true,
  },
];

export default function PrinterRoomPage() {
  const router = useRouter();
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>(
    "SALLE D'IMPRESSION // ARCHIVES PAPIER // SOUS-SOL LVL -1",
  );
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [printedDocs, setPrintedDocs] = useState<Set<string>>(new Set());
  const [currentDoc, setCurrentDoc] = useState<PrinterDoc | null>(null);
  const [watermarkRevealed, setWatermarkRevealed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sylphe_watermark_revealed") === "true",
  );
  const [shreddedCount, setShreddedCount] = useState(0);
  const printRevealRef = useRef(false);

  useEffect(() => {
    markMapVisited("/printer-room");
  }, []);

  useEffect(() => {
    const handleBeforePrint = () => {
      if (!watermarkRevealed) {
        printRevealRef.current = true;
        setWatermarkRevealed(true);
        setGameFlag("sylphe_watermark_revealed");
        setGameFlag("sylphe_printer_room_complete");
      }
    };

    const handleAfterPrint = () => {
      if (printRevealRef.current) {
        printRevealRef.current = false;
        actions.activateTemporarySequence("watermark-reveal", 2);
        setDialog("Le filigrane est apparu sur le papier imprime. Mot de passe: CRYO-FUJI-151. Route revelee: /cold-storage.");
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [actions, watermarkRevealed]);

  const npcs = useMemo<CustomNPC[]>(
    () => [
      { id: "printer-a", x: 3, y: 2, sprite: PRINT_MACHINE_SPRITE, type: "static" },
      { id: "printer-b", x: 14, y: 2, sprite: PRINT_MACHINE_SPRITE, type: "static" },
      { id: "printer-c", x: 3, y: 8, sprite: PRINT_MACHINE_SPRITE, type: "static" },
      { id: "printer-d", x: 14, y: 8, sprite: PRINT_MACHINE_SPRITE, type: "static" },
      { id: "paper-a", x: 6, y: 2, sprite: PAPER_STACK_SPRITE, type: "static" },
      { id: "paper-b", x: 11, y: 2, sprite: PAPER_STACK_SPRITE, type: "static" },
      { id: "paper-c", x: 6, y: 8, sprite: PAPER_STACK_SPRITE, type: "static" },
      { id: "paper-d", x: 11, y: 8, sprite: PAPER_STACK_SPRITE, type: "static" },
      { id: "cabinet-a", x: 5, y: 4, sprite: CABINET_SPRITE, type: "static" },
      { id: "cabinet-b", x: 12, y: 4, sprite: CABINET_SPRITE, type: "static" },
      { id: "cabinet-c", x: 5, y: 7, sprite: CABINET_SPRITE, type: "static" },
      { id: "cabinet-d", x: 12, y: 7, sprite: CABINET_SPRITE, type: "static" },
      { id: "shredder", x: 8, y: 6, sprite: SHREDDER_SPRITE, type: "static" },
    ],
    [],
  );

  const handleInteract = useCallback(
    (_tile: number, _x: number, _y: number, npcId?: string) => {
      if (!npcId || currentDoc) return;

      setIsTypewriterDone(false);
      setForceComplete(false);

      if (npcId.startsWith("printer-")) {
        const docIndex = printedDocs.size;
        if (docIndex >= PRINTER_DOCS.length) {
          setDialog("L'imprimante est vide. Tous les documents utiles ont deja ete recuperes.");
          return;
        }

        const doc = PRINTER_DOCS[docIndex];
        setCurrentDoc(doc);
        setPrintedDocs((current) => {
          const next = new Set(current);
          next.add(doc.id);
          if (next.size >= PRINTER_DOCS.length) {
            setGameFlag("sylphe_printer_room_complete");
          }
          return next;
        });
        actions.activateTemporarySequence("watermark-reveal", 3);
        setDialog(
          doc.hasWatermark
            ? "L'imprimante crepite... Un filigrane presque invisible traverse le papier. Essayez Ctrl+P pour le reveler completement."
            : "Un memo corporate sort sans resistance. Il sert surtout a vous mener vers les documents classes suivants."
        );
        return;
      }

      if (npcId.startsWith("paper-")) {
        setDialog("Les ramettes portent toutes le meme papier Sylphe Corp. L'encre masque un filigrane qui n'apparait correctement qu'a l'impression.");
        return;
      }

      if (npcId.startsWith("cabinet-")) {
        setDialog("Le tiroir est vide. Une etiquette indique: ARCHIVES TRANSFEREES AU MUSEE NULL — SECTION CLASSIFIEE.");
        return;
      }

      if (npcId === "shredder") {
        const nextCount = shreddedCount + 1;
        setShreddedCount(nextCount);
        if (nextCount >= 4) {
          setGameFlag("sylphe_shredder_clue");
          setGameFlag("sylphe_printer_room_complete");
          setDialog("En recollant les fragments: CRYO-FUJI-151. La dechiqueteuse confirme le mot de passe sans meme passer par l'imprimante.");
        } else if (nextCount === 1) {
          setDialog("La dechiqueteuse contient des fragments lisibles: ...CRYO... ...FUJI... ...151...");
        } else {
          setDialog("Vous fouillez les fragments de papier dechiquetes. Le mot de passe se precise a mesure que les bandes s'alignent.");
        }
      }
    },
    [actions, currentDoc, printedDocs, shreddedCount],
  );

  const handlePlayerMove = useCallback(
    (_x: number, y: number) => {
      if (currentDoc) return;
      if (y >= MAP_H - 1) router.push("/");
    },
    [currentDoc, router],
  );

  const handleDialogClick = () => {
    if (isTypewriterDone) {
      setDialog(null);
      setIsTypewriterDone(false);
      setForceComplete(false);
      return;
    }
    setForceComplete(true);
  };

  return (
    <GBAShell>
      <section className="relative h-full overflow-hidden bg-[#1a1a1a]">
        <div
          className="fixed inset-0 z-[9999] pointer-events-none hidden print:flex items-center justify-center"
          style={{ opacity: 0.15 }}
        >
          <div className="text-center transform rotate-[-30deg]">
            <p className="text-6xl font-bold text-gray-400">SYLPHE CORP.</p>
            <p className="text-3xl text-gray-500 mt-2">CLASSIFIE — PROJET M</p>
            <p className="text-2xl text-red-400 mt-4">MOT DE PASSE: CRYO-FUJI-151</p>
            <p className="text-xl text-gray-500 mt-2">ROUTE CACHEE: /cold-storage</p>
            <p className="text-lg text-gray-600 mt-1">Le Dr Fuji savait. Les sauvegardes gelees contiennent la verite.</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(20,20,24,0.35),rgba(18,18,22,0.9))]" />

        <div className="relative z-20 flex items-center justify-between border-b border-[#2a2a3a] bg-[#1a1a2a]/90 px-4 py-2 text-[8px] text-[#d7d7e3] print:hidden">
          <span>📍 SALLE D&apos;IMPRESSION // LVL -1</span>
          <span className="opacity-60">DOCS: {printedDocs.size}/{PRINTER_DOCS.length}</span>
        </div>

        <div className="relative isolate h-full print:hidden">
          <CustomMapCanvas
            mapData={PRINTER_MAP}
            playerSprite={NEUTRAL_NPC_SPRITE}
            initialPlayerX={9}
            initialPlayerY={10}
            npcs={npcs}
            onInteract={handleInteract}
            onPlayerMove={handlePlayerMove}
            className="h-auto w-full"
          />

          <div className="absolute left-2 top-2 z-20 border border-[#3b3b48] bg-[#16161c]/85 px-3 py-2 text-[6px] leading-[12px] text-[#f0e8d8]">
            <p>FILIGRANE: {watermarkRevealed ? "REVELE" : "CACHE"}</p>
            <p>DECHIQUETEUR: {Math.min(shreddedCount, 4)}/4</p>
          </div>

        {currentDoc && (
          <div className="absolute inset-0 z-50 bg-[#0a0a0a]/90 flex items-center justify-center print:hidden">
            <div className="bg-[#f0e8d8] border border-[#8a7a6a] p-4 max-w-[300px] relative">
              {currentDoc.hasWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] rotate-[-25deg]">
                  <span className="text-[16px] font-bold text-[#8a3030]">CRYO-FUJI-151</span>
                </div>
              )}
              <div className="text-[7px] text-[#4a3a2a] font-bold mb-2">
                📄 {currentDoc.title}
              </div>
              <p className="text-[7px] text-[#3a2a1a] leading-[11px] mb-3">
                {currentDoc.content}
              </p>
              {currentDoc.hasWatermark && (
                <p className="text-[5px] text-[#8a7a6a] italic mb-2">
                  Un filigrane presque invisible semble cacher un message. Imprimez la page (Ctrl+P) pour le reveler...
                </p>
              )}
              <button
                onClick={() => {
                  setCurrentDoc(null);
                  if (currentDoc.hasWatermark && !watermarkRevealed) {
                    setDialog("Le document porte un filigrane. Pour le lire, il faut l'imprimer physiquement... ou bien fouiller la dechiqueteuse.");
                  }
                }}
                className="text-[7px] text-[#5a4a3a] hover:text-[#8a3030]"
              >
                FERMER ✕
              </button>
            </div>
          </div>
        )}
        </div>

        <div className="hidden print:block p-8">
          <h1 className="text-xl font-bold mb-4">SYLPHE CORP. — ARCHIVES PAPIER</h1>
          {Array.from(printedDocs).map(id => {
            const doc = PRINTER_DOCS.find(d => d.id === id);
            if (!doc) return null;
            return (
              <div key={id} className="mb-6 border-b pb-4">
                <h2 className="font-bold">{doc.title}</h2>
                <p className="mt-2">{doc.content}</p>
              </div>
            );
          })}
        </div>

        {dialog && !currentDoc && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-40 print:hidden">
            <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
              <TypewriterText
                key={dialog}
                text={dialog}
                speed={40}
                forceComplete={forceComplete}
                onComplete={() => setIsTypewriterDone(true)}
              />
            </DialogBox>
          </div>
        )}

        <Link
          href="/"
          className="absolute bottom-1 right-2 text-[6px] text-[#8a8a9a] hover:text-[#f0e8d8] z-40 transition-colors print:hidden"
        >
          ← RETOUR
        </Link>
      </section>
    </GBAShell>
  );
}
