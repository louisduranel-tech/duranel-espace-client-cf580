"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Les e-mails Supabase par défaut (tant qu'aucun SMTP personnalisé n'est
 * configuré) utilisent {{ .ConfirmationURL }}, qui renvoie vers Supabase
 * puis redirige vers le site avec les jetons de session dans le fragment
 * d'URL (#access_token=...&type=recovery). Le client Supabase du
 * navigateur détecte automatiquement ce fragment et déclenche l'événement
 * "PASSWORD_RECOVERY" — on écoute cet événement pour envoyer l'utilisateur
 * choisir son nouveau mot de passe.
 */
export function RecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        router.push("/mettre-a-jour-mot-de-passe");
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
