import { createClient } from "@/lib/supabase/server";
import type { Indicator } from "@/lib/types";
import { saveIndicators, createIndicator, deleteIndicator } from "../actions";

export default async function AdminIndicateursPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("indicators").select("*").order("label");
  const rows = (data as Indicator[]) || [];

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Indicateurs</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        EUR/USD, Brent, météo... Ces valeurs sont saisies manuellement pour
        l&apos;instant.
      </p>

      <form action={saveIndicators} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="admin-card">
          {rows.map((i) => (
            <div className="admin-row" key={i.id}>
              <input type="hidden" name="row_id" value={i.id} />
              <div className="name">
                {i.label}
                <small>Clé : {i.key}</small>
              </div>
              <input name={`value_${i.id}`} defaultValue={i.value} className="tabular" style={{ width: 110 }} />
              <input
                name={`delta_pct_${i.id}`}
                defaultValue={i.delta_pct ?? ""}
                placeholder="% var."
                className="tabular"
                style={{ width: 70 }}
              />
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="admin-empty">Aucun indicateur pour le moment. Ajoutez-en un ci-dessous.</p>
        )}
        {rows.length > 0 && (
          <div className="admin-save">
            <button className="btn btn-primary" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        )}
      </form>

      <div className="admin-card pad" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Ajouter un indicateur</div>
        <form action={createIndicator}>
          <div className="admin-field">
            <label>Clé technique (ex. eur_usd, brent, meteo)</label>
            <input name="key" required />
          </div>
          <div className="admin-field">
            <label>Libellé affiché (ex. EUR / USD)</label>
            <input name="label" required />
          </div>
          <div className="admin-field">
            <label>Valeur affichée (ex. 1,0842 ou 14°C)</label>
            <input name="value" required />
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
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Supprimer un indicateur</div>
          {rows.map((i) => (
            <form action={deleteIndicator} key={i.id} className="admin-row">
              <input type="hidden" name="id" value={i.id} />
              <div className="name">{i.label}</div>
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
