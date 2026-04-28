'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
const STATS = [
  { value: '4', label: 'Katamaran' },
  { value: '2021+', label: 'Model yılı' },
  { value: '200+', label: 'Mutlu misafir' },
  { value: '5', label: 'Yıllık deneyim' },
];

const SUPABASE_STORAGE = 'https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/team-photos';

function toPublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SUPABASE_STORAGE}/${path}`;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  display_order: number;
}

const VALUES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Misafir odaklı',
    desc: 'Her sezon başı sizi tanır, tatilinizi birlikte planlarız. Standart checklist\'lerden uzağız.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/>
        <line x1="12" y1="22" x2="12" y2="8"/>
        <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
      </svg>
    ),
    title: 'Teknik güvence',
    desc: 'Her çıkış öncesi 40 maddelik teknik kontrol. Sezon başı tam bakım.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    title: 'Yerel bilgi',
    desc: 'Göcek\'te doğduk, burada yaşıyoruz. Hangi koyun ne zaman boş olduğunu biliyoruz.',
  },
];

export default function HakkimizdaPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('team_members')
      .select('id,name,title,bio,avatar_url,display_order')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setTeam((data as TeamMember[]) ?? []);
      });
  }, []);

  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>
            <Link href="/" style={{ color: 'inherit' }}>Ana Sayfa</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.9)' }}>Hakkımızda</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Hakkımızda</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 720, lineHeight: 1.15 }}>
            Hikayemiz
          </h1>
          <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 620, lineHeight: 1.7 }}>
            2020&apos;de Göcek&apos;te bir katamaranla başlayan, bugün 4 katamaranlık bir filoya ulaşan bir aile hikayesi.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="nb-stats">
        <div className="container">
          <div className="nb-stats-grid">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="nb-stat-num">{s.value}</div>
                <div className="nb-stat-lab">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story — image LEFT, text RIGHT (prototype order) */}
      <section className="nb-section">
        <div className="container">
          <div className="nb-story">
            <div className="nb-story-img">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop"
                alt="Ege koylarında katamaran"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>2020 – Bugün</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24, fontWeight: 700 }}>
                Dedemizin ismini taşıyan bir deniz kültürü
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>
                &ldquo;Nonno&rdquo;, İtalyanca&apos;da dede demek. Mehmet Bey&apos;in dedesi İzmir&apos;de balıkçılık yapardı — denizi, teknenin her ayrıntısını, bir konuğa ikram etmenin inceliğini ondan öğrendik.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>
                2020&apos;de pandeminin ortasında, yeni bir iş kurmak cesaret isteyen bir karardı. Bir katamaranla başladık. Bugün dört katamaranla — hepsi 2021 ve sonrası model, Lagoon ve Excess — Göcek ve D-Marin&apos;den hareket ediyoruz. Ama filonun büyümesinden çok, her misafirimizin bir sonraki sezon geri dönmesi bizim için gurur verici.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)' }}>
                Bugün Göcek Marina ve D-Marin&apos;den hizmet veriyoruz. Bir aile işletmesi olmanın tüm sıcaklığı ve bir profesyonel filonun tüm standardıyla.
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
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="nb-section-tight nb-section-sand">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Değerlerimiz</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Neden biz?
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
      {team.length > 0 && (
      <section className="nb-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Ekip</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              NonnoBlue ailesi
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {team.map((member) => (
              <div key={member.id}>
                <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 14, position: 'relative', background: 'var(--foam)' }}>
                  {member.avatar_url ? (
                    <Image
                      src={toPublicUrl(member.avatar_url)}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 900px) 50vw, 25vw"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{member.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{member.title}</div>
                {member.bio && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{member.bio}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

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
