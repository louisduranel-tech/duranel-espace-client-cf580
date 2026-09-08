"use client";

import { useMemo, useState } from "react";
import { IconChevron, IconPhone } from "./icons";
import type { DuranelQuote, GroupedProduct } from "@/lib/types";
import { groupByProduct } from "@/lib/types";

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function QuoteGroup({ group }: { group: GroupedProduct<DuranelQuote> }) {
  const [open, setOpen] = useState(false);
  const first = group.maturities[0];
  const rest = group.maturities.slice(1);

  return (
    <div className="quote-group">
      <button
        className="quote-row-toggle"
        aria-expanded={open}
        onClick={() => rest.length && setOpen((v) => !v)}
        style={{ cursor: rest.length ? "pointer" : "default" }}
      >
        <span className="prod">
          {group.product}
          <small>
            Base sur {first.maturity}, rendu silo
            {rest.length > 0 && <span className="pr-more"> · {group.maturities.length} échéances</span>}
          </small>
        </span>
        <span className="base tabular">
          {first.base > 0 ? "+" : ""}
          {formatNumber(first.base)} €/t
        </span>
        {rest.length > 0 && <IconChevron className="chevron" />}
      </button>
      {rest.length > 0 && (
        <div className="quote-expand" hidden={!open}>
          {rest.map((m) => (
            <div className="quote-sub-row" key={m.id}>
              <span className="term">{m.maturity}, rendu silo</span>
              <span className="p tabular">
                {m.base > 0 ? "+" : ""}
                {formatNumber(m.base)} €/t
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuotesPanel({
  quotes,
  phone,
  updatedLabel,
}: {
  quotes: DuranelQuote[];
  phone: string | null;
  updatedLabel: string | null;
}) {
  const years = useMemo(() => {
    const set = new Set(quotes.map((q) => q.campaign_year));
    return Array.from(set).sort();
  }, [quotes]);
  const [year, setYear] = useState<number | null>(years[0] ?? null);

  const groups = useMemo(() => {
    const filtered = quotes.filter((q) => q.campaign_year === year);
    return groupByProduct(filtered);
  }, [quotes, year]);

  const telHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;

  return (
    <div className="quotes-panel">
      <div className="section-head">
        <div>
          <div className="eyebrow">Prix maison</div>
          <h2>Cotations DURANEL</h2>
        </div>
      </div>

      {years.length > 1 && (
        <div className="campaign-toggle">
          {years.map((y) => (
            <button
              key={y}
              className="chip"
              aria-pressed={y === year}
              onClick={() => setYear(y)}
            >
              Récolte {y}
            </button>
          ))}
        </div>
      )}

      {groups.length === 0 ? (
        <p className="empty-note">Aucune cotation publiée pour le moment.</p>
      ) : (
        groups.map((g) => <QuoteGroup key={g.product} group={g} />)
      )}

      {updatedLabel && <div className="quotes-foot">{updatedLabel}</div>}

      <div className="quotes-notice">
        <p>
          Ces bases sont indicatives et peuvent évoluer en cours de séance.
          Appelez-nous pour fixer votre prix.
        </p>
        {telHref && (
          <a className="btn btn-primary btn-sm" href={telHref}>
            <IconPhone />
            Appeler
          </a>
        )}
      </div>
    </div>
  );
}
