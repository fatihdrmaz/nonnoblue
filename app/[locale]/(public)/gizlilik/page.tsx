'use client';
import { useTranslations, useLocale } from 'next-intl';

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
    title: '1. Genel Bilgi',
    content: (
      <p>
        Bu Gizlilik ve Çerez Politikası, NonnoBlue Denizcilik ve Turizm A.Ş. olarak
        nonnoblue.com adresindeki web sitemizi ve hizmetlerimizi kullanırken toplanan verilerin
        nasıl işlendiğini açıklamaktadır.
      </p>
    ),
  },
  {
    title: '2. Çerezler (Cookies)',
    content: (
      <>
        <p>Sitemiz aşağıdaki çerez türlerini kullanmaktadır:</p>
        <ul>
          <li>
            <strong>Zorunlu çerezler:</strong> Oturum yönetimi, güvenlik
          </li>
          <li>
            <strong>Analitik çerezler:</strong> Anonim kullanım istatistikleri (Google Analytics)
          </li>
          <li>
            <strong>Pazarlama çerezleri:</strong> Kişiselleştirilmiş reklamlar (yalnızca onay ile)
          </li>
        </ul>
        <p>Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.</p>
      </>
    ),
  },
  {
    title: '3. Üçüncü Taraf Hizmetler',
    content: (
      <>
        <p>Sitemiz aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:</p>
        <ul>
          <li>
            <strong>iyzico:</strong> Ödeme işlemleri
          </li>
          <li>
            <strong>Google Analytics:</strong> Anonim site analizi
          </li>
          <li>
            <strong>Resend:</strong> E-posta bildirimleri
          </li>
          <li>
            <strong>Supabase:</strong> Veri depolama (AB sunucuları)
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Veri Güvenliği',
    content: (
      <p>
        Kişisel verileriniz SSL/TLS şifrelemesi ile iletilmekte, güvenli sunucularda
        saklanmaktadır. Ödeme bilgileri PCI-DSS uyumlu iyzico altyapısında işlenmekte; kart
        numarası tarafımızca hiçbir şekilde saklanmamaktadır.
      </p>
    ),
  },
  {
    title: '5. Veri Saklama Süresi',
    content: (
      <p>
        Rezervasyon ve müşteri verileri yasal yükümlülükler kapsamında 10 yıl saklanır. Pazarlama
        verileri onayın geri alınmasıyla 30 gün içinde silinir.
      </p>
    ),
  },
  {
    title: '6. İletişim',
    content: (
      <p>
        Gizlilik politikamıza ilişkin sorularınız için:{' '}
        <a href="mailto:gizlilik@nonnoblue.com" style={{ color: 'var(--teal)' }}>
          gizlilik@nonnoblue.com
        </a>
      </p>
    ),
  },
];

const SECTIONS_EN = [
  {
    title: '1. General Information',
    content: (
      <p>
        This Privacy and Cookie Policy explains how data collected while using the website at
        nonnoblue.com and our services, operated by NonnoBlue Maritime and Tourism Inc., is
        processed.
      </p>
    ),
  },
  {
    title: '2. Cookies',
    content: (
      <>
        <p>Our website uses the following types of cookies:</p>
        <ul>
          <li>
            <strong>Essential cookies:</strong> Session management, security
          </li>
          <li>
            <strong>Analytics cookies:</strong> Anonymous usage statistics (Google Analytics)
          </li>
          <li>
            <strong>Marketing cookies:</strong> Personalized advertisements (with consent only)
          </li>
        </ul>
        <p>You can manage cookies through your browser settings.</p>
      </>
    ),
  },
  {
    title: '3. Third-Party Services',
    content: (
      <>
        <p>Our website uses the following third-party services:</p>
        <ul>
          <li>
            <strong>iyzico:</strong> Payment processing
          </li>
          <li>
            <strong>Google Analytics:</strong> Anonymous site analytics
          </li>
          <li>
            <strong>Resend:</strong> Email notifications
          </li>
          <li>
            <strong>Supabase:</strong> Data storage (EU servers)
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Data Security',
    content: (
      <p>
        Your personal data is transmitted via SSL/TLS encryption and stored on secure servers.
        Payment information is processed through PCI-DSS compliant iyzico infrastructure; card
        numbers are never stored by us.
      </p>
    ),
  },
  {
    title: '5. Data Retention',
    content: (
      <p>
        Reservation and customer data is retained for 10 years in accordance with legal
        obligations. Marketing data is deleted within 30 days of consent withdrawal.
      </p>
    ),
  },
  {
    title: '6. Contact',
    content: (
      <p>
        For questions about our privacy policy:{' '}
        <a href="mailto:gizlilik@nonnoblue.com" style={{ color: 'var(--teal)' }}>
          gizlilik@nonnoblue.com
        </a>
      </p>
    ),
  },
];

export default function GizlilikPage() {
  const t = useTranslations('privacy');
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
