import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // 1) Vérifie que l'appelant est bien un admin connecté (jamais faire confiance au client).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const first_name = String(formData.get("first_name") || "").trim();
  const last_name = String(formData.get("last_name") || "").trim();
  const company = String(formData.get("company") || "").trim();

  if (!email || password.length < 8) {
    return NextResponse.redirect(
      new URL("/admin/clients/nouveau?erreur=champs", request.url)
    );
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/clients/nouveau?erreur=cle-manquante", request.url)
    );
  }

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !created.user) {
    return NextResponse.redirect(
      new URL("/admin/clients/nouveau?erreur=creation", request.url)
    );
  }

  // Le trigger handle_new_user crée déjà la ligne profiles (id + email).
  // On complète avec le nom / la raison sociale.
  await admin
    .from("profiles")
    .update({
      first_name: first_name || null,
      last_name: last_name || null,
      company: company || null,
    })
    .eq("id", created.user.id);

  return NextResponse.redirect(new URL("/admin/clients?cree=1", request.url));
}
