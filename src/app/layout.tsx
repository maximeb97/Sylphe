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
          `}
        </Script>
      </body>
    </html>
  );
}
