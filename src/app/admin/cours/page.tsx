import { createClient } from "@/lib/supabase/server";
import { groupByProduct, type MarketQuote } from "@/lib/types";
import { saveMarketQuotes, createMarketQuote, deleteMarketQuote } from "../actions";

export default async function AdminCoursPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("market_quotes")
    .select("*")
    .order("product", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows = (data as MarketQuote[]) || [];
  const groups = groupByProduct(rows);

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Cours de marché</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Un prix par échéance. Modifiez les chiffres puis enregistrez : les
        clients les voient aussitôt.
      </p>

      <form action={saveMarketQuotes} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {groups.map((g) => (
          <div className="admin-card" key={g.product}>
            <div style={{ padding: "12px 0 4px", fontWeight: 700 }}>{g.product}</div>
            {g.maturities.map((m) => (
              <div className="admin-row" key={m.id}>
                <input type="hidden" name="row_id" value={m.id} />
                <div className="name">
                  {m.maturity}
                  <small>Campagne {m.campaign_year ?? "—"}</small>
                </div>
                <input
                  name={`price_${m.id}`}
                  defaultValue={m.price}
                  className="tabular"
                  inputMode="decimal"
                  aria-label="Prix en euros par tonne"
                />
                <input
                  name={`delta_abs_${m.id}`}
                  defaultValue={m.delta_abs}
                  className="tabular"
                  inputMode="decimal"
                  style={{ width: 70 }}
                  aria-label="Variation en euros"
                />
                <input
                  name={`delta_pct_${m.id}`}
                  defaultValue={m.delta_pct}
                  className="tabular"
                  inputMode="decimal"
                  style={{ width: 60 }}
                  aria-label="Variation en pourcentage"
                />
              </div>
            ))}
          </div>
        ))}
        {groups.length === 0 && (
          <p className="admin-empty">Aucun cours pour le moment. Ajoutez-en un ci-dessous.</p>
        )}
        {groups.length > 0 && (
          <div className="admin-save">
            <button className="btn btn-primary" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        )}
      </form>

      <div className="admin-card pad" style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Ajouter une échéance</div>
        <form action={createMarketQuote}>
          <div className="admin-field">
            <label>Produit (ex. Blé tendre, Colza, Maïs)</label>
            <input name="product" required />
          </div>
          <div className="admin-field">
            <label>Échéance (ex. Déc. 2026)</label>
            <input name="maturity" required />
          </div>
          <div className="admin-field">
            <label>Campagne (année, ex. 2026)</label>
            <input name="campaign_year" type="number" />
          </div>
          <div className="admin-field">
            <label>Prix (€/t)</label>
            <input name="price" inputMode="decimal" defaultValue="0" />
          </div>
          <div className="admin-field">
            <label>Ordre d&apos;affichage (0 = premier affiché)</label>
            <input name="sort_order" type="number" defaultValue="0" />
          </div>
          <div className="admin-save">
            <button className="btn btn-primary" type="submit">
              Ajouter
            </button>
          </div>
        </form>
      </div>

      {rows.length > 0 && (
        <div className="admin-card pad">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Supprimer une échéance</div>
          {rows.map((m) => (
            <form action={deleteMarketQuote} key={m.id} className="admin-row">
              <input type="hidden" name="id" value={m.id} />
              <div className="name">
                {m.product} <small>{m.maturity}</small>
              </div>
              <button className="btn btn-danger btn-sm" type="submit">
                Supprimer
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
