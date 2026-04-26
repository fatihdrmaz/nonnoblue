'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CHARTER_TYPES } from '@/data/mock';

// ─── Additional Services ───────────────────────────────────────────────────────

const EXTRA_SERVICES = [
  { icon: '🛥️', name: 'Kaptan Temini', price: 'Günlük 150€' },
  { icon: '👩', name: 'Hostes Hizmeti', price: 'Günlük 120€' },
  { icon: '🍽️', name: 'Şef Hizmeti', price: 'Günlük 200€' },
  { icon: '🤿', name: 'Dalış Ekipmanı', price: 'Haftalık 80€' },
  { icon: '🚌', name: 'Transfer', price: "50€'dan başlayan" },
  { icon: '🛒', name: 'Provizyon', price: 'Pazarlık' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HizmetlerPage() {
  return (
    <main style={{ fontFamily: 'inherit', color: 'var(--ink)' }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '96px 24px 80px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
            marginBottom: 16,
          }}
        >
          Hizmetlerimiz
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          Charter Seçenekleri
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Her aile, her grup, her bütçe için özelleştirilmiş tekne tatili
          deneyimleri. Bareboat&apos;tan tam hizmetli chartere kadar en uygun
          seçeneği birlikte belirleyelim.
        </p>
      </section>

      {/* ── Charter Types ── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}
        >
          {CHARTER_TYPES.map((ct) => (
            <article
              key={ct.id}
              style={{
                background: 'var(--card)',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: 260 }}>
                <Image
                  src={ct.img}
                  alt={ct.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Body */}
              <div style={{ padding: '28px 28px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
                  {ct.title}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--warm)', lineHeight: 1.65, margin: '0 0 20px' }}>
                  {ct.description}
                </p>

                {/* Highlights */}
                <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ct.highlights.map((h) => (
                    <li key={h} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--ink)' }}>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'var(--teal)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/iletisim"
                  style={{
                    display: 'inline-block',
                    marginTop: 'auto',
                    background: 'var(--teal)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Fiyat Al
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Additional Services ── */}
      <section
        style={{
          background: 'var(--mist)',
          padding: '72px 24px',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 800,
              textAlign: 'center',
              margin: '0 0 12px',
              color: 'var(--ink)',
            }}
          >
            Ek Hizmetler
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--warm)',
              fontSize: '1rem',
              margin: '0 0 48px',
            }}
          >
            Tatilinizi eksiksiz kılacak isteğe bağlı hizmetler
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {EXTRA_SERVICES.map((svc) => (
              <div
                key={svc.name}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <span style={{ fontSize: 32, flexShrink: 0 }}>{svc.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 4px', color: 'var(--ink)' }}>
                    {svc.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--teal)', margin: 0, fontWeight: 600 }}>
                    {svc.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section
        style={{
          background: 'var(--teal)',
          padding: '72px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 24px',
          }}
        >
          Hayalinizdeki Tekne Tatiline Başlayın
        </h2>
        <Link
          href="/iletisim"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: 'var(--teal)',
            padding: '16px 40px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
          }}
        >
          Ücretsiz Teklif Al
        </Link>
      </section>
    </main>
  );
}
