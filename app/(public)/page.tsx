'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NB_DATA } from '@/data/mock';
import { BoatCard } from '@/components/BoatCard';
import { SectionTitle } from '@/components/SectionTitle';

// Hero image slides — use Unsplash URLs from IMG constants in mock
const HERO_SLIDES = [
  {
    img: '/images/hero/lagoon42-bay.jpg',
    eyebrow: 'Göcek · Fethiye · D-Marin',
    title: 'Lagoon 42\nile Göcek\'in\nmavi sırrı',
    sub: '2024 model 4+2 kabinli katamaranlarımızla, 12 Adalar ve Ölüdeniz koylarında unutulmaz bir hafta.',
  },
  {
    img: '/images/hero/aerial-catamaran.jpg',
    eyebrow: '2026 Sezonu Açıldı',
    title: 'Koy koy\nTürk Rivierası',
    sub: 'Tersane Adası, Bedri Rahmi, Sarsala, Gemiler ve Ölüdeniz — bir haftada beş hikaye.',
  },
];

// ─── HERO ──────────────────────────────────────────────────────────────────────

function HeroSection() {
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
          <div className="eyebrow">{cur.eyebrow}</div>
          <h1 className="display">{cur.title}</h1>
          <p className="nb-hero-sub">{cur.sub}</p>
          <HeroSearch />
        </div>
      </div>

      <div className="nb-hero-slides">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      <div className="nb-hero-scroll">Keşfet</div>
    </section>
  );
}

function HeroSearch() {
  return (
    <div className="nb-search">
      <div className="nb-search-field">
        <label>Tekne Tipi</label>
        <select defaultValue="">
          <option value="">Tümü</option>
          <option>Katamaran</option>
        </select>
      </div>
      <div className="nb-search-field">
        <label>Lokasyon</label>
        <select defaultValue="gocek">
          <option value="gocek">Göcek Marina</option>
          <option value="dmarin">D-Marin (Göcek)</option>
        </select>
      </div>
      <div className="nb-search-field">
        <label>Tarih</label>
        <input type="date" defaultValue="2026-07-04" />
      </div>
      <div className="nb-search-field">
        <label>Kişi Sayısı</label>
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
        Ara
      </Link>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatsStrip() {
  return (
    <section className="nb-stats">
      <div className="container">
        <div className="nb-stats-grid">
          <div><div className="nb-stat-num">4</div><div className="nb-stat-lab">Katamaran · Filo</div></div>
          <div><div className="nb-stat-num">6+</div><div className="nb-stat-lab">Yıllık tecrübe</div></div>
          <div><div className="nb-stat-num">240+</div><div className="nb-stat-lab">Mutlu misafir</div></div>
          <div><div className="nb-stat-num">4.9</div><div className="nb-stat-lab">Ortalama puan</div></div>
        </div>
      </div>
    </section>
  );
}

// ─── FLEET ────────────────────────────────────────────────────────────────────

function FleetSection() {
  const boats = (NB_DATA.boats ?? []).slice(0, 4).map((b: any) => ({
    id: b.id,
    name: b.name,
    type: b.type,
    ribbon: b.ribbon,
    cabins: b.cabins,
    maxPax: b.maxPax,
    marina: b.marina,
    badge: b.badge ?? null,
    img: b.img,
    priceFrom: b.priceFrom,
  }));

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Filomuz</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}>
              Aile ruhuyla<br />kürüsyonlanmış tekneler
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 540 }}>
              Göcek&apos;te büyüyen katamaran filomuz — tamamı Lagoon ve Excess, 2022 ve sonrası model. Her tekne, her misafirden önce mühendis kontrolünden geçer.
            </p>
          </div>
          <Link href="/filo" className="btn btn-ghost">
            Tüm filoyu görüntüle
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

const FEATURES = [
  { icon: 'compass', title: 'Rota tasarımı', text: 'Kaptanlarımız Akdeniz\'i avuç içi gibi bilir. Rüzgar, kalabalık ve deneyiminize göre her hafta yeni bir rota öneriyoruz.' },
  { icon: 'anchor', title: 'Şeffaf fiyat', text: 'Service pack dahil. Yakıt, marina ve ekstralar rezervasyon öncesi net. Sürpriz yok, gizli bir madde yok.' },
  { icon: 'users', title: 'Aile gibi hizmet', text: 'Fatih ve ekibi 7/24 destek hattında. Bir sorununuzda arıyorsunuz, bir saat içinde çözülmüş oluyor.' },
  { icon: 'map', title: 'İki marina', text: 'Göcek Marina ve D-Marin Göcek\'ten hareket. Uçuşunuza göre en uygun marinayı planlıyoruz.' },
  { icon: 'star', title: 'Premium filo', text: 'Tamamı 2022 ve sonrası Lagoon 42 ve Excess 11 katamaranlar. Her yıl bakım + yenileme.' },
  { icon: 'chat', title: '4 dilde destek', text: 'TR, EN, DE ve RU. Hangi ülkeden olursanız olun kendi dilinizde hizmet alın.' },
];

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  compass: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>,
  anchor: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 15H3M21 15h-5"/></svg>,
  users: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  map: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  star: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chat: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

function WhyUsSection() {
  return (
    <section className="nb-section-tight nb-section-foam">
      <div className="container">
        <SectionTitle
          eyebrow="Neden NonnoBlue"
          title="Aile ruhuyla, denizci titizliğiyle"
          sub="Büyük charter zincirlerinin rahatlığı, butik işletmenin sıcaklığıyla birleşiyor."
          align="center"
        />
        <div className="nb-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="nb-feature">
              <div className="nb-feature-icon">{FEATURE_ICONS[f.icon]}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

function RoutesSection() {
  const routes = (NB_DATA.routes ?? []).slice(0, 4);

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Rotalar</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 16 }}>
              Koy koy<br />Türk Rivierası
            </h2>
            <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 540 }}>
              Göcek&apos;ten Kekova&apos;ya, dört klasik rota ve sonsuz sayıda alternatif. Her tatilde yeni bir koy.
            </p>
          </div>
          <Link href="/rotalar" className="btn btn-ghost">
            Tüm rotalar
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
                  <span>{r.days} gün</span>
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

const CHARTER_CARDS = [
  {
    num: '01',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 15H3M21 15h-5"/></svg>,
    tag: 'Özgürlük · Macera',
    name: 'Bareboat Charter',
    desc: 'Geçerli kaptanlık belgenizle tekneyi kendiniz kullanın. Rotanızı siz belirleyin, koyları siz keşfedin.',
    price: '€3.500\'den / hafta',
    featured: false,
  },
  {
    num: '02',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>,
    tag: 'En Çok Tercih Edilen',
    name: 'Skipperli Charter',
    desc: 'Deneyimli kaptanımız sizi en güzel koylarla tanıştırsın. Yerel bilgimizle gizli koylara uzanın.',
    price: '€4.500\'den / hafta',
    featured: true,
  },
  {
    num: '03',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 5 5-8 5 8 4-5-2 12H5L3 8z"/><path d="M5 20h14"/></svg>,
    tag: 'VIP Deneyim',
    name: 'Tam Hizmet Charter',
    desc: 'Kaptan, hostes ve isteğe bağlı şefle tam otel konforunda bir deniz tatili. Her detay bizden.',
    price: '€6.500\'den / hafta',
    featured: false,
  },
];

function CharterTypesSection() {
  return (
    <section className="nb-section-tight nb-charter-section">
      <div className="container">
        <SectionTitle
          eyebrow="Kiralama tipleri"
          title="Siz nasıl bir kaptan olmak istersiniz?"
          align="center"
        />
        <div className="nb-charter-grid">
          {CHARTER_CARDS.map((c) => (
            <div key={c.num} className="nb-charter-card" data-featured={c.featured ? 'true' : 'false'}>
              <div className="nb-charter-num">{c.num}</div>
              <div className="nb-charter-icon-wrap">{c.icon}</div>
              <div className="nb-charter-tag">{c.tag}</div>
              <h3 className="display">{c.name}</h3>
              <p>{c.desc}</p>
              <div className="nb-charter-foot">
                <span className="nb-charter-price">{c.price}</span>
                <Link href="/hizmetler" className="nb-charter-cta">
                  Detaylı bilgi
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
  return (
    <section className="nb-section nb-section-sand">
      <div className="container">
        <SectionTitle
          eyebrow="Referanslar"
          title="240 aile, 6 yıl, tek söz"
          align="center"
        />
        <div className="nb-testimonials">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="nb-test">
              <div className="nb-test-stars">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p>&ldquo;{t.text}&rdquo;</p>
              <div className="nb-test-foot">
                <img src={t.avatar} alt={t.name} width={44} height={44} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.trip}</span>
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
  return (
    <section className="nb-cta">
      <div className="nb-cta-inner">
        <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 14 }}>2026 yaz fırsatları</div>
        <h2>Erken rezervasyon<br />%30 indirimli</h2>
        <p>Nisan sonuna kadar booking yapan misafirlere özel. Sınırlı sayıda.</p>
        <Link href="/filo" className="btn btn-white btn-lg">
          Müsaitlik Sorgula
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
  const posts = (NB_DATA.blog ?? []).slice(0, 3);

  return (
    <section className="nb-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Günlük</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>Güncel yazılar</h2>
          </div>
          <Link href="/blog" className="btn btn-ghost">
            Tüm yazılar
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
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="nb-section-tight nb-section-ink" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div className="container-narrow">
        <div className="eyebrow" style={{ color: 'var(--sky)', marginBottom: 14 }}>Bülten</div>
        <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', marginBottom: 12 }}>
          Sezon fırsatlarından ilk siz haberdar olun
        </h2>
        <p style={{ opacity: 0.8 }}>Ayda bir, seyahat rehberleri ve özel kampanyalar. Spam yok.</p>
        {submitted ? (
          <p style={{ color: 'var(--sky)', marginTop: 24, fontSize: 16, fontWeight: 600 }}>Teşekkürler! Bültene kaydoldunuz.</p>
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
              placeholder="E-posta adresiniz"
            />
            <button type="submit" className="btn btn-white">Abone ol</button>
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
