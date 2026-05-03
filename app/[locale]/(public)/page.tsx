'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { NB_DATA } from '@/data/mock';
import { createClient } from '@/lib/supabase/client';
import { BoatCard } from '@/components/BoatCard';
import { SectionTitle } from '@/components/SectionTitle';

// Hero image slides — use Unsplash URLs from IMG constants in mock
const HERO_SLIDES = [
  {
    img: '/images/hero/lagoon42-bay.jpg',
    eyebrowKey: 'hero_slide1_eyebrow',
    titleKey: 'hero_slide1_title',
    subKey: 'hero_slide1_sub',
  },
  {
    img: '/images/hero/aerial-catamaran.jpg',
    eyebrowKey: 'hero_slide2_eyebrow',
    titleKey: 'hero_slide2_title',
    subKey: 'hero_slide2_sub',
  },
];

// ─── HERO ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const t = useTranslations('home');
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const cur = HERO_SLIDES[slide];

  return (
    <section className="nb-hero">
      <div className="nb-hero-bg">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${s.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}
          />
        ))}
      </div>

      <div className="container nb-hero-inner">
        <div className="nb-hero-content">
          <div className="eyebrow">{t(cur.eyebrowKey as any)}</div>
          <h1 className="display">{t(cur.titleKey as any)}</h1>
          <p className="nb-hero-sub">{t(cur.subKey as any)}</p>
          <HeroSearch />
        </div>
      </div>

      <div className="nb-hero-slides">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <div className="nb-hero-scroll">{t('discover')}</div>
    </section>
  );
}

function HeroSearch() {
  const t = useTranslations('home');
  return (
    <div className="nb-search">
      <div className="nb-search-field">
        <label>{t('search_type')}</label>
        <select defaultValue="">
          <option value="">{t('search_all')}</option>
          <option>Katamaran</option>
        </select>
      </div>
      <div className="nb-search-field">
        <label>{t('search_location')}</label>
        <select defaultValue="gocek">
          <option value="gocek">Göcek Marina</option>
          <option value="dmarin">D-Marin (Göcek)</option>
        </select>
      </div>
      <div className="nb-search-field">
        <label>{t('search_date')}</label>
        <input type="date" defaultValue="2026-07-04" />
      </div>
      <div className="nb-search-field">
        <label>{t('search_guests')}</label>
        <select defaultValue="8">
          <option>4</option>
          <option>6</option>
          <option>8</option>
          <option>10</option>
        </select>
      </div>
      <Link href="/filo" className="nb-search-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {t('search_btn')}
      </Link>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatsStrip() {
  const t = useTranslations('home');
  return (
    <section className="nb-stats">
      <div className="container">
        <div className="nb-stats-grid">
          <div><div className="nb-stat-num">4</div><div className="nb-stat-lab">{t('stats_catamaran')}</div></div>
          <div><div className="nb-stat-num">1</div><div className="nb-stat-lab">{t('stats_trawler')}</div></div>
          <div><div className="nb-stat-num">1</div><div className="nb-stat-lab">{t('stats_speedboat')}</div></div>
          <div><div className="nb-stat-num">1000+</div><div className="nb-stat-lab">{t('stats_guests')}</div></div>
          <div><div className="nb-stat-num">4.9/5</div><div className="nb-stat-lab">{t('stats_rating')}</div></div>
        </div>
      </div>
    </section>
  );
}

// ─── FLEET ────────────────────────────────────────────────────────────────────

function FleetSection() {
  const t = useTranslations('home');
  const [boats, setBoats] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('boats')
      .select('id,slug,name,type,cabins,max_guests,marina,boat_photos(storage_path,position),boat_pricing(weekly_price_eur)')
      .eq('active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBoats(data.map((b: any) => {
            const sorted = [...(b.boat_photos ?? [])].sort((a: any, c: any) => a.position - c.position);
            const prices = (b.boat_pricing ?? []).map((p: any) => p.weekly_price_eur);
            const rawPath = sorted[0]?.storage_path ?? '';
            const publicUrl = rawPath
              ? rawPath.startsWith('http')
                ? rawPath
                : supabase.storage.from('boat-photos').getPublicUrl(rawPath).data.publicUrl
              : '';
            return {
              id: b.slug,
              name: b.name,
              type: b.type,
              ribbon: null,
              cabins: b.cabins,
              maxPax: b.max_guests,
              marina: b.marina,
              badge: null,
              img: publicUrl || '/images/hero/lagoon42-bay.jpg',
              priceFrom: prices.length ? Math.min(...prices) : 0,
            };
          }));
        } else {
          setBoats((NB_DATA.boats ?? []).map((b: any) => ({
            id: b.id, name: b.name, type: b.type, ribbon: b.ribbon,
            cabins: b.cabins, maxPax: b.maxPax, marina: b.marina,
            badge: b.badge ?? null, img: b.img, priceFrom: b.priceFrom,
          })));
        }
      });
  }, []);

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('fleet_eyebrow')}</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}>
              {t('fleet_heading')}
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 540 }}>
              {t('fleet_sub')}
            </p>
          </div>
          <Link href="/filo" className="btn btn-ghost">
            {t('view_fleet')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
        <div className="nb-fleet-grid">
          {boats.map((boat: any) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY US ───────────────────────────────────────────────────────────────────

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  compass: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>,
  anchor: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 15H3M21 15h-5"/></svg>,
  users: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  map: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  star: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chat: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

const FEATURE_KEYS = ['compass', 'anchor', 'users', 'map', 'star', 'chat'] as const;

function WhyUsSection() {
  const t = useTranslations('home');
  return (
    <section className="nb-section-tight nb-section-foam">
      <div className="container">
        <SectionTitle
          eyebrow={t('why_eyebrow')}
          title={t('why_title')}
          sub={t('why_sub')}
          align="center"
        />
        <div className="nb-features">
          {FEATURE_KEYS.map((icon) => (
            <div key={icon} className="nb-feature">
              <div className="nb-feature-icon">{FEATURE_ICONS[icon]}</div>
              <h3>{t(`feature_${icon}_title` as any)}</h3>
              <p>{t(`feature_${icon}_text` as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

function RoutesSection() {
  const t = useTranslations('home');
  const tRoutes = useTranslations('routes');
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('routes')
      .select('id,title,days,difficulty,description,highlights,img_url')
      .eq('active', true)
      .order('display_order')
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setRoutes(data.map((r: any) => ({ ...r, img: r.img_url, desc: r.description })));
        } else {
          setRoutes((NB_DATA.routes ?? []).slice(0, 4));
        }
      });
  }, []);

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('routes_eyebrow')}</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}>
              {t('routes_heading')}
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 540 }}>
              {t('routes_sub')}
            </p>
          </div>
          <Link href="/rotalar" className="btn btn-ghost">
            {t('view_routes')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
        <div className="nb-routes">
          {routes.map((r: any) => (
            <Link key={r.id} href={`/rotalar/${r.id}`} className="nb-route" style={{ display: 'block', textDecoration: 'none' }}>
              <Image src={r.img} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:800px) 100vw, 50vw" />
              <div className="nb-route-body">
                <div className="nb-route-chips">
                  <span>{r.days} {tRoutes('day')}</span>
                  <span>{r.difficulty}</span>
                </div>
                <h3 className="display">{r.title}</h3>
                <p>{r.desc}</p>
                <div className="nb-route-highlights">
                  {(r.highlights ?? []).slice(0, 4).map((h: string) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CHARTER TYPES ────────────────────────────────────────────────────────────

const CHARTER_CARD_ICONS = [
  <svg key="bareboat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 15H3M21 15h-5"/></svg>,
  <svg key="skipperli" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>,
  <svg key="full" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 5 5-8 5 8 4-5-2 12H5L3 8z"/><path d="M5 20h14"/></svg>,
];

const CHARTER_KEYS = ['bareboat', 'skipperli', 'full_service'] as const;

function CharterTypesSection() {
  const t = useTranslations('home');
  return (
    <section className="nb-section-tight nb-charter-section">
      <div className="container">
        <SectionTitle
          eyebrow={t('charter_eyebrow')}
          title={t('charter_title')}
          align="center"
        />
        <div className="nb-charter-grid">
          {CHARTER_KEYS.map((key, i) => (
            <div key={key} className="nb-charter-card" data-featured={key === 'skipperli' ? 'true' : 'false'}>
              <div className="nb-charter-num">0{i + 1}</div>
              <div className="nb-charter-icon-wrap">{CHARTER_CARD_ICONS[i]}</div>
              <div className="nb-charter-tag">{t(`charter_${key}_tag` as any)}</div>
              <h3 className="display">{t(`charter_${key}_name` as any)}</h3>
              <p>{t(`charter_${key}_desc` as any)}</p>
              <div className="nb-charter-foot">
                <span className="nb-charter-price">{t(`charter_${key}_price` as any)}</span>
                <Link href="/hizmetler" className="nb-charter-cta">
                  {t('charter_detail')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: 'Elif & Can', trip: 'Ivan Nonno · 7 gün · Temmuz 2025', text: 'Her şey mükemmeldi. Tekne 2024 model, yepyeni; klima ve jeneratör sayesinde sıcak temmuzda bile kokpitte çay içtik. Fatih Bey gece 23:00\'te mesaj attığımızda bile anında döndü.', avatar: 'https://i.pravatar.cc/120?u=elifcan' },
  { name: 'Marco Rossi', trip: 'Carmelina · 10 gün · Eylül 2025', text: 'Professional crew, beautiful boat. The Bose system and the karaoke were a bonus — evenings in Gemiler bay will stay with us. Returning next summer, for sure.', avatar: 'https://i.pravatar.cc/120?u=marco2' },
  { name: 'Aylin Yılmaz', trip: 'Rena · 7 gün · Haziran 2025', text: 'Rena için fiyat-performans olarak piyasadaki en iyi seçenek. 4+2 kabin çift aileye bol bol yetti, watermaker da büyük artı. Teslim öncesi brifing çok detaylıydı.', avatar: 'https://i.pravatar.cc/120?u=aylin' },
  { name: 'Thomas Weber', trip: 'Ayza 1 · 14 gün · Ağustos 2025', text: 'Ein fantastischer Urlaub. Der Lagoon 42 ist perfekt für 8 Erwachsene — stabil, leise, gut belüftet. Die Bucht von Göcek ist ein Paradies.', avatar: 'https://i.pravatar.cc/120?u=thomas' },
];

function TestimonialsSection() {
  const t = useTranslations('home');
  return (
    <section className="nb-section nb-section-sand">
      <div className="container">
        <SectionTitle
          eyebrow={t('testimonials_eyebrow')}
          title={t('testimonials_title')}
          align="center"
        />
        <div className="nb-testimonials">
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="nb-test">
              <div className="nb-test-stars">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p>&ldquo;{item.text}&rdquo;</p>
              <div className="nb-test-foot">
                <img src={item.avatar} alt={item.name} width={44} height={44} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.trip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CtaBand() {
  const t = useTranslations('home');
  return (
    <section className="nb-cta">
      <div className="nb-cta-inner">
        <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 14 }}>{t('cta_eyebrow')}</div>
        <h2>{t('cta_title')}</h2>
        <p>{t('cta_sub')}</p>
        <Link href="/filo" className="btn btn-white btn-lg">
          {t('cta_btn')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ─── BLOG TEASER ──────────────────────────────────────────────────────────────

function BlogTeaserSection() {
  const t = useTranslations('home');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('blog_posts')
      .select('id,slug,title,excerpt,img_url,category,published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPosts(data.map((p: any) => ({ ...p, img: p.img_url, date: p.published_at?.split('T')[0] ?? '', cat: p.category })));
        } else {
          setPosts((NB_DATA.blog ?? []).slice(0, 3));
        }
      });
  }, []);

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{t('blog_eyebrow')}</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>{t('blog_posts_title')}</h2>
          </div>
          <Link href="/blog" className="btn btn-ghost">
            {t('view_blog')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
        <div className="nb-blog-grid">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="nb-blog" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="nb-blog-img">
                <Image src={post.img} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:800px) 100vw, 33vw" />
              </div>
              <div className="nb-blog-meta">
                <span>{post.category ?? post.cat}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="nb-section-tight nb-section-ink" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div className="container-narrow">
        <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 14 }}>{t('newsletter_eyebrow')}</div>
        <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', marginBottom: 12 }}>
          {t('newsletter_title')}
        </h2>
        <p style={{ opacity: 0.8 }}>{t('newsletter_sub')}</p>
        {submitted ? (
          <p style={{ color: 'var(--sky)', marginTop: 24, fontSize: 16, fontWeight: 600 }}>{t('newsletter_thanks')}</p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            className="nb-newsletter"
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter_placeholder')}
            />
            <button type="submit" className="btn btn-white">{t('newsletter_btn')}</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

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
