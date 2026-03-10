import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
