'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/data/mock';

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

const VALUES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Güvenlik',
    desc: 'Tüm teknelerimiz periyodik bakım ve sertifikasyon süreçlerinden geçer. Misafirlerimizin güvenliği her şeyin önündedir.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Konfor',
    desc: 'Klima, jeneratör ve modern mutfak ekipmanlarıyla donatılmış teknelerimizde otel konforunu denizde yaşayın.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Sürdürülebilirlik',
    desc: 'Solar paneller, su tasarrufu ve çevre dostu uygulamalarla Ege ve Akdeniz\'in berrak sularını gelecek nesillere aktarıyoruz.',
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Hakkımızda</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 720, lineHeight: 1.15 }}>
            Denizin Özgürlüğünü Yaşatıyoruz
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 560, lineHeight: 1.7 }}>
            {BRAND.sub}
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="nb-stats">
        <div className="container">
          <div className="nb-stats-grid">
            {BRAND.stats.map((s) => (
              <div key={s.label}>
                <div className="nb-stat-num">{s.value}</div>
                <div className="nb-stat-lab">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="nb-section">
        <div className="container-narrow">
          <div className="nb-story">
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Hikayemiz</div>
              <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.2 }}>
                2020&apos;den Bu Yana<br />Türk Rivierası&apos;nda
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 20 }}>
                Nonno Blue, Ege ve Akdeniz&apos;in büyüsüne tutku besleyen bir kaptan
                tarafından 2020 yılında Göcek&apos;te kuruldu. Sakin koylardan başlayan
                bu yolculuk; yıllar içinde büyüyen bir katamaran filosu, genişleyen
                bir rota ağı ve binlerce mutlu misafirle bugünkü halini aldı.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)' }}>
                Ege&apos;nin rüzgarı, Akdeniz&apos;in rengi ve Türk misafirperverliği —
                bunların hepsini tek bir çatı altında sunmak için varız. Her rezervasyon
                bir başlangıç; her yolculuk ömür boyu sürecek bir anı.
              </p>
              <div style={{ marginTop: 32 }}>
                <Link href="/iletisim" className="btn btn-primary">
                  Bize Ulaşın
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="nb-story-img">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
                alt="Ege koylarında katamaran"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="nb-section nb-section-foam">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Değerlerimiz</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Bizi Biz Yapan Prensipler
            </h2>
          </div>
          <div className="nb-features">
            {VALUES.map((v) => (
              <div key={v.title} className="nb-feature">
                <div className="nb-feature-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="nb-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Ekibimiz</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Deneyimli ve Tutkulu İnsanlar
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, maxWidth: 900, margin: '0 auto' }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', textAlign: 'center' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', position: 'relative', border: '3px solid var(--teal)' }}>
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="88px"
                  />
                </div>
                <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, color: 'var(--ink)' }}>{member.name}</p>
                <p style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nb-cta">
        <div className="nb-cta-inner">
          <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 16 }}>2026 yaz sezonu</div>
          <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Hayalinizi birlikte planlayalım
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, marginBottom: 36, maxWidth: 480 }}>
            Göcek&apos;ten başlayan bir yolculuk için bizimle iletişime geçin.
          </p>
          <Link href="/filo" className="btn btn-white btn-lg">
            Filoyu İncele
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
