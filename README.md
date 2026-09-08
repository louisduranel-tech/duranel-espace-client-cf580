# Espace Client DURANEL

Application Next.js + Supabase pour le portail client DURANEL (cours du
jour, cotations DURANEL, actualités, contact, espace d'administration).

## Variables d'environnement

À configurer dans **Netlify → Site settings → Environment variables** (jamais
dans le code) :

| Variable | Valeur | Sensible ? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eyzdchmclpxptymjyzfw.supabase.co` | non |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé « publishable » Supabase (Project Settings → API Keys) | non |
| `SUPABASE_SERVICE_ROLE_KEY` | clé « secret » Supabase (Project Settings → API Keys) | **oui — à saisir uniquement par DURANEL, jamais par l'assistant** |

La clé `SUPABASE_SERVICE_ROLE_KEY` donne un accès total à la base sans
restriction (RLS contournée). Elle est nécessaire uniquement pour la
création de comptes clients et la réinitialisation de mot de passe
(fonctions d'administration). Sans elle, tout le reste de l'application
fonctionne normalement.

## Développement local

```bash
npm install
npm run dev
```

`.env.local` contient déjà l'URL et la clé publique Supabase (sans danger à
committer... mais gardé hors de git par précaution). `SUPABASE_SERVICE_ROLE_KEY`
y est volontairement vide.

## Déploiement

Le fichier `netlify.toml` configure le plugin officiel
`@netlify/plugin-nextjs`, qui transforme automatiquement les pages
dynamiques, Server Actions et Route Handlers en fonctions Netlify.
