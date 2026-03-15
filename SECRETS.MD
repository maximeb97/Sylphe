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