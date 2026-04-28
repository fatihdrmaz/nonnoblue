export default function GizlilikPage() {
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
          Gizlilik Politikası
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

          <Section title="1. Genel Bilgi">
            <p>
              Bu Gizlilik Politikası, NonnoBlue Denizcilik ve Turizm A.Ş. olarak nonnoblue.com adresindeki web sitemizi ve hizmetlerimizi kullanırken toplanan verilerin nasıl işlendiğini açıklamaktadır.
            </p>
          </Section>

          <Section title="2. Çerezler (Cookies)">
            <p>Sitemiz aşağıdaki çerez türlerini kullanmaktadır:</p>
            <ul>
              <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi, güvenlik</li>
              <li><strong>Analitik çerezler:</strong> Anonim kullanım istatistikleri (Google Analytics)</li>
              <li><strong>Pazarlama çerezleri:</strong> Kişiselleştirilmiş reklamlar (yalnızca onay ile)</li>
            </ul>
            <p>Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.</p>
          </Section>

          <Section title="3. Üçüncü Taraf Hizmetler">
            <p>Sitemiz aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:</p>
            <ul>
              <li><strong>iyzico:</strong> Ödeme işlemleri</li>
              <li><strong>Google Analytics:</strong> Anonim site analizi</li>
              <li><strong>Resend:</strong> E-posta bildirimleri</li>
              <li><strong>Supabase:</strong> Veri depolama (EU sunucuları)</li>
            </ul>
          </Section>

          <Section title="4. Veri Güvenliği">
            <p>
              Kişisel verileriniz SSL/TLS şifrelemesi ile iletilmekte, güvenli sunucularda saklanmaktadır. Ödeme bilgileri PCI-DSS uyumlu iyzico altyapısında işlenmekte; kart numarası tarafımızca hiçbir şekilde saklanmamaktadır.
            </p>
          </Section>

          <Section title="5. Veri Saklama Süresi">
            <p>
              Rezervasyon ve müşteri verileri yasal yükümlülükler kapsamında 10 yıl saklanır. Pazarlama verileri onayın geri alınmasıyla 30 gün içinde silinir.
            </p>
          </Section>

          <Section title="6. İletişim">
            <p>
              Gizlilik politikamıza ilişkin sorularınız için:{" "}
              <a href="mailto:gizlilik@nonnoblue.com" style={{ color: "var(--teal)" }}>
                gizlilik@nonnoblue.com
              </a>
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
