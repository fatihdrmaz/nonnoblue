'use client'

import { BOATS } from '@/data/mock'

const MOCK_RESERVATIONS = [
  { id: 1, code: 'NB-2025-001', guest: 'Elif Demir', email: 'elif@ex.com', boat: 'Ivan Nonno', route: 'Göcek – Fethiye', start: '12.07.2025', end: '19.07.2025', pax: 4, status: 'tamamlandı', total: 8400, paid: true },
  { id: 2, code: 'NB-2025-002', guest: 'Marco Rossi', email: 'marco@ex.com', boat: 'Carmelina', route: 'Bodrum – Datça', start: '05.08.2025', end: '12.08.2025', pax: 6, status: 'onaylandı', total: 11200, paid: true },
  { id: 3, code: 'NB-2026-001', guest: 'Thomas Weber', email: 'thomas@ex.com', boat: 'Rena', route: 'Marmaris Turu', start: '14.06.2026', end: '21.06.2026', pax: 4, status: 'bekliyor', total: 7800, paid: false },
  { id: 4, code: 'NB-2026-002', guest: 'Aylin Yılmaz', email: 'aylin@ex.com', boat: 'Ayza 1', route: 'Fethiye – Kaş', start: '02.07.2026', end: '09.07.2026', pax: 8, status: 'bekliyor', total: 14600, paid: false },
]

const BOAT_STATUS: Record<string, boolean> = {
  'Ivan Nonno': false,
  'Ayza 1': true,
  'Rena': true,
  'Carmelina': true,
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  tamamlandı: { bg: '#dcfce7', color: '#166534' },
  onaylandı: { bg: '#dbeafe', color: '#1e40af' },
  bekliyor: { bg: '#fef9c3', color: '#854d0e' },
  iptal: { bg: '#fee2e2', color: '#991b1b' },
}

const STATS = [
  { label: 'Toplam Rezervasyon', value: '4', icon: '📋', bg: 'var(--teal, #0d9488)', color: '#fff' },
  { label: 'Bu Ay Gelir', value: '₺42.000', icon: '💰', bg: 'var(--deep, #0b2540)', color: '#fff' },
  { label: 'Aktif Tekne', value: String(BOATS.length), icon: '🚢', bg: 'var(--foam, #e0f2fe)', color: 'var(--deep, #0b2540)' },
  { label: 'Bekleyen', value: '2', icon: '⏳', bg: '#fef9c3', color: '#854d0e' },
]

export default function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{
            background: s.bg,
            color: s.color,
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        {/* Son Rezervasyonlar */}
        <div style={{
          background: 'var(--card, #fff)',
          borderRadius: 12,
          border: '1px solid var(--line, #e5e7eb)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line, #e5e7eb)' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink, #1e293b)' }}>
              Son Rezervasyonlar
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg, #f4f6f8)' }}>
                  {['Kod', 'Misafir', 'Tekne', 'Tarih', 'Durum', 'Tutar'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--deep, #0b2540)',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_RESERVATIONS.map((r, i) => {
                  const st = STATUS_STYLES[r.status] ?? { bg: '#f3f4f6', color: '#374151' }
                  return (
                    <tr key={r.id} style={{ borderTop: '1px solid var(--line, #e5e7eb)', background: i % 2 === 0 ? '#fff' : 'var(--bg, #f9fafb)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--teal, #0d9488)', whiteSpace: 'nowrap' }}>{r.code}</td>
                      <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>{r.guest}</td>
                      <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>{r.boat}</td>
                      <td style={{ padding: '10px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{r.start}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          background: st.bg,
                          color: st.color,
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>{r.status}</span>
                      </td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        ₺{r.total.toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filo Durumu */}
        <div style={{
          background: 'var(--card, #fff)',
          borderRadius: 12,
          border: '1px solid var(--line, #e5e7eb)',
          overflow: 'hidden',
          alignSelf: 'start',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line, #e5e7eb)' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink, #1e293b)' }}>
              Filo Durumu
            </h2>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BOATS.map((b) => {
              const available = BOAT_STATUS[b.name] ?? true
              return (
                <div key={b.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--line, #e5e7eb)',
                  background: available ? '#f0fdf4' : '#fef2f2',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink, #1e293b)' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{b.model} · {b.marina}</div>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: available ? '#166534' : '#991b1b',
                    background: available ? '#dcfce7' : '#fee2e2',
                    padding: '3px 8px',
                    borderRadius: 10,
                    whiteSpace: 'nowrap',
                  }}>
                    {available ? 'Müsait' : 'Dolu'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
