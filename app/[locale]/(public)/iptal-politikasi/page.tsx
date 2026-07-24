'use client';
import { useLocale } from 'next-intl';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.1rem',
          color: 'var(--ink)',
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: '2px solid var(--teal)',
          display: 'inline-block',
        }}
      >
        {title}
      </h2>
      <div style={{ color: 'var(--ink)', fontSize: 15 }}>{children}</div>
    </div>
  );
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };
const cellStyle: React.CSSProperties = { border: '1px solid var(--line)', padding: '10px 14px', textAlign: 'left' };

const SECTIONS_TR = [
  {
    title: '1. Rezervasyon ve Ödeme Koşulları',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Rezervasyonun kesinleşmesi için toplam kiralama bedelinin <strong>%50&apos;si</strong> ön ödeme
          (depozito) olarak tahsil edilir. Kalan bakiye, tekne teslim tarihinden en geç{' '}
          <strong>30 gün önce</strong> ödenir. Teslim tarihine 30 günden az kala yapılan
          rezervasyonlarda toplam bedelin tamamı peşin tahsil edilir.
        </p>
        <p>
          Ödemeler kredi kartı (3D Secure) veya banka havalesi / EFT ile EUR veya TL cinsinden
          yapılabilir.
        </p>
      </>
    ),
  },
  {
    title: '2. İptal Koşulları',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          İptal talepleri yazılı olarak (e-posta ile) iletilmelidir. İptal bildiriminin tarafımıza
          ulaştığı tarih esas alınır ve aşağıdaki kesinti oranları uygulanır:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...cellStyle, background: 'var(--foam)' }}>Teslim tarihine kalan süre</th>
              <th style={{ ...cellStyle, background: 'var(--foam)' }}>İade oranı</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>60 günden fazla</td><td style={cellStyle}>Ödenen tutarın %90&apos;ı iade edilir</td></tr>
            <tr><td style={cellStyle}>30 – 60 gün</td><td style={cellStyle}>Ödenen tutarın %50&apos;si iade edilir</td></tr>
            <tr><td style={cellStyle}>30 günden az</td><td style={cellStyle}>İade yapılmaz</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          İade yapılamayan durumlarda, müsaitlik dahilinde aynı sezon içinde bir kez ücretsiz{' '}
          <strong>tarih değişikliği</strong> hakkı sunulur.
        </p>
      </>
    ),
  },
  {
    title: '3. İade Süreci',
    content: (
      <p>
        Onaylanan iadeler, iptal onayını takiben <strong>14 iş günü</strong> içinde, ödemenin
        yapıldığı yönteme (kredi kartı veya banka hesabı) yapılır. Bankanız kaynaklı yansıma
        süreleri farklılık gösterebilir.
      </p>
    ),
  },
  {
    title: '4. Güvence Bedeli (Depozito) İadesi',
    content: (
      <p>
        Tekne tesliminde alınan güvence bedeli; teknenin hasarsız, eksiksiz ve sözleşme koşullarına
        uygun iade edilmesi halinde check-out işlemini takiben <strong>en geç 7 iş günü</strong>{' '}
        içinde iade edilir. Hasar veya eksik tespitinde, tespit edilen tutar güvence bedelinden
        düşülerek kalan kısım iade edilir.
      </p>
    ),
  },
  {
    title: '5. Mücbir Sebep',
    content: (
      <p>
        Olumsuz hava koşulları nedeniyle liman çıkış yasağı, doğal afet, salgın hastalık, resmi
        makam kararları gibi tarafların kontrolü dışındaki durumlarda; rezervasyon bedeli kesintisiz
        olarak ileri bir tarihe devredilir veya kullanılamayan günlerin bedeli iade edilir.
      </p>
    ),
  },
  {
    title: '6. İletişim',
    content: (
      <p>
        İptal ve iade talepleriniz için:{' '}
        <a href="mailto:ahoy@nonnoblue.com" style={{ color: 'var(--teal)' }}>ahoy@nonnoblue.com</a>
        {' '}· WhatsApp: +90 539 440 34 29
      </p>
    ),
  },
];

const SECTIONS_EN = [
  {
    title: '1. Booking & Payment Terms',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          A deposit of <strong>50%</strong> of the total charter fee is required to confirm your
          booking. The remaining balance is due no later than <strong>30 days before</strong> the
          embarkation date. Bookings made less than 30 days before embarkation must be paid in full.
        </p>
        <p>Payments can be made by credit card (3D Secure) or bank transfer, in EUR or TRY.</p>
      </>
    ),
  },
  {
    title: '2. Cancellation Terms',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Cancellation requests must be submitted in writing (by e-mail). The date we receive your
          notice determines the applicable refund:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...cellStyle, background: 'var(--foam)' }}>Time before embarkation</th>
              <th style={{ ...cellStyle, background: 'var(--foam)' }}>Refund</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>More than 60 days</td><td style={cellStyle}>90% of the amount paid</td></tr>
            <tr><td style={cellStyle}>30 – 60 days</td><td style={cellStyle}>50% of the amount paid</td></tr>
            <tr><td style={cellStyle}>Less than 30 days</td><td style={cellStyle}>No refund</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          Where no refund applies, we offer a one-time free <strong>date change</strong> within the
          same season, subject to availability.
        </p>
      </>
    ),
  },
  {
    title: '3. Refund Process',
    content: (
      <p>
        Approved refunds are issued within <strong>14 business days</strong> of cancellation
        confirmation, to the original payment method. Bank processing times may vary.
      </p>
    ),
  },
  {
    title: '4. Security Deposit Refund',
    content: (
      <p>
        The security deposit collected at check-in is refunded within <strong>7 business days</strong>{' '}
        after check-out, provided the yacht is returned undamaged and complete. Any assessed damage
        is deducted from the deposit and the remainder refunded.
      </p>
    ),
  },
  {
    title: '5. Force Majeure',
    content: (
      <p>
        In events beyond the parties&apos; control — harbour closure due to severe weather, natural
        disaster, epidemic, or acts of authorities — the charter fee is credited in full toward a
        future date, or the unused days are refunded.
      </p>
    ),
  },
  {
    title: '6. Contact',
    content: (
      <p>
        For cancellation and refund requests:{' '}
        <a href="mailto:ahoy@nonnoblue.com" style={{ color: 'var(--teal)' }}>ahoy@nonnoblue.com</a>
        {' '}· WhatsApp: +90 539 440 34 29
      </p>
    ),
  },
];

export default function IptalPolitikasiPage() {
  const locale = useLocale();
  const sections = locale === 'en' ? SECTIONS_EN : SECTIONS_TR;
  const updateDate = locale === 'en' ? 'Last updated: July 24, 2026' : 'Son güncelleme: 24 Temmuz 2026';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--deep)', padding: '120px 24px 64px', textAlign: 'center' }}>
        <p style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          {locale === 'en' ? 'Legal' : 'Yasal'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', margin: 0 }}>
          {locale === 'en' ? 'Cancellation & Refund Policy' : 'İptal & İade Koşulları'}
        </h1>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '40px 48px', lineHeight: 1.8, color: 'var(--ink)' }}>
          <p style={{ color: 'var(--mist)', fontSize: 13, marginBottom: 32 }}>{updateDate}</p>
          {sections.map((s) => (
            <Section key={s.title} title={s.title}>{s.content}</Section>
          ))}
        </div>
      </div>
    </div>
  );
}
