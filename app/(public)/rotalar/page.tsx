'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

export default function RotalarPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('routes')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setRoutes(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Page Hero */}
      <div
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '140px 0 80px',
        }}
      >
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,.6)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Ana Sayfa</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.9)' }}>Rotalar</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Rotalar</div>
          <h1
            style={{
              fontFamily: 'var(--f-serif,"Playfair Display",serif)',
              fontSize: 'clamp(36px,5vw,64px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 20,
              maxWidth: 720,
              lineHeight: 1.15,
            }}
          >
            Ege ve Akdeniz&apos;in En Güzel Rotaları
          </h1>
          <p
            style={{
              fontSize: 18,
              opacity: 0.8,
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            Göcek&apos;ten Atina&apos;ya uzanan mavinin binbir tonu — her rota, kendi hikayesini taşıyor.
            Hayalinizdeki deniz yolculuğunu seçin, biz geri kalanını halledelim.
          </p>
        </div>
      </div>

      {/* Routes Grid */}
      <section style={{ padding: '80px 0 120px', background: 'var(--bg)' }}>
        <div className="container">
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 32,
              }}
              className="nb-routes-grid"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--card)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--line)',
                    height: 420,
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 32,
              }}
              className="nb-routes-grid"
            >
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '80px 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Özel Rota</div>
          <h2
            style={{
              fontFamily: 'var(--f-serif,"Playfair Display",serif)',
              fontSize: 'clamp(28px,3.5vw,44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Hayalinizdeki rotayı birlikte tasarlayalım
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, marginBottom: 36, maxWidth: 520, marginInline: 'auto' }}>
            Standart rotalarımızın dışına çıkmak ister misiniz? Ekibimiz size özel bir güzergah oluşturur.
          </p>
          <Link
            href="/iletisim"
            className="btn btn-white btn-lg"
            style={{ display: 'inline-flex' }}
          >
            Bizimle iletişime geçin →
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .nb-routes-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .nb-route-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .nb-route-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </>
  );
}

function RouteCard({ route }: { route: Route }) {
  return (
    <div
      className="nb-route-card"
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--line)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 240 }}>
        <Image
          src={route.img_url}
          alt={route.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Difficulty badge */}
        <span
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'var(--teal)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: 20,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {route.difficulty}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 26px 28px' }}>
        {/* Title + days */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--f-serif,"Playfair Display",serif)',
              fontSize: 'clamp(18px,1.8vw,22px)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              lineHeight: 1.25,
            }}
          >
            {route.title}
          </h2>
          <span
            style={{
              flexShrink: 0,
              background: 'var(--foam)',
              color: 'var(--teal)',
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}
          >
            {route.days} gün
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--muted)',
            marginBottom: 18,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {route.description}
        </p>

        {/* Highlights pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 22,
          }}
        >
          {route.highlights.slice(0, 4).map((h) => (
            <span
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--teal)',
                background: 'var(--foam)',
                border: '1px solid var(--mist)',
                borderRadius: 20,
                padding: '4px 10px',
                letterSpacing: '0.03em',
              }}
            >
              {h}
            </span>
          ))}
          {route.highlights.length > 4 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--muted)',
                padding: '4px 10px',
              }}
            >
              +{route.highlights.length - 4} daha
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/rotalar/${route.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--teal)',
            textDecoration: 'none',
            transition: 'gap 0.2s ease',
          }}
        >
          İncele
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
