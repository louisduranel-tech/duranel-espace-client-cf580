import { getNews } from "@/lib/data/public";
import { NewsFilterList } from "./NewsFilterList";

export default async function ActualitesPage() {
  const news = await getNews();

  return (
    <section className="fade-in">
      <div className="section-head">
        <div>
          <div className="eyebrow">DURANEL</div>
          <h2>Actualités</h2>
        </div>
      </div>
      <NewsFilterList items={news} />
    </section>
  );
}
