'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="nb-footer">
      <div className="container nb-footer-grid">
        <div>
          <div style={{ marginBottom: 20, display: 'inline-block' }}>
            <Logo invert height={36} />
          </div>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 14, maxWidth: 320, lineHeight: 1.7 }}>
            {t('tagline')}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <a className="nb-social" href="https://instagram.com/nonnoblue" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a className="nb-social" href="#" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a className="nb-social" href="https://wa.me/905394403429" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="nb-footer-h">{t('explore')}</div>
          <Link href="/filo">{t('fleet')}</Link>
          <Link href="/rotalar">{t('routes')}</Link>
          <Link href="/hizmetler">{t('charter_types')}</Link>
          <Link href="/hakkimizda">{t('about')}</Link>
          <Link href="/blog">{t('faq')}</Link>
        </div>

        <div>
          <div className="nb-footer-h">{t('help')}</div>
          <Link href="/sss">{t('faq')}</Link>
          <Link href="/iptal-politikasi">{t('cancel_policy')}</Link>
          <Link href="/sozlesme">{t('rental_contract')}</Link>
          <Link href="/kvkk">{t('kvkk')}</Link>
          <Link href="/gizlilik">{t('cookie_policy')}</Link>
        </div>

        <div>
          <div className="nb-footer-h">{t('contact')}</div>
          <a href="tel:+905394403429">+90 539 440 34 29</a>
          <a href="mailto:booking@nonnoblue.com">booking@nonnoblue.com</a>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
            Göcek Mh. Çarşı Yolu Cd.<br />
            Okaliptus İş Merkezi No:10<br />
            Fethiye / Muğla
          </p>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, marginTop: 8 }}>
            Hafta içi 09:00 – 17:00 · Pazar kapalı
          </p>
        </div>
      </div>

      <div className="container nb-footer-bot">
        <span>{t('copyright')}</span>
        <span>Göcek · Fethiye · Muğla</span>
      </div>
    </footer>
  );
}
