"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function sendContactMessage(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !message) {
    return { ok: false, error: "Merci de renseigner votre nom et votre message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    phone: phone || null,
    email: email || null,
    message,
  });

  if (error) {
    return { ok: false, error: "Impossible d'envoyer le message pour le moment." };
  }

  return { ok: true };
}
