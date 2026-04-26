'use client'

import { useState } from 'react'

const MOCK_RESERVATIONS = [
  { id: 1, code: 'NB-2025-001', guest: 'Elif Demir', email: 'elif@ex.com', boat: 'Ivan Nonno', route: 'Göcek – Fethiye', start: '12.07.2025', end: '19.07.2025', pax: 4, status: 'tamamlandı', total: 8400, paid: true },
  { id: 2, code: 'NB-2025-002', guest: 'Marco Rossi', email: 'marco@ex.com', boat: 'Carmelina', route: 'Bodrum – Datça', start: '05.08.2025', end: '12.08.2025', pax: 6, status: 'onaylandı', total: 11200, paid: true },
  { id: 3, code: 'NB-2026-001', guest: 'Thomas Weber', email: 'thomas@ex.com', boat: 'Rena', route: 'Marmaris Turu', start: '14.06.2026', end: '21.06.2026', pax: 4, status: 'bekliyor', total: 7800, paid: false },
  { id: 4, code: 'NB-2026-002', guest: 'Aylin Yılmaz', email: 'aylin@ex.com', boat: 'Ayza 1', route: 'Fethiye – Kaş', start: '02.07.2026', end: '09.07.2026', pax: 8, status: 'bekliyor', total: 14600, paid: false },
]

const BOAT_COLORS: Record<string, string> = {
  'Ivan Nonno': 'var(--teal, #0d9488)',
  'Carmelina': '#3b82f6',
  'Rena': '#f59e0b',
  'Ayza 1': '#8b5cf6',
}

const BOAT_COLORS_BG: Record<string, string> = {
  'Ivan Nonno': '#ccfbf1',
  'Carmelina': '#dbeafe',
  'Rena': '#fef3c7',
  'Ayza 1': '#ede9fe',
}

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]
const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

function parseDate(str: string): Date {
  const [d, m, y] = str.split('.').map(Number)
  return new Date(y, m - 1, d)
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function AdminTakvimPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1)
  // Monday-based: 0=Mon..6=Sun
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const cells: Array<Date | null> = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push(null)
    } else {
      cells.push(new Date(year, month, dayNum))
    }
  }

  // Map reservations by start date
  const getReservationsForDay = (date: Date) => {
    return MOCK_RESERVATIONS.filter((r) => {
      const start = parseDate(r.start)
      return isSameDay(start, date)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Calendar header */}
      <div style={{
        background: 'var(--card, #fff)',
        border: '1px solid var(--line, #e5e7eb)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {/* Month nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--line, #e5e7eb)',
        }}>
          <button
            onClick={prevMonth}
            style={{
              background: 'var(--bg, #f4f6f8)',
              border: '1px solid var(--line, #e5e7eb)',
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink, #1e293b)',
            }}
          >
            ‹ Önceki
          </button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--deep, #0b2540)' }}>
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            style={{
              background: 'var(--bg, #f4f6f8)',
              border: '1px solid var(--line, #e5e7eb)',
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink, #1e293b)',
            }}
          >
            Sonraki ›
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line, #e5e7eb)' }}>
          {DAY_NAMES.map((d) => (
            <div key={d} style={{
              padding: '10px 8px',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((date, idx) => {
            const isToday = date ? isSameDay(date, today) : false
            const dayReservations = date ? getReservationsForDay(date) : []
            return (
              <div
                key={idx}
                style={{
                  minHeight: 80,
                  padding: '8px',
                  borderRight: idx % 7 !== 6 ? '1px solid var(--line, #e5e7eb)' : 'none',
                  borderBottom: idx < cells.length - 7 ? '1px solid var(--line, #e5e7eb)' : 'none',
                  background: !date ? 'var(--bg, #f9fafb)' : isToday ? '#f0fdfa' : '#fff',
                  position: 'relative',
                }}
              >
                {date && (
                  <>
                    <span style={{
                      display: 'inline-flex',
                      width: 26,
                      height: 26,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? '#fff' : 'var(--ink, #1e293b)',
                      background: isToday ? 'var(--teal, #0d9488)' : 'transparent',
                    }}>
                      {date.getDate()}
                    </span>
                    <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {dayReservations.map((r) => (
                        <div
                          key={r.id}
                          title={`${r.guest} — ${r.boat} (${r.route})`}
                          style={{
                            background: BOAT_COLORS_BG[r.boat] ?? '#f3f4f6',
                            color: BOAT_COLORS[r.boat] ?? '#374151',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: 4,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            borderLeft: `3px solid ${BOAT_COLORS[r.boat] ?? '#374151'}`,
                          }}
                        >
                          {r.boat.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        background: 'var(--card, #fff)',
        border: '1px solid var(--line, #e5e7eb)',
        borderRadius: 10,
        padding: '14px 20px',
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tekneler:
        </span>
        {Object.entries(BOAT_COLORS).map(([boat, color]) => (
          <div key={boat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: 3,
              background: color,
            }} />
            <span style={{ fontSize: 13, color: 'var(--ink, #1e293b)' }}>{boat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
