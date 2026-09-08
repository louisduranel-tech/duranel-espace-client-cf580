"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/cours", label: "Cours" },
  { href: "/admin/cotations", label: "Cotations" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/indicateurs", label: "Indicateurs" },
  { href: "/admin/contact", label: "Contact" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname.startsWith(item.href) ? "on" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
