"use client";

import { useState } from "react";
import { IconArrowUp, IconArrowDown, IconChevron } from "./icons";
import type { GroupedProduct, MarketQuote } from "@/lib/types";

function deltaClass(delta: number) {
  if (delta > 0) return "gain";
  if (delta < 0) return "loss";
  return "flat";
}

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Delta({ abs, pct }: { abs: number; pct: number }) {
  const cls = deltaClass(abs);
  return (
    <span className={`delta ${cls}`}>
      {cls === "gain" && <IconArrowUp />}
      {cls === "loss" && <IconArrowDown />}
      {abs > 0 ? "+" : ""}
      {formatNumber(abs)} €/t · {pct > 0 ? "+" : ""}
      {pct.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
    </span>
  );
}

function ProductGroup({ group }: { group: GroupedProduct<MarketQuote> }) {
  const [open, setOpen] = useState(false);
  const first = group.maturities[0];
  const rest = group.maturities.slice(1);
  const updated = new Date(first.updated_at).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const cls = deltaClass(first.delta_abs);

  return (
    <div className="price-group">
      <button className="price-row-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="pr-name">{group.product}</div>
          <div className="pr-term">
            Échéance {first.maturity}
            {rest.length > 0 && <span className="pr-more"> · {group.maturities.length} échéances</span>}
          </div>
          <div className="pr-updated">Maj {updated}</div>
        </div>
        {/* pas d'historique en base pour l'instant : sparkline désactivée */}
        <div className="pr-right">
          <div className="pr-price tabular">{formatNumber(first.price)} €/t</div>
          <Delta abs={first.delta_abs} pct={first.delta_pct} />
        </div>
        {rest.length > 0 && <IconChevron className="chevron" />}
      </button>
      {rest.length > 0 && (
        <div className="price-expand" hidden={!open}>
          {rest.map((m) => (
            <div className="price-sub-row" key={m.id}>
              <span className="term">{m.maturity}</span>
              <span className="p tabular">{formatNumber(m.price)} €/t</span>
              <Delta abs={m.delta_abs} pct={m.delta_pct} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PriceList({ groups }: { groups: GroupedProduct<MarketQuote>[] }) {
  if (groups.length === 0) {
    return <p className="empty-note">Aucun cours publié pour le moment.</p>;
  }
  return (
    <>
      {groups.map((g) => (
        <ProductGroup key={g.product} group={g} />
      ))}
    </>
  );
}
