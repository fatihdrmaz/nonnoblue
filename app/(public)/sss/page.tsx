'use client';

import { useState } from 'react';
import Link from 'next/link';

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
          SSS
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          Sık Sorulan Sorular
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Merak ettiğiniz her şeyi burada bulabilirsiniz. Cevap bulamazsanız
          doğrudan bize yazın.
        </p>
      </section>

      {/* ── FAQ Accordions ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '72px 24px' }}>
        {FAQ_GROUPS.map((group) => (
          <div key={group.category} style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--teal)',
                margin: '0 0 4px',
                paddingBottom: 12,
                borderBottom: '2px solid var(--teal)',
              }}
            >
              {group.category}
            </h2>
            <div>
              {group.items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Bottom CTA ── */}
      <section
        style={{
          background: 'var(--mist)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            padding: '48px 32px',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px', color: 'var(--ink)' }}>
            Sorunuz mu var?
          </h2>
          <p style={{ color: 'var(--warm)', margin: '0 0 28px', lineHeight: 1.6 }}>
            Burada cevap bulamadıysanız WhatsApp üzerinden bize anında ulaşabilirsiniz.
          </p>
          <Link
            href="https://wa.me/905321234567"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#25D366',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            WhatsApp&apos;tan Yaz
          </Link>
        </div>
      </section>
    </main>
  );
}
