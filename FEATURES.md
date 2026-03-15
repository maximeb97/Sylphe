# Features

## Easter eggs à faire:

- [x] Route à créer: "/giovanni-office", seulement "sylphe_giovanni_unlocked" est à true, sinon on affiche une page "Accès refusé" dans le style gameboy. Si "sylphe_giovanni_unlocked" est à true, on une map avec notre personnage jouable dans un bureau luxueux avec un ordinateur et un téléphone. Un message de Giovanni s'affiche sur l'ordinateur.
- [x] Route à créer: "/rocket-hq" avec une map du HQ de la team rocket (seulement si "sylphe_rocket_mode" est à true, sinon "accès refusé").
- [x] Route à créer: "/mew-cloning-chamber-042" ou on affichera une map avec un laboratoire où on pourra voir Mewtoo dans un aquarium et des pokémon clones
- [x] Route à créer: "/cyberspace" ou on aura une map d'un monde virtuel avec des flash bleus et rouges, on pourra trouver Porygon dans cette map
- [x] Route à créer: "/pokeball": sois créatif pour cette page
- [x] Route à créer: "/glitch-city": sois créatif pour cette page, en rapport avec missingno
- [x] Route API à créer: "/api/masterball": sois créatif pour cet endpoint

## Prochaines étapes (Phase 2):
- [x] Créer une quête croisée: trouver le code d'accès au "Projet M" caché entre le cyber-espace et Glitch City.
- [x] Permettre au joueur de lancer le combat contre Mewtwo dans "/mew-cloning-chamber-042" s'il détient la Masterball.
- [x] Créer l'objet "Silph Scope" déblocable avec MissingNo pour révéler des fantômes sur la map extérieure.
- [x] Dans /pokeball , si mew n'a pas été capturé (sylphe_mew_captured), la pokeball est vide, sinon elle contient mew.

## Prochaines étapes (Phase 3):
- [x] La map de la route "/mew-cloning-chamber-042" ne doit être accessible que si on entre le mot de passe "7382-4B9F". Une fois le mot de passe entré, il ne doit pas être demandé à nouveau 
- [x] Route à créer: "/cerulean-cave", un labyrinthe de fin de jeu accessible uniquement après avoir fini tous les autres easter eggs.
- [x] Implémenter le fameux combat final avec RED si on parvient au bout de /cerulean-cave.
- [x] Ajouter une gestion de l'inventaire pour visualiser la Masterball, la clé, et le Silph Scope. (Via commande terminal `inventory`)
- [x] Avec le système d'inventaire, ajoute aussi une liste des maps visitées. En cliquant sur une map, on est redirigé vers celle-ci. Une map ne doit appraitre que quand elle a déjà été visitée une fois. (Commande terminal `map` implémentée)

## Prochaines étapes (Phase 4):

- [x] Ajoute un easter egg en rapport avec le mot de passe qui se trouve dans /var/log/system.log (pr0t0type_151)
- [x] Utiliser des animations de combat Pokémon classiques lors de la capture de Mew et Mewtwo plutôt que juste du texte de dialogue.
- [x] Refonte du systeme d'inventaire: ouvrir un menu quand l'utilisateur appuie sur le bouton "start" de la gameboy, ce menu contient 2 sous menu: "inventaire" et "map", on affichera la liste des items, et la liste des maps débloquer. Cliquer sur une map nous redirigera vers celle-ci.
- [x] Améliore la map de /cerulean-cave
- [x] Ajoute la route au robots.txt

## Prochaines étapes (Phase 5):

- [x] Ajouter une route "/hall-of-fame" qui s'ouvre après RED et rejoue toute la progression sous forme d'archives corrompues.
- [ ] Créer un mini-jeu de terminal où Porygon défragmente les données de Glitch City pour révéler une nouvelle commande cachée.
- [ ] Ajouter une mécanique de météo secrète: pluie acide Team Rocket, aurore cybernétique, brouillard spectral si le Scope est actif.
- [ ] Ajouter un faux Pokédex interne Sylphe avec fiches truquées pour Mew, Mewtwo et le Prototype 151.
- [ ] Cacher un easter egg audio: si l'utilisateur ouvre /pokeball puis /mew-cloning-chamber-042 en moins de 15 secondes, un cri inversé de Mew joue et débloque une note de labo.
- [x] Ajouter une salle blanche finale derrière les escaliers de /cerulean-cave pour confronter l'archive 151 elle-même.
- [x] Faire en sorte que le personnage soit aussi controllable avec les touche de la gameboy
- [x] Tous les pokémons capturés doivent apparaitrent dans la "Team"
- [x] La map pokeball doit contenir tous les pokémons capturés.
- [x] Les pokémons dans la map pokeball peuvent se déplacer librement par eux-mêmes

## Prochaines étapes (Phase 6):

- [x] Débloquer un mode "Archive Debug" si l'utilisateur possède RED + Prototype 151 + toutes les maps visitées.
- [x] Ajouter une présence rare de Porygon dans la Pokeball si le joueur passe par /cyberspace juste avant.

## Prochaines étapes (Phase 7):

- [x] Faire en sorte que `archive-debug` ouvre aussi des logs cachés dans le terminal avec chronologie complète du Projet M.
- [x] Ajouter un combat factice contre une "Archive Rouge" dans /hall-of-fame si le joueur tente de corrompre les archives.
- [x] Connecter la page Team au Hall of Fame: cliquer plusieurs fois sur Porygon Echo pourrait ouvrir directement l'archive.
- [x] Ajouter une variante de la Pokeball intérieure quand Mew, Mewtwo et Porygon sont présents ensemble: la pièce devient une mini biosphère triangulée.
- [x] Cacher un faux bug visuel dans le Hall of Fame qui révèle en réalité un indice pour la future salle blanche finale.
- [x] Ajouter une commande terminal secrète de diagnostic (`containment`) qui résume les anomalies encore non résolues.
- [x] Les commandes utilitaires cachées ne doivent pas être listées directement dans le "help" du terminal. Elles doivent être trouvées en explorant le site, elles devront être données via des indices variés/subtiles.
- [x] Ajoute plusieurs évennements qui se déclenchent de façon aléatoire sous certaines conditions, il faut plusieurs niveau de rareté mais ces évennements ne doivent pas bloquer d'autres élements du lore.
- [x] Ajoute une nouvelle quête de lore complète, sans lien avec les autres (ou avec peu de liens).
- [x] Route white-room
- [x] Route beneath_stairs

## Checklist suite:

- [ ] Mini-jeu de defragmentation Porygon dans le terminal.
- [ ] Systeme de meteo secrete partage entre plusieurs routes.
- [ ] Faux Pokedex Sylphe avec fiches truquees et variantes selon la progression.
- [ ] Easter egg audio entre `/pokeball` et `/mew-cloning-chamber-042`.
- [x] Quete "Lavender Mirror" comme seconde branche parallele au Musee Null.
- [ ] Evenement rare global "Blackout Sylphe".

## Propositions pour la suite:

- Easter egg terminal `checksum`: une commande pseudo-technique qui compare 150 et 151 et devoile des divergences de lore selon la progression.
- Evenement rare "Blackout Sylphe": pendant quelques secondes, toute l'interface coupe sauf les entites deja liberees dans la Pokeball.
- Mini-boss "Archiviste Porygon-Z": issue d'une mauvaise defragmentation de Glitch City, a utiliser pour une quete plus autonome.

## Idées de lore additionnel:

- Le mot de passe `pr0t0type_151` n'est pas juste un code de sauvegarde: c'est une clef memoire qui reveille l'empreinte du sujet originel cache dans la Masterball.
- RED n'est pas seulement le boss final: il surveille le point ou la recherche Sylphe bascule d'une simple capture vers la recreation du vivant.
- La Pokeball blanche agit comme une chambre d'echo mentale: plus le joueur accumule de secrets, plus elle cesse d'etre vide.
- Mewtwo ne reste pas enferme par contrainte: il choisit peu a peu de revenir dans la Pokeball blanche pour observer l'empreinte du sujet 151.
- La Team visible sur le site n'est pas un simple trombinoscope: c'est une projection du roster reel du système Sylphe.
- Les boutons physiques de la console semblent maintenant conectés au monde virtuel, comme si la coque GBA était devenue une télécommande de confinement.
- Le Hall of Fame n'est pas un tableau d'honneur mais un registre de confinement classe, consultable seulement par les operateurs qui ont vu trop de choses.
- Porygon ne rejoint jamais vraiment l'equipe: il traverse les couches du système comme un paquet reseau devenu vivant.
