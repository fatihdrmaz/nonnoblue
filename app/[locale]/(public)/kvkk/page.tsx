'use client';
import { useTranslations } from 'next-intl';

export default function KvkkPage() {
  const t = useTranslations('kvkk');
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{
          background: "var(--deep)",
          padding: "120px 24px 64px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "var(--teal)", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Yasal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            color: "#fff",
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px" }}>
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "40px 48px",
            lineHeight: 1.8,
            color: "var(--ink)",
          }}
        >
          <p style={{ color: "var(--mist)", fontSize: 13, marginBottom: 32 }}>
            Son güncelleme: 1 Ocak 2026
          </p>

          <Section title="1. Veri Sorumlusu">
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla <strong>NonnoBlue Denizcilik ve Turizm A.Ş.</strong> (Göcek Marina, 48310 Fethiye / Muğla) tarafından aşağıda açıklanan kapsamda işlenecektir.
            </p>
          </Section>

          <Section title="2. İşlenen Kişisel Veriler">
            <p>Hizmetlerimizden yararlanmanız kapsamında aşağıdaki veriler işlenmektedir:</p>
            <ul>
              <li>Kimlik bilgileri: Ad, soyad, T.C. kimlik numarası</li>
              <li>İletişim bilgileri: E-posta adresi, telefon numarası, adres</li>
              <li>Rezervasyon bilgileri: Tekne, tarih, kişi sayısı, güzergah</li>
              <li>Ödeme bilgileri: Kart son 4 hanesi, fatura adresi (tam kart bilgisi tarafımızca saklanmaz)</li>
              <li>Teknik veriler: IP adresi, tarayıcı bilgisi, çerezler</li>
            </ul>
          </Section>

          <Section title="3. Kişisel Verilerin İşlenme Amaçları">
            <ul>
              <li>Rezervasyon oluşturma, yönetme ve onaylama</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Müşteri hizmetleri ve destek</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Pazarlama ve tanıtım faaliyetleri (açık rıza ile)</li>
            </ul>
          </Section>

          <Section title="4. Kişisel Verilerin Aktarıldığı Taraflar">
            <p>
              Kişisel verileriniz; ödeme hizmet sağlayıcıları (iyzico), e-posta altyapı sağlayıcıları, yasal merciler ve hizmet alınan iş ortaklarıyla KVKK&apos;nın 8. ve 9. maddeleri kapsamında paylaşılabilir.
            </p>
          </Section>

          <Section title="5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi">
            <p>
              Kişisel verileriniz; web sitemiz, mobil uygulama, e-posta ve telefon kanallarıyla toplanmaktadır. İşlemenin hukuki sebepleri: sözleşmenin ifası, hukuki yükümlülük ve meşru menfaat.
            </p>
          </Section>

          <Section title="6. Veri Sahibinin Hakları">
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
              Talepleriniz için: <a href="mailto:kvkk@nonnoblue.com" style={{ color: "var(--teal)" }}>kvkk@nonnoblue.com</a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.1rem",
          color: "var(--ink)",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "2px solid var(--teal)",
          display: "inline-block",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--ink)", fontSize: 15 }}>{children}</div>
    </div>
  );
}
