import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase "admin" — utilise la clé secrète (service_role).
 * NE JAMAIS importer ce fichier depuis un composant "use client" ou
 * depuis du code exécuté dans le navigateur : la clé donne un accès total,
 * sans RLS, à toute la base. Utilisé uniquement dans les Route Handlers
 * /api/admin/* qui s'exécutent côté serveur.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY n'est pas configurée sur ce serveur. " +
        "Cette clé doit être ajoutée dans les variables d'environnement " +
        "de l'hébergeur (Netlify), jamais dans le code."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
