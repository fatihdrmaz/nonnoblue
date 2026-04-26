'use client'

import { useState } from 'react'

type ReservationStatus = 'bekliyor' | 'onaylandı' | 'tamamlandı' | 'iptal'

interface Reservation {
  id: number
  code: string
  guest: string
  email: string
  boat: string
  route: string
  start: string
  end: string
  pax: number
  status: ReservationStatus
  total: number
  paid: boolean
}

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 1, code: 'NB-2025-001', guest: 'Elif Demir', email: 'elif@ex.com', boat: 'Ivan Nonno', route: 'Göcek – Fethiye', start: '12.07.2025', end: '19.07.2025', pax: 4, status: 'tamamlandı', total: 8400, paid: true },
  { id: 2, code: 'NB-2025-002', guest: 'Marco Rossi', email: 'marco@ex.com', boat: 'Carmelina', route: 'Bodrum – Datça', start: '05.08.2025', end: '12.08.2025', pax: 6, status: 'onaylandı', total: 11200, paid: true },
  { id: 3, code: 'NB-2026-001', guest: 'Thomas Weber', email: 'thomas@ex.com', boat: 'Rena', route: 'Marmaris Turu', start: '14.06.2026', end: '21.06.2026', pax: 4, status: 'bekliyor', total: 7800, paid: false },
  { id: 4, code: 'NB-2026-002', guest: 'Aylin Yılmaz', email: 'aylin@ex.com', boat: 'Ayza 1', route: 'Fethiye – Kaş', start: '02.07.2026', end: '09.07.2026', pax: 8, status: 'bekliyor', total: 14600, paid: false },
]

const STATUS_STYLES: Record<ReservationStatus, { bg: string; color: string }> = {
  tamamlandı: { bg: '#dcfce7', color: '#166534' },
  onaylandı: { bg: '#dbeafe', color: '#1e40af' },
  bekliyor: { bg: '#fef9c3', color: '#854d0e' },
  iptal: { bg: '#fee2e2', color: '#991b1b' },
}

const STATUS_FILTER_OPTIONS = ['Tümü', 'bekliyor', 'onaylandı', 'tamamlandı', 'iptal']

export default function AdminRezervasyonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tümü')

  const filtered = reservations.filter((r) => {
    const matchSearch =
      search === '' ||
      r.guest.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Tümü' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id: number, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'var(--card, #fff)',
        borderRadius: 10,
        border: '1px solid var(--line, #e5e7eb)',
        padding: '14px 16px',
      }}>
        <input
          type="text"
          placeholder="Misafir adı veya rezervasyon kodu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: '8px 12px',
            border: '1px solid var(--line, #e5e7eb)',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
            color: 'var(--ink, #1e293b)',
            background: 'var(--bg, #f9fafb)',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--line, #e5e7eb)',
            borderRadius: 8,
            fontSize: 14,
            color: 'var(--ink, #1e293b)',
            background: 'var(--bg, #f9fafb)',
            cursor: 'pointer',
          }}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'Tümü' ? 'Tüm Durumlar' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
          {filtered.length} rezervasyon
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--card, #fff)',
        borderRadius: 12,
        border: '1px solid var(--line, #e5e7eb)',
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg, #f4f6f8)', borderBottom: '1px solid var(--line, #e5e7eb)' }}>
              {['Kod', 'Misafir', 'E-posta', 'Tekne', 'Rota', 'Tarihler', 'Kişi', 'Durum', 'Tutar', 'Ödeme', 'İşlemler'].map((h) => (
                <th key={h} style={{
                  padding: '12px 14px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'var(--deep, #0b2540)',
                  whiteSpace: 'nowrap',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  Eşleşen rezervasyon bulunamadı.
                </td>
              </tr>
            )}
            {filtered.map((r, i) => {
              const st = STATUS_STYLES[r.status]
              return (
                <tr key={r.id} style={{
                  borderTop: '1px solid var(--line, #e5e7eb)',
                  background: i % 2 === 0 ? '#fff' : 'var(--bg, #fafafa)',
                }}>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: 'var(--teal, #0d9488)', whiteSpace: 'nowrap' }}>
                    {r.code}
                  </td>
                  <td style={{ padding: '11px 14px', fontWeight: 500, whiteSpace: 'nowrap' }}>{r.guest}</td>
                  <td style={{ padding: '11px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{r.email}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>{r.boat}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', color: '#475569' }}>{r.route}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', color: '#475569' }}>
                    {r.start} – {r.end}
                  </td>
                  <td style={{ padding: '11px 14px', textAlign: 'center' }}>{r.pax}</td>
                  <td style={{ padding: '11px 14px' }}>
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
                  <td style={{ padding: '11px 14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    ₺{r.total.toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: r.paid ? '#166534' : '#991b1b',
                      background: r.paid ? '#dcfce7' : '#fee2e2',
                      padding: '3px 8px',
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}>
                      {r.paid ? 'Ödendi' : 'Bekliyor'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status === 'bekliyor' && (
                        <button
                          onClick={() => updateStatus(r.id, 'onaylandı')}
                          style={{
                            background: 'var(--teal, #0d9488)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '5px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Onayla
                        </button>
                      )}
                      {r.status !== 'iptal' && r.status !== 'tamamlandı' && (
                        <button
                          onClick={() => updateStatus(r.id, 'iptal')}
                          style={{
                            background: 'transparent',
                            color: '#dc2626',
                            border: '1px solid #dc2626',
                            borderRadius: 6,
                            padding: '5px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          İptal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
