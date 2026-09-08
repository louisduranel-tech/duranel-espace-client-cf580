import { createNews } from "../../actions";
import { NewsForm } from "../NewsForm";

export default function NewArticlePage() {
  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 16 }}>Nouvel article</h2>
      <div className="admin-card pad">
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
