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
- [x] Créer un mini-jeu de terminal où Porygon défragmente les données de Glitch City pour révéler une nouvelle commande cachée.
- [x] Ajouter une mécanique de météo secrète: pluie acide Team Rocket, aurore cybernétique, brouillard spectral si le Scope est actif.
- [x] Ajouter un faux Pokédex interne Sylphe avec fiches truquées pour Mew, Mewtwo et le Prototype 151.
- [x] Cacher un easter egg audio: si l'utilisateur ouvre /pokeball puis /mew-cloning-chamber-042 en moins de 15 secondes, un cri inversé de Mew joue et débloque une note de labo.
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

- [x] Mini-jeu de defragmentation Porygon dans le terminal.
- [x] Systeme de meteo secrete partage entre plusieurs routes.
- [x] Faux Pokedex Sylphe avec fiches truquees et variantes selon la progression.
- [x] Easter egg audio entre `/pokeball` et `/mew-cloning-chamber-042`.
- [x] Quete "Lavender Mirror" comme seconde branche parallele au Musee Null.
- [x] Evenement rare global "Blackout Sylphe": pendant quelques secondes, toute l'interface coupe sauf les entites deja liberees dans la Pokeball..

## Nouvelles Features / Quêtes / Easter Eggs (Phase 8+)

Voici une vingtaine de propositions audacieuses tirant parti des technologies web pour créer du meta-gaming et de nouveaux secrets :

### 1. Manipulation du Navigateur & Web APIs
- [x] **Quête de l'Hors-Ligne (Service Worker) :** Si l'utilisateur coupe physiquement sa connexion internet, le site est remplacé par une version corrompue (mise en cache) hébergée par MissingNo avec le message "L'abîme réseau est ma maison".
- [x] **Écholocalisation dans la Grotte Noire (Web Audio / Microphone API) :** Une route `/mt-moon-cavern` dans le noir absolu. Le joueur doit faire du bruit au micro de son PC. Le son génère des flashs lumineux circulaires qui éclairent la map une ou deux secondes (façon Nosferapti).
- [x] **Spectre en Réalité Augmentée (MediaStream API) :** Une page `/spectre-mirror` active la webcam, applique un filtre Gameboy (pixels verts), et affiche aléatoirement l'ombre d'un Ectoplasma ou de Spectrum derrière l'utilisateur sur le flux vidéo.
- [x] **Labyrinthe Gyroscopique (Device Orientation API) :** Sur mobile, une épreuve `/trick-house-maze` où incliner physiquement son téléphone fait rouler une Pokéball virtuelle pour éviter les dalles piégées de la Team Rocket.
- [x] **Fréquences Radio Cachées (Web Audio API) :** Ajout d'une "Radio Pokématos" interactive dans le header. Régler la fréquence sur 20.5 MHz fait jouer la "Pokéflûte" et réveille un Ronflex bloquant un module ; la fréquence 10.5 GHz (Lavanville) dévoile des dialogues chuchotés et invisibles à l'œil.

- [x] **Synchronisation des Pods (Broadcast Channel API) :** Le joueur doit ouvrir deux onglets : l'un sur `/cloning-pod-a`, l'autre sur `/cloning-pod-b`, et déclencher une "Séquence de stabilisation ADN" sur les deux fenêtres en moins de 3 secondes pour réussir un mini-jeu.
- [x] **Le Boss de la Console DevTools :** Un combat secret accessible en ouvrant l'inspecteur (`F12`). Une entité "Glitch" vit dans la section `console.log`. Le joueur la bat en exécutant des appels manuels (ex: `window.sylphe.useMasterball()`).
- [x] **Piratage du LocalStorage :** Porygon laisse un indice: "La dernière clef n'est pas sur nos serveurs, mais chez vous". Le joueur doit aller dans le LocalStorage du navigateur et passer la variable `sylphe_root_access` de `false` à `true` et recharger la page.
- [x] **Secrets Cachés dans le CSS (Inspecteur DOM) :** Des mémos d'employés de Sylphe ou des bouts de mots de passe sont dissimulés sur la Home page avec `color: transparent` ou `display: none`. Ils nécessitent une inspection du code ou de surligner la page entière.
- [x] **Glisser-Déposer Inter-Fonctionnel :** Drag & drop d'un objet visuel (comme une plume spectrale) depuis la page `/museum-null` directement dans le bloc du Web Terminal sur une ligne de commande `analyze_sample`.

- [x] **Éditeur de Fichier VIM intégré :** Lancement de `nano /etc/sylphe/containment.conf` depuis le terminal qui ouvre une interface d'édition textuelle au clavier. Modifier `status=ON` en `OFF` coupe le courant du site et libère des anomalies temporelles.
- [x] **Commande PING et Paquets Réseau :** Une commande `ping mansion.cinnabar.gov` simulant une trace réseau. Elle renvoie au hasard des "paquets corrompus" qui sont en fait des chaines Base64 à décoder pour lire les notes du Dr Fuji.
- [x] **Simulation d'Intranet Corporate (Phishing) :** Créer un portail `/employee-login`. Pour se connecter, le joueur enquête sur un membre de la Team Rocket, trouve son Pokémon préféré, et en déduit son mot de passe pour lire ses emails compromettants.
- [x] **Chronologie Système (Date/Heure Système) :** Un easter egg qui ne se manifeste que si l'utilisateur change l'heure de son propre ordinateur pour la mettre exactement à Minuit : apparition de routes fantômes en haut de la page.

- [x] **Le Système de Stockage de Bill (`/pc-bill`) :** Un bureau virtuel facon Windows 95 très daté. Dans la poubelle, on retrouve les brouillons des emails de "Léo/Bill" paniquant et expliquant comment il a accidentellement transféré son ADN dans une machine.
- [x] **Casino Clandestin (`/casino-game-corner`) :** Une machine à sous purement CSS/TS. Gagner débloque le mode "Porygon-Z" dans le Terminal. Mais jouer plus de 10 fois provoque une rançon numérique ("Team Rocket Ransomware") qui bloque temporairement certains menus.
- [x] **L'Easter Egg `robots.txt` et `humans.txt` :** Rendre le fichier `/humans.txt` accessible avec le message d'appel à l'aide d'un développeur enfermé au siège de la Team Rocket. Ajouter des règles absurdes au `/robots.txt` comme `User-agent: Pokedex-Crawler Disallow: /`.
- [x] **Le Bug de Scroll (Scroll Hijacking Glitch) :** Si l'utilisateur possède l'archive 151, une fois arrivé au footer, le scroll de la page "casse" et permet de descendre encore plus bas, dans le vide intersidéral d'une zone glitch noire, où de multiples MissingNos errent sur la molette de la souris.
- [x] **Faux Geofencing (Geolocation API) :** Le site demande la position géographique de l'utilisateur. S'il l'accepte en Europe, il affiche "Signal lointain". Si l'utilisateur s'amuse à *fausser* (spoof) sa position en DevTools pour l'établir à Tokyo (Kanto), il reçoit un passe pour le Train Magnétique caché.
- [x] **Notifications PUSH Fantômes :** Demander la permission de notification web. S'il est 3h du matin, envoyer une simple notification système qui dit : `"Sujet 150 : J'ai mal..."`, sans que l'utilisateur soit sur l'onglet actif du site.

## Suite

- [ ] Corriger l'affichage de la page `/pc-bill` après le texte initial (rien n'est affiché)
- [ ] Réussir les routes "mt-moon-cavern" et "spectre-mirror" doivent permettra d'ajouter les pokémons Kabuto et Phantominus à l'équipe (et dans la pokéball) si le joueur possède la masteball.
- [ ] Liste dans un fichier à part tous les éléments qui éxistent dans le code mais qui ne sont pas exploités (par exemple `MYUUTSU`)
- [ ] Quand il y en a l'occasion (quand un lieu est mentionné), tu peux mettre un lien vers le lieu s'il existe. (par exemple `Musee Null` -> `<a href='/museum-null' style='color: blue;'>Musee Null</a>`)
- [ ] - Créé d'autres quêtes qui permettent de capturer des pokémons, à chaque fois créé leur Sprite pour qu'ils apparaissent dans la Team et dans la pokéball
- [ ] Ajoute une quête complète qui nous permettra d'entrer dans le fameux 11e etage de la Sylphe Corp, où est enfermé le développeur (moi, Maxime)