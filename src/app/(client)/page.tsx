import Link from "next/link";
import {
  getContactInfo,
  getDuranelQuotes,
  getIndicators,
  getMarketQuotes,
  getNews,
  latestQuotesUpdateLabel,
} from "@/lib/data/public";
import { groupByProduct } from "@/lib/types";
import { PriceList } from "@/components/PriceList";
import { QuotesPanel } from "@/components/QuotesPanel";
import { IndicatorsGrid } from "@/components/IndicatorsGrid";
import { NewsList } from "@/components/NewsList";
import { IconMail, IconPhone } from "@/components/icons";

export default async function HomePage() {
  const [marketQuotes, duranelQuotes, indicators, news, contact] = await Promise.all([
    getMarketQuotes(),
    getDuranelQuotes(),
    getIndicators(),
    getNews(3),
    getContactInfo(),
  ]);

  const priceGroups = groupByProduct(marketQuotes);
  const phone = contact?.phone || null;
  const telHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;
  const mailHref = contact?.email ? `mailto:${contact.email}` : undefined;

  return (
    <section className="fade-in">
      <div className="two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">Marchés</div>
                <h2>Cours du jour</h2>
              </div>
              <Link className="link-more" href="/cours">
                Tous les cours →
              </Link>
            </div>
            <div className="card prices-card">
              <PriceList groups={priceGroups} />
            </div>
          </div>

          <QuotesPanel
            quotes={duranelQuotes}
            phone={phone}
            updatedLabel={latestQuotesUpdateLabel(duranelQuotes)}
          />

          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">Repères</div>
                <h2>Indicateurs</h2>
              </div>
            </div>
            <IndicatorsGrid indicators={indicators} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">DURANEL</div>
                <h2>Actualités</h2>
              </div>
              <Link className="link-more" href="/actualites">
                Tout voir →
              </Link>
            </div>
            <NewsList items={news} />
          </div>

          <div className="card contact-hero">
            <div className="eyebrow">Une question ?</div>
            <h2 style={{ margin: "2px 0 4px" }}>Contactez DURANEL</h2>
            {contact?.hours && (
              <p style={{ color: "var(--ink-muted)", fontSize: ".88rem", margin: 0 }}>
                {contact.hours}
              </p>
            )}
            <div className="contact-actions">
              {telHref && (
                <a className="btn btn-primary" href={telHref}>
                  <IconPhone />
                  Appeler
                </a>
              )}
              {mailHref && (
                <a className="btn btn-ghost" href={mailHref}>
                  <IconMail />
                  E-mail
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
