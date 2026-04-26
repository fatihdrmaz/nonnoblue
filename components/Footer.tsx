import Link from 'next/link';
import { Logo } from './Logo';

const filoLinks = [
  { href: '/filo', label: 'Tüm Tekneler' },
  { href: '/filo?type=gulet', label: 'Gületler' },
  { href: '/filo?type=motorlu', label: 'Motor Yatlar' },
  { href: '/rotalar', label: 'Popüler Rotalar' },
  { href: '/hizmetler', label: 'Kiralama Hizmetleri' },
];

const kurumsal = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/kariyer', label: 'Kariyer' },
  { href: '/kvkk', label: 'KVKK' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
  { href: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
];

const iletisimLinks = [
  { href: '/iletisim', label: 'İletişim Formu' },
  { href: '/rezervasyon', label: 'Rezervasyon Talebi' },
  { href: 'tel:+905XXXXXXXXX', label: '+90 5XX XXX XX XX' },
  { href: 'mailto:info@nonnoblue.com', label: 'info@nonnoblue.com' },
];

export function Footer() {
  return (
    <footer className="bg-[var(--deep)] text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Logo invert height={32} />
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Göcek ve Fethiye çıkışlı tekne kiralama. Ege ve Akdeniz&apos;in en
              güzel koylularında unutulmaz bir deneyim için buradayız.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/nonnoblue"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/nonnoblue"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/905XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Filo & Rotalar */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              Filo &amp; Rotalar
            </h3>
            <ul className="flex flex-col gap-2">
              {filoLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              Kurumsal
            </h3>
            <ul className="flex flex-col gap-2">
              {kurumsal.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              İletişim
            </h3>
            <ul className="flex flex-col gap-2">
              {iletisimLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <address className="mt-4 not-italic text-sm text-white/40 leading-relaxed">
              Göcek Marina, Fethiye
              <br />
              Muğla, Türkiye
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} NonnoBlue. Tüm hakları saklıdır.
            </p>

            <div className="flex items-center gap-4 text-xs text-white/30">
              <Link href="/kvkk" className="transition-colors hover:text-white/60">
                KVKK
              </Link>
              <Link href="/gizlilik" className="transition-colors hover:text-white/60">
                Gizlilik
              </Link>
              <Link href="/kullanim-kosullari" className="transition-colors hover:text-white/60">
                Kullanım Koşulları
              </Link>

              {/* Hidden admin shortcut */}
              <Link
                href="/admin"
                className="opacity-0 hover:opacity-20 transition-opacity select-none"
                tabIndex={-1}
                aria-hidden="true"
              >
                &copy;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
