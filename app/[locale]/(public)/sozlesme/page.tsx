'use client';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

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
    title: '1. Taraflar',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          <strong>Satıcı / Hizmet Sağlayıcı:</strong><br />
          NonnoBlue Denizcilik ve Turizm A.Ş.<br />
          Adres: D-Marin Göcek, 48310 Fethiye / Muğla<br />
          E-posta: ahoy@nonnoblue.com · Tel: +90 539 440 34 29
        </p>
        <p>
          <strong>Alıcı / Müşteri:</strong> Rezervasyon formunda ad-soyad, e-posta ve telefon
          bilgileri yer alan gerçek veya tüzel kişi (bundan sonra &ldquo;Müşteri&rdquo;).
        </p>
      </>
    ),
  },
  {
    title: '2. Sözleşmenin Konusu',
    content: (
      <p>
        İşbu sözleşmenin konusu; Müşteri&apos;nin www.nonnoblue.com internet sitesi üzerinden
        elektronik ortamda rezervasyon verdiği, nitelikleri ve kiralama bedeli sitede belirtilen
        tekne kiralama (yat charter) hizmetinin sunulması ile ilgili olarak 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların
        hak ve yükümlülüklerinin belirlenmesidir.
      </p>
    ),
  },
  {
    title: '3. Hizmet Bilgileri ve Bedeli',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Kiralanan teknenin adı, modeli, kiralama tarihleri, charter tipi (bareboat / skipperli /
          tam hizmet), kişi sayısı ve toplam kiralama bedeli; rezervasyon özeti ekranında ve
          Müşteri&apos;ye gönderilen rezervasyon onay e-postasında belirtilir.
        </p>
        <p>
          Fiyatlar EUR cinsindendir; ödeme anındaki kur üzerinden TL olarak da tahsil edilebilir.
          Kiralama bedeline teknenin kullanımı dahildir; yakıt, liman/demir ücretleri ve opsiyonel
          hizmetler (kaptan, hostes, transfer vb.) ayrıca ücretlendirilir.
        </p>
      </>
    ),
  },
  {
    title: '4. Ödeme Koşulları',
    content: (
      <p>
        Rezervasyonun kesinleşmesi için toplam bedelin %50&apos;si ön ödeme olarak; kalan bakiye
        teslim tarihinden en geç 30 gün önce ödenir. Ödemeler kredi kartı (3D Secure) veya banka
        havalesi/EFT ile yapılabilir. Tekne tesliminde ayrıca, tekneye göre değişen tutarda iade
        edilebilir güvence bedeli (depozito) alınır.
      </p>
    ),
  },
  {
    title: '5. Hizmetin İfası',
    content: (
      <p>
        Tekne, rezervasyonda belirtilen tarihte belirtilen marinada (Göcek) Müşteri&apos;ye teslim
        edilir. Teslimde tekne kontrol listesi ile birlikte teknik brifing yapılır. Müşteri, tekneyi
        sözleşme bitiş tarihinde aynı marinada, teslim aldığı durumda iade etmekle yükümlüdür.
        Bareboat kiralamalarda Müşteri&apos;nin geçerli yeterlilik belgesine (kaptanlık ehliyeti)
        sahip olması zorunludur.
      </p>
    ),
  },
  {
    title: '6. Cayma Hakkı ve İptal',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/1-g maddesi uyarınca; belirli bir tarihte
          yapılması gereken konaklama, eşya taşıma, araç kiralama ve eğlence-dinlenme amaçlı boş
          zaman değerlendirilmesine ilişkin hizmetlerde <strong>cayma hakkı istisnası</strong>{' '}
          uygulanır. Bu kapsamda tekne kiralama hizmetinde 14 günlük cayma hakkı bulunmamaktadır.
        </p>
        <p>
          İptal ve iade talepleri, sitede yayımlanan{' '}
          <Link href="/iptal-politikasi" style={{ color: 'var(--teal)' }}>İptal &amp; İade Koşulları</Link>
          &apos;na tabidir.
        </p>
      </>
    ),
  },
  {
    title: '7. Mücbir Sebep',
    content: (
      <p>
        Olumsuz hava koşulları nedeniyle liman çıkış yasağı, doğal afet, salgın, resmi makam
        kararları gibi tarafların kontrolü dışında gelişen durumlarda hizmet ileri bir tarihe
        ertelenir veya kullanılamayan günlerin bedeli iade edilir. Bu hallerde taraflar birbirinden
        ayrıca tazminat talep edemez.
      </p>
    ),
  },
  {
    title: '8. Kişisel Verilerin Korunması',
    content: (
      <p>
        Müşteri&apos;ye ait kişisel veriler, sitede yayımlanan{' '}
        <Link href="/kvkk" style={{ color: 'var(--teal)' }}>KVKK Aydınlatma Metni</Link> ve{' '}
        <Link href="/gizlilik" style={{ color: 'var(--teal)' }}>Gizlilik Politikası</Link>{' '}
        kapsamında işlenir.
      </p>
    ),
  },
  {
    title: '9. Uyuşmazlıkların Çözümü',
    content: (
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca ilan edilen parasal
        sınırlar dahilinde Müşteri&apos;nin yerleşim yerindeki Tüketici Hakem Heyetleri; bu sınırları
        aşan durumlarda Muğla (Fethiye) Tüketici Mahkemeleri ve İcra Daireleri yetkilidir.
      </p>
    ),
  },
  {
    title: '10. Yürürlük',
    content: (
      <p>
        Müşteri, sitede rezervasyon/ödeme adımını tamamlayarak işbu sözleşmenin tüm koşullarını
        kabul etmiş sayılır. Sözleşme, ödemenin gerçekleştiği tarihte yürürlüğe girer ve
        rezervasyon onay e-postası ile birlikte saklanır.
      </p>
    ),
  },
];

const SECTIONS_EN = [
  {
    title: '1. Parties',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          <strong>Seller / Service Provider:</strong><br />
          NonnoBlue Denizcilik ve Turizm A.Ş.<br />
          Address: D-Marin Göcek, 48310 Fethiye / Muğla, Türkiye<br />
          E-mail: ahoy@nonnoblue.com · Phone: +90 539 440 34 29
        </p>
        <p>
          <strong>Buyer / Customer:</strong> The natural or legal person whose name, e-mail and
          phone details are provided in the booking form (the &ldquo;Customer&rdquo;).
        </p>
      </>
    ),
  },
  {
    title: '2. Subject of the Agreement',
    content: (
      <p>
        This agreement sets out the rights and obligations of the parties regarding the yacht
        charter service booked electronically by the Customer via www.nonnoblue.com, pursuant to
        Turkish Consumer Protection Law No. 6502 and the Distance Contracts Regulation.
      </p>
    ),
  },
  {
    title: '3. Service Details & Price',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          The yacht name and model, charter dates, charter type (bareboat / skippered / crewed),
          number of guests and total charter fee are stated on the booking summary screen and in the
          booking confirmation e-mail sent to the Customer.
        </p>
        <p>
          Prices are quoted in EUR and may also be charged in TRY at the prevailing exchange rate.
          The charter fee covers use of the yacht; fuel, port/mooring fees and optional services
          (skipper, hostess, transfer etc.) are charged separately.
        </p>
      </>
    ),
  },
  {
    title: '4. Payment Terms',
    content: (
      <p>
        A 50% deposit confirms the booking; the balance is due no later than 30 days before
        embarkation. Payments can be made by credit card (3D Secure) or bank transfer. A refundable
        security deposit, varying by yacht, is collected at check-in.
      </p>
    ),
  },
  {
    title: '5. Performance of the Service',
    content: (
      <p>
        The yacht is handed over at the specified marina (Göcek) on the specified date, with a
        technical briefing and check-in inventory. The Customer must return the yacht at the same
        marina on the end date, in the condition received. For bareboat charters the Customer must
        hold a valid skipper&apos;s licence.
      </p>
    ),
  },
  {
    title: '6. Right of Withdrawal & Cancellation',
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Under Article 15/1-g of the Turkish Distance Contracts Regulation, services relating to
          leisure activities to be performed on a specific date — including vehicle rental and
          accommodation — are <strong>exempt from the 14-day right of withdrawal</strong>.
        </p>
        <p>
          Cancellations and refunds are governed by our{' '}
          <Link href="/iptal-politikasi" style={{ color: 'var(--teal)' }}>Cancellation &amp; Refund Policy</Link>.
        </p>
      </>
    ),
  },
  {
    title: '7. Force Majeure',
    content: (
      <p>
        In events beyond the parties&apos; control — harbour closure due to severe weather, natural
        disaster, epidemic, acts of authorities — the service is postponed or the unused days
        refunded. Neither party may claim additional compensation in such cases.
      </p>
    ),
  },
  {
    title: '8. Personal Data',
    content: (
      <p>
        The Customer&apos;s personal data is processed in accordance with our{' '}
        <Link href="/kvkk" style={{ color: 'var(--teal)' }}>KVKK Notice</Link> and{' '}
        <Link href="/gizlilik" style={{ color: 'var(--teal)' }}>Privacy Policy</Link>.
      </p>
    ),
  },
  {
    title: '9. Disputes',
    content: (
      <p>
        Consumer Arbitration Committees at the Customer&apos;s place of residence (within the
        monetary limits announced by the Ministry of Trade) and, beyond those limits, the Consumer
        Courts and Enforcement Offices of Muğla (Fethiye), Türkiye have jurisdiction.
      </p>
    ),
  },
  {
    title: '10. Entry into Force',
    content: (
      <p>
        By completing the booking/payment step on the site, the Customer is deemed to have accepted
        all terms of this agreement. The agreement enters into force on the date of payment and is
        stored together with the booking confirmation e-mail.
      </p>
    ),
  },
];

export default function SozlesmePage() {
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
          {locale === 'en' ? 'Distance Sales Agreement' : 'Mesafeli Satış Sözleşmesi'}
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
