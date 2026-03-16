"use client";

import { useState, useEffect, useCallback } from "react";
import { useMusic } from "@/hooks/useMusic";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import PixelSprite, { BILL_SPRITE } from "@/components/PixelSprite";
import { setGameFlag } from "@/lib/gameState";

type DesktopIcon = {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
};

type WindowState = {
  id: string;
  title: string;
  content: string[];
  x: number;
  y: number;
  minimized: boolean;
};

const ICONS: DesktopIcon[] = [
  { id: "mypc", label: "Mon PC", icon: "🖥️", x: 10, y: 10 },
  { id: "trash", label: "Corbeille", icon: "🗑️", x: 10, y: 80 },
  { id: "transfer", label: "Transfert\nPokemon", icon: "📡", x: 10, y: 150 },
  { id: "notes", label: "Mes Notes", icon: "📝", x: 10, y: 220 },
];

const TRASH_EMAILS = [
  [
    "De: leo@sylphe.cc",
    "A: prof.chen@sylphe.cc",
    "Objet: URGENT - Incident de teleportation",
    "",
    "Professeur,",
    "",
    "J'ai commis une erreur terrible. La machine de",
    "transfert Pokemon... Je l'ai testee sur moi-meme.",
    "Pendant 3 minutes, j'etais un RATTATA.",
    "",
    "Mon ADN s'est reconstitue mais je sens encore",
    "des griffes fantomes. Ne dites rien a personne.",
    "",
    "- Leo (Bill)",
  ],
  [
    "De: leo@sylphe.cc",
    "A: admin@sylphe.cc",
    "Objet: RE: RE: Anomalie Systeme de Stockage",
    "",
    "Le PC de stockage Pokemon montre des signes",
    "d'instabilite depuis l'incident. Les donnees",
    "des Pokemon transferes se corrompent. J'ai",
    "detecte des fragments de MON propre ADN dans",
    "les metadata des captures recentes.",
    "",
    "Est-ce que le Sujet 150 utilise aussi ce",
    "systeme? Si oui, on a un GROS probleme.",
    "",
    "P.S. J'ai cache le rapport sous /dev/null",
    "dans le terminal. Personne ne regarde la-bas.",
  ],
  [
    "De: leo@sylphe.cc",
    "A: [brouillon non envoye]",
    "Objet: Je dois partir",
    "",
    "Si quelqu'un lit ceci, je suis probablement",
    "deja parti. La machine de transfer ne fait pas",
    "que deplacer les pokemon - elle les COPIE.",
    "Chaque transfert cree un clone ephemere.",
    "",
    "Les Pokemon dans les boites PC ne sont pas les",
    "originaux. Ce sont des copies. Les originaux...",
    "je ne sais pas ou ils vont.",
    "",
    "Le Projet M le savait depuis le debut.",
    "Mot de passe admin systeme: MYUUTSU",
    "",
    "Pardonnez-moi.",
    "- Leo",
  ],
];

const PC_INFO = [
  "SYSTEME PC SYLPHE v3.1",
  "========================",
  "Processeur: Porygon-Core 8086",
  "Memoire: 640KB (ought to be enough)",
  "Stockage: 151 slots actifs",
  "Reseau: SYLPHE-NET (connecte)",
  "",
  "AVERTISSEMENT: Fragments ADN detectes",
  "dans le bus de donnees principal.",
];

const NOTES = [
  "=== NOTES PERSONNELLES DE LEO ===",
  "",
  "TODO:",
  "- Reparer la machine de transfert",
  "- Effacer les logs du Dr. Fuji",
  "- Changer tous les mots de passe",
  "- NE PLUS JAMAIS entrer dans la machine",
  "",
  "RAPPEL: Le code de la chambre 042",
  "est compose de 2 fragments.",
  "Le premier est dans /cyberspace,",
  "le second dans /glitch-city.",
  "",
  "NOTE: L'imprimante du sous-sol (-1)",
  "imprime des documents avec un filigrane",
  "que je n'arrive pas a lire a l'ecran.",
  "Route: /printer-room",
  "",
  "Si tu lis ceci et que tu n'es pas moi,",
  "tape 'reconstruct' dans le terminal.",
];

const TRANSFER_INFO = [
  "╔══════════════════════════════╗",
  "║  SYSTEME DE TRANSFERT v2.0  ║",
  "╠══════════════════════════════╣",
  "║                              ║",
  "║  Status: HORS LIGNE          ║",
  "║  Raison: Contamination ADN   ║",
  "║                              ║",
  "║  Dernier transfert:          ║",
  "║  -> Specimen: HUMAIN (???)   ║",
  "║  -> Direction: BIDIRECTIONNEL║",
  "║  -> Integrite: 43.7%         ║",
  "║                              ║",
  "║  ERREUR: genome_checksum     ║",
  "║  ne correspond pas.          ║",
  "║  Sequences RATTATA detectees ║",
  "║  dans echo memoire.          ║",
  "║                              ║",
  "╚══════════════════════════════╝",
];

export default function PCBill() {
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>("Systeme PC de LEO / BILL demarre...");
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [trashIndex, setTrashIndex] = useState(0);
  const [emailFound, setEmailFound] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  useEffect(() => {
    if (!booted) return;

    setWindows(prev => {
      if (prev.length > 0) return prev;

      return [
        {
          id: "mypc",
          title: "Mon PC",
          content: PC_INFO,
          x: 54,
          y: 24,
          minimized: false,
        },
        {
          id: "trash",
          title: "Corbeille - Email 1/3",
          content: TRASH_EMAILS[0],
          x: 94,
          y: 42,
          minimized: false,
        },
      ];
    });
  }, [booted]);

  useEffect(() => {
    const lines = [
      "BIOS Sylphe v1.0...",
      "Memoire: 640K OK",
      "Detection peripheriques...",
      "Machine de Transfert: ERREUR",
      "Chargement SylpheOS 95...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooted(true);
          actions.playOneShot("sfx-puzzle");
        }, 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows(prev => {
      if (prev.find(w => w.id === id)) {
        return prev.map(w => w.id === id ? { ...w, minimized: false } : w);
      }
      let title = "";
      let content: string[] = [];
      const offset = prev.length * 15;
      switch (id) {
        case "mypc":
          title = "Mon PC";
          content = PC_INFO;
          break;
        case "trash":
          title = `Corbeille - Email ${1}/3`;
          content = TRASH_EMAILS[0];
          break;
        case "transfer":
          title = "Systeme de Transfert Pokemon";
          content = TRANSFER_INFO;
          break;
        case "notes":
          title = "Bloc-Notes";
          content = NOTES;
          break;
        default:
          return prev;
      }
      return [...prev, { id, title, content, x: 30 + offset, y: 20 + offset, minimized: false }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const nextTrashEmail = useCallback(() => {
    const next = trashIndex + 1;
    if (next < TRASH_EMAILS.length) {
      setTrashIndex(next);
      setWindows(prev => prev.map(w =>
        w.id === "trash"
          ? { ...w, title: `Corbeille - Email ${next + 1}/3`, content: TRASH_EMAILS[next] }
          : w
      ));
      if (next === TRASH_EMAILS.length - 1 && !emailFound) {
        setEmailFound(true);
        setGameFlag("sylphe_bill_email");
        actions.activateTemporarySequence("error-beep", 2);
        actions.activateTemporarySequence("file-corrupt", 1);
        setTimeout(() => {
          setDialog(
            "Email confidentiel de Leo recupere. Le mot de passe MYUUTSU semble encore repondre sur le canal maintenance du 11e etage.",
          );
        }, 500);
      }
    } else {
      setTrashIndex(0);
      setWindows(prev => prev.map(w =>
        w.id === "trash"
          ? { ...w, title: "Corbeille - Email 1/3", content: TRASH_EMAILS[0] }
          : w
      ));
    }
  }, [trashIndex, emailFound]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  if (!booted) {
    return (
      <GBAShell>
        <section className="relative bg-black h-full flex flex-col justify-center items-center p-4">
          <div className="font-mono text-[8px] text-[#00aa00] space-y-1">
            {bootLines.filter(l => l).map((line, i) => (
              <p key={i} className={line.includes("ERREUR") ? "text-[#aa0000]" : ""}>{line}</p>
            ))}
            <span className="animate-pulse">_</span>
          </div>
        </section>
      </GBAShell>
    );
  }

  return (
    <GBAShell>
      <section
        className="relative h-full overflow-hidden min-h-[500px]"
        style={{ background: "#008080" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="absolute right-5 top-6 z-0 flex flex-col items-center text-white/70">
          <PixelSprite sprite={BILL_SPRITE} size={74} animate={false} />
          <div
            className="mt-2 text-[6px] text-center leading-[10px]"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            LEO / BILL
            <br />
            maintenance ghost online
          </div>
        </div>

        {/* Taskbar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[22px] z-30 flex items-center px-1 gap-1"
          style={{
            background: "linear-gradient(to right, #c0c0c0, #d4d0c8)",
            borderTop: "2px solid #fff",
          }}
        >
          <button
            className="h-[18px] px-2 text-[7px] font-bold flex items-center gap-1"
            style={{
              background: "linear-gradient(to bottom, #d4d0c8, #c0c0c0)",
              border: "1px outset #fff",
            }}
          >
            <span>🪟</span> Demarrer
          </button>
          {windows
            .filter(w => !w.minimized)
            .map(w => (
              <button
                key={w.id}
                onClick={() => closeWindow(w.id)}
                className="h-[16px] px-2 text-[6px] truncate max-w-[80px]"
                style={{ background: "#c0c0c0", border: "1px inset #808080" }}
              >
                {w.title}
              </button>
            ))}
          <div
            className="ml-auto text-[6px] px-2 h-[16px] flex items-center"
            style={{ border: "1px inset #808080", background: "#c0c0c0" }}
          >
            {new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Desktop Icons */}
        {ICONS.map(icon => (
          <button
            key={icon.id}
            onDoubleClick={() => openWindow(icon.id)}
            onClick={() => openWindow(icon.id)}
            className="absolute flex flex-col items-center gap-1 w-[50px] cursor-pointer group"
            style={{ left: icon.x, top: icon.y }}
          >
            <span className="text-[16px] group-hover:scale-110 transition-transform">
              {icon.icon}
            </span>
            <span
              className="text-[6px] text-white text-center leading-[8px] whitespace-pre-line"
              style={{ textShadow: "1px 1px 0 #000" }}
            >
              {icon.label}
            </span>
          </button>
        ))}

        <div
          className="absolute left-[72px] top-[138px] max-w-[128px] z-0 bg-white/20 border border-white/40 px-2 py-2 text-[6px] text-white leading-[10px]"
          style={{ textShadow: "1px 1px 0 #004040" }}
        >
          Bureau de secours active. Double-cliquez sur la Corbeille pour lire
          les brouillons supprimes de Leo.
        </div>

        {/* Windows */}
        {windows
          .filter(w => !w.minimized)
          .map(w => (
            <div
              key={w.id}
              className="absolute shadow-lg"
              style={{
                left: w.x,
                top: w.y,
                width: 200,
                minHeight: 120,
                border: "2px outset #d4d0c8",
                background: "#c0c0c0",
                zIndex: 20,
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-1 h-[16px]"
                style={{
                  background: "linear-gradient(to right, #000080, #1084d0)",
                }}
              >
                <span className="text-[6px] text-white font-bold truncate">
                  {w.title}
                </span>
                <div className="flex gap-[2px]">
                  {w.id === "trash" && (
                    <button
                      onClick={nextTrashEmail}
                      className="w-[12px] h-[12px] text-[7px] flex items-center justify-center"
                      style={{
                        background: "#c0c0c0",
                        border: "1px outset #fff",
                      }}
                    >
                      →
                    </button>
                  )}
                  <button
                    onClick={() => closeWindow(w.id)}
                    className="w-[12px] h-[12px] text-[7px] flex items-center justify-center"
                    style={{ background: "#c0c0c0", border: "1px outset #fff" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              {/* Content */}
              <div
                className="p-2 overflow-y-auto"
                style={{
                  maxHeight: 160,
                  background: "#fff",
                  margin: 2,
                  border: "1px inset #808080",
                }}
              >
                {w.content.map((line, i) => (
                  <p
                    key={i}
                    className="text-[6px] text-black font-mono leading-[10px] whitespace-pre-wrap"
                  >
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
            </div>
          ))}

        {/* Dialog overlay */}
        {dialog && (
          <div className="absolute bottom-[24px] left-0 right-0 p-3 z-40">
            <DialogBox
              isClickable={isTypewriterDone}
              onClick={handleDialogClick}
            >
              <TypewriterText
                key={dialog}
                text={dialog}
                speed={40}
                forceComplete={forceComplete}
                className="text-[8px] md:text-[9px] leading-[18px] text-gba-text block"
                onComplete={() => setIsTypewriterDone(true)}
              />
            </DialogBox>
          </div>
        )}
      </section>
    </GBAShell>
  );
}
