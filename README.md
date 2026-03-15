# Sylphe

Sylphe est une experience Next.js qui melange faux site corporate, mini-aventure Pokemon et terminal secret. Le projet repose sur une coque de GBA interactive, des routes cachees, une progression persistante via `localStorage` et une couche de lore qui se debloque en explorant le site.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Demarrage local

```bash
npm install
npm run dev
```

Application locale: `http://localhost:3000`

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Systèmes principaux

- Navigation dans un monde retro pilotable au clavier et via les boutons de la coque GBA.
- Terminal secret avec faux systeme de fichiers, pseudo-commandes shell et commandes lore cachees.
- Gestion persistante des flags `sylphe_*`, de l'inventaire et de la cartographie des zones visitees.
- Routes secretes pour Glitch City, Rocket HQ, Giovanni Office, Chambre 042, Pokeball interieure, Grotte Azuree et Hall of Fame.
- Hall of Fame comme registre de confinement, avec anomalies visuelles et routines d'archive hostiles.

## Secrets récents déjà implémentés

- `archive-debug` imprime maintenant une chronologie complete du Projet M dans le terminal.
- `containment` dresse un diagnostic clandestin des anomalies encore non resolues.
- Les commandes cachees ne sont plus exposees directement par `help` ni par l'autocompletion standard.
- Porygon Echo peut ouvrir directement le Hall of Fame depuis la Team si l'archive est deja montee.
- La Pokeball blanche peut se transformer en biosphere triangulee et declencher des evenements ambiants a raretes multiples.
- Le Hall of Fame contient une "Archive Rouge" qui revele un indice persistant vers une future White Room.
- La Grotte Azuree cache maintenant un acces vers `Beneath Stairs`, qui ouvre a son tour la `White Room` et la confrontation finale avec l'archive 151.
- Une quete parallele `Musee Null` peut etre declenchee depuis la home et ajoute le `Badge NULL` ainsi que la commande cachee `checksum`.
- Une seconde quete parallele `Lavender Mirror` transforme la home en piste telephonique vers un memorial spectral interne et debloque la commande cachee `requiem`.

## Documentation interne

- `FEATURES.md` suit les easter eggs et l'avancement des phases.
- `SECRETS.MD` contient l'ensemble des spoilers et commandes cachees.

## Validation

```bash
npm run lint
```
