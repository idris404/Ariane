# Architecture d’Ariane

## Vue d’ensemble

```text
data-model/                    web/backend/                 web/frontend/
┌─────────────────────┐       ┌─────────────────────┐      ┌─────────────────────┐
│ Profils synthétiques│       │ API FastAPI         │      │ Landing publique    │
│ Historique sérique  │──────►│ Services métier     │─────►│ Cockpit de dossiers │
│ Contrats et règles  │       │ Accès PostgreSQL    │      │ Fiche et files      │
└─────────────────────┘       └─────────────────────┘      └─────────────────────┘
                                         │                            │
                                         └──────── validation humaine ┘
```

## Frontend

Le frontend utilise Next.js avec l’App Router. La route `/` sert la présentation publique et `/login` ouvre le démonstrateur. Les écrans de données sont protégés côté client par la vérification de session du backend.

Les routes principales sont :

| Route | Rôle |
| --- | --- |
| `/` | Landing page publique et vidéo de démonstration |
| `/login` | Connexion au démonstrateur local |
| `/dashboard` | Liste, recherche, filtres, tri et import simulé |
| `/fiche/[id]` | Historique et évolution sérique d’un dossier |
| `/a-signer` | Dossiers préparés pour vérification et signature |
| `/a-consulter` | Dossiers conservés pour une revue approfondie |

TanStack Query gère l’état serveur. Zod vérifie les réponses avant leur utilisation. Le frontend ne transforme pas une valeur manquante en conclusion favorable et n’implémente pas de seuil médical.

## Backend

Le backend FastAPI sépare les routes, services, dépôts et entités. Pydantic valide les entrées et les sorties. SQLAlchemy accède à PostgreSQL.

Les capacités utilisées par le parcours incluent :

- session par cookie HTTP-only ;
- consultation paginée des patients ;
- lecture d’un dossier et de son historique ;
- file de signature ;
- file de consultation ;
- enregistrement explicite d’une signature.

## Données

Le dossier `data-model/` contient les schémas, le pipeline et les scénarios synthétiques. Le seed du backend charge les profils, les tests sériques et les événements nécessaires au parcours local.

Les identifiants de démonstration sont stables. Les entrées sont reproductibles et ne contiennent aucune donnée patient réelle.

## Contrat et limites

Le contrat entre le frontend et le backend est l’API HTTP : modèles Pydantic côté serveur et schémas Zod côté client. Le backend reste la source de vérité.

Certaines valeurs du prototype sont encore des éléments de scénario ou de maquette. Elles doivent rester identifiées comme synthétiques, simulées ou non validées. Voir [Usage responsable](RESPONSIBLE_USE.md).
