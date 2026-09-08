import Link from "next/link";

const TILES = [
  { href: "/admin/clients", title: "Clients", desc: "Créer, désactiver, réinitialiser un mot de passe" },
  { href: "/admin/cours", title: "Cours", desc: "Cours de marché (blé, colza, maïs...)" },
  { href: "/admin/cotations", title: "Cotations DURANEL", desc: "Vos bases par campagne" },
  { href: "/admin/actualites", title: "Actualités", desc: "Créer et publier des articles" },
  { href: "/admin/indicateurs", title: "Indicateurs", desc: "EUR/USD, Brent, météo..." },
  { href: "/admin/contact", title: "Contact", desc: "Coordonnées et messages reçus" },
];

export default function AdminHomePage() {
  return (
    <div>
      <p className="admin-note" style={{ marginBottom: 16 }}>
        Choisissez une rubrique à modifier. Chaque changement est visible par
        les clients dès l&apos;enregistrement.
      </p>
      <div className="admin-menu-grid">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} className="admin-menu-tile">
            <span className="t">{t.title}</span>
            <span className="d">{t.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
