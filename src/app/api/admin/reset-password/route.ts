import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.redirect(new URL("/", request.url));

  const formData = await request.formData();
  const id = String(formData.get("id") || "");
  const password = String(formData.get("password") || "");

  if (!id || password.length < 8) {
    return NextResponse.redirect(
      new URL("/admin/clients?erreur=mdp-court", request.url)
    );
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.redirect(
      new URL("/admin/clients?erreur=cle-manquante", request.url)
    );
  }

  await admin.auth.admin.updateUserById(id, { password });

  return NextResponse.redirect(new URL("/admin/clients?mdp=1", request.url));
}
