import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; desactive?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="login-screen">
      <div className="login-wrap fade-in">
        <div className="brand-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo"
            src="/logo.webp"
            alt="DURANEL — Aliment du bétail & Négoce"
          />
          <div className="brand-sub">Espace Client</div>
        </div>
        <div className="login-card card">
          {params.erreur === "identifiants" && (
            <div className="login-alert">
              Adresse e-mail ou mot de passe incorrect.
            </div>
          )}
          {params.erreur === "champs" && (
            <div className="login-alert">
              Merci de renseigner votre e-mail et votre mot de passe.
            </div>
          )}
          {params.desactive === "1" && (
            <div className="login-alert">
              Votre accès a été désactivé. Contactez DURANEL pour plus
              d&apos;informations.
            </div>
          )}
          <form action={login}>
            <div className="field">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exploitation.fr"
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Se connecter
            </button>
          </form>
          <p className="login-help">
            Vos identifiants vous ont été transmis par DURANEL.
            <br />
            Un problème d&apos;accès ? Contactez-nous.
          </p>
        </div>
      </div>
    </section>
  );
}
