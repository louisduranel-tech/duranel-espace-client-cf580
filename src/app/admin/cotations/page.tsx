import { createClient } from "@/lib/supabase/server";
import { groupByProduct, type DuranelQuote } from "@/lib/types";
import { saveDuranelQuotes, createDuranelQuote, deleteDuranelQuote } from "../actions";

export default async function AdminCotationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("duranel_quotes")
    .select("*")
    .order("campaign_year", { ascending: true })
    .order("product", { ascending: true })
    .order("sort_order", { ascending: true });

  const rows = (data as DuranelQuote[]) || [];
  const years = Array.from(new Set(rows.map((r) => r.campaign_year))).sort();

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Cotations DURANEL</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Vos bases par campagne. Décochez &quot;Publiée&quot; pour masquer une
        ligne sans la supprimer.
      </p>

      <form action={saveDuranelQuotes} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {years.map((year) => {
          const yearRows = rows.filter((r) => r.campaign_year === year);
          const groups = groupByProduct(yearRows);
          return (
            <div key={year}>
              <div className="eyebrow" style={{ margin: "4px 0 8px" }}>
                Récolte {year}
              </div>
              {groups.map((g) => (
                <div className="admin-card" key={g.product} style={{ marginBottom: 12 }}>
                  <div style={{ padding: "12px 0 4px", fontWeight: 700 }}>{g.product}</div>
                  {g.maturities.map((m) => (
                    <div className="admin-row" key={m.id}>
                      <input type="hidden" name="row_id" value={m.id} />
                      <div className="name">{m.maturity}</div>
                      <input
                        name={`base_${m.id}`}
                        defaultValue={m.base}
                        className="tabular"
                        inputMode="decimal"
                        aria-label="Base en euros par tonne"
                      />
                      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".72rem" }}>
                        <input
                          type="checkbox"
                          name={`published_${m.id}`}
                          defaultChecked={m.published}
                          style={{ width: "auto" }}
                        />
                        Publiée
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
        {rows.length === 0 && (
          <p className="admin-empty">Aucune cotation pour le moment. Ajoutez-en une ci-dessous.</p>
        )}
        {rows.length > 0 && (
          <div className="admin-save">
            <button className="btn btn-primary" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        )}
      </form>

      <div className="admin-card pad" style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Ajouter une cotation</div>
        <form action={createDuranelQuote}>
          <div className="admin-field">
            <label>Produit (ex. Blé, Colza, Maïs)</label>
            <input name="product" required />
          </div>
          <div className="admin-field">
            <label>Campagne (année, ex. 2026)</label>
            <input name="campaign_year" type="number" required />
          </div>
          <div className="admin-field">
            <label>Échéance (ex. Matif déc. 2026)</label>
            <input name="maturity" required />
          </div>
          <div className="admin-field">
            <label>Base (€/t, peut être négative)</label>
            <input name="base" inputMode="decimal" defaultValue="0" />
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
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Supprimer une cotation</div>
          {rows.map((m) => (
            <form action={deleteDuranelQuote} key={m.id} className="admin-row">
              <input type="hidden" name="id" value={m.id} />
              <div className="name">
                {m.product} <small>{m.maturity} · Récolte {m.campaign_year}</small>
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
