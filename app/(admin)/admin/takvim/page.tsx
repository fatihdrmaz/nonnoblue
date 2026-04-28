'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Boat = { id: string; name: string; model: string }
type AvailRow = { boat_id: string; start_date: string; end_date: string; status: string }
type BookingRow = { boat_id: string; start_date: string; end_date: string; code: string; status: string }

type CellStatus = 'free' | 'sold' | 'blocked' | 'option'

const COLORS: Record<CellStatus, { bg: string; c: string; l: string }> = {
  free:    { bg: 'var(--foam)',            c: 'var(--muted)', l: 'Müsait' },
  sold:    { bg: 'rgba(16,185,129,.15)',   c: '#059669',      l: 'Satıldı' },
  blocked: { bg: 'rgba(107,114,128,.18)',  c: '#374151',      l: 'Bloke' },
  option:  { bg: 'rgba(245,158,11,.15)',   c: '#d97706',      l: 'Opsiyonlu' },
}

const CYCLE: CellStatus[] = ['free', 'option', 'sold', 'blocked']

function getWeeks(count = 16): { label: string; from: Date; iso: string }[] {
  const weeks = []
  const start = new Date()
  // Charter haftaları Cumartesi başlar — en yakın geçmiş Cumartesi'ye geri al
  // getDay(): 0=Paz,1=Pzt,...,6=Cmt → daysBack=(getDay()+1)%7
  start.setDate(start.getDate() - (start.getDay() + 1) % 7)
  start.setHours(0, 0, 0, 0)
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i * 7)
    weeks.push({
      label: `${d.getDate()} ${months[d.getMonth()]}`,
      from: d,
      iso: d.toISOString().slice(0, 10),
    })
  }
  return weeks
}

function dateInRange(weekFrom: Date, rowStart: string, rowEnd: string): boolean {
  const wFrom = weekFrom.getTime()
  const wTo = wFrom + 6 * 86400000
  const rFrom = new Date(rowStart).getTime()
  const rTo = new Date(rowEnd).getTime()
  return wFrom <= rTo && wTo >= rFrom
}

export default function AdminTakvimPage() {
  const [boats, setBoats] = useState<Boat[]>([])
  const [availability, setAvailability] = useState<AvailRow[]>([])
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [grid, setGrid] = useState<Record<string, CellStatus[]>>({})
  const [boatFilter, setBoatFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const weeks = getWeeks(16)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const [{ data: boatData }, { data: availData }, { data: bkgData }] = await Promise.all([
        supabase.from('boats').select('id,name,model').eq('active', true).order('display_order'),
        supabase.from('boat_availability').select('boat_id,start_date,end_date,status'),
        supabase.from('bookings').select('boat_id,start_date,end_date,code,status').neq('status', 'cancelled'),
      ])

      const boatList = (boatData ?? []) as Boat[]
      const avail = (availData ?? []) as AvailRow[]
      const bkgs = (bkgData ?? []) as BookingRow[]

      setBoats(boatList)
      setAvailability(avail)
      setBookings(bkgs)

      const g: Record<string, CellStatus[]> = {}
      boatList.forEach(b => {
        g[b.id] = weeks.map(w => {
          const booking = bkgs.find(bk => bk.boat_id === b.id && dateInRange(w.from, bk.start_date, bk.end_date))
          if (booking) return 'sold'
          const blocked = avail.find(a => a.boat_id === b.id && dateInRange(w.from, a.start_date, a.end_date))
          if (blocked?.status === 'blocked' || blocked?.status === 'maintenance') return 'blocked'
          if (blocked?.status === 'option') return 'option'
          if (blocked?.status === 'sold') return 'sold'
          return 'free'
        })
      })
      setGrid(g)
      setLoading(false)
    })()
  }, [])

  async function cycleCell(boatId: string, weekIdx: number) {
    const cur = grid[boatId]?.[weekIdx] ?? 'free'
    const next = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length]

    setGrid(prev => ({
      ...prev,
      [boatId]: prev[boatId].map((v, i) => i === weekIdx ? next : v),
    }))

    const supabase = createClient()
    const w = weeks[weekIdx]

    if (next === 'free') {
      await supabase.from('boat_availability')
        .delete()
        .eq('boat_id', boatId)
        .eq('start_date', w.iso)
    } else {
      const endDate = new Date(w.from); endDate.setDate(endDate.getDate() + 6)
      const endIso = endDate.toISOString().slice(0, 10)
      const statusMap: Record<string, string> = { option: 'option', sold: 'sold', blocked: 'blocked' }
      await supabase.from('boat_availability').upsert({
        boat_id: boatId,
        start_date: w.iso,
        end_date: endIso,
        status: statusMap[next],
      }, { onConflict: 'boat_id,start_date' })
    }
  }

  const visible = boatFilter === 'all' ? boats : boats.filter(b => b.id === boatFilter)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Takvim & müsaitlik</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Tıklayarak durum değiştir</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" style={{ padding: '8px 12px', fontSize: 13 }} value={boatFilter} onChange={e => setBoatFilter(e.target.value)}>
            <option value="all">Tüm filo</option>
            {boats.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 12 }}>
        {(Object.entries(COLORS) as [CellStatus, typeof COLORS[CellStatus]][]).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: v.bg, border: `1px solid ${v.c}` }} />
            <span style={{ color: 'var(--muted)' }}>{v.l}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', padding: 32 }}>Yükleniyor…</p>
      ) : (
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1100 }}>
            <thead>
              <tr style={{ background: 'var(--foam)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', position: 'sticky', left: 0, background: 'var(--foam)', minWidth: 160, borderRight: '1px solid var(--line)' }}>
                  Tekne
                </th>
                {weeks.map((w, i) => {
                  const fri = new Date(w.from); fri.setDate(fri.getDate() + 6)
                  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
                  const endLabel = `${fri.getDate()} ${months[fri.getMonth()]}`
                  return (
                    <th key={i} style={{ padding: '10px 6px', fontWeight: 600, color: 'var(--muted)', minWidth: 80, textAlign: 'center', borderRight: '1px solid var(--line)', fontSize: 11 }}>
                      <div>{w.label}</div>
                      <div style={{ fontWeight: 400, fontSize: 10, opacity: 0.7 }}>– {endLabel}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {visible.map(b => (
                <tr key={b.id}>
                  <td style={{ padding: 14, position: 'sticky', left: 0, background: 'var(--card)', borderRight: '1px solid var(--line)', borderTop: '1px solid var(--line)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{b.model}</div>
                  </td>
                  {(grid[b.id] ?? weeks.map(() => 'free' as CellStatus)).map((s, i) => {
                    const c = COLORS[s as CellStatus]
                    return (
                      <td key={i} onClick={() => cycleCell(b.id, i)} style={{ padding: 0, borderRight: '1px solid var(--line)', borderTop: '1px solid var(--line)', cursor: 'pointer' }}>
                        <div style={{ height: 46, background: c.bg, color: c.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                          {s === 'sold' ? '€' : s === 'blocked' ? '✕' : s === 'option' ? '?' : ''}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, padding: 16, background: 'var(--foam)', borderRadius: 10, fontSize: 13, color: 'var(--muted)' }}>
        💡 Bir hücreye tıklayarak durumlar arası geçiş yapabilirsiniz (Müsait → Opsiyonlu → Satıldı → Bloke).
      </div>
    </>
  )
}
