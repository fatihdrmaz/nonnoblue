'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function toPublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/boat-photos/${path}`;
}

interface Route {
  id: string;
  title: string;
  days: number;
  difficulty: string;
  description: string;
  highlights: string[];
  img_url: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

interface Boat {
  id: string;
  slug: string;
  name: string;
  type: string;
  marina: string;
  features: string[];
  deposit_eur: number;
  cover_photo: string | null;
  price_from: number | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RotaDetayPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations('routes');
  const tCommon = useTranslations('common');

  const [route, setRoute] = useState<Route | null | undefined>(undefined);
  const [boats, setBoats] = useState<Boat[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()
      .then(({ data }) => {
        setRoute(data ?? null);
      });

    supabase
      .from('boats')
      .select(`
        *,
        cover_photo:boat_photos(storage_path),
        price_from:boat_pricing(weekly_price_eur)
      `)
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const normalised: Boat[] = data.map((b: any) => ({
          ...b,
          cover_photo: Array.isArray(b.cover_photo) && b.cover_photo.length > 0
            ? b.cover_photo[0].storage_path
            : null,
          price_from: Array.isArray(b.price_from) && b.price_from.length > 0
            ? Math.min(...b.price_from.map((p: any) => p.weekly_price_eur))
            : null,
        }));
        setBoats(normalised);
      });
  }, [id]);

  // Still loading
  if (route === undefined) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: 0.4, fontSize: 15 }}>{tCommon('loading')}</div>
      </div>
    );
  }

  if (route === null) notFound();

  return (
    <>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 520,
          overflow: 'hidden',
        }}
      >
        <Image
          src={route.img_url}
          alt={route.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,31,61,.85) 0%, rgba(10,31,61,.3) 60%, transparent 100%)',
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '48px 0 52px',
            color: '#fff',
          }}
        >
          <div className="container">
            <div className="breadcrumb" style={{ color: 'rgba(255,255,255,.65)', marginBottom: 14 }}>
              <Link href="/" style={{ color: 'inherit' }}>{t('home')}</Link>
              <span>/</span>
              <Link href="/rotalar" style={{ color: 'inherit' }}>{t('title')}</Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,.9)' }}>{route.title}</span>
            </div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('detail_eyebrow')}</div>
            <h1
              style={{
                fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                fontSize: 'clamp(30px,4.5vw,56px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 20,
                maxWidth: 780,
                lineHeight: 1.15,
              }}
            >
              {route.title}
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(255,255,255,.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,.25)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '7px 16px',
                  borderRadius: 20,
                }}
              >
                {route.days} {t('day')}
              </span>
              <span
                style={{
                  background: 'var(--teal)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '7px 16px',
                  borderRadius: 20,
                  letterSpacing: '0.05em',
                }}
              >
                {route.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: 64,
              alignItems: 'start',
            }}
            className="nb-rota-detail-grid"
          >
            {/* LEFT — Description + Highlights */}
            <div>
              {/* Description */}
              <div style={{ marginBottom: 56 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('about_route')}</div>
                <h2
                  style={{
                    fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                    fontSize: 'clamp(24px,2.8vw,36px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {route.days} {t('sea_adventure')}
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: 'var(--muted)',
                    maxWidth: 640,
                  }}
                >
                  {route.description}
                </p>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: 56 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>{t('highlights_label')}</div>
                <h3
                  style={{
                    fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 28,
                    color: 'var(--ink)',
                  }}
                >
                  {t('what_awaits')}
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                  }}
                  className="nb-highlights-grid"
                >
                  {route.highlights.map((h) => (
                    <div
                      key={h}
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius)',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'var(--foam)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 1,
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          lineHeight: 1.4,
                        }}
                      >
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route info stats */}
              <div
                style={{
                  background: 'var(--foam)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 36px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                  marginBottom: 56,
                  border: '1px solid var(--mist)',
                }}
                className="nb-route-stats"
              >
                {[
                  { label: t('duration_label'), value: `${route.days} ${t('day')}` },
                  { label: t('difficulty_label'), value: route.difficulty },
                  { label: t('stops'), value: `${route.highlights.length} ${t('stops_count')}` },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: 'var(--deep)',
                        fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                        marginBottom: 6,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--muted)',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — CTA card */}
            <div>
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  position: 'sticky',
                  top: 100,
                }}
              >
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('book_route')}</div>
                <h3
                  style={{
                    fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: 16,
                    lineHeight: 1.3,
                  }}
                >
                  {route.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 24,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      background: 'var(--foam)',
                      color: 'var(--teal)',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 8,
                    }}
                  >
                    {route.days} {t('day')}
                  </span>
                  <span
                    style={{
                      background: 'var(--foam)',
                      color: 'var(--teal)',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: 8,
                    }}
                  >
                    {route.difficulty}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: 'var(--muted)',
                    lineHeight: 1.65,
                    marginBottom: 28,
                  }}
                >
                  Teknelerimizden birini seçerek bu rotayı hemen rezerve edebilir ya da önce bizimle iletişime geçebilirsiniz.
                </div>

                <Link
                  href="/rezervasyon"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 12, display: 'flex' }}
                >
                  {t('book_now')}
                </Link>

                <Link
                  href="/iletisim"
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
                >
                  {t('get_info')}
                </Link>

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: '1px solid var(--line-2,rgba(11,42,80,.07))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    t('free_consulting'),
                    t('flexible_dates'),
                    t('personalization'),
                  ].map((note) => (
                    <div
                      key={note}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        color: 'var(--muted)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suitable Boats Section */}
      <section style={{ background: 'var(--sand)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{t('boat_selection')}</div>
            <h2
              style={{
                fontFamily: 'var(--f-serif,"Playfair Display",serif)',
                fontSize: 'clamp(26px,3vw,38px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                marginBottom: 12,
              }}
            >
              {t('suitable_boats')}
            </h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 500 }}>
              {t('suitable_boats_sub')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
            className="nb-rota-boats-grid"
          >
            {boats.map((boat) => (
              <Link
                key={boat.slug}
                href={`/filo/${boat.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--card)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                className="nb-rota-boat-card"
              >
                <div style={{ position: 'relative', height: 160 }}>
                  {boat.cover_photo ? (
                    <Image
                      src={toPublicUrl(boat.cover_photo)}
                      alt={boat.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'var(--foam)',
                      }}
                    />
                  )}
                </div>
                <div style={{ padding: '16px 18px 20px' }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--muted)',
                      marginBottom: 5,
                    }}
                  >
                    {boat.type} · {boat.marina}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      marginBottom: 12,
                    }}
                  >
                    {boat.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--muted)',
                          display: 'block',
                          marginBottom: 2,
                        }}
                      >
                        {t('from_price')}
                      </span>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: 'var(--deep)',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {boat.price_from != null
                          ? `€${boat.price_from.toLocaleString('tr-TR')}`
                          : '—'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>/hafta</span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--teal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {t('view')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '80px 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>{t('ready')}</div>
          <h2
            style={{
              fontFamily: 'var(--f-serif,"Playfair Display",serif)',
              fontSize: 'clamp(28px,3.5vw,44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 18,
            }}
          >
            {t('book_cta')}
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, maxWidth: 480, marginInline: 'auto', marginBottom: 36 }}>
            {t('book_cta_sub')}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/rezervasyon"
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex' }}
            >
              {t('book_now_cta')}
            </Link>
            <Link
              href="/rotalar"
              className="btn btn-ghost btn-lg"
              style={{ display: 'inline-flex', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
            >
              {t('other_routes')}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .nb-rota-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          .nb-rota-boats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .nb-highlights-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .nb-route-stats {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .nb-rota-boats-grid {
            grid-template-columns: 1fr !important;
          }
          .nb-highlights-grid {
            grid-template-columns: 1fr !important;
          }
          .nb-route-stats {
            grid-template-columns: 1fr !important;
          }
        }
        .nb-rota-boat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </>
  );
}
