'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Customer = {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  country: string | null
  created_at: string
  bookingCount: number
  totalSpent: number
  lastBooking: string | null
}

export default function AdminMusterilerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id,full_name,email,phone,country,created_at,role')
        .or('role.is.null,role.neq.admin')
        .order('created_at', { ascending: false })

      if (!profiles) { setLoading(false); return }

      const { data: bookings } = await supabase
        .from('bookings')
        .select('user_id,total_amount,start_date,status')

      const customers: Customer[] = profiles.map(p => {
        const bkgs = (bookings ?? []).filter(b => b.user_id === p.id && b.status !== 'cancelled')
        const sorted = [...bkgs].sort((a, b) => b.start_date.localeCompare(a.start_date))
        return {
          ...p,
          bookingCount: bkgs.length,
          totalSpent: bkgs.reduce((s, b) => s + (b.total_amount || 0), 0),
          lastBooking: sorted[0]?.start_date ?? null,
        }
      })

      setCustomers(customers)
      setLoading(false)
    })()
  }, [])

  const filtered = customers.filter(c => {
    if (!search) return true
    const name = c.full_name || ''
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Müşteriler</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{loading ? '…' : `${filtered.length} müşteri`}</p>
        </div>
        <input
          className="input"
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 280, fontSize: 13 }}
        />
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--foam)', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {['Müşteri', 'Ülke', 'Rezervasyon', 'Toplam harcama', 'Son seyahat', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Yükleniyor…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Müşteri bulunamadı.</td></tr>
            )}
            {filtered.map(c => {
              const name = c.full_name || c.email.split('@')[0]
              const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
              return (
                <tr key={c.id} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', background: 'var(--teal)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{c.country || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>{c.bookingCount}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink)' }}>
                    {c.totalSpent > 0 ? `€${c.totalSpent.toLocaleString('tr-TR')}` : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{c.lastBooking ?? '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm">Detay</button>
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
