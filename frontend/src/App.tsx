import { useEffect, useState } from 'react';
import { PolicyList } from './components/PolicyList';
import './App.css';

const NAV_LINKS = [
  { label: 'Inicio', href: 'https://www.segurosbolivar.com/' },
  { label: 'Pólizas', href: 'https://www.segurosbolivar.com/seguros-para-personas' },
  { label: 'Clientes', href: 'https://registro.segurosbolivar.com/nidp/app/login' },
  { label: 'Contacto', href: 'https://www.segurosbolivar.com/canales-de-atencion' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="App">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>

      <header className={`app-navbar ${scrolled ? 'app-navbar--scrolled' : ''}`}>
        <div className="app-navbar__accent" aria-hidden="true" />
        <div className="container d-flex align-items-center justify-content-between">
          <a className="navbar-brand" href="/">
            <span className="brand-logo-wrap">
              <img src="/seguros_bolivar.jpg" alt="Seguros Bolívar" className="brand-logo" />
            </span>
            <span className="brand-copy">
              <span className="brand-text">Seguros Bolívar</span>
              <span className="brand-tagline">Portal de Gestión</span>
            </span>
          </a>

          <nav
            className="main-nav d-none d-lg-flex"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="main-nav__link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="d-none d-lg-flex align-items-center gap-3">
            <span className="user-badge">
              <span className="user-badge__dot" aria-hidden="true" />
              Sesión activa
            </span>
          </div>

          <button
            className={`menu-toggle d-lg-none ${menuOpen ? 'menu-toggle--open' : ''}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={`mobile-nav d-lg-none ${menuOpen ? 'mobile-nav--open' : ''}`}
          aria-label="Navegación móvil"
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav__link"
              style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {menuOpen && <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)} />}

      <main id="contenido-principal">
        <PolicyList />
      </main>
    </div>
  );
}

export default App;

