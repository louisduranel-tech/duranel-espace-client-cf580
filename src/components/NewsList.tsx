import Link from "next/link";
import type { NewsItem } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link className="news-card card" href={`/actualites/${item.id}`}>
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="news-thumb-img" src={item.image_url} alt="" />
      ) : (
        <div className="news-thumb" aria-hidden="true" />
      )}
      <div className="news-body">
        <span className="news-cat">{item.category}</span>
        <span className="news-title">{item.title}</span>
        <span className="news-date">{formatDate(item.published_at)}</span>
        {item.intro && <span className="news-intro">{item.intro}</span>}
      </div>
    </Link>
  );
}

export function NewsList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="empty-note">Aucune actualité pour le moment.</p>;
  }
  return (
    <div className="news-list">
      {items.map((n) => (
        <NewsCard key={n.id} item={n} />
      ))}
    </div>
  );
}
