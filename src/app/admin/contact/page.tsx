import { createClient } from "@/lib/supabase/server";
import type { ContactInfo, ContactMessage } from "@/lib/types";
import { updateContactInfo, markMessageRead } from "../actions";

export default async function AdminContactPage() {
  const supabase = await createClient();
  const [{ data: contact }, { data: messages }] = await Promise.all([
    supabase.from("contact_info").select("*").eq("id", 1).single(),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
  ]);

  const c = contact as ContactInfo | null;
  const msgs = (messages as ContactMessage[]) || [];

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Coordonnées</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Ces informations apparaissent sur la page Contact et sur l&apos;accueil.
      </p>

      <form action={updateContactInfo} className="admin-card pad">
        <div className="admin-field">
          <label>Adresse</label>
          <input name="address" defaultValue={c?.address ?? ""} />
        </div>
        <div className="admin-field">
          <label>Téléphone</label>
          <input name="phone" defaultValue={c?.phone ?? ""} placeholder="03 21 00 00 00" />
        </div>
        <div className="admin-field">
          <label>E-mail</label>
          <input name="email" defaultValue={c?.email ?? ""} type="email" />
        </div>
        <div className="admin-field">
          <label>Horaires (une ligne par jour, ex. &quot;Lundi – Jeudi: 8h00 – 18h00&quot;)</label>
          <textarea
            name="hours"
            defaultValue={c?.hours ?? ""}
            placeholder={"Lundi – Jeudi: 8h00 – 18h00\nVendredi: 8h00 – 17h00\nSamedi – Dimanche: Fermé"}
          />
        </div>
        <div className="admin-save">
          <button className="btn btn-primary" type="submit">
            Enregistrer
          </button>
        </div>
      </form>

      <h2 style={{ fontSize: "1.05rem", margin: "24px 0 4px" }}>Messages reçus</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Envoyés depuis le formulaire de contact de l&apos;espace client.
      </p>

      {msgs.length === 0 ? (
        <p className="admin-empty">Aucun message pour le moment.</p>
      ) : (
        <div className="admin-card pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                borderBottom: "1px solid rgba(255,255,255,.1)",
                paddingBottom: 12,
              }}
            >
              <div className="admin-toggle-row" style={{ marginBottom: 4 }}>
                <strong>{m.name}</strong>
                <span className={`admin-pill ${m.read ? "off" : "on"}`}>
                  {m.read ? "Lu" : "Nouveau"}
                </span>
              </div>
              <div style={{ fontSize: ".82rem", opacity: 0.7, marginBottom: 6 }}>
                {[m.phone, m.email].filter(Boolean).join(" · ") || "Aucun contact fourni"}
                {" · "}
                {new Date(m.created_at).toLocaleString("fr-FR")}
              </div>
              <div style={{ fontSize: ".9rem", marginBottom: 8 }}>{m.message}</div>
              {!m.read && (
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn btn-ghost btn-sm admin-back" type="submit">
                    Marquer comme lu
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
