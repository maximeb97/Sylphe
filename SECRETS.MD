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

### Commandes de lore / progression

- `inventory`: affiche les objets reels deja recuperes.
- `map`: affiche les zones deja visitees et retenues dans la memoire du site.
- `pr0t0type_151`: active l'archive du sujet originel 151 a partir du mot de passe cache dans `/var/log/system.log`.
- `archive-debug`: n'est utile qu'apres RED, le PASS SYSTEME, l'archive 151 et la visite de toutes les zones majeures. La commande monte alors le Hall of Fame.

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

## 8. Hall of Fame et archives profondes

### Deblocage

- Le Hall of Fame devient consultable apres RED si la progression est suffisamment avancee.
- La commande `archive-debug` permet de monter officiellement les archives profondes si le joueur remplit toutes les conditions.

### Contenu

- `/hall-of-fame` regroupe roster archive, inventaire trace et cartographie conservee.
- Cette page n'est pas un tableau d'honneur classique: c'est le registre de confinement de Sylphe Corp.

## 9. Inventaire et cartographie

### Inventaire

- L'inventaire liste les objets lore reels: carte d'acces, Masterball, Scope Sylphe, Prototype 151, Porygon Echo, PASS SYSTEME, etc.

### Maps visitees

- Une route n'apparait dans la cartographie que lorsqu'elle a vraiment ete visitee.
- Le Hall of Fame lui-meme rejoint la liste une fois monte.

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

## 11. Secrets mineurs supplementaires

- 500 pas sur la map principale declenchent une blague Safari Zone.
- Le site contient plusieurs references de developpeur dans la console et dans les scripts shell du faux systeme.
- Certaines anomalies changent subtilement selon l'ordre dans lequel on visite les routes.