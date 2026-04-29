'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/data/mock';

const DIFFICULTY_EN: Record<string, string> = {
  'Kolay': 'Easy',
  'Orta': 'Moderate',
  'Zor': 'Challenging',
};

function localizeDifficulty(d: string, locale: string) {
  return locale === 'en' ? (DIFFICULTY_EN[d] ?? d) : d;
}

interface Route {
  id: string;
  title: string;
  days: number;
  difficulty: string;
  description: string;
  title_en: string | null;
  description_en: string | null;
  highlights: string[];
  img_url: string;
}

function toPublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/route-photos/${path}`;
}

function normalizeMockRoute(r: typeof ROUTES[0]): Route {
  return {
    id: r.id,
    title: r.title,
    days: r.days,
    difficulty: r.difficulty,
    description: r.desc,
    title_en: null,
    description_en: null,
    highlights: r.highlights,
    img_url: r.img,
  };
}

export default function RotalarPage() {
  const t = useTranslations('routes');
  const locale = useLocale();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('routes')
      .select('id,title,days,difficulty,description,title_en,description_en,highlights,img_url')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setRoutes(data as Route[]);
        } else {
          setRoutes(ROUTES.map(normalizeMockRoute));
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>
            <Link href="/" style={{ color: 'inherit' }}>{t('home')}</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.9)' }}>{t('title')}</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>{t('eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 720, lineHeight: 1.15 }}>
            {t('page_title')}
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 560, lineHeight: 1.7 }}>
            {t('page_subtitle')}
          </p>
        </div>
      </div>

      {/* Routes Grid */}
      <section className="nb-section">
        <div className="container">
          {loading ? (
            <div className="nb-routes">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="nb-route" style={{ background: 'var(--mist)', opacity: 0.4 }} />
              ))}
            </div>
          ) : (
            <div className="nb-routes">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} t={t} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="nb-cta">
        <div className="nb-cta-inner">
          <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 16 }}>{t('custom_route')}</div>
          <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            {t('custom_route_title')}
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, marginBottom: 36, maxWidth: 520 }}>
            {t('custom_route_sub')}
          </p>
          <Link href="/iletisim" className="btn btn-white btn-lg">
            {t('contact_us')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

function RouteCard({ route, t, locale }: { route: Route; t: ReturnType<typeof useTranslations<'routes'>>; locale: string }) {
  return (
    <Link href={`/rotalar/${route.id}`} className="nb-route">
      {route.img_url && <Image
        src={toPublicUrl(route.img_url)}
        alt={locale === 'en' && route.title_en ? route.title_en : route.title}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 800px) 100vw, 50vw"
      />}
      <div className="nb-route-body">
        <div className="nb-route-chips">
          <span>{route.days} {t('day')}</span>
          <span>{localizeDifficulty(route.difficulty, locale)}</span>
        </div>
        <h3>{locale === 'en' && route.title_en ? route.title_en : route.title}</h3>
        <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {locale === 'en' && route.description_en ? route.description_en : route.description}
        </p>
        {route.highlights?.length > 0 && (
          <div className="nb-route-highlights">
            {route.highlights.slice(0, 4).map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
