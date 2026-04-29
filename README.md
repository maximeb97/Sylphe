# Sylphe

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

## Variables d'environnement

Les variables publiques suivantes permettent de brancher les nouveaux liens sans modifier les composants :

- `NEXT_PUBLIC_DISCORD_URL`: affiche le badge Discord sur l'ecran d'accueil et pointe vers votre serveur.
- `NEXT_PUBLIC_MAXIME_PROFILE_URL`: affiche le bouton `PROFIL` dans la fiche de `Maxime B.` dans la section Team.
- `NEXT_PUBLIC_NEXVID_URL`: remplace le bouton d'action de `NexVid` par `VISITER`.
- `NEXT_PUBLIC_RECLYP_URL`: remplace le bouton d'action de `ReClyp` par `VISITER`.
- `NEXT_PUBLIC_FRAGBIN_URL`: remplace le bouton d'action de `FragBin` par `VISITER`.
- `NEXT_PUBLIC_BROWMI_URL`: remplace le bouton d'action de `Browmi` par `VISITER`.

Exemple :

```bash
NEXT_PUBLIC_DISCORD_URL=https://discord.gg/votre-serveur
NEXT_PUBLIC_MAXIME_PROFILE_URL=https://maxime.example/profile
NEXT_PUBLIC_NEXVID_URL=https://nexvid.example
NEXT_PUBLIC_RECLYP_URL=https://reclyp.example
NEXT_PUBLIC_FRAGBIN_URL=https://fragbin.example
NEXT_PUBLIC_BROWMI_URL=https://browmi.example
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Documentation interne

- `FEATURES.md` suit les easter eggs et l'avancement des phases.
- `SECRETS.MD` contient l'ensemble des spoilers et commandes cachees.

## Validation

```bash
npm run lint
```
