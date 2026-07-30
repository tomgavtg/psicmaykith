import { SanityStudio } from "../../../components/admin/SanityStudio";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administración de contenido",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

  if (!configured) {
    return (
      <main className="admin-setup">
        <div>
          <p className="section-kicker">Administración</p>
          <h1>Sanity todavía no está configurado</h1>
          <p>
            Define el proyecto, dataset y origen CORS de Sanity para habilitar el
            Studio en esta ruta. No incluyas secretos en variables públicas.
          </p>
          <Link className="button button-primary" href="/">
            Volver al sitio
          </Link>
        </div>
      </main>
    );
  }

  return <SanityStudio />;
}
