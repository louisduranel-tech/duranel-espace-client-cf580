import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

/**
 * Synchronise automatiquement les cours de marché (table `market_quotes`)
 * depuis les cotations Euronext publiées sur agritel.com/fr.
 *
 * ⚠️ Ne récupère QUE Blé, Maïs et Colza (les 3 tableaux "Euronext" de la
 * page d'accueil Agritel) — DURANEL dispose d'un accord écrit d'Agritel
 * (Argus Media France) l'autorisant à reprendre ces prix affichés. Ne pas
 * étendre ce script à d'autres pages/sources sans vérifier au préalable
 * que l'accord les couvre.
 *
 * Tourne automatiquement via le planning Netlify Scheduled Functions
 * défini dans `config.schedule` ci-dessous (pas besoin d'appel externe).
 */

const AGRITEL_URL = "https://www.agritel.com/fr/";
const USER_AGENT =
  "Mozilla/5.0 (compatible; DuranelExtranetBot/1.0; +https://espace-client.ets-duranel.com)";

// Produits à synchroniser : le nom qu'on veut stocker en base, en face du
// libellé exact utilisé par Agritel dans le <th> du tableau.
const PRODUCTS: Record<string, string> = {
  "Blé (€/t)": "Blé",
  "Maïs (€/t)": "Maïs",
  "Colza (€/t)": "Colza",
};

type ScrapedRow = {
  product: string;
  maturity: string;
  campaign_year: number | null;
  price: number;
  delta_abs: number;
  delta_pct: number;
  sort_order: number;
};

function parseFrNumber(raw: string): number {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function guessCampaignYear(maturity: string): number | null {
  const m = maturity.match(/(\d{2})\s*$/);
  if (!m) return null;
  return 2000 + Number(m[1]);
}

function scrapeAgritel(html: string): ScrapedRow[] {
  const $ = cheerio.load(html);
  const rows: ScrapedRow[] = [];

  $("table.table-condensed").each((_, table) => {
    const header = $(table).find("th").first().text().trim();
    const product = PRODUCTS[header];
    if (!product) return; // pas un des 3 tableaux qui nous intéressent

    let sortOrder = 0;
    $(table)
      .find("tbody tr")
      .each((__, tr) => {
        const cells = $(tr).find("td");
        const maturity = $(cells[0]).text().trim();
        const priceText = $(cells[1]).text().trim();
        const varText = $(cells[2]).find("span").first().text().trim();
        if (!maturity || !priceText) return;

        const price = parseFrNumber(priceText);
        const delta_abs = varText ? parseFrNumber(varText) : 0;
        const prevPrice = price - delta_abs;
        const delta_pct =
          prevPrice !== 0 ? Math.round((delta_abs / prevPrice) * 10000) / 100 : 0;

        rows.push({
          product,
          maturity,
          campaign_year: guessCampaignYear(maturity),
          price,
          delta_abs,
          delta_pct,
          sort_order: sortOrder++,
        });
      });
  });

  return rows;
}

export default async (req: Request) => {
  const results: Record<string, unknown> = {};

  try {
    const res = await fetch(AGRITEL_URL, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) {
      throw new Error(`Agritel a répondu ${res.status}`);
    }
    const html = await res.text();
    const scraped = scrapeAgritel(html);

    if (scraped.length === 0) {
      throw new Error(
        "Aucune donnée extraite — la structure de la page agritel.com a peut-être changé."
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Variables Supabase manquantes (URL ou clé service_role).");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const managedProducts = Object.values(PRODUCTS);

    // Récupère les lignes existantes pour ces 3 produits, pour savoir
    // lesquelles mettre à jour, lesquelles créer, lesquelles supprimer
    // (échéance qui a expiré et n'apparaît plus chez Agritel).
    const { data: existing, error: fetchErr } = await supabase
      .from("market_quotes")
      .select("id, product, maturity")
      .in("product", managedProducts);
    if (fetchErr) throw fetchErr;

    const existingMap = new Map<string, string>();
    for (const row of existing || []) {
      existingMap.set(`${row.product}|${row.maturity}`, row.id);
    }

    const seenKeys = new Set<string>();
    let inserted = 0;
    let updated = 0;

    for (const row of scraped) {
      const key = `${row.product}|${row.maturity}`;
      seenKeys.add(key);
      const existingId = existingMap.get(key);

      if (existingId) {
        const { error } = await supabase
          .from("market_quotes")
          .update({
            price: row.price,
            delta_abs: row.delta_abs,
            delta_pct: row.delta_pct,
            campaign_year: row.campaign_year,
            sort_order: row.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingId);
        if (error) throw error;
        updated++;
      } else {
        const { error } = await supabase.from("market_quotes").insert(row);
        if (error) throw error;
        inserted++;
      }
    }

    // Supprime les échéances qui existaient en base pour ces produits mais
    // qu'Agritel n'affiche plus (contrat expiré).
    const staleIds = (existing || [])
      .filter((row) => !seenKeys.has(`${row.product}|${row.maturity}`))
      .map((row) => row.id);
    let deleted = 0;
    if (staleIds.length > 0) {
      const { error } = await supabase.from("market_quotes").delete().in("id", staleIds);
      if (error) throw error;
      deleted = staleIds.length;
    }

    results.ok = true;
    results.inserted = inserted;
    results.updated = updated;
    results.deleted = deleted;
    console.log("[sync-agritel]", JSON.stringify(results));
    return new Response(JSON.stringify(results), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[sync-agritel] échec:", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

// Tourne les jours ouvrés à 8h et 18h (heure de Paris, approx. — cron en
// UTC : 6h/16h en hiver, 7h/17h... on prend une fourchette qui couvre les
// deux, ajustable ici si besoin).
export const config = {
  schedule: "0 6,16 * * 1-5",
};
