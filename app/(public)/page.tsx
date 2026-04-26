'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NB_DATA } from '@/data/mock';
import { BoatCard } from '@/components/BoatCard';
import { SectionTitle } from '@/components/SectionTitle';

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

function HeroSection() {
  const slides = NB_DATA.heroSlides ?? [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[active] ?? {
    img: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1800&q=80',
    eyebrow: 'Ege & Akdeniz',
    title: 'Denizi hisset,\nsıfır stresle.',
    sub: 'Ailece çıktığınız her yelken yolculuğu bir ömür boyu anı bırakır.',
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'max(100vh, 860px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Background slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 1.2s ease',
            opacity: i === active ? 1 : 0,
          }}
        >
          <Image
            src={slide.img}
            alt={slide.title ?? 'NonnoBlue hero'}
            fill
            priority={i === 0}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(42,48,54,.75) 0%, rgba(42,48,54,.35) 40%, rgba(42,48,54,.55) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          paddingTop: 120,
          paddingBottom: 200,
        }}
      >
        <p
          className="eyebrow"
          style={{ color: 'var(--sky)', marginBottom: 16 }}
        >
          {current.eyebrow}
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(48px, 7vw, 92px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#fff',
            whiteSpace: 'pre-line',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 720,
          }}
        >
          {current.title}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#fff',
            opacity: 0.9,
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 48,
          }}
        >
          {current.sub}
        </p>

        {/* Search bar */}
        <div
          style={{
            background: 'rgba(255,255,255,.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,.2)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            maxWidth: 860,
          }}
        >
          <HeroField label="Tekne Tipi">
            <select style={selectStyle}>
              <option>Tümü</option>
              <option>Katamaran</option>
              <option>Yelkenli</option>
              <option>Motor Yat</option>
            </select>
          </HeroField>
          <HeroField label="Lokasyon">
            <select style={selectStyle}>
              <option>Göcek Marina</option>
              <option>D-Marin Turgutreis</option>
            </select>
          </HeroField>
          <HeroField label="Tarih">
            <input type="date" style={selectStyle} />
          </HeroField>
          <HeroField label="Kişi Sayısı">
            <select style={selectStyle}>
              <option>4</option>
              <option>6</option>
              <option>8</option>
              <option>10</option>
            </select>
          </HeroField>
          <div style={{ flex: '1 1 140px' }}>
            <Link
              href="/filo"
              style={{
                display: 'block',
                background: '#fff',
                color: 'var(--ink)',
                padding: '16px 24px',
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 15,
                textAlign: 'center',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Ara
            </Link>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            right: 40,
            bottom: 128,
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            zIndex: 3,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? 60 : 40,
                height: 4,
                borderRadius: 2,
                border: 'none',
                background: i === active ? '#fff' : 'rgba(255,255,255,.4)',
                cursor: 'pointer',
                transition: 'all .4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Keşfet indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#fff',
            opacity: 0.7,
          }}
        >
          Keşfet
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background: 'rgba(255,255,255,.5)',
          }}
        />
      </div>
    </section>
  );
}

const selectStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  cursor: 'pointer',
  width: '100%',
};

function HeroField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ flex: '1 1 140px', minWidth: 120 }}>
      <p
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,.6)',
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------

const stats = [
  { num: '4', label: 'Katamaran · Filo' },
  { num: '6+', label: 'Yıllık tecrübe' },
  { num: '240+', label: 'Mutlu misafir' },
  { num: '4.9', label: 'Ortalama puan' },
];

function StatsStrip() {
  return (
    <section
      style={{
        background: 'var(--deep)',
        color: '#fff',
        padding: '40px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}
      >
        {stats.map((s) => (
          <div key={s.num} style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {s.num}
            </p>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FLEET
// ---------------------------------------------------------------------------

function FleetSection() {
  return (
    <section className="nb-section">
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Filomuz
            </p>
            <h2
              className="display"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}
            >
              Aile ruhuyla kürüsyonlanmış tekneler
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
              Her teknemiz düzenli bakım görür, kaptan seçimimiz titizlikle
              yapılır. Güvenli, konforlu ve unutulmaz bir deniz tatili için
              hazır.
            </p>
          </div>
          <Link href="/filo" className="btn btn-ghost">
            Tüm filoyu görüntüle →
          </Link>
        </div>

        {/* Grid */}
        <div className="nb-fleet-grid">
          {(NB_DATA.boats ?? []).map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WHY US
// ---------------------------------------------------------------------------

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: 'Rota tasarımı',
    desc: 'Her ailenin ritmine ve ilgi alanına özel güzergah planlaması yapıyoruz.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="22" x2="12" y2="8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
    ),
    title: 'Şeffaf fiyat',
    desc: 'Gizli maliyet yok. Teklifte yazan fiyat, ödediğiniz fiyattır.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Aile gibi hizmet',
    desc: '6 yıldır aynı ekip. Sizi tanıyan, tercihlerinizi hatırlayan bir ağırlama anlayışı.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
    title: 'İki marina',
    desc: 'Göcek ve D-Marin Turgutreis bazlı operasyon — Ege ve Akdeniz\'in en iyi koyları kapıda.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Premium filo',
    desc: 'Tüm tekneler A sınıfı donanımlı; klima, watermaker, chart plotter ve daha fazlası.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: '4 dilde destek',
    desc: 'Türkçe, İngilizce, Almanca ve Rusça — nerede olursanız olun size ulaşıyoruz.',
  },
];

function WhyUsSection() {
  return (
    <section className="nb-section-tight nb-section-foam">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <SectionTitle
          eyebrow="Neden NonnoBlue"
          title="Aile ruhuyla, denizci titizliğiyle"
          sub="Her detay, denizde rahat etmeniz için düşünüldü. Tekneden kaptana, rotadan yemeğe kadar."
          align="center"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 48,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)',
        border: `1px solid ${hovered ? 'var(--teal)' : 'var(--line)'}`,
        borderRadius: 16,
        padding: '28px 24px',
        transition: 'transform .25s ease, border-color .25s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'default',
      }}
    >
      <div
        style={{ color: 'var(--teal)', marginBottom: 16 }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
        {desc}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------

function RoutesSection() {
  const routes = NB_DATA.routes ?? [];

  return (
    <section className="nb-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Rotalar
            </p>
            <h2
              className="display"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}
            >
              Koy koy Türk Rivierası
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
              Göcek koylarından Ölüdeniz&apos;e, Bodrum&apos;dan Marmaris&apos;e
              uzanan rotalar — her biri bizzat kaptanlarımız tarafından
              tasarlandı.
            </p>
          </div>
          <Link href="/rotalar" className="btn btn-ghost">
            Tüm rotalar →
          </Link>
        </div>

        {/* 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteCard({ route }: { route: NonnoRoute }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '4/5',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <Image
        src={route.img}
        alt={route.title}
        fill
        style={{
          objectFit: 'cover',
          transition: 'transform .6s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(20,30,40,.85) 0%, rgba(20,30,40,0) 55%)',
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top chips */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip>{route.days} gün</Chip>
          <Chip>{route.difficulty}</Chip>
        </div>
        {/* Bottom info */}
        <div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            {route.title}
          </h3>
          <p
            style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', marginBottom: 12 }}
          >
            {route.desc}
          </p>
          {/* Highlight tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(route.highlights ?? []).map((tag: string) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,.75)',
                  background: 'rgba(255,255,255,.12)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: 20,
                  padding: '3px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#fff',
        background: 'rgba(255,255,255,.18)',
        border: '1px solid rgba(255,255,255,.25)',
        borderRadius: 20,
        padding: '4px 12px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CHARTER TYPES
// ---------------------------------------------------------------------------

const charterTypes = [
  {
    num: '01',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="22" x2="12" y2="8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
    ),
    tagline: 'Sen kaptansın',
    title: 'Bareboat',
    desc: 'Geçerli yeterliliğinizle tekneyi kendiniz kullanırsınız. Tam özgürlük, tam sorumluluk.',
    price: 'kişi başı €4.200den',
    cta: 'İncele',
    featured: false,
  },
  {
    num: '02',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    tagline: 'En çok tercih edilen',
    title: 'Skippered',
    desc: 'Deneyimli kaptanımız tekneyi sürer, siz sadece dinlenir ve keyfini çıkarırsınız.',
    price: 'kişi başı €6.800den',
    cta: 'Rezervasyon Yap',
    featured: true,
  },
  {
    num: '03',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    tagline: 'Tam otel konforu',
    title: 'Crewed',
    desc: 'Kaptan + hostes ekibi dahil. Yemekler, temizlik, transfer — her şey hazır.',
    price: 'kişi başı €9.500den',
    cta: 'Teklif Al',
    featured: false,
  },
];

function CharterTypesSection() {
  return (
    <section
      className="nb-charter-section"
      style={{
        background: 'var(--deep)',
        color: '#fff',
        padding: '80px 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <SectionTitle
          eyebrow="Kiralama tipleri"
          title="Siz nasıl bir kaptan olmak istersiniz?"
          align="center"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 48,
          }}
        >
          {charterTypes.map((ct) => (
            <CharterCard key={ct.num} {...ct} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CharterCard({
  num,
  icon,
  tagline,
  title,
  desc,
  price,
  cta,
  featured,
}: (typeof charterTypes)[0]) {
  return (
    <div
      style={{
        background: featured
          ? 'rgba(141,199,220,.12)'
          : 'rgba(255,255,255,.05)',
        border: featured
          ? '1px solid rgba(141,199,220,.35)'
          : '1px solid rgba(255,255,255,.1)',
        borderRadius: 20,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
      }}
    >
      {featured && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--sky)',
            color: 'var(--ink)',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 14px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          En popüler
        </span>
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--sky)',
          letterSpacing: '0.08em',
        }}
      >
        {num}
      </span>
      <div style={{ color: 'var(--sky)' }}>{icon}</div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {tagline}
      </p>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26,
          fontWeight: 700,
          color: '#fff',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.65 }}>
        {desc}
      </p>
      <p style={{ fontSize: 13, color: 'var(--sky)', fontWeight: 600, marginTop: 'auto' }}>
        {price}
      </p>
      <Link
        href="/filo"
        style={{
          display: 'block',
          textAlign: 'center',
          background: featured ? 'var(--sky)' : 'transparent',
          color: featured ? 'var(--ink)' : '#fff',
          border: featured ? 'none' : '1px solid rgba(255,255,255,.3)',
          borderRadius: 12,
          padding: '12px 20px',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity .2s',
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------

function TestimonialsSection() {
  const testimonials = NB_DATA.testimonials ?? [];

  return (
    <section className="nb-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <SectionTitle
          eyebrow="Referanslar"
          title="240 aile, 6 yıl, tek söz"
          align="center"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 48,
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: NonnoTestimonial }) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* 5 stars */}
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="var(--teal)"
            stroke="none"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <p
        style={{
          fontSize: 15,
          color: 'var(--ink)',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
        {testimonial.avatar && (
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={44}
            height={44}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        {!testimonial.avatar && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {testimonial.name?.[0] ?? '?'}
          </div>
        )}
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
            {testimonial.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{testimonial.trip}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CTA BAND
// ---------------------------------------------------------------------------

function CtaBand() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--deep) 0%, #1a4a7a 100%)',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 680 }}>
        <p
          className="eyebrow"
          style={{ color: 'var(--sky)', marginBottom: 16 }}
        >
          2026 yaz fırsatları
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          Erken rezervasyon %30 indirimli
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.8)', marginBottom: 36, lineHeight: 1.65 }}>
          Nisan sonuna kadar booking yapan misafirlere özel. Sınırlı sayıda.
        </p>
        <Link href="/filo" className="btn btn-white btn-lg">
          Müsaitlik Sorgula →
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BLOG TEASER
// ---------------------------------------------------------------------------

function BlogTeaserSection() {
  const posts = NB_DATA.blog ?? [];

  return (
    <section className="nb-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Günlük
            </p>
            <h2
              className="display"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Güncel yazılar
            </h2>
          </div>
          <Link href="/blog" className="btn btn-ghost">
            Tüm yazılar →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
          }}
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: NonnoBlogPost }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform .25s ease',
          transform: hovered ? 'translateY(-4px)' : 'none',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            overflow: 'hidden',
          }}
        >
          <Image
            src={post.img}
            alt={post.title}
            fill
            style={{
              objectFit: 'cover',
              transition: 'transform .5s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        </div>
        {/* Text */}
        <div style={{ padding: '20px 20px 24px' }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.date}</span>
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--ink)',
              lineHeight: 1.4,
              marginBottom: 10,
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              fontSize: 14,
              color: 'var(--muted)',
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// NEWSLETTER
// ---------------------------------------------------------------------------

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section
      style={{
        background: 'var(--ink)',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 16 }}>
          Bülten
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          Sezon fırsatlarından ilk siz haberdar olun
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.65)', marginBottom: 36, lineHeight: 1.65 }}>
          Ayda bir, seyahat rehberleri ve özel kampanyalar. Spam yok.
        </p>

        {submitted ? (
          <p style={{ color: 'var(--sky)', fontSize: 16, fontWeight: 600 }}>
            Teşekkürler! Bültene kaydoldunuz.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-posta adresiniz"
              style={{
                flex: '1 1 260px',
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 12,
                padding: '14px 18px',
                color: '#fff',
                fontSize: 15,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--sky)',
                color: 'var(--ink)',
                border: 'none',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Abone ol
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TYPE HELPERS (minimal — real types live in @/types)
// ---------------------------------------------------------------------------

interface NonnoRoute {
  id: string | number;
  img: string;
  title: string;
  desc: string;
  days: number | string;
  difficulty: string;
  highlights?: string[];
}

interface NonnoTestimonial {
  text: string;
  name: string;
  trip: string;
  rating?: number;
  avatar?: string;
}

interface NonnoBlogPost {
  id: string | number;
  slug: string;
  img: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <FleetSection />
      <WhyUsSection />
      <RoutesSection />
      <CharterTypesSection />
      <TestimonialsSection />
      <CtaBand />
      <BlogTeaserSection />
      <NewsletterSection />
    </>
  );
}
