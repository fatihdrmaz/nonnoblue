'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  code: string
  status: string
  start_date: string
  end_date: string
  guest_count: number
  total_amount: number
  deposit_amount: number
  balance_amount: number
  guest_name: string | null
  guest_email: string | null
  boats: { name: string } | null
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Bekliyor', color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  confirmed: { label: 'Onaylı',  color: '#065f46', bg: 'rgba(16,185,129,.12)' },
  completed: { label: 'Tamamlandı', color: 'var(--muted)', bg: 'var(--foam)' },
  cancelled: { label: 'İptal',   color: '#991b1b', bg: 'rgba(239,68,68,.12)' },
}

const FILTERS = [
  { k: 'all',       l: 'Tümü' },
  { k: 'pending',   l: 'Bekleyen' },
  { k: 'confirmed', l: 'Onaylı' },
  { k: 'cancelled', l: 'İptal' },
]

export default function AdminRezervasyonlarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('bookings')
      .select('id,code,status,start_date,end_date,guest_count,total_amount,deposit_amount,balance_amount,guest_name,guest_email,boats(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookings((data ?? []) as Booking[])
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, newStatus: string) {
    const supabase = createClient()
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter
    const guest = b.profiles?.full_name || b.profiles?.email || ''
    const matchSearch = search === '' ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      (b.guest_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (b.guest_email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (b.boats?.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Rezervasyonlar</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{loading ? '…' : `${filtered.length} rezervasyon`}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            placeholder="Kod, müşteri, tekne ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280, fontSize: 13 }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {FILTERS.map(t => (
          <button key={t.k} onClick={() => setFilter(t.k)} style={{
            padding: '6px 14px', fontSize: 13, fontWeight: 600,
            border: '1px solid var(--line)',
            background: filter === t.k ? 'var(--deep)' : 'var(--card)',
            color: filter === t.k ? '#fff' : 'var(--ink)',
            borderRadius: 99, cursor: 'pointer',
          }}>
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--foam)', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {['Kod', 'Müşteri', 'Tekne', 'Tarih', 'Toplam', 'Ödenen', 'Durum', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Yükleniyor…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Rezervasyon bulunamadı.</td></tr>
            )}
            {filtered.map(r => {
              const guest = r.guest_name || r.guest_email || '—'
              const guestEmail = r.guest_email
              const cfg = STATUS_MAP[r.status] ?? STATUS_MAP.pending
              const paid = r.total_amount - r.balance_amount
              return (
                <tr key={r.id} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink)' }}>{r.code}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{guest}</div>
                    {guestEmail && guest !== guestEmail && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{guestEmail}</div>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{r.boats?.name ?? '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>
                    {r.start_date} → {r.end_date}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>€{r.total_amount.toLocaleString('tr-TR')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: paid >= r.total_amount ? '#10b981' : paid > 0 ? '#f59e0b' : 'var(--muted)' }}>
                      €{paid.toLocaleString('tr-TR')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 9px', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, borderRadius: 99 }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {r.status === 'pending' && (
                        <button onClick={() => updateStatus(r.id, 'confirmed')} className="btn btn-primary btn-sm">
                          Onayla
                        </button>
                      )}
                      {r.status !== 'cancelled' && r.status !== 'completed' && (
                        <button onClick={() => updateStatus(r.id, 'cancelled')} className="btn btn-ghost btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }}>
                          İptal
                        </button>
                      )}
                      {r.status === 'confirmed' && (
                        <button onClick={() => updateStatus(r.id, 'completed')} className="btn btn-ghost btn-sm">
                          Tamamlandı
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
    </>
  )
}
