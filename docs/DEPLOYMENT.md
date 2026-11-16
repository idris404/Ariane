# Déploiement Vercel et Neon

La production publique utilise un projet Vercel Services : Next.js est le service public et
FastAPI reste privé. Le navigateur appelle `/api/backend/*` sur la même origine ; la route Next.js
transmet uniquement les chemins `/api/v1/*` au service Python. Le cookie de session reste ainsi
HTTP-only, `Secure` et rattaché au domaine public.

Neon héberge uniquement les données synthétiques du démonstrateur. Utiliser une connexion poolée et
chiffrée, fournie à FastAPI dans le secret `DATABASE_URL`.

## Variables de production

| Service | Variable | Valeur attendue |
| --- | --- | --- |
| frontend | `NEXT_PUBLIC_API_URL` | `/api/backend` |
| backend | `DATABASE_URL` | URL Neon poolée avec `sslmode=require` |
| backend | `FRONTEND_URL` | URL publique Vercel |
| backend | `COOKIE_SECURE` | `true` |

`BACKEND_URL` n'est pas un secret à saisir : Vercel le fournit au frontend grâce au service binding
déclaré dans `vercel.json`.

Les identifiants du compte de démonstration ne doivent pas vivre dans le processus de l'API. Ils sont
utilisés uniquement pendant le seed via `SEED_USER_EMAIL` et `SEED_USER_PASSWORD`, puis retirés de
l'environnement d'exécution.

## Initialisation

Depuis une machine autorisée, avec `DATABASE_URL`, `SEED_USER_EMAIL` et `SEED_USER_PASSWORD` chargés
sans les écrire dans le dépôt :

```bash
cd web/backend
uv run python -m app.seed
```

Le seed est rejouable et charge par défaut 1 000 profils entièrement synthétiques. Ne jamais utiliser
`--reset` sur une base existante sans vérifier les signatures et comptes à conserver.

## Vérifications avant publication

```bash
cd web/backend && uv run pytest
cd web/frontend && npm run lint && npm run typecheck && npm run test:ui && npm run build
```

Après le déploiement, vérifier la landing, la vidéo, la connexion, les deux files, une fiche patient,
la signature explicite et la déconnexion. Toute communication publique doit conserver les mentions
« données synthétiques », « objectif à mesurer » et « validation humaine obligatoire ».
