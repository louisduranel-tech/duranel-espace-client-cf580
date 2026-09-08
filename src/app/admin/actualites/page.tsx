import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/lib/types";

export default async function AdminActualitesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  const rows = (data as NewsItem[]) || [];

  return (
    <div>
      <div className="admin-toggle-row" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: "1.05rem" }}>Actualités</h2>
        <Link href="/admin/actualites/nouvelle" className="btn btn-primary btn-sm">
          + Nouvel article
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="admin-empty">Aucun article pour le moment.</p>
      ) : (
        <div className="admin-card">
          {rows.map((n) => (
            <Link href={`/admin/actualites/${n.id}`} className="admin-list-link" key={n.id}>
              <div className="name">
                {n.title}
                <small>
                  {n.category} ·{" "}
                  {new Date(n.published_at).toLocaleDateString("fr-FR")}
                </small>
              </div>
              <span className={`admin-pill ${n.published ? "on" : "off"}`}>
                {n.published ? "Publié" : "Brouillon"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
