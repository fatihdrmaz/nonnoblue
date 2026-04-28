'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_GROUPS = [
  {
    category: 'Kiralama Süreci',
    items: [
      {
        q: 'Nasıl rezervasyon yapabilirim?',
        a: 'Web sitemizin iletişim formu, WhatsApp veya e-posta aracılığıyla bize ulaşabilirsiniz. İstediğiniz tarihleri ve tekne tipini belirtin; 24 saat içinde size uygunluk ve fiyat teklifi sunarız.',
      },
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi/banka kartı (Visa, Mastercard), havale/EFT ve iyzico güvenceli online ödeme sistemini kabul ediyoruz. Yabancı misafirlerimiz için banka transferi de mevcuttur.',
      },
      {
        q: 'İptal politikanız nedir?',
        a: 'Kalkıştan 60+ gün önce yapılan iptallerde %80 iade, 30-59 gün önce %50 iade sağlanır. 30 günden daha yakın iptallerde iade yapılmamakla birlikte, tarih değişikliği için esnek çözümler sunuyoruz.',
      },
      {
        q: 'Hangi belgelere ihtiyacım var?',
        a: 'Bareboat charter için geçerli kaptanlık belgeniz (ICC veya eşdeğeri), VHF telsiz lisansı ve kimlik belgesi yeterlidir. Skipperli charterde yalnızca kimlik belgesi gerekmektedir.',
      },
      {
        q: 'Depozito ne kadar ve ne zaman iade edilir?',
        a: 'Tekneye göre 2.000€–3.000€ arasında değişen depozito, check-in sırasında kredi kartı blokajı veya nakit olarak alınır. Tekne hasarsız teslim edildiğinde check-out günü tam olarak iade edilir.',
      },
    ],
  },
  {
    category: 'Tekne & Güvenlik',
    items: [
      {
        q: 'Tekneleriniz ne kadar güvenli?',
        a: 'Tüm teknelerimiz yıllık bakım, zorunlu güvenlik denetimleri ve tam sigorta kapsamından geçer. Can salı, can yeleği, VHF telsiz, yangın söndürücü ve ilk yardım çantası dahil tüm güvenlik ekipmanları eksiksiz mevcuttur.',
      },
      {
        q: 'Yelken deneyimim yoksa kiralayabilir miyim?',
        a: 'Deneyiminiz olmasa da sorun yok! Skipperli charter seçeneğinde uzman kaptanımız tekneyi kullanır; siz yalnızca keyfini çıkarırsınız. Yelken deneyimi kazanmak isteyenler için kaptan eşliğinde öğretici geziler de düzenliyoruz.',
      },
      {
        q: 'Tekne sigortası dahil mi?',
        a: 'Evet, tüm teknelerimiz tam tekne ve üçüncü şahıs sorumluluk sigortasıyla kapsama alınmıştır. Ek olarak, misafirlerimizin kişisel seyahat sigortası yaptırmalarını tavsiye ediyoruz.',
      },
      {
        q: 'Evcil hayvanla gelebilir miyim?',
        a: 'Küçük ve orta boy evcil hayvanlar (özellikle köpek) tekneye kabul edilmektedir. Büyük hayvanlar için lütfen rezervasyon öncesinde bizimle iletişime geçin. Ek temizlik ücreti uygulanabilir.',
      },
      {
        q: 'Yiyecek ve içecekleri ben mi temin etmeliyim?',
        a: 'Provizyon (yiyecek ikmal) misafire aittir. Marina çevresindeki marketlerden kolayca tedarik edebilirsiniz. İsteyenler için şef hizmeti veya önceden hazırlanmış provizyon paketi sunuyoruz; ayrıntılar için bizimle iletişime geçin.',
      },
    ],
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--line)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 16,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
          {q}
        </span>
        <span
          style={{
            color: 'var(--teal)',
            fontSize: 20,
            fontWeight: 700,
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            display: 'inline-block',
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            paddingBottom: 20,
            fontSize: '0.95rem',
            color: 'var(--warm)',
            lineHeight: 1.75,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SSSPage() {
  const t = useTranslations('sss');
  return (
    <>

      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>FAQ</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.15 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* FAQ Accordions */}
      <section className="nb-section">
        <div className="container-narrow" style={{ maxWidth: 800 }}>
          {FAQ_GROUPS.map((group) => (
            <div key={group.category} style={{ marginBottom: 56 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal)', margin: '0 0 4px', paddingBottom: 12, borderBottom: '2px solid var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {group.category}
              </h2>
              <div>
                {group.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="nb-section nb-section-foam" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 700, margin: '0 0 12px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              Sorunuz mu var?
            </h2>
            <p style={{ color: 'var(--muted)', margin: '0 0 28px', lineHeight: 1.6, fontSize: 15 }}>
              Burada cevap bulamadıysanız WhatsApp üzerinden bize anında ulaşabilirsiniz.
            </p>
            <Link
              href="https://wa.me/905394403429"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
              </svg>
              WhatsApp&apos;tan Yaz
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
