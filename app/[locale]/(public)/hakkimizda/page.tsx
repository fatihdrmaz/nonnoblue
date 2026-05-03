'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
const STAT_KEYS = [
  { value: '4', key: 'stat_catamaran' },
  { value: '1', key: 'stat_trawler' },
  { value: '1', key: 'stat_speedboat' },
  { value: '1000+', key: 'stat_guests' },
  { value: '4.9/5', key: 'stat_rating' },
] as const;

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
  title_en: string | null;
  bio_en: string | null;
  avatar_url: string | null;
  display_order: number;
}

const VALUES_ICONS = [
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <line x1="12" y1="22" x2="12" y2="8"/>
      <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
    </svg>
  ),
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
];
const VALUES_KEYS = ['value1', 'value2', 'value3'] as const;

export default function HakkimizdaPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('team_members')
      .select('id,name,title,bio,title_en,bio_en,avatar_url,display_order')
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
            <Link href="/" style={{ color: 'inherit' }}>{t('home')}</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.9)' }}>{t('title')}</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>{t('page_eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 720, lineHeight: 1.15 }}>
            {t('story_title')}
          </h1>
          <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 620, lineHeight: 1.7 }}>
            {t('story_sub')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="nb-stats">
        <div className="container">
          <div className="nb-stats-grid">
            {STAT_KEYS.map((s) => (
              <div key={s.key}>
                <div className="nb-stat-num">{s.value}</div>
                <div className="nb-stat-lab">{t(s.key)}</div>
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
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t('story_period')}</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24, fontWeight: 700 }}>
                {t('story_heading')}
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>
                {t('story_p1')}
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>
                {t('story_p2')}
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)' }}>
                {t('story_p3')}
              </p>
              <div style={{ marginTop: 32 }}>
                <Link href="/iletisim" className="btn btn-primary">
                  {t('contact_us')}
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
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('values_eyebrow')}</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {t('values_title')}
            </h2>
          </div>
          <div className="nb-features">
            {VALUES_KEYS.map((key, i) => (
              <div key={key} className="nb-feature">
                <div className="nb-feature-icon">{VALUES_ICONS[i]}</div>
                <h3>{t(`${key}_title`)}</h3>
                <p>{t(`${key}_desc`)}</p>
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
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('team_eyebrow')}</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {t('team_family')}
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
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{locale === 'en' && member.title_en ? member.title_en : member.title}</div>
                {(member.bio || member.bio_en) && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{locale === 'en' && member.bio_en ? member.bio_en : member.bio}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="nb-cta">
        <div className="nb-cta-inner">
          <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 16 }}>{t('cta_eyebrow')}</div>
          <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            {t('cta_title')}
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, marginBottom: 36, maxWidth: 480 }}>
            {t('cta_sub')}
          </p>
          <Link href="/filo" className="btn btn-white btn-lg">
            {t('cta_btn')}
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
