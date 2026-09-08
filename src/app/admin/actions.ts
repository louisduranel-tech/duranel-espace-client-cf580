"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ---------- Cours (market_quotes) ----------

export async function saveMarketQuotes(formData: FormData) {
  const ids = formData.getAll("row_id").map(String);
  const supabase = await createClient();

  await Promise.all(
    ids.map((id) => {
      const price = Number(String(formData.get(`price_${id}`) || "0").replace(",", "."));
      const delta_abs = Number(String(formData.get(`delta_abs_${id}`) || "0").replace(",", "."));
      const delta_pct = Number(String(formData.get(`delta_pct_${id}`) || "0").replace(",", "."));
      return supabase
        .from("market_quotes")
        .update({ price, delta_abs, delta_pct, updated_at: new Date().toISOString() })
        .eq("id", id);
    })
  );

  redirect("/admin/cours");
}

export async function createMarketQuote(formData: FormData) {
  const product = String(formData.get("product") || "").trim();
  const maturity = String(formData.get("maturity") || "").trim();
  const campaign_year = Number(formData.get("campaign_year")) || null;
  const price = Number(String(formData.get("price") || "0").replace(",", "."));
  const sort_order = Number(formData.get("sort_order")) || 0;

  if (!product || !maturity) redirect("/admin/cours?erreur=champs");

  const supabase = await createClient();
  await supabase.from("market_quotes").insert({
    product,
    maturity,
    campaign_year,
    price,
    delta_abs: 0,
    delta_pct: 0,
    sort_order,
  });

  redirect("/admin/cours");
}

export async function deleteMarketQuote(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("market_quotes").delete().eq("id", id);
  redirect("/admin/cours");
}

// ---------- Cotations DURANEL ----------

export async function saveDuranelQuotes(formData: FormData) {
  const ids = formData.getAll("row_id").map(String);
  const supabase = await createClient();

  await Promise.all(
    ids.map((id) => {
      const base = Number(String(formData.get(`base_${id}`) || "0").replace(",", "."));
      const published = formData.get(`published_${id}`) === "on";
      return supabase
        .from("duranel_quotes")
        .update({ base, published, updated_at: new Date().toISOString() })
        .eq("id", id);
    })
  );

  redirect("/admin/cotations");
}

export async function createDuranelQuote(formData: FormData) {
  const product = String(formData.get("product") || "").trim();
  const maturity = String(formData.get("maturity") || "").trim();
  const campaign_year = Number(formData.get("campaign_year"));
  const base = Number(String(formData.get("base") || "0").replace(",", "."));
  const sort_order = Number(formData.get("sort_order")) || 0;

  if (!product || !maturity || !campaign_year) redirect("/admin/cotations?erreur=champs");

  const supabase = await createClient();
  await supabase.from("duranel_quotes").insert({
    product,
    maturity,
    campaign_year,
    base,
    sort_order,
    published: true,
  });

  redirect("/admin/cotations");
}

export async function deleteDuranelQuote(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("duranel_quotes").delete().eq("id", id);
  redirect("/admin/cotations");
}

// ---------- Indicateurs ----------

export async function saveIndicators(formData: FormData) {
  const ids = formData.getAll("row_id").map(String);
  const supabase = await createClient();

  await Promise.all(
    ids.map((id) => {
      const value = String(formData.get(`value_${id}`) || "").trim();
      const deltaRaw = String(formData.get(`delta_pct_${id}`) || "").trim();
      const delta_pct = deltaRaw ? Number(deltaRaw.replace(",", ".")) : null;
      return supabase
        .from("indicators")
        .update({ value, delta_pct, updated_at: new Date().toISOString() })
        .eq("id", id);
    })
  );

  redirect("/admin/indicateurs");
}

export async function createIndicator(formData: FormData) {
  const key = String(formData.get("key") || "").trim();
  const label = String(formData.get("label") || "").trim();
  const value = String(formData.get("value") || "").trim();

  if (!key || !label || !value) redirect("/admin/indicateurs?erreur=champs");

  const supabase = await createClient();
  await supabase.from("indicators").insert({ key, label, value, source: "manual" });

  redirect("/admin/indicateurs");
}

export async function deleteIndicator(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("indicators").delete().eq("id", id);
  redirect("/admin/indicateurs");
}

// ---------- Contact ----------

export async function updateContactInfo(formData: FormData) {
  const address = String(formData.get("address") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const hours = String(formData.get("hours") || "").trim();

  const supabase = await createClient();
  await supabase
    .from("contact_info")
    .update({ address, phone, email, hours, updated_at: new Date().toISOString() })
    .eq("id", 1);

  redirect("/admin/contact");
}

export async function markMessageRead(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  redirect("/admin/contact");
}

// ---------- Actualités ----------

export async function createNews(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const intro = String(formData.get("intro") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const published = formData.get("published") === "on";

  if (!title || !category) redirect("/admin/actualites?erreur=champs");

  const supabase = await createClient();
  await supabase.from("news").insert({
    title,
    category,
    intro: intro || null,
    body: body || null,
    image_url: image_url || null,
    published,
    published_at: new Date().toISOString(),
  });

  redirect("/admin/actualites");
}

export async function updateNews(formData: FormData) {
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const intro = String(formData.get("intro") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const published = formData.get("published") === "on";

  const supabase = await createClient();
  await supabase
    .from("news")
    .update({
      title,
      category,
      intro: intro || null,
      body: body || null,
      image_url: image_url || null,
      published,
    })
    .eq("id", id);

  redirect("/admin/actualites");
}

export async function deleteNews(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);
  redirect("/admin/actualites");
}

// ---------- Clients ----------

export async function updateClientProfile(formData: FormData) {
  const id = String(formData.get("id"));
  const first_name = String(formData.get("first_name") || "").trim();
  const last_name = String(formData.get("last_name") || "").trim();
  const company = String(formData.get("company") || "").trim();

  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ first_name: first_name || null, last_name: last_name || null, company: company || null })
    .eq("id", id);

  redirect("/admin/clients");
}
