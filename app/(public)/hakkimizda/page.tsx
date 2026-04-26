'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/data/mock';

// ─── Team ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Ahmet Yılmaz',
    title: 'Kurucu Kaptan',
    avatar: 'https://i.pravatar.cc/200?u=ahmet-yilmaz',
  },
  {
    name: 'Selin Karaca',
    title: 'Operasyon Müdürü',
    avatar: 'https://i.pravatar.cc/200?u=selin-karaca',
  },
  {
    name: 'Emre Demir',
    title: 'Misafir İlişkileri',
    avatar: 'https://i.pravatar.cc/200?u=emre-demir',
  },
];

// ─── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: '⚓',
    title: 'Güvenlik',
    desc: 'Tüm teknelerimiz periyodik bakım ve sertifikasyon süreçlerinden geçer. Misafirlerimizin güvenliği her şeyin önündedir.',
  },
  {
    icon: '🛋️',
    title: 'Konfor',
    desc: 'Klima, jeneratör ve modern mutfak ekipmanlarıyla donatılmış teknelerimizde otel konforunu denizde yaşayın.',
  },
  {
    icon: '🌿',
    title: 'Sürdürülebilirlik',
    desc: 'Solar paneller, su tasarrufu ve çevre dostu uygulamalarla Ege ve Akdeniz\'in berrak sularını gelecek nesillere aktarıyoruz.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HakkimizdaPage() {
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
          Hakkımızda
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          Denizin Özgürlüğünü Yaşatıyoruz
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          {BRAND.sub}
        </p>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: 'var(--teal)', padding: '40px 24px' }}>
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 8,
            textAlign: 'center',
          }}
        >
          {BRAND.stats.map((s) => (
            <div key={s.label} style={{ padding: '12px 8px' }}>
              <p style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Text */}
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--teal)',
                marginBottom: 12,
              }}
            >
              Hikayemiz
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2 }}>
              2018&apos;den Bu Yana Ege ve Akdeniz&apos;de
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--warm)', margin: '0 0 16px' }}>
              Nonno Blue, Ege ve Akdeniz&apos;in büyüsüne tutku besleyen bir kaptan
              tarafından 2018 yılında kuruldu. Göcek&apos;in sakin koylarında başlayan
              bu yolculuk; yıllar içinde büyüyen bir filo, genişleyen bir rota ağı
              ve binlerce mutlu misafirle bugünkü halini aldı.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--warm)', margin: 0 }}>
              Ege&apos;nin rüzgarı, Akdeniz&apos;in rengi ve Türk misafirperverliği —
              bunların hepsini tek bir çatı altında sunmak için varız. Her rezervasyon
              bir başlangıç; her yolculuk ise ömür boyu sürecek bir anı.
            </p>
          </div>

          {/* Image */}
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '4/3',
              minHeight: 280,
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
              alt="Ege koylarında tekne"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ background: 'var(--mist)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 800,
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            Ekibimiz
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--warm)', margin: '0 0 48px', fontSize: '1rem' }}>
            Deneyimli ve tutkulu insanlar
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 28,
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  padding: '36px 28px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 16px',
                    position: 'relative',
                    border: '3px solid var(--teal)',
                  }}
                >
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="88px"
                  />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0 0 4px', color: 'var(--ink)' }}>
                  {member.name}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--teal)', margin: 0, fontWeight: 600 }}>
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 24px' }}>
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          Değerlerimiz
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--warm)', margin: '0 0 48px', fontSize: '1rem' }}>
          Bizi biz yapan prensipler
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {VALUES.map((v) => (
            <div
              key={v.title}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '32px 28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)' }}>
                {v.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--warm)', lineHeight: 1.7, margin: 0 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section
        style={{
          background: 'var(--deep)',
          color: '#fff',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 32px' }}>
            Bize Ulaşın
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 600, marginRight: 8 }}>E-posta:</span>
              <Link href={`mailto:${BRAND.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {BRAND.email}
              </Link>
            </p>
            <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 600, marginRight: 8 }}>Telefon:</span>
              <Link href={`tel:${BRAND.phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {BRAND.phone}
              </Link>
            </p>
            <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 600, marginRight: 8 }}>Adres:</span>
              {BRAND.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
