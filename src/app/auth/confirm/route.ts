import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Point d'entrée des liens envoyés par e-mail par Supabase
 * (invitation d'un nouveau compte, réinitialisation de mot de passe).
 * Vérifie le jeton puis envoie l'utilisateur choisir son mot de passe.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/mettre-a-jour-mot-de-passe";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect(next);
    }
  }

  redirect("/login?erreur=lien-invalide");
}
