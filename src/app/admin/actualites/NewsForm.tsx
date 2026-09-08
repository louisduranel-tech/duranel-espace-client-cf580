"use client";

import type { NewsItem } from "@/lib/types";

const CATEGORIES = ["Marchés", "DURANEL", "Récolte", "Météo", "Réglementation"];

export function NewsForm({
  action,
  item,
}: {
  action: (formData: FormData) => void;
  item?: NewsItem;
}) {
  return (
    <form action={action}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="admin-field">
        <label>Titre</label>
        <input name="title" defaultValue={item?.title} required />
      </div>
      <div className="admin-field">
        <label>Catégorie</label>
        <select name="category" defaultValue={item?.category || CATEGORIES[0]}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label>Résumé (affiché dans les listes)</label>
        <textarea name="intro" defaultValue={item?.intro ?? ""} />
      </div>
      <div className="admin-field">
        <label>Texte complet de l&apos;article</label>
        <textarea name="body" defaultValue={item?.body ?? ""} style={{ minHeight: 180 }} />
      </div>
      <div className="admin-field">
        <label>Image (lien web, facultatif)</label>
        <input name="image_url" defaultValue={item?.image_url ?? ""} placeholder="https://..." />
      </div>
      <div className="admin-field admin-toggle-row" style={{ flexDirection: "row" }}>
        <label style={{ marginBottom: 0 }}>Publié (visible par les clients)</label>
        <input
          type="checkbox"
          name="published"
          defaultChecked={item ? item.published : true}
          style={{ width: "auto" }}
        />
      </div>
      <div className="admin-save">
        <button className="btn btn-primary" type="submit">
          {item ? "Enregistrer" : "Publier"}
        </button>
      </div>
    </form>
  );
}
