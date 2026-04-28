'use client';
import { useTranslations } from 'next-intl';

export default function KariyerPage() {
  const t = useTranslations('careers');
  const positions = [
    {
      title: "Deneyimli Kaptan",
      type: "Tam Zamanlı / Sezonluk",
      location: "Göcek, Muğla",
      desc: "En az 5 yıl mavi yolculuk deneyimi, geçerli kaptanlık belgesi. Yabancı dil (İngilizce veya Almanca) tercih sebebidir.",
      tags: ["Kaptanlık", "Deneyimli", "Sezonal"],
    },
    {
      title: "Hostes / Kamarot",
      type: "Sezonluk (Mayıs – Ekim)",
      location: "Göcek, Muğla",
      desc: "Misafir ağırlama, tekne bakımı ve servis konusunda deneyimli. Turizm veya otelcilik eğitimi tercih sebebidir.",
      tags: ["Hostes", "Servis", "Turizm"],
    },
    {
      title: "Rezervasyon & Müşteri Temsilcisi",
      type: "Tam Zamanlı",
      location: "Göcek veya Uzaktan",
      desc: "Tekne kiralama sektöründe deneyim, güçlü iletişim becerileri, CRM kullanımı. İngilizce zorunlu, Almanca/Rusça artı.",
      tags: ["Ofis", "CRM", "İngilizce"],
    },
    {
      title: "Dijital Pazarlama Uzmanı",
      type: "Tam Zamanlı / Uzaktan",
      location: "Uzaktan",
      desc: "SEO, sosyal medya yönetimi, Google Ads ve içerik üretimi. Turizm sektörü deneyimi avantaj.",
      tags: ["Pazarlama", "SEO", "Uzaktan"],
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "var(--deep)",
          padding: "120px 24px 64px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--teal)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {t('title')}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#fff",
            margin: "0 0 16px",
            fontWeight: 700,
          }}
        >
          {t('subtitle')}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          NonnoBlue&apos;da her sezon yeni yetenekler arıyoruz. Denizle ve insanlarla çalışmayı seviyorsanız doğru yerdesiniz.
        </p>
      </div>

      {/* Positions */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--ink)",
            marginBottom: 32,
          }}
        >
          Açık Pozisyonlar
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {positions.map((pos, i) => (
            <div
              key={i}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "24px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--ink)", margin: 0 }}>
                  {pos.title}
                </h3>
                <span
                  style={{
                    background: "var(--foam)",
                    color: "var(--teal)",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 20,
                  }}
                >
                  {pos.type}
                </span>
              </div>
              <p style={{ color: "var(--mist)", fontSize: 13, marginBottom: 8 }}>📍 {pos.location}</p>
              <p style={{ color: "var(--ink)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                {pos.desc}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pos.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--line)",
                      color: "var(--mist)",
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div
          style={{
            marginTop: 48,
            background: "var(--teal)",
            borderRadius: 16,
            padding: "40px 32px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.4rem",
              color: "#fff",
              marginBottom: 12,
            }}
          >
            Pozisyon Bulamadınız mı?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.6 }}>
            Açık bir pozisyon olmasa bile özgeçmişinizi bize gönderebilirsiniz. Uygun bir pozisyon açıldığında sizi ilk biz ararız.
          </p>
          <a
            href="mailto:kariyer@nonnoblue.com"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "var(--teal)",
              fontWeight: 700,
              padding: "12px 32px",
              borderRadius: 40,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            CV Gönder
          </a>
        </div>
      </div>
    </div>
  );
}
