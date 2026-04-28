'use client';
import { useTranslations, useLocale } from 'next-intl';

type SectionData = { title: string; content: React.ReactNode };

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

const SECTIONS_TR = [
  {
    title: '1. Veri Sorumlusu',
    content: (
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca kişisel
        verileriniz; veri sorumlusu sıfatıyla <strong>NonnoBlue Denizcilik ve Turizm A.Ş.</strong>{' '}
        (Göcek Marina, 48310 Fethiye / Muğla) tarafından aşağıda açıklanan kapsamda işlenecektir.
      </p>
    ),
  },
  {
    title: '2. İşlenen Kişisel Veriler',
    content: (
      <>
        <p>Hizmetlerimizden yararlanmanız kapsamında aşağıdaki veriler işlenmektedir:</p>
        <ul>
          <li>Kimlik bilgileri: Ad, soyad, T.C. kimlik numarası</li>
          <li>İletişim bilgileri: E-posta adresi, telefon numarası, adres</li>
          <li>Rezervasyon bilgileri: Tekne, tarih, kişi sayısı, güzergah</li>
          <li>
            Ödeme bilgileri: Kart son 4 hanesi, fatura adresi (tam kart bilgisi tarafımızca
            saklanmaz)
          </li>
          <li>Teknik veriler: IP adresi, tarayıcı bilgisi, çerezler</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Kişisel Verilerin İşlenme Amaçları',
    content: (
      <ul>
        <li>Rezervasyon oluşturma, yönetme ve onaylama</li>
        <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
        <li>Müşteri hizmetleri ve destek</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Pazarlama ve tanıtım faaliyetleri (açık rıza ile)</li>
      </ul>
    ),
  },
  {
    title: '4. Kişisel Verilerin Aktarıldığı Taraflar',
    content: (
      <p>
        Kişisel verileriniz; ödeme hizmet sağlayıcıları (iyzico), e-posta altyapı sağlayıcıları,
        yasal merciler ve hizmet alınan iş ortaklarıyla KVKK&apos;nın 8. ve 9. maddeleri kapsamında
        paylaşılabilir.
      </p>
    ),
  },
  {
    title: '5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi',
    content: (
      <p>
        Kişisel verileriniz; web sitemiz, mobil uygulama, e-posta ve telefon kanallarıyla
        toplanmaktadır. İşlemenin hukuki sebepleri: sözleşmenin ifası, hukuki yükümlülük ve meşru
        menfaat.
      </p>
    ),
  },
  {
    title: '6. Veri Sahibinin Hakları',
    content: (
      <>
        <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde / yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini isteme</li>
          <li>İşlemeye itiraz etme</li>
        </ul>
        <p>
          Talepleriniz için:{' '}
          <a href="mailto:kvkk@nonnoblue.com" style={{ color: 'var(--teal)' }}>
            kvkk@nonnoblue.com
          </a>
        </p>
      </>
    ),
  },
];

const SECTIONS_EN = [
  {
    title: '1. Data Controller',
    content: (
      <p>
        Pursuant to the Law on Protection of Personal Data No. 6698 (&ldquo;KVKK&rdquo;), your
        personal data will be processed by <strong>NonnoBlue Maritime and Tourism Inc.</strong>{' '}
        (Göcek Marina, 48310 Fethiye / Muğla), acting as the data controller, within the scope
        described below.
      </p>
    ),
  },
  {
    title: '2. Personal Data Processed',
    content: (
      <>
        <p>The following data is processed in connection with your use of our services:</p>
        <ul>
          <li>Identity information: First name, last name, national ID number</li>
          <li>Contact information: Email address, phone number, address</li>
          <li>Reservation information: Vessel, dates, number of guests, route</li>
          <li>
            Payment information: Last 4 digits of card, billing address (full card details are not
            stored by us)
          </li>
          <li>Technical data: IP address, browser information, cookies</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Purposes of Processing Personal Data',
    content: (
      <ul>
        <li>Creating, managing, and confirming reservations</li>
        <li>Processing payments</li>
        <li>Customer service and support</li>
        <li>Fulfilling legal obligations</li>
        <li>Marketing and promotional activities (with explicit consent)</li>
      </ul>
    ),
  },
  {
    title: '4. Third Parties to Whom Personal Data is Transferred',
    content: (
      <p>
        Your personal data may be shared with payment service providers (iyzico), email
        infrastructure providers, legal authorities and business partners within the scope of
        Articles 8 and 9 of the KVKK.
      </p>
    ),
  },
  {
    title: '5. Method of Collection and Legal Basis',
    content: (
      <p>
        Your personal data is collected through our website, mobile application, email and telephone
        channels. Legal bases for processing: performance of contract, legal obligation, and
        legitimate interest.
      </p>
    ),
  },
  {
    title: '6. Rights of the Data Subject',
    content: (
      <>
        <p>Pursuant to Article 11 of the KVKK, you have the following rights:</p>
        <ul>
          <li>To learn whether your personal data is being processed</li>
          <li>To request information about processing if it has occurred</li>
          <li>To learn the purpose of processing and whether it is used in accordance with that purpose</li>
          <li>To know third parties to whom data is transferred domestically or abroad</li>
          <li>To request correction if data is incomplete or inaccurate</li>
          <li>To request deletion or destruction</li>
          <li>To object to processing</li>
        </ul>
        <p>
          For requests:{' '}
          <a href="mailto:kvkk@nonnoblue.com" style={{ color: 'var(--teal)' }}>
            kvkk@nonnoblue.com
          </a>
        </p>
      </>
    ),
  },
];

export default function KvkkPage() {
  const t = useTranslations('kvkk');
  const locale = useLocale();
  const sections = locale === 'en' ? SECTIONS_EN : SECTIONS_TR;
  const updateDate = locale === 'en' ? 'Last updated: January 1, 2026' : 'Son güncelleme: 1 Ocak 2026';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div
        style={{
          background: 'var(--deep)',
          padding: '120px 24px 64px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'var(--teal)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {t('eyebrow')}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#fff',
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: '40px 48px',
            lineHeight: 1.8,
            color: 'var(--ink)',
          }}
        >
          <p style={{ color: 'var(--mist)', fontSize: 13, marginBottom: 32 }}>
            {updateDate}
          </p>
          {sections.map((s) => (
            <Section key={s.title} title={s.title}>
              {s.content}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
