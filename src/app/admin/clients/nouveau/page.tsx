export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <h2 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Nouveau client</h2>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Créez l&apos;accès puis communiquez l&apos;e-mail et le mot de passe
        au client par téléphone ou en main propre.
      </p>

      {params.erreur === "champs" && (
        <p style={{ color: "var(--loss)", fontSize: ".88rem", marginBottom: 12 }}>
          Merci de renseigner un e-mail valide et un mot de passe d&apos;au moins 8 caractères.
        </p>
      )}
      {params.erreur === "creation" && (
        <p style={{ color: "var(--loss)", fontSize: ".88rem", marginBottom: 12 }}>
          Impossible de créer ce compte (l&apos;e-mail est peut-être déjà utilisé).
        </p>
      )}
      {params.erreur === "cle-manquante" && (
        <p style={{ color: "var(--loss)", fontSize: ".88rem", marginBottom: 12 }}>
          La création de compte n&apos;est pas encore configurée sur ce serveur
          (clé technique manquante). Contactez le développeur.
        </p>
      )}

      <form action="/api/admin/create-client" method="post" className="admin-card pad">
        <div className="admin-field">
          <label>Prénom</label>
          <input name="first_name" />
        </div>
        <div className="admin-field">
          <label>Nom</label>
          <input name="last_name" />
        </div>
        <div className="admin-field">
          <label>Exploitation / raison sociale</label>
          <input name="company" placeholder="Ferme du Moulin" />
        </div>
        <div className="admin-field">
          <label>E-mail (identifiant de connexion)</label>
          <input name="email" type="email" required />
        </div>
        <div className="admin-field">
          <label>Mot de passe initial (8 caractères minimum)</label>
          <input name="password" required minLength={8} />
        </div>
        <div className="admin-save">
          <button className="btn btn-primary" type="submit">
            Créer le compte
          </button>
        </div>
      </form>
    </div>
  );
}
