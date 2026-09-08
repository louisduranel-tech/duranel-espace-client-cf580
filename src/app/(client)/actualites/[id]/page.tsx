import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsById } from "@/lib/data/public";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(id);

  if (!item) notFound();

  return (
    <section className="fade-in">
      <div className="section-head">
        <Link className="link-more" href="/actualites">
          ← Toutes les actualités
        </Link>
      </div>
      <div className="card news-article" style={{ padding: 20 }}>
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" />
        )}
        <span className="news-cat">{item.category}</span>
        <h1 style={{ fontSize: "1.4rem" }}>{item.title}</h1>
        <span className="news-date">{formatDate(item.published_at)}</span>
        {item.body && <div className="news-article-body">{item.body}</div>}
      </div>
    </section>
  );
}
