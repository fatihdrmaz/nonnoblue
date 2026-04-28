'use client'

import { useState } from 'react'

type Template = {
  id: string
  name: string
  subject: string
  description: string
  preview: React.ReactNode
}

function EmailPreview({ type }: { type: string }) {
  const styles = {
    wrap: { background: '#f4f7fb', padding: 20, borderRadius: 8, fontFamily: 'Arial, sans-serif', fontSize: 13 } as React.CSSProperties,
    card: { background: '#fff', borderRadius: 8, overflow: 'hidden', maxWidth: 420, margin: '0 auto' } as React.CSSProperties,
    header: { background: '#0a1f3d', padding: '16px 24px', textAlign: 'center' as const },
    body: { padding: '20px 24px' },
    footer: { padding: '12px 24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' as const, fontSize: 11, color: '#94a3b8' },
    btn: { display: 'inline-block', background: '#0a1f3d', color: '#fff', padding: '10px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 13, margin: '8px 0' } as React.CSSProperties,
    label: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 2 },
  }
  const Logo = () => (
    <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
      Nonno<span style={{ color: '#38bdf8' }}>Blue</span>
      <span style={{ display: 'block', fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Tekne Kiralama</span>
    </div>
  )

  if (type === 'magic-link') return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}><Logo /></div>
        <div style={styles.body}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#0f172a' }}>Merhaba,</p>
          <p style={{ margin: '0 0 16px', color: '#475569', lineHeight: 1.6 }}>Hesabınıza giriş için aşağıdaki butona tıklayın. Bu bağlantı 10 dakika geçerlidir.</p>
          <div style={{ textAlign: 'center' }}><a href="#" style={styles.btn}>Hesabıma giriş yap →</a></div>
          <p style={{ margin: '12px 0 0', fontSize: 11, color: '#94a3b8' }}>Bu e-postayı siz talep etmediyseniz güvenle yok sayabilirsiniz.</p>
        </div>
        <div style={styles.footer}>nonnoblue.com</div>
      </div>
    </div>
  )

  if (type === 'rezervasyon-onay') return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}><Logo /></div>
        <div style={styles.body}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0f172a' }}>Rezervasyon Talebiniz Alındı!</p>
          <p style={{ margin: '0 0 16px', color: '#475569', fontSize: 12, lineHeight: 1.6 }}>En geç 24 saat içinde size dönüş yapacağız.</p>
          <div style={{ background: '#f8fafc', borderRadius: 6, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><p style={styles.label}>Rezervasyon Kodu</p><p style={{ margin: 0, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>NB-2026-XXXX</p></div>
              <div><p style={styles.label}>Tekne</p><p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>Ivan Nonno</p></div>
              <div><p style={styles.label}>Başlangıç</p><p style={{ margin: 0, color: '#334155' }}>2026-07-12</p></div>
              <div><p style={styles.label}>Bitiş</p><p style={{ margin: 0, color: '#334155' }}>2026-07-19</p></div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}><a href="#" style={styles.btn}>Rezervasyonumu Görüntüle</a></div>
        </div>
        <div style={styles.footer}>nonnoblue.com</div>
      </div>
    </div>
  )

  if (type === 'hatirlatici') return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}><Logo /></div>
        <div style={styles.body}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#0f172a' }}>Seyahatinize 24 saat kaldı!</p>
          <p style={{ margin: '0 0 12px', color: '#475569', lineHeight: 1.6, fontSize: 12 }}>Yarın başlayan seyahatiniz için hazırlıklarınızı tamamlamayı unutmayın.</p>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#166534', fontSize: 12 }}>Ivan Nonno — Yarın 09:00</p>
            <p style={{ margin: '2px 0 0', color: '#166534', fontSize: 11 }}>D-Marin Göcek · İskele 14</p>
          </div>
          <div style={{ textAlign: 'center' }}><a href="#" style={styles.btn}>Detayları Görüntüle</a></div>
        </div>
        <div style={styles.footer}>nonnoblue.com</div>
      </div>
    </div>
  )

  if (type === 'iptal') return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}><Logo /></div>
        <div style={styles.body}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#0f172a' }}>Rezervasyonunuz İptal Edildi</p>
          <p style={{ margin: '0 0 12px', color: '#475569', lineHeight: 1.6, fontSize: 12 }}>NB-2026-XXXX kodlu rezervasyonunuz iptal edilmiştir. Herhangi bir sorunuz için bize ulaşabilirsiniz.</p>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ margin: 0, color: '#991b1b', fontSize: 12 }}>İptal tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
          <div style={{ textAlign: 'center' }}><a href="#" style={{ ...styles.btn, background: '#0f172a' }}>Yeni Rezervasyon Oluştur</a></div>
        </div>
        <div style={styles.footer}>nonnoblue.com</div>
      </div>
    </div>
  )

  return null
}

const TEMPLATES = [
  { id: 'magic-link',        name: 'Magic Link',           subject: 'NonnoBlue — Giriş bağlantınız',         description: 'Kullanıcı magic link ile giriş yapmak istediğinde otomatik gönderilir.' },
  { id: 'rezervasyon-onay',  name: 'Rezervasyon Onayı',    subject: 'Rezervasyon Talebiniz Alındı — NonnoBlue', description: 'Rezervasyon formu doldurulduğunda müşteriye otomatik gönderilir.' },
  { id: 'hatirlatici',       name: 'Seyahat Hatırlatıcısı', subject: 'Yarın seyahatiniz başlıyor — NonnoBlue', description: 'Seyahat başlangıcından 24 saat önce otomatik gönderilir.' },
  { id: 'iptal',             name: 'İptal Bildirimi',      subject: 'Rezervasyonunuz İptal Edildi — NonnoBlue', description: 'Admin rezervasyonu iptal ettiğinde müşteriye gönderilir.' },
]

export default function AdminMailPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const active = TEMPLATES.find(t => t.id === selected)

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Mail şablonları</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Sistem tarafından gönderilen e-posta şablonları</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : 'repeat(2, 1fr)', gap: 16 }}>

        {/* Template list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelected(selected === t.id ? null : t.id)}
              style={{
                background: 'var(--card)',
                border: `1px solid ${selected === t.id ? 'var(--teal)' : 'var(--line)'}`,
                borderRadius: 'var(--radius)',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', background: 'var(--foam)', padding: '3px 8px', borderRadius: 4, display: 'inline-block' }}>
                    {t.subject}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: selected === t.id ? 'var(--teal)' : 'var(--muted)', flexShrink: 0, marginLeft: 12 }}>
                  {selected === t.id ? 'Önizleme ▲' : 'Önizleme ▼'}
                </span>
              </div>
            </div>
          ))}

          <div style={{ background: 'var(--foam)', border: '1px solid var(--mist)', borderRadius: 'var(--radius)', padding: '16px 20px', marginTop: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600, marginBottom: 6 }}>Şablonları düzenlemek için:</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
              Magic Link şablonu → Supabase Dashboard → Authentication → Email Templates<br />
              Rezervasyon ve diğer şablonlar → <code style={{ background: 'rgba(0,0,0,.06)', padding: '1px 5px', borderRadius: 3 }}>app/api/rezervasyon/route.ts</code>
            </p>
          </div>
        </div>

        {/* Preview panel */}
        {active && (
          <div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'sticky', top: 24 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{active.name} — Önizleme</span>
                <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>×</button>
              </div>
              <div style={{ padding: 16 }}>
                <EmailPreview type={active.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
