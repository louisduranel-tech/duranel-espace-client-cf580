import { createClient } from "@/lib/supabase/server";
import type { ContactInfo, DuranelQuote, Indicator, MarketQuote, NewsItem } from "@/lib/types";

export async function getMarketQuotes(): Promise<MarketQuote[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("market_quotes")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as MarketQuote[]) || [];
}

export async function getDuranelQuotes(): Promise<DuranelQuote[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("duranel_quotes")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return (data as DuranelQuote[]) || [];
}

export async function getIndicators(): Promise<Indicator[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("indicators").select("*");
  return (data as Indicator[]) || [];
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as NewsItem[]) || [];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  return (data as NewsItem) || null;
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("contact_info").select("*").eq("id", 1).single();
  return (data as ContactInfo) || null;
}

export function latestQuotesUpdateLabel(quotes: DuranelQuote[]): string | null {
  if (quotes.length === 0) return null;
  const latest = quotes.reduce((max, q) => (q.updated_at > max ? q.updated_at : max), quotes[0].updated_at);
  const d = new Date(latest);
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `Publié par DURANEL le ${date} à ${time}`;
}
