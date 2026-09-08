export type MarketQuote = {
  id: string;
  product: string;
  maturity: string;
  campaign_year: number | null;
  price: number;
  delta_abs: number;
  delta_pct: number;
  sort_order: number;
  updated_at: string;
};

export type DuranelQuote = {
  id: string;
  product: string;
  campaign_year: number;
  maturity: string;
  base: number;
  published: boolean;
  sort_order: number;
  updated_at: string;
};

export type NewsItem = {
  id: string;
  title: string;
  intro: string | null;
  body: string | null;
  category: string;
  image_url: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
};

export type Indicator = {
  id: string;
  key: string;
  label: string;
  value: string;
  delta_pct: number | null;
  source: string;
  updated_at: string;
};

export type ContactInfo = {
  id: number;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  email?: string;
};

/** Un produit avec ses échéances groupées, pour l'affichage accordéon. */
export type GroupedProduct<T> = {
  product: string;
  maturities: T[];
};

export function groupByProduct<T extends { product: string; sort_order: number }>(
  rows: T[]
): GroupedProduct<T>[] {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const list = map.get(row.product) || [];
    list.push(row);
    map.set(row.product, list);
  }
  return Array.from(map.entries()).map(([product, maturities]) => ({
    product,
    maturities: maturities.sort((a, b) => a.sort_order - b.sort_order),
  }));
}
