import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RecoveryRedirect } from "@/components/RecoveryRedirect";

export const metadata: Metadata = {
  title: "Espace Client DURANEL",
  description: "Cours du jour, cotations DURANEL, actualités et contact.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DURANEL",
  },
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <RecoveryRedirect />
        <div id="app">{children}</div>
      </body>
    </html>
  );
}
