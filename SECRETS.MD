# SECRETS SYLPHE

Ce document compile l'ensemble des secrets, quetes cachees et easter eggs actuellement presents dans le site.

Attention: ce fichier contient des spoilers complets.

## 1. Secrets globaux

### Console GBA

- Le bouton Start de la console ouvre un menu interne avec l'inventaire et la cartographie des zones deja visitees.
- La croix directionnelle de la coque GBA est connectee au monde virtuel et permet de deplacer le personnage sans clavier.

### Navigation et interface

- Le header de la zone principale peut basculer en mode nuit si on clique plusieurs fois sur la barre de lieu.
- Le code Konami sur la page d'accueil declenche une pluie de richesse et une rotation absurde du QG.
- Certaines routes sont volontairement absentes ou restreintes dans `robots.txt` pour souligner leur nature clandestine.

### Reseau et entetes

- Le middleware injecte des entetes sur toutes les pages avec des indices sur MissingNo, la Masterball et la surveillance Sylphe.
- `/api/coffee` renvoie un `418` avec plusieurs indices caches dans les headers, dont une allusion a Mew sous l'eau.
- `/api/masterball` donne un faux point de distribution d'usine et l'indice permettant de debloquer la commande terminale `masterball`.

## 2. Terminal secret

Le terminal Sylphe est le coeur de nombreuses quetes. Il se trouve via l'ordinateur du site principal.

### Commandes utilitaires cachees

- `masterball`: debloque la Masterball dans le monde du site.
- `missingno`: force l'apparition de l'anomalie MissingNo et ouvre Glitch City.
- `giovanni`: debloque l'acces au bureau de Giovanni.
- `bike`: active un mode de deplacement plus rapide.
- `motherlode`: injecte la fortune numerique de Sylphe.
- `noclip`: autorise les collisions fantomes.
- `lsd`: applique une distorsion visuelle temporaire.
- `containment`: affiche un diagnostic clandestin des anomalies encore non contenues.
- `checksum`: compare les archives publiques et l'aile corporate nulle apres recuperation du Badge NULL.
- `requiem`: relit les noms effaces du Miroir de Lavanville apres recuperation du `Mirror Tag`.
- `defrag`: lance le mini-jeu de defragmentation Porygon. Necessite Porygon Echo et Glitch City deverrouilles. Revele la commande `reconstruct`.
- `reconstruct`: reconstitue les archives defragmentees par Porygon. Accessible uniquement apres `defrag`.
- `sylphedex`: consulte le Pokedex interne Sylphe Corp. avec fiches truquees et variantes selon la progression du joueur.

Ces commandes ne sont plus listees directement dans `help` ni dans l'autocompletion standard du terminal.

### Commandes de lore / progression

- `inventory`: affiche les objets reels deja recuperes.
- `map`: affiche les zones deja visitees et retenues dans la memoire du site.
- `pr0t0type_151`: active l'archive du sujet originel 151 a partir du mot de passe cache dans `/var/log/system.log`.
- `archive-debug`: n'est utile qu'apres RED, le PASS SYSTEME, l'archive 151 et la visite de toutes les zones majeures. La commande monte alors le Hall of Fame et imprime une chronologie complete du Projet M directement dans le terminal.

### Faux systeme de fichiers

- `/var/log/system.log` contient le mot de passe `pr0t0type_151`.
- `/home/user/projects/secret/hint.txt` renvoie vers les logs.
- Plusieurs scripts dans `/bin/scripts` donnent des indices narratifs plutot que de vraies fonctions shell.

## 3. Quete du Projet M

### Fragment du mot de passe

- Dans `/cyberspace`, Porygon fournit le fragment `7382`.
- Dans `/glitch-city`, MissingNo fournit le fragment `4B9F` en meme temps que le Scope Sylphe et un bonus de richesse.
- Le mot de passe complet `7382-4B9F` debloque `/mew-cloning-chamber-042` de facon persistante.

### Chambre 042

- La Chambre 042 contient Mewtwo, deux clones de Mew et un terminal de labo.
- Si la Masterball est possedee, la capture de Mewtwo se joue via une sequence de capture Pokemon.
- Si `pr0t0type_151` a ete active, plusieurs dialogues du labo changent pour suggerer que 151 precede 150.

## 4. Quete de Mew et de la Masterball blanche

### Capture de Mew

- Sur la map principale, cliquer plusieurs fois l'eau finit par reveler Mew.
- Si la Masterball est disponible, Mew est capture via une sequence de capture complete.
- Si on insiste encore davantage sur l'eau, un vieux camion rouille apparait comme clin d'oeil aux rumeurs de la premiere generation.

### Pokeball interieure

- La route `/pokeball` represente l'interieur de la Masterball blanche.
- Si Mew n'est pas capture, la piece est quasi vide.
- Si Mew est capture, il flotte librement dans la capsule.
- Si Mewtwo est capture, il rejoint lui aussi l'interieur de la Masterball.
- Si `pr0t0type_151` a ete active, une presence spectrale supplementaire apparait dans la coque.
- Si le joueur sort de `/cyberspace` puis rejoint la Pokeball assez vite, un echo rare de Porygon peut s'y materialiser.
- Quand plusieurs creatures cohabitent, la Pokeball devient un biotope artificiel vivant.
- Si Mew, Mewtwo et Porygon Echo cohabitent, la capsule peut entrer dans un etat de biosphere triangulee avec dialogues et ambiance visuelle specifiques.
- Des evenements ambiants aleatoires peuvent s'y produire avec plusieurs raretes: microclimat docile, brume memoire et convergence triangulee.

## 5. Anomalies et entites cachees

### MissingNo

- `missingno` debloque Glitch City.
- Parler a une anomalie dans Glitch City enrichit le joueur, debloque le Scope Sylphe et livre le second fragment du mot de passe.

### Fantomes du Scope Sylphe

- Le Scope Sylphe revele des fantomes sur la map principale.
- Les fantomes murmurent des restes de memoire lies au clone #150.

### Cali

- Cliquer plusieurs fois sur un arbre de la map principale revele la plume de Cali.
- La mascotte fantome est alors enregistree dans le lore interne du site, meme si son slot equipe est encore reserve pour une evolution future.

### Porygon Echo

- Interagir avec Porygon dans `/cyberspace` active un echo numerique persistant.
- Cet echo peut apparaitre dans la Pokeball interieure.
- Une fois active, il apparait aussi dans la Team sous forme de visiteur numerique.

## 6. Team Rocket et Giovanni

### Rocket HQ

- La route `/rocket-hq` n'est accessible que si `sylphe_rocket_mode` est actif.
- Les sbires donnent des indices sur Giovanni et sur le mot de passe du labo.

### Bureau de Giovanni

- La commande `giovanni` debloque le bureau secret.
- Le bureau contient des indices sur l'instabilite du clone 150 et la prudence a garder avec la Masterball.

## 7. Grotte Azuree et RED

### Conditions d'acces

- `/cerulean-cave` n'est accessible qu'apres avoir boucle les grandes anomalies du Projet M.
- La grotte incorpore deja des traces de memoire supplementaires si l'archive 151 est active.

### Combat contre RED

- RED bloque le sanctuaire final.
- Le vaincre debloque le PASS SYSTEME.
- Si `pr0t0type_151` est deja actif, RED reconnait implicitement l'existence de cette memoire originelle.
- Si l'indice White Room a deja ete obtenu, l'escalier de la grotte cache ensuite un vrai passage vers `/beneath-stairs`.

## 7.bis. Beneath Stairs et White Room

### Beneath Stairs

- La route `/beneath-stairs` n'apparait qu'apres le faux bug du Hall of Fame et la victoire contre RED.
- On y trouve une console residuelle et des traces de labo suggerant que 151 etait stocke hors-plan pendant que 150 monopolisait le Projet M.
- La console residuelle ouvre `/white-room` si `pr0t0type_151` a deja ete active.

### White Room

- La route `/white-room` est une salle sterile ou l'archive 151 existe encore comme memoire originelle.
- L'entite centrale ne demande ni capture ni mot de passe: elle exige d'etre reconnue jusqu'au bout.
- Finir cette confrontation debloque une concordance persistante de l'archive 151 dans l'inventaire.

## 8. Hall of Fame et archives profondes

### Deblocage

- Le Hall of Fame devient consultable apres RED si la progression est suffisamment avancee.
- La commande `archive-debug` permet de monter officiellement les archives profondes si le joueur remplit toutes les conditions.

### Contenu

- `/hall-of-fame` regroupe roster archive, inventaire trace et cartographie conservee.
- Cette page n'est pas un tableau d'honneur classique: c'est le registre de confinement de Sylphe Corp.
- Un faux bug visuel peut apparaitre dans le Hall of Fame et suggerer une piste vers une future White Room cachee sous les escaliers de la Grotte Azuree.
- Le bouton de corruption declenche une contre-mesure "Archive Rouge". En la laissant aller jusqu'au bout, on obtient un indice persistant `WHITE_ROOM // BENEATH_STAIRS // CERULEAN-CAVE`.

## 8.bis. Ponts secrets entre interfaces

- Sur la page Team, cliquer plusieurs fois sur Porygon Echo finit par ouvrir directement le Hall of Fame si l'archive est deja montee.
- L'indice White Room apparait ensuite aussi dans le diagnostic `containment` et dans l'inventaire de supervision.

## 8.ter. Quete parallele du Musee Null

### Deblocage

- Cliquer plusieurs fois sur le profil du Prof. SYLPHE dans la home revele un indice sur l'aile `N-ULL`.
- Une fois l'indice obtenu, la carte stats corporate `ID No. 31415` peut etre activee plusieurs fois pour ouvrir `/museum-null`.
- Cette quete est parallele au Projet M: elle peut etre faite sans attendre la White Room ou le Hall of Fame.

### Musee Null

- `/museum-null` est une aile corporate effacee des brochures officielles.
- On y trouve des cartels truques, un conservateur, et avec le Scope des profils d'employes rayes qui remplacent les trophées.
- Le socle central donne le `Badge NULL`, qui rejoint l'inventaire et rend la commande terminale `checksum` utile.
- Si Porygon Echo a deja ete obtenu, un guide numerique parasite aussi l'aile et mentionne explicitement la divergence entre les archives publiques et nulles.

## 8.quater. Quete parallele Lavender Mirror

### Deblocage

- Ouvrir plusieurs fois la fiche du `Scope Sylphe` dans les Produits revele une frequence de Lavanville interne.
- Cliquer ensuite plusieurs fois sur `POKEGEAR 0800-SYLPHE poste 7` dans la section Contact ouvre `/lavender-mirror`.
- Cette quete est parallele: elle ne depend ni de la White Room ni du Musee Null.

### Lavender Mirror

- `/lavender-mirror` est une salle memorielle qui imite la Tour Pokemon de Lavanville sous une forme corporate cachee.
- La console haute active ou coupe une couche spectrale du lieu. En mode spectral, les cartels se transforment en epitaphes et des profils salaries fantomes apparaissent.
- Un gardien osseux hante le reflet central. En l'ecoutant jusqu'au bout, on obtient le `Mirror Tag`.
- Le `Mirror Tag` rend ensuite la commande terminale `requiem` utile et permet de relire les noms retires du miroir.

## 9. Inventaire et cartographie

### Inventaire

- L'inventaire liste les objets lore reels: carte d'acces, Masterball, Scope Sylphe, Prototype 151, Porygon Echo, PASS SYSTEME, indice White Room, Concordance 151, Badge NULL, Mirror Tag, etc.

### Maps visitees

- Une route n'apparait dans la cartographie que lorsqu'elle a vraiment ete visitee.
- Le Hall of Fame lui-meme rejoint la liste une fois monte.
- `Beneath Stairs` et `White Room` rejoignent eux aussi la cartographie une fois trouves et ouverts.
- `Musee Null` rejoint la cartographie une fois son aile debloquee puis visitee.
- `Lavender Mirror` rejoint aussi la cartographie apres activation de la ligne poste 7.

## 10.ter. Quete E: Ouvrir le Miroir de Lavanville

1. Examiner plusieurs fois le `Scope Sylphe` dans les Produits.
2. Composer plusieurs fois `POKEGEAR 0800-SYLPHE poste 7` dans Contact.
3. Explorer `/lavender-mirror`.
4. Basculer le miroir en couche spectrale.
5. Ecouter le gardien osseux jusqu'a obtenir le `Mirror Tag`.
6. Taper `requiem` dans le terminal.

## 10.bis. Quete D: Auditer le patrimoine efface

1. Reveler l'indice `N-ULL` dans la home.
2. Activer plusieurs fois la carte stats `31415`.
3. Explorer `/museum-null`.
4. Recuperer le `Badge NULL`.
5. Lancer `checksum` dans le terminal pour comparer les archives.

## 10. Liste rapide des principales quetes

### Quete A: Debloquer le Projet M

1. Rencontrer Porygon dans `/cyberspace`.
2. Rencontrer MissingNo dans `/glitch-city`.
3. Reconstituer `7382-4B9F`.
4. Debloquer la Chambre 042.

### Quete B: Capturer les sujets legendaires

1. Recuperer la Masterball via le terminal ou l'API.
2. Capturer Mew sur la map principale.
3. Capturer Mewtwo dans la Chambre 042.
4. Observer leur coexistence dans `/pokeball`.

### Quete C: Ouvrir les archives profondes

1. Activer `pr0t0type_151` depuis les logs du terminal.
2. Finir Cerulean Cave et vaincre RED.
3. Visiter toutes les zones majeures.
4. Taper `archive-debug`.
5. Consulter `/hall-of-fame`.

## 11. Systeme de meteo secrete

### Conditions de declenchement

- La meteo est tiree aleatoirement toutes les 30 secondes sur les routes qui comportent un overlay meteo.
- La meteo s'applique en couche visuelle semi-transparente sur les routes principales, la Pokeball, le Cyberespace, Glitch City, Rocket HQ, le Bureau Giovanni, le Labo 042 et la Grotte Azuree.

### Types de meteo

- **Pluie acide Rocket** (~22% si `sylphe_rocket_mode` actif): precipitations toxiques teintees de violet, signees Team Rocket. Les emissions du labo corrompu contaminent l'atmosphere.
- **Aurore cybernetique** (~30% si `sylphe_porygon_echo` actif): Porygon projette des fragments de cyberespace dans le ciel sous forme d'aurore boreale numerique. Teintes cyan/vert/rose.
- **Brouillard spectral** (~12% si `sylphe_silph_scope` actif): le Scope Sylphe reagit. Des residus de memoire flottent sous forme de brume lilas quasi-transparente.
- **Temps clair**: aucun effet visible (probabilite restante).

### Notification

- Chaque changement de meteo affiche une notification evanescente en haut de l'ecran pendant 6 secondes avec le nom et la description du phenomene.

## 12. Defragmentation Porygon (mini-jeu terminal)

### Conditions d'acces

- Necessite `sylphe_porygon_echo` (avoir rencontre Porygon dans le Cyberespace).
- Necessite `sylphe_missingno_unlocked` (avoir ouvert Glitch City).

### Deroulement

- La commande `defrag` initialise un protocole de defragmentation en 4 passes.
- Chaque passe montre une grille de caracteres corrompus (16x6) qui se nettoie progressivement.
- Des fragments de donnees sont recuperes a chaque etape: 7382, 4B9F, PRJM, 151@.
- Une barre de progression accompagne l'operation.

### Recompense

- A la fin, Porygon revele la commande cachee `reconstruct`.
- `reconstruct` affiche les archives defragmentees: les blocs recuperes racontent l'histoire complete du Projet M, incluant la note supprimee du Dr Fuji sur le sujet 151.

## 13. Pokedex interne Sylphe (SYLPHEDEX)

### Acces

- La commande `sylphedex` est cachee (non listee dans help).
- L'indice pour la trouver est donne par la note de labo du Dr Fuji (easter egg audio) et par Porygon dans la Pokeball.

### Contenu

- Le SYLPHEDEX liste les sujets enregistres selon la progression du joueur: Mew, Mewtwo, MissingNo, Archive 151, Porygon Echo, Gardien Osseux.
- Chaque fiche est truquee avec des classifications internes Sylphe Corp.
- Les notes de chaque fiche varient selon les flags actifs (capture, archive 151, concordance, badge null, scope...).
- Les fiches marquees [RESTREINT] indiquent un niveau d'acces eleve.
- `sylphedex <nom>` affiche le detail complet d'un sujet specifique.

## 14. Easter egg audio (Pokeball rush)

### Condition

- Ouvrir `/pokeball` puis naviguer vers `/mew-cloning-chamber-042` en moins de 15 secondes.

### Effet

- Un cri inverse de Mew est genere via Web Audio API (le buffer audio est inverse echantillon par echantillon).
- Une note de labo du Dr Fuji apparait en overlay dans la Chambre 042 pendant 8 secondes.
- La note mentionne une frequence subsonique laissee par le sujet 151 dans la cuve #42 et donne l'indice `sylphedex`.
- Le flag `sylphe_mew_reverse_cry` est pose: l'easter egg ne se declenche qu'une seule fois.

## 15. Blackout Sylphe (evenement rare global)

### Conditions

- Au moins un Pokemon capture (Mew, Mewtwo ou Porygon Echo).
- Pas de cooldown actif (5 minutes minimum entre deux blackouts).
- Ne se declenche pas sur les routes `/hall-of-fame`, `/white-room` ou `/beneath-stairs`.
- Probabilite de 3% a chaque chargement de page, avec un delai aleatoire de 3 a 11 secondes.

### Deroulement

- L'ecran GBA passe entierement au noir pendant 4.5 secondes.
- Un flash initial simule une coupure de courant.
- Un message d'alerte s'affiche en rouge sombre au centre de l'ecran (parmi 4 variantes).
- Les noms des entites capturees persistantes (Mew, Mewtwo, Porygon Echo) s'affichent en vert sous le message, pulsant faiblement.
- Apres la duree, l'interface revient a la normale.

## 16. Quete F: Defragmenter les donnees de Glitch City

1. Obtenir Porygon Echo via `/cyberspace`.
2. Ouvrir Glitch City via la commande `missingno`.
3. Taper `defrag` dans le terminal.
4. Observer la defragmentation en 4 passes.
5. Taper `reconstruct` pour lire les archives restaurees.
6. Consulter `sylphedex` pour lire les fiches internes Sylphe.

## 17. Secrets mineurs supplementaires

- 500 pas sur la map principale declenchent une blague Safari Zone.
- Le site contient plusieurs references de developpeur dans la console et dans les scripts shell du faux systeme.
- Certaines anomalies changent subtilement selon l'ordre dans lequel on visite les routes.

## 18. Grotte du Mont Selenite (`/mt-moon-cavern`)

### Acces

- Route directe `/mt-moon-cavern`. Apparait dans les routes fantomes a minuit.

### Mecanique

- La grotte est plongee dans le noir total. Seule la case du joueur et ses voisines immediates sont visibles.
- Le joueur peut activer son microphone. Le bruit ambiant genere des flashs circulaires lumineux (via Web Audio API) qui eclairent la map pendant quelques secondes, comme l'echolocalisation d'un Nosferapti.
- La map contient des nids de Nosferapti (qui s'agitent au bruit), des fossiles a decouvrir, et une sortie.
- Trouver les deux fossiles pose le flag `sylphe_cave_echo`.

## 19. Miroir Spectral (`/spectre-mirror`)

### Acces

- Route directe `/spectre-mirror`. Apparait dans les routes fantomes a minuit.

### Mecanique

- Active la webcam de l'utilisateur et applique un filtre Gameboy (pixels verts, faible resolution).
- Des ombres de Pokémon spectres (Ectoplasma, Spectrum, Fantominus) apparaissent aleatoirement sur le flux video.
- Cliquer sur un spectre tente une "capture" via le Scope Sylphe.
- Chaque spectre capture apporte un fragment de lore sur le Miroir de Lavanville.

## 20. Labyrinthe de la Maison Piege (`/trick-house-maze`)

### Acces

- Route directe `/trick-house-maze`.

### Mecanique

- Sur mobile: le gyroscope controle le deplacement d'une Pokeball dans le labyrinthe.
- Sur desktop: les fleches du clavier servent de fallback.
- Le labyrinthe contient des dalles piegees (Team Rocket) qui repoussent le joueur.
- Un objet cache (plan de la Team Rocket) peut etre trouve.
- Atteindre la sortie pose le flag `sylphe_trick_house_complete`.

## 21. Pods de Clonage (`/cloning-pod-a` et `/cloning-pod-b`)

### Acces

- Le joueur doit ouvrir deux onglets du navigateur simultanement.

### Mecanique (Broadcast Channel API)

- Chaque pod affiche une interface de stabilisation ADN.
- Le joueur lance la stabilisation sur un pod, puis doit la lancer sur l'autre onglet en moins de 3 secondes.
- Les pods communiquent en temps reel via BroadcastChannel.
- Une fois synchronises, une barre de progression ADN se remplit et le clonage reussit.
- Le flag `sylphe_pod_synced` est pose apres synchronisation reussie.

## 22. Systeme de Stockage de Bill (`/pc-bill`)

### Acces

- Route `/pc-bill`. Deblocage du flag `sylphe_bill_email` apres visite.

### Contenu

- Interface facon Windows 95 avec sequence de demarrage retro.
- Bureau avec 4 icones: Mon PC, Corbeille, Transfert Pokemon, Mes Notes.
- La Corbeille contient 3 emails supprimes de Leo/Bill:
  - Email paniquant sur le transfert ADN accidentel.
  - Email sur les copies de Pokemon apparaissant dans le systeme.
  - Email revelant le mot de passe admin `MYUUTSU`.
- Transfert Pokemon montre un faux gestionnaire de PC avec 6 slots.
- Mes Notes contient un journal technique de Bill.

## 23. Casino Clandestin (`/casino-game-corner`)

### Acces

- Route directe `/casino-game-corner`.

### Mecanique

- Machine a sous avec 6 symboles Pokemon (Pikachu, Rondoudou, Magicarpe, Metamorph, Porygon, 7).
- 100 jetons au depart, 10 jetons par tour.
- Triple 7 = Jackpot 777: debloque le mode Porygon-Z (`sylphe_casino_porygon_z`).
- Triple symbole = +100 jetons.
- Double symbole = +20 jetons.

### Ransomware Team Rocket

- Apres 10 parties, un rançongiciel Team Rocket bloque la machine (`sylphe_rocket_ransomware`).
- Le message indique de payer 9999 jetons ou taper `defrag` dans le terminal.

## 24. Intranet Corporate (`/employee-login`)

### Acces

- Route directe `/employee-login`.

### Mecanique

- Portail de connexion imitant un intranet Team Rocket.
- Deux agents disponibles:
  - LAMBDA-04: mot de passe = `arbok` (son Pokemon prefere).
  - SIGMA-12: mot de passe = `rattata` (son Pokemon prefere).
- Chaque agent a une boite mail avec des emails compromettants sur le Projet M.
- Le flag `sylphe_intranet_complete` est pose apres lecture des emails.

## 25. Radio Pokematos

### Acces

- Disponible en permanence dans le header de la page d'accueil.

### Frequences speciales

- **10.5 MHz**: Frequence de Lavanville. Murmures spectraux et pose du flag `sylphe_lavender_whisper`.
- **20.5 MHz**: Pokéflûte. Reveil du Ronflex. Pose du flag `sylphe_pokeflute_played`.
- **42.0 MHz**: "La reponse est 42."
- **151.0 MHz**: Signal du Sujet 151. Message de detresse.

## 26. Boss de la Console DevTools

### Acces

- Ouvrir la console developpeur (F12) du navigateur.

### Mecanique

- `window.sylphe.useMasterball()` declenche un combat dans la console.
- L'entite Glitch a 3 PV.
- Chaque appel de `useMasterball()` inflige 1 degat avec des messages colores en console.
- Vaincre le Glitch pose le flag `sylphe_glitch_boss_defeated`.
- Un indice Porygon est affiche dans la console au chargement de la page, chuchotant de chercher `sylphe_root_access` dans le LocalStorage.

## 27. Piratage du LocalStorage

### Indice

- Porygon affiche un message dans la console: "La derniere clef n'est pas sur nos serveurs, mais chez vous."

### Mecanique

- Le joueur doit ouvrir l'onglet Application/Storage du navigateur.
- Passer manuellement la variable `sylphe_root_access` de `false` a `true`.
- Recharger la page pour que le flag soit pris en compte.

## 28. Secrets CSS caches (Inspecteur DOM)

### Localisations

- **AboutSection**: Texte transparent 1px contenant un memo employe mentionnant le 11e etage, `mansion.cinnabar.gov`, et la commande `nano`.
- **Footer**: Texte transparent hors champ contenant une entree du journal du Dr Fuji et des indices sur le casino et `humans.txt`.
- **HeroSection**: Texte transparent mentionnant la commande `ping`, le LocalStorage, et le boss DevTools.

### Methode de decouverte

- Inspecter le DOM ou surligner toute la page pour reveler les textes caches.

## 29. Commandes Terminal Phase 8+

### `nano` / `nano /etc/sylphe/containment.conf`

- Ouvre une interface d'edition textuelle simulee.
- La lecture de `containment.conf` revele les parametres de confinement des sujets 150 et 151.
- Un commentaire cachee dans le fichier sugere d'utiliser `nano-edit off`.

### `nano-edit off`

- Commande cachee pour basculer le confinement de ON a OFF.
- Desactiver le confinement declenche une sequence dramatique avec glitchs visuels.
- Pose le flag `sylphe_containment_off`.

### `analyze_sample`

- Commande cachee pour analyser un echantillon spectral.
- Necessite le flag `sylphe_spectral_feather` (obtenu par drag & drop depuis `/museum-null`).
- Revele des informations sur le Dr Fuji et la frequence de Lavanville.

### `ping mansion.cinnabar.gov`

- Simule une trace reseau vers le Manoir de Cramois'ile.
- Les paquets "corrompus" sont des chaines Base64 encodant les notes du Dr Fuji.
- Pose le flag `sylphe_dr_fuji_notes`.

## 30. Drag & Drop inter-pages

### Mecanique

- Sur `/museum-null`, une plume spectrale apparait quand le Scope Sylphe est obtenu.
- L'objet est draggable (HTML5 Drag API).
- Le flag `sylphe_spectral_feather` est pose au debut du drag.
- Le Terminal accepte le drop et execute automatiquement la commande `analyze_sample`.

## 31. Routes fantomes a minuit (MidnightGhosts)

### Condition

- L'heure systeme de l'utilisateur doit etre entre 23h et 1h.

### Effet

- Des liens fantomes vers `/mt-moon-cavern`, `/spectre-mirror`, et `/lavender-mirror` apparaissent dans la barre HUD de la page d'accueil.
- Les liens pulsent avec un style spectral.

## 32. Quete de l'Hors-Ligne (Service Worker)

### Mecanique

- Un Service Worker (`/sw.js`) est enregistre au chargement du site.
- Il met en cache une page corrompue de secours.
- Si l'utilisateur perd sa connexion internet, le site affiche une page MissingNo avec le message "L'abime reseau est ma maison".
- La page offline contient une animation de glitch et un compteur de realite.

## 33. Geolocalisation et Train Magnetique

### Mecanique

- Le site demande la position GPS apres 15 secondes.
- Si l'utilisateur est en Europe, un message "Signal lointain detecte" s'affiche.
- Si la position correspond a Tokyo/Kanto (lat 35-36.5, lon 139-140.5), le joueur recoit le passe Train Magnetique (`sylphe_magnet_train_pass`).

### Astuce

- L'utilisateur peut spoofer sa position via DevTools (Sensors > Geolocation > Tokyo) pour obtenir le passe.

## 34. Notifications PUSH fantomes

### Mecanique

- Le site demande la permission de notification web.
- Si l'heure systeme est 3h du matin, une notification est envoyee: "Sujet 150 : J'ai mal..."
- La notification se declenche meme si l'onglet n'est pas actif.

## 35. Glitch Scroll Void (Bug de Scroll)

### Condition

- Le flag `sylphe_prototype_151` ou `sylphe_archive_debug` doit etre actif.

### Effet

- Apres le footer de la page d'accueil, une zone void noire apparait.
- Un canvas affiche 12 MissingNos errant dans le vide.
- Les MissingNos sont rendus en glitch art pixel avec des artefacts visuels.

## 36. `robots.txt` et `humans.txt`

### robots.txt

- `User-agent: Pokedex-Crawler` / `Disallow: /` — Le Pokedex n'a pas le droit de tout scanner.
- `User-agent: Deoxys-Speed` / `Allow: /api/` / `Disallow: /api/masterball` — Forme Vitesse autorisee sauf Masterball.
- `User-agent: Team-Rocket-Bot` / `Disallow: /*` — Les bots de la Team Rocket sont interdits partout.

### humans.txt

- Message d'un developpeur prisonnier du QG Team Rocket.
- Indices caches: commande `nano`, `containment.conf`, casino, intranet, mot de passe `pr0t0type_151`.

## 37. Quetes Phase 8+

### Quete G: Decoder les notes du Dr Fuji

1. Trouver l'indice CSS dans AboutSection (inspecter le DOM).
2. Taper `ping mansion.cinnabar.gov` dans le terminal.
3. Decoder les chaines Base64 pour lire les notes du Dr Fuji.

### Quete H: Desactiver le confinement

1. Trouver l'indice `nano` dans `humans.txt` ou dans les secrets CSS.
2. Taper `nano /etc/sylphe/containment.conf` dans le terminal.
3. Taper `nano-edit off` pour desactiver le confinement.

### Quete I: Synchroniser les Pods de clonage

1. Ouvrir `/cloning-pod-a` dans un onglet.
2. Ouvrir `/cloning-pod-b` dans un autre onglet.
3. Lancer la stabilisation sur les deux pods en moins de 3 secondes.

### Quete J: Infiltrer l'Intranet Rocket

1. Aller sur `/employee-login`.
2. Entrer le login LAMBDA-04 avec le mot de passe `arbok`.
3. Ou entrer SIGMA-12 avec `rattata`.
4. Lire les emails compromettants.

### Quete K: Battre le Boss DevTools

1. Ouvrir la console (F12).
2. Taper `window.sylphe.useMasterball()` trois fois.
3. L'entite Glitch est vaincue.

### Quete L: Analyser la plume spectrale

1. Obtenir le Scope Sylphe.
2. Sur `/museum-null`, glisser la plume spectrale.
3. La deposer sur le terminal.
4. La commande `analyze_sample` s'execute automatiquement.