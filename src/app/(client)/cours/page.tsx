import {
  getDuranelQuotes,
  getMarketQuotes,
  latestQuotesUpdateLabel,
} from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";
import { groupByProduct } from "@/lib/types";
import { PriceList } from "@/components/PriceList";
import { QuotesPanel } from "@/components/QuotesPanel";

export default async function CoursPage() {
  const [marketQuotes, duranelQuotes] = await Promise.all([
    getMarketQuotes(),
    getDuranelQuotes(),
  ]);
  const supabase = await createClient();
  const { data: contact } = await supabase.from("contact_info").select("phone").eq("id", 1).single();

  const priceGroups = groupByProduct(marketQuotes);

  return (
    <section className="fade-in">
      <div className="section-head">
        <div>
          <div className="eyebrow">Marchés</div>
          <h2>Cours du jour</h2>
        </div>
      </div>
      <div className="card prices-card">
        <PriceList groups={priceGroups} />
      </div>

      <div style={{ height: 8 }} />

      <QuotesPanel
        quotes={duranelQuotes}
        phone={contact?.phone || null}
        updatedLabel={latestQuotesUpdateLabel(duranelQuotes)}
      />
    </section>
  );
}
