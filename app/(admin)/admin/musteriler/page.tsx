'use client'

import { useState } from 'react'

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Elif Demir', email: 'elif@ex.com', phone: '+90 532 111 2233', bookings: 2, total: 19600, lastBooking: '05.08.2025', country: 'TR' },
  { id: 2, name: 'Marco Rossi', email: 'marco@ex.com', phone: '+39 333 456 789', bookings: 1, total: 11200, lastBooking: '12.08.2025', country: 'IT' },
  { id: 3, name: 'Thomas Weber', email: 'thomas@ex.com', phone: '+49 176 123 456', bookings: 1, total: 14600, lastBooking: '09.07.2026', country: 'DE' },
  { id: 4, name: 'Aylin Yılmaz', email: 'aylin@ex.com', phone: '+90 542 987 6543', bookings: 1, total: 7800, lastBooking: '21.06.2026', country: 'TR' },
]

const COUNTRY_FLAG: Record<string, string> = {
  TR: '🇹🇷',
  IT: '🇮🇹',
  DE: '🇩🇪',
  GB: '🇬🇧',
  FR: '🇫🇷',
}

export default function AdminMusterilerPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    search === '' ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = filtered.reduce((sum, c) => sum + c.total, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Summary bar */}
      <div style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        background: 'var(--card, #fff)',
        border: '1px solid var(--line, #e5e7eb)',
        borderRadius: 10,
        padding: '14px 20px',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: 24, flex: 1 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal, #0d9488)' }}>
              {MOCK_CUSTOMERS.length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Toplam Müşteri</div>
          </div>
          <div style={{ width: 1, background: 'var(--line, #e5e7eb)' }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--deep, #0b2540)' }}>
              ₺{MOCK_CUSTOMERS.reduce((s, c) => s + c.total, 0).toLocaleString('tr-TR')}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Toplam Gelir</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Müşteri ara (ad veya e-posta)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--line, #e5e7eb)',
            borderRadius: 8,
            fontSize: 14,
            minWidth: 240,
            outline: 'none',
            color: 'var(--ink, #1e293b)',
            background: 'var(--bg, #f9fafb)',
          }}
        />
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
              {['Müşteri', 'E-posta', 'Telefon', 'Ülke', 'Rezervasyon', 'Toplam Harcama', 'Son Rezervasyon'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px',
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
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  Eşleşen müşteri bulunamadı.
                </td>
              </tr>
            )}
            {filtered.map((c, i) => {
              const initials = c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
              const colors = ['#0d9488', '#0b2540', '#6366f1', '#f59e0b']
              const avatarBg = colors[c.id % colors.length]
              return (
                <tr key={c.id} style={{
                  borderTop: '1px solid var(--line, #e5e7eb)',
                  background: i % 2 === 0 ? '#fff' : 'var(--bg, #fafafa)',
                }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: avatarBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--ink, #1e293b)', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{c.email}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>{c.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 18, textAlign: 'center' }}>
                    {COUNTRY_FLAG[c.country] ?? c.country}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      background: 'var(--foam, #e0f2fe)',
                      color: 'var(--deep, #0b2540)',
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {c.bookings}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--teal, #0d9488)', whiteSpace: 'nowrap' }}>
                    ₺{c.total.toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{c.lastBooking}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {search && (
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          {filtered.length} sonuç · toplam ₺{totalRevenue.toLocaleString('tr-TR')}
        </p>
      )}
    </div>
  )
}
