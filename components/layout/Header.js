import Link from "next/link";

export function Header({ name }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${name}, inicio`}>
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>{name}</span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/#sobre-mi">Inicio</Link>
          <Link href="/#servicios">Servicios</Link>
          <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link href="/#agendar">Agendar</Link>
        </nav>

        <Link className="button button-primary header-cta" href="/#agendar">
          Reservar
        </Link>

        <details className="mobile-navigation">
          <summary>Menú</summary>
          <nav aria-label="Navegación principal móvil">
            <Link href="/#sobre-mi">Inicio</Link>
            <Link href="/#servicios">Servicios</Link>
            <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
            <Link href="/#agendar">Agendar una cita</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
