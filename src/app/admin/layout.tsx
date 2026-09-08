import Link from "next/link";
import { AdminNav } from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <div className="admin-top">
        <div>
          <div className="tag">Interne DURANEL</div>
          <div className="admin-title">Administration</div>
        </div>
        <Link href="/" className="btn btn-ghost admin-back">
          ← Retour à l&apos;espace client
        </Link>
      </div>
      <div className="admin-body">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
