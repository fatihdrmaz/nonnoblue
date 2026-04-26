'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDarkMode(saved === 'dark');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü açıkken body scroll'u engelle
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleDark = () => {
    const next = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'bg-[var(--deep)]/95 backdrop-blur-md shadow-sm',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Logo invert={!isTransparent ? true : false} height={30} />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      isTransparent
                        ? active
                          ? 'text-white underline underline-offset-4'
                          : 'text-white/80 hover:text-white'
                        : active
                          ? 'text-[var(--sky)] underline underline-offset-4'
                          : 'text-white/70 hover:text-white',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Tema değiştir"
              className={cn(
                'rounded-full p-1.5 transition-colors',
                isTransparent
                  ? 'text-white/70 hover:bg-white/10 hover:text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
              )}
            >
              {darkMode ? (
                /* Sun icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                /* Moon icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              )}
            </button>

            {/* CTA */}
            <Link
              href="/rezervasyon"
              className="rounded-full bg-[#e8654a] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#d4533a] active:bg-[#c04530]"
            >
              Rezerve Et
            </Link>
          </div>

          {/* Mobile: dark toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDark}
              aria-label="Tema değiştir"
              className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              className="rounded-md p-1.5 text-white transition-colors hover:bg-white/10"
            >
              {menuOpen ? (
                /* X icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-[var(--deep)] transition-transform duration-300 ease-in-out md:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Spacer for header height */}
        <div className="h-16 shrink-0" />

        <nav className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'w-full rounded-xl px-6 py-4 text-center text-xl font-semibold tracking-wide transition-colors',
                  active
                    ? 'bg-white/10 text-[var(--sky)]'
                    : 'text-white/80 hover:bg-white/5 hover:text-white',
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="mt-6 w-full">
            <Link
              href="/rezervasyon"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-full bg-[#e8654a] px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-[#d4533a]"
            >
              Rezerve Et
            </Link>
          </div>
        </nav>

        <p className="pb-8 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} NonnoBlue
        </p>
      </div>

      {/* Overlay — close on tap outside */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
