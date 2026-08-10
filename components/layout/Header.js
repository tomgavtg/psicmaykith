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
          <Link href="/#agendar">Agendar</Link>
        </nav>

        <Link className="button button-primary header-cta" href="/#agendar">
          Reservar
        </Link>
      </div>
    </header>
  );
}
