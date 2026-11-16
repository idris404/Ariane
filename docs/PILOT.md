# Du démonstrateur au pilote

## Objectif

Ariane dispose aujourd’hui d’une preuve de produit : un parcours local, reproductible et testé qui prépare une revue immunologique à partir de données synthétiques, tout en maintenant une validation humaine explicite.

L’étape suivante n’est pas de déployer le démonstrateur tel quel. Elle consiste à vérifier, dans un cadre autorisé et supervisé, si la préparation proposée peut réellement rendre de la capacité à une équipe sans diminuer la qualité de la revue.

L’ambition de ramener une file accumulée de **six mois vers un mois** est un objectif opérationnel à mesurer. Ce n’est ni un résultat déjà obtenu, ni une promesse contractuelle, ni une performance clinique.

## Ce qui est déjà démontré

- un parcours complet de l’import simulé à la validation humaine ;
- une lecture longitudinale de profils synthétiques ;
- deux files distinctes pour préparer la validation et approfondir la revue ;
- un backend déterministe qui reste la source de vérité ;
- une interface qui expose les données manquantes et les limites ;
- une exécution locale, des tests automatisés et un scénario reproductible ;
- le **prix de la meilleure solution pour les patients** au hackathon AI for Health.

## Ce que le pilote doit mesurer

### Capacité opérationnelle

- temps nécessaire pour préparer puis relire un dossier ;
- volume de dossiers revus sur une période définie ;
- taille et ancienneté de la file avant, pendant et après l’expérimentation ;
- nombre de reprises manuelles nécessaires avant validation.

### Qualité et sécurité

- données manquantes ou contradictoires détectées ;
- écarts entre la préparation proposée et la revue du professionnel ;
- corrections apportées avant toute validation ;
- traçabilité des règles déclenchées, de leur version et de l’action humaine.

### Adoption

- compréhension des informations et des limites affichées ;
- charge perçue par les utilisateurs ;
- motifs de non-utilisation, de correction ou de retour au parcours habituel.

Aucun seuil de succès n’est fixé dans ce dépôt. Les critères, définitions et valeurs attendues doivent être convenus avec les professionnels, les responsables qualité et les parties juridiques avant l’expérimentation.

## Parcours proposé

### 1. Cadrage

- valider le vocabulaire, les règles, les contre-exemples et les responsabilités ;
- définir le protocole d’évaluation et les indicateurs ;
- documenter la gouvernance, la sécurité et le cadre d’utilisation des données.

### 2. Évaluation rétrospective encadrée

- travailler uniquement dans un environnement autorisé ;
- comparer la préparation d’Ariane à une revue professionnelle de référence ;
- documenter chaque désaccord, information manquante et limite observée.

Cette phase n’est pas implémentée dans le dépôt et ne doit pas être menée avec des données réelles sans autorisation et gouvernance adaptées.

### 3. Pilote en mode supervisé

- utiliser Ariane comme outil de préparation, jamais comme décideur ;
- conserver la validation professionnelle à chaque étape ;
- suivre les indicateurs définis au cadrage ;
- prévoir un arrêt immédiat et un retour au processus habituel en cas d’incertitude.

### 4. Décision de suite

Les résultats du pilote doivent permettre de décider s’il faut arrêter, corriger, prolonger l’évaluation ou préparer une version professionnelle. Une suite produit pourrait inclure des protocoles versionnés, un audit renforcé, une gestion des accès et un déploiement adapté à l’environnement cible.

## Conditions non négociables

- aucune décision autonome de transplantation ;
- aucune affirmation de validation clinique sans évaluation formelle ;
- aucune donnée patient réelle dans ce dépôt ;
- aucune règle médicale nouvelle sans validation professionnelle ;
- aucune intégration à un système tiers sans documentation et autorisation ;
- une validation humaine visible et traçable jusqu’à la décision finale.

Voir également [Usage responsable](RESPONSIBLE_USE.md), [Vision produit](PRODUCT.md) et [Architecture](ARCHITECTURE.md).
