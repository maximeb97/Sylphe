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
- [ ] Utiliser des animations de combat Pokémon classiques lors de la capture de Mew et Mewtwo plutôt que juste du texte de dialogue. (Combat RED implémenté)
- [x] Avec le système d'inventaire, ajoute aussi une liste des maps visitées. En cliquant sur une map, on est redirigé vers celle-ci. Une map ne doit appraitre que quand elle a déjà été visitée une fois. (Commande terminal `map` implémentée)
- [ ] Ajoute un easter egg en rapport avec le mot de passe qui se trouve dans /var/log/system.log (pr0t0type_151)