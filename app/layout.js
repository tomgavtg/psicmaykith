import "./globals.css";
import { getSiteUrl } from "../lib/config/site-url";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Psic. Mayumi Kitahara | Psicoterapia en línea",
    template: "%s | Psic. Mayumi Kitahara",
  },
  description:
    "Información profesional y medios de contacto para solicitar disponibilidad de atención psicológica.",
  robots:
    process.env.SITE_MODE === "production" &&
    process.env.CONTENT_APPROVED === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
