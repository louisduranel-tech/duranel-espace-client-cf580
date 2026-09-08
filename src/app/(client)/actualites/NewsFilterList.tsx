"use client";

import { useMemo, useState } from "react";
import { NewsList } from "@/components/NewsList";
import type { NewsItem } from "@/lib/types";

const CATEGORIES = ["Toutes", "Marchés", "DURANEL", "Récolte", "Météo", "Réglementation"];

export function NewsFilterList({ items }: { items: NewsItem[] }) {
  const [cat, setCat] = useState("Toutes");

  const filtered = useMemo(() => {
    if (cat === "Toutes") return items;
    return items.filter((n) => n.category === cat);
  }, [items, cat]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          overflowY: "hidden",
          marginBottom: 16,
          overscrollBehaviorX: "contain",
          touchAction: "pan-x pinch-zoom",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="chip"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="example-note" style={{ padding: "14px 0" }}>
          Aucune actualité dans cette catégorie pour le moment.
        </p>
      ) : (
        <NewsList items={filtered} />
      )}
    </>
  );
}
