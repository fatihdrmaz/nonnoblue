'use client';
import { useTranslations } from 'next-intl';

export default function KariyerPage() {
  const t = useTranslations('careers');

  const positions = [
    {
      title: t('p1_title'), type: t('p1_type'), location: t('p1_location'),
      desc: t('p1_desc'), tags: [t('p1_t1'), t('p1_t2'), t('p1_t3')],
    },
    {
      title: t('p2_title'), type: t('p2_type'), location: t('p2_location'),
      desc: t('p2_desc'), tags: [t('p2_t1'), t('p2_t2'), t('p2_t3')],
    },
    {
      title: t('p3_title'), type: t('p3_type'), location: t('p3_location'),
      desc: t('p3_desc'), tags: [t('p3_t1'), t('p3_t2'), t('p3_t3')],
    },
    {
      title: t('p4_title'), type: t('p4_type'), location: t('p4_location'),
      desc: t('p4_desc'), tags: [t('p4_t1'), t('p4_t2'), t('p4_t3')],
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--deep)", padding: "120px 24px 64px", textAlign: "center" }}>
        <p style={{ color: "var(--teal)", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          {t('title')}
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", margin: "0 0 16px", fontWeight: 700 }}>
          {t('subtitle')}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          {t('hero_sub')}
        </p>
      </div>

      {/* Positions */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--ink)", marginBottom: 32 }}>
          {t('open_positions')}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {positions.map((pos, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--ink)", margin: 0 }}>
                  {pos.title}
                </h3>
                <span style={{ background: "var(--foam)", color: "var(--teal)", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                  {pos.type}
                </span>
              </div>
              <p style={{ color: "var(--mist)", fontSize: 13, marginBottom: 8 }}>📍 {pos.location}</p>
              <p style={{ color: "var(--ink)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{pos.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pos.tags.map((tag) => (
                  <span key={tag} style={{ background: "var(--bg)", border: "1px solid var(--line)", color: "var(--mist)", fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div style={{ marginTop: 48, background: "var(--teal)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "#fff", marginBottom: 12 }}>
            {t('no_position_title')}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.6 }}>
            {t('no_position_sub')}
          </p>
          <a href="mailto:kariyer@nonnoblue.com" style={{ display: "inline-block", background: "#fff", color: "var(--teal)", fontWeight: 700, padding: "12px 32px", borderRadius: 40, textDecoration: "none", fontSize: 15 }}>
            {t('send_cv')}
          </a>
        </div>
      </div>
    </div>
  );
}
