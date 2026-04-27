'use client';

import Link from 'next/link';

const CHARTER_CARDS = [
  {
    num: '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l2-5h14l2 5"/><path d="M3 17h18"/><path d="M12 7v5"/>
        <circle cx="12" cy="5" r="2"/>
      </svg>
    ),
    tag: 'Özgürlük · Macera',
    name: 'Bareboat Charter',
    desc: 'Geçerli kaptanlık belgenizle tekneyi kendiniz kullanın. Rotanızı siz belirleyin, koyları siz keşfedin. Maksimum özgürlük, en uygun fiyat.',
    price: '€3.500\'den / hafta',
    featured: false,
  },
  {
    num: '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    tag: 'En Çok Tercih Edilen',
    name: 'Skipperli Charter',
    desc: 'Deneyimli kaptanımız sizi en güzel koylarla tanıştırsın. Yerel bilgimizle gizli koylara uzanın, siz sadece keyfini çıkarın.',
    price: '€4.500\'den / hafta',
    featured: true,
  },
  {
    num: '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    tag: 'VIP Deneyim',
    name: 'Tam Hizmet Charter',
    desc: 'Kaptan, hostes ve isteğe bağlı şefle tam otel konforunda bir deniz tatili. Her şey dahil, tüm detaylar bizden.',
    price: '€6.500\'den / hafta',
    featured: false,
  },
];

const EXTRA_SERVICES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    name: 'Kaptan Temini',
    price: '€200 / gün',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    name: 'Hostes Hizmeti',
    price: '€150 / gün',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z"/>
      </svg>
    ),
    name: 'Transfer',
    price: '€60 / yön',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10"/><path d="M2 12a10 10 0 0 0 10 10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    name: 'Şef Hizmeti',
    price: '€180 / gün',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    name: 'Dalış Ekipmanı',
    price: '€80 / hafta',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    name: 'Provizyon',
    price: 'Talebe göre',
  },
];

export default function HizmetlerPage() {
  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Kiralama Tipleri</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 720, lineHeight: 1.15 }}>
            Her İhtiyaca Özel<br />Charter Seçenekleri
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 560, lineHeight: 1.7 }}>
            Bareboat&apos;tan tam hizmetli chartere, her aile, her grup, her bütçeye
            uygun tekne tatili deneyimleri.
          </p>
        </div>
      </div>

      {/* Charter Types */}
      <section className="nb-section nb-charter-section">
        <div className="container">
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
                  <Link href="/iletisim" className="nb-charter-cta">
                    Fiyat al
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Services */}
      <section className="nb-section nb-section-foam">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Ek Hizmetler</div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Tatilinizi Eksiksiz Kılın
            </h2>
          </div>
          <div className="nb-features">
            {EXTRA_SERVICES.map((svc) => (
              <div key={svc.name} className="nb-feature">
                <div className="nb-feature-icon">{svc.icon}</div>
                <h3>{svc.name}</h3>
                <p style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 15 }}>{svc.price}</p>
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
            Hayalinizdeki tekne<br />tatiline başlayın
          </h2>
          <p style={{ opacity: 0.75, fontSize: 17, marginBottom: 36, maxWidth: 480 }}>
            Ekibimiz size en uygun charter seçeneğini bulmak için hazır.
          </p>
          <Link href="/iletisim" className="btn btn-white btn-lg">
            Ücretsiz Teklif Al
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
