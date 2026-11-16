# Pipeline de données synthétiques

## Objectif

Le pipeline fournit des données déterministes pour développer, tester et démontrer Ariane sans utiliser de données patient réelles.

## Contenu

```text
data-model/
├── data/                    profils et historiques synthétiques
├── protocols/               configuration versionnée du démonstrateur
├── schemas/                 contrats JSON
├── src/hla_data_model/      normalisation, analyse et validation
└── tests/                   cas nominaux, absences et contradictions
```

## Principes

- mêmes entrées, mêmes résultats ;
- identifiants synthétiques stables ;
- séparation entre données d’entrée et vérités du générateur ;
- validation des structures avant consommation ;
- absence de dépendance réseau pendant le cœur de la démonstration ;
- obligation de validation humaine dans les restitutions.

## Utilisation par l’application

Le seed du backend charge par défaut 999 profils disposant d’un historique sérique et un dossier synthétique mis en avant, soit les 1 000 profils du scénario. Il charge aussi les événements fictifs dans PostgreSQL. L’option `--all-patients` permet de charger les 51 000 profils sources. Le frontend récupère ces données uniquement après la fin de l’import simulé.

L’import visible dans l’interface raconte le parcours du produit : le navigateur ne transmet actuellement aucun fichier patient au backend.

## Vérification

Depuis `data-model/` :

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios
```

## Interprétation

Les résultats du pipeline servent à démontrer le fonctionnement du produit. Ils ne démontrent aucune sensibilité, spécificité, performance clinique ou capacité de généralisation.
