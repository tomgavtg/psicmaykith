export function Header({ name }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#sobre-mi" aria-label={`${name}, inicio`}>
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>{name}</span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#sobre-mi">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#agendar">Agendar</a>
        </nav>

        <a className="button button-primary header-cta" href="#agendar">
          Reservar
        </a>
      </div>
    </header>
  );
}
