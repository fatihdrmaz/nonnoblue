'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Stats = {
  totalRevenue: number
  activeBookings: number
  pendingPayments: number
  pendingCount: number
}

type BoatOccupancy = {
  name: string
  bookings: number
  revenue: number
}

type RecentBooking = {
  code: string
  guest: string
  boat: string
  start_date: string
  status: string
  total_amount: number
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Bekliyor',  color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  confirmed: { label: 'Onaylı',   color: '#065f46', bg: 'rgba(16,185,129,.12)' },
  completed: { label: 'Tamamlandı', color: 'var(--muted)', bg: 'var(--foam)' },
  cancelled: { label: 'İptal',    color: '#991b1b', bg: 'rgba(239,68,68,.12)' },
}

function StatCard({ label, value, delta, deltaUp, icon }: { label: string; value: string; delta?: string; deltaUp?: boolean; icon: string }) {
  return (
    <div style={{ background: 'var(--card)', padding: 22, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ width: 32, height: 32, background: 'var(--foam)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 16 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: deltaUp ? '#10b981' : '#ef4444' }}>{deltaUp ? '↑' : '↓'} {delta}</div>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, activeBookings: 0, pendingPayments: 0, pendingCount: 0 })
  const [boatOccupancy, setBoatOccupancy] = useState<BoatOccupancy[]>([])
  const [recent, setRecent] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        setAdminName(prof?.full_name || user.email?.split('@')[0] || 'Admin')
      }

      const [{ data: bookings }, { data: boats }] = await Promise.all([
        supabase.from('bookings').select('code,status,total_amount,deposit_amount,balance_amount,start_date,guest_count,user_id,boat_id,boats(name),profiles(full_name,email)'),
        supabase.from('boats').select('id,name').eq('active', true),
      ])

      if (bookings) {
        const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
        const pending = bookings.filter(b => b.status === 'pending')
        const totalRev = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.total_amount || 0), 0)
        const pendingPay = pending.reduce((s, b) => s + (b.deposit_amount || 0), 0)

        setStats({
          totalRevenue: totalRev,
          activeBookings: active.length,
          pendingPayments: pendingPay,
          pendingCount: pending.length,
        })

        // Boat occupancy
        if (boats) {
          const occ: BoatOccupancy[] = boats.map(boat => {
            const bkgs = bookings.filter(b => b.boat_id === boat.id && b.status !== 'cancelled')
            return {
              name: boat.name,
              bookings: bkgs.length,
              revenue: bkgs.reduce((s, b) => s + (b.total_amount || 0), 0),
            }
          }).sort((a, b) => b.revenue - a.revenue)
          setBoatOccupancy(occ)
        }

        // Recent bookings
        const recentList: RecentBooking[] = bookings.slice(0, 5).map(b => ({
          code: b.code,
          guest: (b.profiles as { full_name?: string; email?: string } | null)?.full_name || (b.profiles as { full_name?: string; email?: string } | null)?.email || '—',
          boat: (b.boats as { name?: string } | null)?.name || '—',
          start_date: b.start_date,
          status: b.status,
          total_amount: b.total_amount,
        }))
        setRecent(recentList)
      }

      setLoading(false)
    })()
  }, [])

  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  const maxRev = Math.max(...boatOccupancy.map(b => b.revenue), 1)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{today} · Hoş geldin {adminName}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Sezon cirosu" value={loading ? '…' : `€${stats.totalRevenue.toLocaleString('tr-TR')}`} icon="⚓" />
        <StatCard label="Aktif rezervasyon" value={loading ? '…' : String(stats.activeBookings)} icon="📅" />
        <StatCard label="Bekleyen rezervasyon" value={loading ? '…' : String(stats.pendingCount)} icon="⏳" />
        <StatCard label="Bekleyen ödeme" value={loading ? '…' : `€${stats.pendingPayments.toLocaleString('tr-TR')}`} icon="✉" />
      </div>

      {/* 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Boat occupancy */}
        <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Tekne bazında ciro</h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>2026 sezonu</span>
          </div>
          {loading ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Yükleniyor…</p>
          ) : boatOccupancy.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Henüz veri yok.</p>
          ) : (
            boatOccupancy.map(b => {
              const pct = Math.round((b.revenue / maxRev) * 100)
              return (
                <div key={b.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{b.name}</span>
                    <span style={{ color: 'var(--muted)' }}>€{b.revenue.toLocaleString('tr-TR')} · {b.bookings} rezervasyon</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--foam)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--teal), var(--cyan, #06b6d4))' }} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Recent */}
        <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 18 }}>Son rezervasyonlar</h3>
          {loading ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Yükleniyor…</p>
          ) : recent.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Henüz rezervasyon yok.</p>
          ) : (
            recent.map((r, i) => (
              <div key={r.code} style={{ padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{r.boat}</span>
                  <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>€{r.total_amount.toLocaleString('tr-TR')}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.guest} · {r.code}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent bookings table */}
      <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 18 }}>Tüm rezervasyonlar</h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Yükleniyor…</p>
        ) : recent.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Henüz rezervasyon yok.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--foam)', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {['Kod', 'Müşteri', 'Tekne', 'Tarih', 'Durum', 'Toplam'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => {
                const cfg = STATUS_MAP[r.status] ?? STATUS_MAP.pending
                return (
                  <tr key={r.code} style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink)' }}>{r.code}</td>
                    <td style={{ padding: '14px 16px' }}>{r.guest}</td>
                    <td style={{ padding: '14px 16px' }}>{r.boat}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{r.start_date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 9px', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, borderRadius: 99 }}>{cfg.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>€{r.total_amount.toLocaleString('tr-TR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
