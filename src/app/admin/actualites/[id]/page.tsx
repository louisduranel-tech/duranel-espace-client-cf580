import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NewsItem } from "@/lib/types";
import { updateNews, deleteNews } from "../../actions";
import { NewsForm } from "../NewsForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").eq("id", id).single();
  const item = data as NewsItem | null;

  if (!item) notFound();

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 16 }}>Modifier l&apos;article</h2>
      <div className="admin-card pad">
        <NewsForm action={updateNews} item={item} />
      </div>
      <div className="admin-card pad" style={{ marginTop: 16 }}>
        <form action={deleteNews}>
          <input type="hidden" name="id" value={item.id} />
          <button className="btn btn-danger" type="submit">
            Supprimer cet article
          </button>
        </form>
      </div>
    </div>
  );
}
