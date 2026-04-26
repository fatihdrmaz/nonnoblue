'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';

const navLinks = [
  { href: '/filo', label: 'Filo' },
  { href: '/rotalar', label: 'Rotalar' },
  { href: '/hizmetler', label: 'Kiralama' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header className="nb-nav" data-transparent={transparent ? 'true' : 'false'}>
        <div className="container nb-nav-inner">
          <Link href="/" className="nb-nav-logo" onClick={() => setMenuOpen(false)}>
            <Logo invert={transparent} height={32} />
          </Link>

          <nav className="nb-nav-links">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link key={href} href={href} className={active ? 'is-active' : ''}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="nb-nav-actions">
            <Link href="/giris" className="btn btn-ghost btn-sm">
              Giriş Yap
            </Link>
            <Link href="/filo" className="btn btn-primary btn-sm">
              Rezervasyon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <button className="nb-mobile" onClick={() => setMenuOpen(true)} aria-label="Menü">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="nb-mobile-panel" onClick={() => setMenuOpen(false)}>
          <div className="nb-mobile-inner" onClick={e => e.stopPropagation()}>
            <div className="nb-mobile-head">
              <Logo height={26} />
              <button onClick={() => setMenuOpen(false)} aria-label="Kapat">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/filo" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Rezervasyon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
