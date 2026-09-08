import { createClient } from "@/lib/supabase/server";
import { NavTop, NavBottom } from "@/components/AppNav";
import { logout } from "./actions";

function formatGreeting(name: string | null) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return name ? `${name} — ${today}` : today;
}

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, company")
      .eq("id", user.id)
      .single();
    displayName =
      profile?.company ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      null;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-id">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="topbar-logo" src="/logo.webp" alt="DURANEL" />
          <div className="topbar-greeting" id="greeting">
            {formatGreeting(displayName)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavTop />
          <form action={logout}>
            <button type="submit" className="btn btn-ghost btn-sm">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main>{children}</main>

      <NavBottom />
    </div>
  );
}
