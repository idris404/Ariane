# Application Ariane

Le dossier `web/` contient l’application locale du démonstrateur :

```text
web/
├── backend/      API FastAPI, services, accès PostgreSQL et tests
├── frontend/     Next.js, landing publique et écrans du démonstrateur
├── doc/          décisions API et notes d’implémentation
├── .env.example  configuration locale du backend et du seed
└── DESIGN.md     références visuelles historiques
```

## Démarrage

Depuis la racine du dépôt, lancer PostgreSQL :

```bash
docker compose -f dependencies/compose.yml up -d
```

Puis le backend :

```bash
cd web
cp .env.example .env
cd backend
uv sync
uv run python -m app.seed
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Le seed charge par défaut les 999 patients disposant d’un historique sérique,
ainsi qu’un dossier synthétique mis en avant. L’option `--all-patients` charge
les 51 000 profils. Une étape peut être ciblée avec `--only` parmi `patients`,
`synthetic`, `serum`, `history`, `featured` et `users`.

Dans un second terminal, lancer le frontend :

```bash
cd web/frontend
cp .env.example .env
npm ci
npm run dev
```

- landing : <http://localhost:5173> ;
- démonstrateur : <http://localhost:5173/login> ;
- API : <http://localhost:8000> ;
- OpenAPI : <http://localhost:8000/docs>.

Le compte local est configuré par `SEED_USER_EMAIL` et `SEED_USER_PASSWORD`
dans `web/.env`. Les valeurs proposées dans `.env.example` sont réservées au
développement local.

## Contrat

Le backend est la source de vérité. Les routes déclarent des modèles Pydantic et le frontend vérifie les réponses avec Zod avant usage. Le cookie de session est HTTP-only et envoyé avec les requêtes au backend.

Le cœur du parcours utilise exclusivement des données synthétiques. L’import visible dans l’interface est simulé et ne transmet aucun fichier au serveur.

## Documentation

- [architecture générale](../docs/ARCHITECTURE.md) ;
- [parcours de démonstration](../docs/DEMO.md) ;
- [usage responsable](../docs/RESPONSIBLE_USE.md) ;
- [catalogue des endpoints](doc/api-endpoints.md) ;
- [journal des décisions API](doc/api-decisions.md).
