"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Impossible d'enregistrer ce mot de passe. Réessayez.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <section className="login-screen">
      <div className="login-wrap fade-in">
        <div className="brand-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/logo.webp" alt="DURANEL" />
          <div className="brand-sub">Espace Client</div>
        </div>
        <div className="login-card card">
          <h2 style={{ fontSize: "1rem", marginBottom: 16, textAlign: "center" }}>
            Choisissez votre mot de passe
          </h2>
          {error && <div className="login-alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirmez le mot de passe</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Enregistrement..." : "Valider"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
