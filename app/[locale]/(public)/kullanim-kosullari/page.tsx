export default function KullanimKosullariPage() {
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
          Kullanım Koşulları
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

          <Section title="1. Taraflar ve Kapsam">
            <p>
              Bu Kullanım Koşulları, NonnoBlue Denizcilik ve Turizm A.Ş. (&ldquo;NonnoBlue&rdquo;) ile nonnoblue.com adresini kullanan gerçek veya tüzel kişiler (&ldquo;Kullanıcı&rdquo;) arasındaki ilişkiyi düzenler.
            </p>
          </Section>

          <Section title="2. Rezervasyon ve Ödeme">
            <ul>
              <li>Rezervasyon talebi onaylanmadan kesinleşmez.</li>
              <li>Toplam ücretin %30&apos;u ön ödeme olarak tahsil edilir, kalan %70 tekne tesliminden 30 gün önce ödenir.</li>
              <li>Depozito tutarı tekneye göre değişir; hasar olmaksızın tekne iadesi sonrası 7 iş günü içinde iade edilir.</li>
              <li>Ödemeler iyzico güvenli ödeme altyapısı üzerinden gerçekleştirilir.</li>
            </ul>
          </Section>

          <Section title="3. İptal ve İade Politikası">
            <ul>
              <li><strong>60+ gün önce:</strong> Ön ödeme tam iade</li>
              <li><strong>30–59 gün önce:</strong> Ön ödemenin %50&apos;si iade</li>
              <li><strong>30 günden az:</strong> İade yapılmaz</li>
              <li>İptal mücbir sebepten kaynaklanıyorsa (fırtına, deniz yasağı vb.) tarih değişikliği ücretsiz yapılır.</li>
            </ul>
          </Section>

          <Section title="4. Kullanım Kuralları">
            <ul>
              <li>Bareboat charter için geçerli kaptanlık belgesi zorunludur.</li>
              <li>Maksimum kişi sayısı aşılamaz.</li>
              <li>Alkol tüketimi güvenlik kuralları dahilinde serbest; uyuşturucu kesinlikle yasaktır.</li>
              <li>Tekne sözleşmede belirtilen bölge dışına çıkarılamaz.</li>
              <li>Oluşan hasarlar derhal NonnoBlue&apos;ya bildirilmelidir.</li>
            </ul>
          </Section>

          <Section title="5. Sorumluluk Sınırı">
            <p>
              NonnoBlue, mücbir sebepler, hava koşulları, liman kısıtlamaları veya üçüncü tarafların eylemlerinden kaynaklanan zararlardan sorumlu tutulamaz. Tekne sigortası charter süresince geçerlidir.
            </p>
          </Section>

          <Section title="6. Uyuşmazlık Çözümü">
            <p>
              Bu sözleşmeden doğan uyuşmazlıklarda Fethiye Mahkemeleri ve İcra Daireleri yetkilidir. Türk hukuku uygulanır.
            </p>
          </Section>

          <Section title="7. Değişiklikler">
            <p>
              NonnoBlue bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar. Güncel koşullar bu sayfada yayımlanır.
            </p>
          </Section>

          <Section title="8. İletişim">
            <p>
              <a href="mailto:info@nonnoblue.com" style={{ color: "var(--teal)" }}>info@nonnoblue.com</a>
              {" · "}
              <a href="tel:+902526120000" style={{ color: "var(--teal)" }}>+90 252 612 00 00</a>
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
