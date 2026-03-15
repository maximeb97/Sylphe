import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYLPHE CORP. | La Technologie du Futur",
  description: "Sylphe Corp. - Leader mondial en recherche et développement technologique. Bienvenue dans le futur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script id="developer-easter-egg" strategy="afterInteractive">
          {`
            console.log("%c📡 SYLPHE CORP. NETWORK INITIALIZED", "color: #ff3333; font-weight: bold; font-family: monospace; font-size: 14px; background: #222; padding: 4px; border-left: 4px solid #ff3333;");
            console.log("%cLa direction vous remercie de votre discrétion concernant le 'Projet M' sous Jadielle.", "color: #999; font-style: italic;");
            console.log("ASTUCE DEV: Essayez d'utiliser le terminal et tapez des mots de passe farfelus ou surveillez les requêtes réseau...");

            // DevTools Console Boss
            (function() {
              var glitchHP = 3;
              var glitchDefeated = localStorage.getItem('sylphe_glitch_boss_defeated') === 'true';

              if (!glitchDefeated) {
                setTimeout(function() {
                  console.log("%c⚠ ANOMALIE DETECTEE DANS LA CONSOLE", "color: #ff0000; font-size: 16px; font-weight: bold;");
                  console.log("%c░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "color: #ff3333;");
                  console.log("%c   UN GLITCH VIT DANS VOTRE     ", "color: #ff3333; font-size: 12px;");
                  console.log("%c       INSPECTEUR DOM.           ", "color: #ff3333; font-size: 12px;");
                  console.log("%c░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "color: #ff3333;");
                  console.log("%cHP du Glitch: " + glitchHP + "/3", "color: #ffcc00; font-size: 14px;");
                  console.log("%cPour le combattre, executez: window.sylphe.useMasterball()", "color: #88ff88; font-style: italic;");
                }, 3000);
              }

              window.sylphe = window.sylphe || {};
              window.sylphe.useMasterball = function() {
                if (glitchDefeated) {
                  console.log("%c🔴 Le Glitch a deja ete capture.", "color: #888;");
                  return;
                }
                glitchHP--;
                if (glitchHP > 0) {
                  console.log("%c🔴 La Masterball vibre...", "color: #ff3333; font-size: 12px;");
                  console.log("%c   Le Glitch resiste ! HP: " + glitchHP + "/" + 3, "color: #ffcc00;");
                  console.log("%cReessayez ! Le Glitch s'affaiblit...", "color: #88ff88;");
                } else {
                  glitchDefeated = true;
                  localStorage.setItem('sylphe_glitch_boss_defeated', 'true');
                  window.dispatchEvent(new Event('storage'));
                  console.log("%c✨ GLITCH CAPTURE !", "color: #88ff88; font-size: 16px; font-weight: bold;");
                  console.log("%c░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "color: #88ff88;");
                  console.log("%c  L'anomalie a ete confinee.    ", "color: #88ff88; font-size: 12px;");
                  console.log("%c  La console est purifiee.      ", "color: #88ff88; font-size: 12px;");
                  console.log("%c░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "color: #88ff88;");
                  console.log("%cVous avez prouve que les vrais dresseurs regardent aussi la console.", "color: #999; font-style: italic;");
                }
              };
            })();

            // Service Worker registration for offline MissingNo
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            }

            // LocalStorage piratage hint from Porygon
            (function() {
              if (localStorage.getItem('sylphe_root_access') !== 'true') {
                setTimeout(function() {
                  if (localStorage.getItem('sylphe_porygon_echo') === 'true' || localStorage.getItem('sylphe_missingno_unlocked') === 'true') {
                    console.log("%c🔑 PORYGON WHISPER:", "color: #00ccff; font-weight: bold;");
                    console.log("%cLa derniere clef n'est pas sur nos serveurs, mais chez vous.", "color: #00ccff; font-style: italic;");
                    console.log("%cRegardez dans votre LocalStorage... la variable sylphe_root_access attend d'etre changee.", "color: #006688;");
                  }
                }, 10000);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
