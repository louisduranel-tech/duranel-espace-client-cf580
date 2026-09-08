import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ cree?: string; mdp?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data as Profile[]) || [];

  return (
    <div>
      <div className="admin-toggle-row" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: "1.05rem" }}>Clients</h2>
        <Link href="/admin/clients/nouveau" className="btn btn-primary btn-sm">
          + Nouveau client
        </Link>
      </div>

      {params.cree === "1" && (
        <p style={{ color: "var(--gain)", fontSize: ".88rem", marginBottom: 12 }}>
          Compte créé. Communiquez l&apos;identifiant et le mot de passe au client.
        </p>
      )}
      {params.mdp === "1" && (
        <p style={{ color: "var(--gain)", fontSize: ".88rem", marginBottom: 12 }}>
          Mot de passe réinitialisé.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="admin-empty">Aucun client pour le moment.</p>
      ) : (
        <div className="admin-card">
          {rows.map((c) => (
            <div className="admin-row" key={c.id} style={{ flexWrap: "wrap" }}>
              <div className="name">
                {c.company || [c.first_name, c.last_name].filter(Boolean).join(" ") || "(sans nom)"}
                <small>{c.email}</small>
              </div>
              <span className={`admin-pill ${c.is_active ? "on" : "off"}`}>
                {c.is_active ? "Actif" : "Désactivé"}
              </span>
              <details style={{ width: "100%" }}>
                <summary style={{ cursor: "pointer", fontSize: ".78rem", opacity: 0.8, padding: "4px 0" }}>
                  Gérer
                </summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
                  <form action="/api/admin/set-client-active" method="post" style={{ display: "flex", gap: 8 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="active" value={c.is_active ? "0" : "1"} />
                    <button className="btn btn-ghost btn-sm admin-back" type="submit">
                      {c.is_active ? "Désactiver" : "Réactiver"}
                    </button>
                  </form>
                  <form action="/api/admin/reset-password" method="post" style={{ display: "flex", gap: 8 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="password"
                      placeholder="Nouveau mot de passe (8 car. min.)"
                      style={{ width: 220 }}
                    />
                    <button className="btn btn-ghost btn-sm admin-back" type="submit">
                      Réinitialiser le mot de passe
                    </button>
                  </form>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
