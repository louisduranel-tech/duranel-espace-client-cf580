"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconChart, IconNews, IconPhone } from "./icons";

const ITEMS = [
  { href: "/", label: "Accueil", Icon: IconHome },
  { href: "/cours", label: "Cours", Icon: IconChart },
  { href: "/actualites", label: "Actualités", Icon: IconNews },
  { href: "/contact", label: "Contact", Icon: IconPhone },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function NavTop() {
  const pathname = usePathname();
  return (
    <nav className="nav-top">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
        >
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function NavBottom() {
  const pathname = usePathname();
  return (
    <nav className="nav-bottom">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
        >
          <Icon />
          {label}
        </Link>
      ))}
    </nav>
  );
}
