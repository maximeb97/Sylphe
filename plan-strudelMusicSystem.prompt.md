# Plan: Système musique Strudel

Mettre en place un système de musique global persistant entre les pages, basé sur Strudel, avec provider racine, hook ergonomique, catalogue de musiques découpées en séquences `$:` activables, volume global piloté depuis GBAShell, et page de test technique pour auditionner n'importe quelle musique et ses séquences. L'approche recommandée est: provider client monté depuis le layout racine pour survivre aux changements de route, moteur Strudel singleton inspiré de `www`, bus audio global pour unifier musique et SFX existants, puis déclaration des musiques par fichiers de catalogue + mapping automatique par route avec surcharge via hook.

## Steps

### 1. Phase 1 — Fondations audio globales
Ajouter les dépendances Strudel dans `package.json`, puis créer un noyau audio global sous `src/lib/music/engine/` avec: initialisation singleton Strudel, chargement des banques/synthés, reprise de l'AudioContext sur geste utilisateur, master gain global, persistance volume/mute en localStorage, et API impérative minimale `playScript`, `stop`, `setVolume`, `getState`. Cette phase bloque toutes les autres.

### 2. Phase 1 — Unifier la sortie audio existante
Refactorer `src/lib/audio.ts` et `src/components/RadioPokematos.tsx` pour qu'ils consomment le même bus audio global au lieu de créer chacun leur propre `AudioContext`/destination. Objectif: la roulette du shell contrôle aussi les cris Pokémon, glitches et le mini-radio. *Dépend de 1.*

### 3. Phase 2 — État React global
Créer un provider client racine, par exemple `src/app/providers.tsx`, monté depuis `src/app/layout.tsx`, qui expose un contexte `MusicProvider`. Ce provider ne doit pas vivre dans `GBAShell`, sinon il serait remonté à chaque page. Il gère l'état observable: musique courante, séquences actives persistantes, séquence temporaire, lecture one-shot, volume/mute, statut de chargement, et route courante. *Dépend de 1.*

### 4. Phase 2 — API hook
Créer `src/hooks/useMusic.ts` et les types associés sous `src/lib/music/types.ts`. L'API du hook doit couvrir les cas demandés: changer complètement de musique, activer/désactiver une séquence persistante, activer une séquence temporaire avec restauration propre, jouer un son one-shot traité comme une musique jetable, régler volume/mute, et déclarer une musique de page. Prévoir deux niveaux d'API: une API impérative globale et une couche `usePageMusic(...)` pour le mapping automatique par route. *Dépend de 3.*

### 5. Phase 3 — Modèle des musiques et séquences
Créer un catalogue sous `src/lib/music/tracks/` avec un fichier par musique et un index central. Chaque musique doit séparer: métadonnées, script Strudel source, identifiants de séquences, séquences activées par défaut, options de boucle ou one-shot. Reprendre le principe du projet `www`: parser les blocs `$:` et ignorer / rendre activables les blocs en `_$:`. Au lieu de muter le code source à la volée, construire le script évalué à partir du catalogue des blocs actifs pour garder un comportement déterministe. *Dépend de 1.*

### 6. Phase 3 — Mapping automatique par route
Ajouter un fichier de configuration du style `src/lib/music/routeMusic.ts` qui associe les routes aux musiques par défaut et à des séquences de base. Le provider écoute `pathname` et applique ce mapping si aucune page ne demande explicitement autre chose. Les pages peuvent surcharger ce comportement via `usePageMusic`. Inclure clairement le fallback quand une route n'a pas de musique. *Dépend de 4 et 5.*

### 7. Phase 4 — Intégration shell/UI
Modifier `src/components/GBAShell.tsx` pour afficher une roulette de volume discrète sur le bezel, avec glisser/souris/clavier, et reflet visuel des états `mute`/volume. Cette roulette lit et met à jour le contexte global uniquement; elle ne porte aucune logique audio locale. Ne pas ajouter d'entrée dans `StartMenu`, puisque la page de test doit rester technique et discrète. *Dépend de 3.*

### 8. Phase 4 — Page test technique
Créer une page cachée, par exemple `src/app/music-test/page.tsx`, permettant de lister toutes les musiques du catalogue, lancer/arrêter chaque musique, activer/désactiver chaque séquence connue, déclencher une séquence temporaire, jouer un one-shot, et inspecter l'état courant du provider. La page doit servir à valider le parsing des `$:` / `_$:` sans exposition dans la navigation publique. *Dépend de 4 et 5.*

### 9. Phase 5 — Adoption initiale
Brancher au moins un petit ensemble représentatif de pages sur le nouveau système: page d'accueil, une page ambiante type `pokeball`, et une page plus agressive type `glitch-city` ou `mew-cloning-chamber-042`. L'objectif n'est pas de musicaliser tout le site d'un coup, mais de valider le pattern complet route → musique → séquences → SFX globaux. *Dépend de 6 et 7.*

### 10. Phase 5 — Stabilisation
Ajouter la documentation minimale d'usage pour les futures musiques (format de fichier, nommage des séquences, comment utiliser `usePageMusic` et les séquences temporaires), puis vérifier qu'aucun ancien appel audio ne bypass le bus global. *Parallèle avec 9 sauf sur les fichiers touchés.*

## Relevant files

- `src/app/layout.tsx` — point d'insertion du provider client racine sans transformer le layout serveur
- `src/components/GBAShell.tsx` — emplacement de la roulette de volume globale dans le shell
- `src/components/StartMenu.tsx` — à laisser hors du périmètre pour ne pas exposer la page technique
- `src/lib/audio.ts` — SFX existants à rerouter vers le bus audio commun
- `src/components/RadioPokematos.tsx` — exemple de source audio locale à raccorder au master gain
- `src/app/page.tsx` — première page à déclarer une musique de route et à servir de référence d'adoption
- `src/app/pokeball/page.tsx` — page candidate pour tester musique + SFX coexistants
- `src/app/glitch-city/page.tsx` — page candidate pour tester une ambiance plus abrasive
- `src/app/mew-cloning-chamber-042/page.tsx` — autre candidate pour une surcharge contextuelle et des one-shots
- `package.json` — dépendances Strudel à ajouter
- `www/src/hooks/useStrudel.ts` — référence pour l'initialisation singleton du REPL Strudel
- `www/src/hooks/usePatternSequencer.ts` — référence pour le parsing et l'activation sélective des blocs `$:`

## Vérification

1. Vérifier que le provider ne se remonte pas à chaque navigation en changeant plusieurs fois de route et en confirmant que l'état volume/mute persiste sans recréation du contexte audio.
2. Confirmer qu'une musique par défaut démarre ou se met à jour correctement lors d'un changement de route, et qu'un appel explicite via hook peut la surcharger puis relâcher la main au mapping automatique.
3. Depuis la page de test, activer puis désactiver plusieurs séquences d'une même musique et vérifier que seuls les blocs `$:` attendus sont joués; tester aussi un bloc marqué `_$:` devenu actif via le hook.
4. Tester une séquence temporaire: activation, superposition éventuelle, puis retour propre à l'état précédent sans fuite d'état.
5. Tester un one-shot qui se joue une fois sans casser la musique de fond, puis vérifier que l'état du provider revient à la piste précédente.
6. Tourner la roulette dans `GBAShell` et vérifier l'effet sur Strudel, `playPokemonCry`, `playGlitchSound` et `RadioPokematos`.
7. Lancer `npm run lint` après intégration.

## Décisions

- Inclure un mapping automatique par route avec possibilité de surcharge explicite via hook.
- Le volume est global à toute la couche audio du site, pas seulement à Strudel.
- La page de test est une route technique discrète, sans entrée ajoutée au Start Menu.
- Le provider doit vivre au niveau racine de l'application, pas dans `GBAShell`, pour survivre aux changements de page.
- Le système doit traiter les séquences Strudel comme des blocs nommés et activables, en tenant compte des variantes `$:` et `_$:`.

## Considérations supplémentaires

1. Choisir des banques/samples Strudel raisonnables au démarrage pour limiter le temps de premier chargement; recommandation: commencer avec synthés intégrés + une banque de samples utile, puis étendre si nécessaire.
2. Décider si les one-shots doivent passer par le même bus musical que la piste de fond ou par un sous-bus dédié; recommandation: même master gain, mais canal logique distinct dans l'état pour éviter les collisions de remplacement.
3. Délimiter l'adoption initiale à quelques pages représentatives avant généralisation à tout le site pour garder la mise en production maîtrisée.
