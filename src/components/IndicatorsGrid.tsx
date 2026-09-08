import { IconCloud } from "./icons";
import type { Indicator } from "@/lib/types";

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const cls = pct > 0 ? "gain" : pct < 0 ? "loss" : "flat";
  return (
    <span className={`delta ${cls}`} style={{ alignSelf: "flex-start" }}>
      {pct > 0 ? "+" : ""}
      {pct.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %
    </span>
  );
}

export function IndicatorsGrid({ indicators }: { indicators: Indicator[] }) {
  const byKey = new Map(indicators.map((i) => [i.key, i]));
  const weather = byKey.get("meteo");
  const others = indicators.filter((i) => i.key !== "meteo");

  if (indicators.length === 0) {
    return <p className="empty-note">Aucun indicateur configuré pour le moment.</p>;
  }

  return (
    <div className="indicators-grid">
      {others.map((i) => (
        <div className="indicator-tile card" key={i.id}>
          <span className="lbl">{i.label}</span>
          <span className="val tabular">{i.value}</span>
          <DeltaBadge pct={i.delta_pct} />
        </div>
      ))}
      {weather && (
        <div className="indicator-tile card">
          <span className="lbl">{weather.label}</span>
          <div className="weather-row">
            <IconCloud />
            <div>
              <span className="val tabular" style={{ fontSize: "1.1rem" }}>
                {weather.value}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
