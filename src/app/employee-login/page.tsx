"use client";

import { useState, useCallback } from "react";
import { useMusic } from "@/hooks/useMusic";
import GBAShell from "@/components/GBAShell";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { setGameFlag } from "@/lib/gameState";

const EMPLOYEES = [
  {
    name: "Agent LAMBDA-04",
    email: "lambda04@rocket-net.co",
    pokemon: "arbok",
    hint: "Mon Pokemon prefere est le serpent violet de Kanto.",
    inbox: [
      {
        from: "giovanni@rocket-net.co",
        subject: "Opération nébuleuse",
        body: "Lambda, les fonds de la Sylphe Corp arriveront via le <a href='/casino-game-corner' color='blue'>Casino</a>. Assurez-vous que personne ne remarque l'accès au sous-sol. Mot d'ordre: discrétion.",
      },
      {
        from: "admin@rocket-net.co",
        subject: "RE: Mot de passe oublié",
        body: "Rappel: votre mot de passe est le nom de votre Pokémon favori en minuscules. Arrêtez de l'oublier.",
      },
      {
        from: "lambda04@rocket-net.co",
        subject: "[Brouillon] Démission",
        body: "Je ne peux plus continuer. Ce qu'ils font au Sujet 150... c'est inhumain. Les cris la nuit dans le labo B2. J'ai copié des fichiers sur une clé. Si je disparais, cherchez dans /dev/null du terminal Sylphe.",
      },
    ],
  },
  {
    name: "Agent SIGMA-12",
    email: "sigma12@rocket-net.co",
    pokemon: "rattata",
    hint: "Le rat violet est mon compagnon de toujours.",
    inbox: [
      {
        from: "giovanni@rocket-net.co",
        subject: "Infiltration Sylphe",
        body: "Sigma, votre couverture est celle d'un employé de maintenance. Accédez au 11e étage, récupérez le prototype de la Master Ball. Ne touchez à RIEN d'autre.",
      },
      {
        from: "sigma12@rocket-net.co",
        subject: "[Non envoyé] Rapport anomalie",
        body: "J'ai vu quelque chose dans les serveurs. Un Pokémon... digital. Il nageait dans les lignes de code. Porygon ? Non, plus instable. Comme un fantôme.",
      },
    ],
  },
];

type Phase = "login" | "select-agent" | "password" | "inbox" | "email";

export default function EmployeeLogin() {
  const { actions } = useMusic();
  const [dialog, setDialog] = useState<string | null>("Portail ROCKET-NET v4.2 — Intranet securise. Identifiez-vous.");
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [phase, setPhase] = useState<Phase>("login");
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [readEmails, setReadEmails] = useState<Set<string>>(new Set());
  const [maintenanceUnlocked, setMaintenanceUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("sylphe_intranet_complete") === "true" &&
      localStorage.getItem("sylphe_bill_email") === "true",
  );

  const handleLogin = useCallback(() => {
    setPhase("select-agent");
    setDialog("Selectionnez un profil employe. Indice: leur mot de passe est le nom de leur Pokemon prefere...");
  }, []);

  const handleSelectAgent = useCallback((index: number) => {
    setSelectedAgent(index);
    setPhase("password");
    setDialog(EMPLOYEES[index].hint);
    setPassword("");
    setPasswordError(false);
  }, []);

  const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgent === null) return;
    const agent = EMPLOYEES[selectedAgent];
    if (password.toLowerCase().trim() === agent.pokemon) {
      setPhase("inbox");
      setDialog(`Acces autorise. Boite de reception de ${agent.name}.`);
      actions.playOneShot("sfx-puzzle");
    } else {
      setPasswordError(true);
      setDialog("Mot de passe incorrect. Indice: c'est le nom d'un Pokemon...");
    }
  }, [selectedAgent, password]);

  const handleOpenEmail = useCallback((emailIdx: number) => {
    if (selectedAgent === null) return;
    setSelectedEmail(emailIdx);
    setPhase("email");
    actions.activateTemporarySequence("file-corrupt", 1);
    const emailKey = `${selectedAgent}-${emailIdx}`;
    setReadEmails(prev => new Set(prev).add(emailKey));

    const agent = EMPLOYEES[selectedAgent];
    const totalEmails = agent.inbox.length;
    const newRead = new Set(readEmails).add(emailKey);
    const agentEmailsRead = agent.inbox.filter((_, i) => newRead.has(`${selectedAgent}-${i}`)).length;

    if (agentEmailsRead === totalEmails) {
      setGameFlag("sylphe_intranet_complete");
      actions.activateTemporarySequence("access-denied");
      const billEmailUnlocked =
        typeof window !== "undefined" &&
        localStorage.getItem("sylphe_bill_email") === "true";
      setMaintenanceUnlocked(Boolean(billEmailUnlocked));
      setDialog(
        billEmailUnlocked
          ? "Tous les emails lus. Le canal maintenance du 11e etage repond encore au mot de passe laisse par Leo."
          : "Tous les emails lus. Des informations compromettantes sur la Team Rocket ont ete decouvertes.",
      );
    }
  }, [selectedAgent, readEmails]);

  const handleDialogClick = () => {
    if (isTypewriterDone) { setDialog(null); setIsTypewriterDone(false); setForceComplete(false); }
    else { setForceComplete(true); }
  };

  return (
    <GBAShell>
      <section className="relative bg-[#0a0a0a] h-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a0000] border-b border-[#330000] text-[#ff3333] text-[8px] px-4 py-2 flex justify-between items-center z-10 relative select-none">
          <span>📍 INTRANET ROCKET-NET</span>
          <span className="opacity-60 text-[6px]">v4.2 — CONFIDENTIEL</span>
        </div>

        <div className="h-full overflow-y-auto pb-20 px-3 pt-3">
          {/* Login screen */}
          {phase === "login" && (
            <div className="flex flex-col items-center gap-3 mt-8">
              <div className="text-[10px] text-[#ff3333] font-bold text-center">
                ╔═══════════════════════╗<br />
                ║&nbsp; ROCKET-NET INTRANET &nbsp;║<br />
                ║&nbsp; Acces Employes Only &nbsp;║<br />
                ╚═══════════════════════╝
              </div>
              <div className="w-[40px] h-[40px] text-[30px] text-center">R</div>
              <button
                onClick={handleLogin}
                className="bg-[#330000] text-[#ff3333] border border-[#550000] text-[8px] px-6 py-2 hover:bg-[#440000] transition-colors"
              >
                CONNEXION EMPLOYE
              </button>
              <p className="text-[6px] text-[#440000] mt-2">
                Tout acces non autorise sera signale a Giovanni.
              </p>
            </div>
          )}

          {/* Agent selection */}
          {phase === "select-agent" && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-[7px] text-[#ff3333] mb-2">PROFILS DISPONIBLES:</p>
              {EMPLOYEES.map((emp, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAgent(i)}
                  className="bg-[#1a0000] border border-[#330000] text-left p-2 hover:bg-[#220000] transition-colors"
                >
                  <p className="text-[8px] text-[#ff3333]">{emp.name}</p>
                  <p className="text-[6px] text-[#550000]">{emp.email}</p>
                </button>
              ))}
              <button
                onClick={() => { setPhase("login"); setDialog(null); }}
                className="text-[6px] text-[#330000] mt-2 hover:text-[#550000]"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* Password entry */}
          {phase === "password" && selectedAgent !== null && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <p className="text-[8px] text-[#ff3333]">{EMPLOYEES[selectedAgent].name}</p>
              <p className="text-[6px] text-[#550000]">{EMPLOYEES[selectedAgent].email}</p>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Mot de passe"
                  autoFocus
                  className={`bg-[#0a0000] border text-[8px] text-[#ff3333] px-3 py-1 w-[150px] outline-none placeholder:text-[#330000] ${
                    passwordError ? "border-[#ff0000]" : "border-[#330000]"
                  }`}
                />
                <button
                  type="submit"
                  className="bg-[#330000] text-[#ff3333] border border-[#550000] text-[7px] px-4 py-1 hover:bg-[#440000]"
                >
                  ENTRER
                </button>
              </form>
              <button
                onClick={() => { setPhase("select-agent"); setSelectedAgent(null); setDialog(null); }}
                className="text-[6px] text-[#330000] mt-2 hover:text-[#550000]"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* Inbox */}
          {phase === "inbox" && selectedAgent !== null && (
            <div className="flex flex-col gap-1 mt-3">
              <p className="text-[7px] text-[#ff3333] mb-2">
                📬 BOITE DE RECEPTION — {EMPLOYEES[selectedAgent].name}
              </p>
              {EMPLOYEES[selectedAgent].inbox.map((email, i) => {
                const isRead = readEmails.has(`${selectedAgent}-${i}`);
                return (
                  <button
                    key={i}
                    onClick={() => handleOpenEmail(i)}
                    className={`text-left p-2 border transition-colors ${
                      isRead
                        ? "bg-[#0a0000] border-[#1a0000] opacity-60"
                        : "bg-[#1a0000] border-[#330000] hover:bg-[#220000]"
                    }`}
                  >
                    <p className="text-[6px] text-[#880000]">De: {email.from}</p>
                    <p className="text-[7px] text-[#ff3333]">{isRead ? "✓ " : "● "}{email.subject}</p>
                  </button>
                );
              })}
              {maintenanceUnlocked && (
                <button
                  onClick={() => window.location.assign("/11th-floor")}
                  className="mt-3 border border-[#335577] bg-[#08111f] px-3 py-2 text-left text-[7px] text-[#7db8ff] hover:bg-[#10213b]"
                >
                  ↗ ASCENSEUR MAINTENANCE // 11E ETAGE
                </button>
              )}
              <button
                onClick={() => { setPhase("select-agent"); setSelectedAgent(null); setDialog(null); }}
                className="text-[6px] text-[#330000] mt-3 hover:text-[#550000]"
              >
                ← Deconnexion
              </button>
            </div>
          )}

          {/* Email detail */}
          {phase === "email" && selectedAgent !== null && selectedEmail !== null && (
            <div className="mt-3">
              <div className="bg-[#0a0000] border border-[#330000] p-3">
                <p className="text-[6px] text-[#880000]">
                  De: {EMPLOYEES[selectedAgent].inbox[selectedEmail].from}
                </p>
                <p className="text-[7px] text-[#ff3333] mt-1 border-b border-[#1a0000] pb-1">
                  {EMPLOYEES[selectedAgent].inbox[selectedEmail].subject}
                </p>
                <p className="text-[7px] text-[#aa3333] mt-2 leading-[12px] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: EMPLOYEES[selectedAgent].inbox[selectedEmail].body.replace("11e étage", "<a href='/11th-floor' style='color:#7db8ff'>11e étage</a>") }}>
                </p>
              </div>
              {maintenanceUnlocked && (
                <button
                  onClick={() => window.location.assign("/11th-floor")}
                  className="mt-3 border border-[#335577] bg-[#08111f] px-3 py-2 text-[7px] text-[#7db8ff] hover:bg-[#10213b]"
                >
                  Ouvrir le canal maintenance vers le 11e etage
                </button>
              )}
              <button
                onClick={() => { setPhase("inbox"); setSelectedEmail(null); }}
                className="text-[6px] text-[#330000] mt-2 hover:text-[#550000]"
              >
                ← Retour a la boite de reception
              </button>
            </div>
          )}
        </div>

        {/* Dialog */}
        {dialog && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <DialogBox isClickable={isTypewriterDone} onClick={handleDialogClick}>
              <TypewriterText
                key={dialog} text={dialog} speed={40} forceComplete={forceComplete}
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
