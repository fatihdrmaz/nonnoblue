'use client'

import { useState, useEffect } from 'react'

type Booking = {
  id: string
  code: string
  status: string
  start_date: string
  end_date: string
  guest_count: number
  service_type: string | null
  currency: string | null
  fx_rate: number | null
  total_amount: number
  deposit_amount: number
  balance_amount: number
  iyzico_payment_id: string | null
  contract_accepted_at: string | null
  notes: string | null
  created_at: string
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  boats: { name: string } | null
  booking_extras: { name: string; price_amount: number; qty: number }[] | null
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Bekliyor', color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  awaiting_3ds: { label: 'Ödeme bekleniyor', color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  confirmed:    { label: 'Onaylı',  color: '#065f46', bg: 'rgba(16,185,129,.12)' },
  completed:    { label: 'Tamamlandı', color: 'var(--muted)', bg: 'var(--foam)' },
  cancelled:    { label: 'İptal',   color: '#991b1b', bg: 'rgba(239,68,68,.12)' },
  refunded:     { label: 'İade edildi', color: '#6b21a8', bg: 'rgba(147,51,234,.12)' },
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
  const [detail, setDetail] = useState<Booking | null>(null)

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(json => {
        setBookings((json.bookings ?? []) as Booking[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const [refunding, setRefunding] = useState(false)
  const [refundMsg, setRefundMsg] = useState('')

  async function handleRefund(booking: Booking) {
    if (!confirm(`${booking.code} — tahsil edilen ön ödeme bankaya iade edilecek. Emin misiniz?`)) return
    setRefunding(true)
    setRefundMsg('')
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      })
      const json = await res.json()
      if (!res.ok) {
        const msg = `İade başarısız: ${json.detail ?? json.error}`
        setRefundMsg(msg)
        alert(msg)
        return
      }
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'refunded' } : b))
      setDetail(prev => prev && prev.id === booking.id ? { ...prev, status: 'refunded' } : prev)
      setRefundMsg(json.method === 'void' ? 'İşlem aynı gün iptali ile geri alındı (komisyonsuz).' : 'İade bankaya gönderildi.')
    } catch {
      setRefundMsg('İade isteği gönderilemedi.')
    } finally {
      setRefunding(false)
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })
    if (!res.ok) return
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter
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
                <tr key={r.id} onClick={() => { setDetail(r); setRefundMsg('') }} style={{ borderTop: '1px solid var(--line)', cursor: 'pointer' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--teal)' }}>{r.code}</td>
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
                  <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {r.status === 'pending' && (
                        <button onClick={() => updateStatus(r.id, 'confirmed')} className="btn btn-primary btn-sm">
                          Onayla
                        </button>
                      )}
                      {['confirmed', 'balance_paid'].includes(r.status) && r.iyzico_payment_id ? (
                        <button onClick={() => handleRefund(r)} disabled={refunding} className="btn btn-ghost btn-sm" style={{ color: '#6b21a8', borderColor: '#6b21a8', cursor: refunding ? 'wait' : 'pointer' }}>
                          {refunding ? 'İade ediliyor…' : 'İade Et'}
                        </button>
                      ) : (
                        !['cancelled', 'completed', 'refunded'].includes(r.status) && (
                          <button onClick={() => updateStatus(r.id, 'cancelled')} className="btn btn-ghost btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }}>
                            İptal
                          </button>
                        )
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

      {/* Detay modalı */}
      {detail && (() => {
        const cfg = STATUS_MAP[detail.status] ?? STATUS_MAP.pending
        const paid = detail.total_amount - detail.balance_amount
        const CHARTER_LABELS: Record<string, string> = { bareboat: 'Bareboat', skippered: 'Skipperli', crewed: 'Tam Hizmet' }
        // notes içindeki yapılandırılmış alanlar zaten ayrı gösteriliyor; kalan serbest notu ayıkla
        const freeNote = (detail.notes ?? '')
          .split(' | ')
          .filter(p => !/^(Ad Soyad|E-posta|Telefon|Charter|Kaptan istendi|Rota):/.test(p))
          .map(p => p.replace(/^Notlar: /, ''))
          .join(' | ')
        const rows: [string, React.ReactNode][] = [
          ['Müşteri', detail.guest_name ?? '—'],
          ['E-posta', detail.guest_email ? <a key="e" href={`mailto:${detail.guest_email}`} style={{ color: 'var(--teal)' }}>{detail.guest_email}</a> : '—'],
          ['Telefon', detail.guest_phone ? <a key="p" href={`tel:${detail.guest_phone}`} style={{ color: 'var(--teal)' }}>{detail.guest_phone}</a> : '—'],
          ['Tekne', detail.boats?.name ?? '—'],
          ['Tarih', `${detail.start_date} → ${detail.end_date}`],
          ['Kişi sayısı', detail.guest_count ?? '—'],
          ['Charter tipi', detail.service_type ? (CHARTER_LABELS[detail.service_type] ?? detail.service_type) : '—'],
          // Kalem dökümü: tekne kiralama bedeli + booking_extras satırları
          ...(() => {
            const extras = detail.booking_extras ?? []
            if (!extras.length || !detail.total_amount) return [] as [string, React.ReactNode][]
            const extrasSum = extras.reduce((s, e) => s + e.price_amount * (e.qty || 1), 0)
            const base = detail.total_amount - extrasSum
            return [
              ['Tekne kiralama', `€${base.toLocaleString('tr-TR')}`] as [string, React.ReactNode],
              ...extras.map(e => [
                `+ ${e.name}${(e.qty || 1) > 1 ? ` × ${e.qty}` : ''}`,
                `€${(e.price_amount * (e.qty || 1)).toLocaleString('tr-TR')}`,
              ] as [string, React.ReactNode]),
            ]
          })(),
          ['Toplam', `€${detail.total_amount.toLocaleString('tr-TR')}`],
          ['Ön ödeme (%50)', `€${detail.deposit_amount.toLocaleString('tr-TR')}`],
          ['Ödenen', `€${paid.toLocaleString('tr-TR')}`],
          ['Kalan bakiye', `€${detail.balance_amount.toLocaleString('tr-TR')}`],
          ...(detail.fx_rate ? [['Kur (EUR/TRY)', `₺${Number(detail.fx_rate).toLocaleString('tr-TR', { maximumFractionDigits: 4 })}`] as [string, React.ReactNode]] : []),
          ...(detail.iyzico_payment_id ? [['Banka referans no', detail.iyzico_payment_id] as [string, React.ReactNode]] : []),
          ...(detail.contract_accepted_at ? [['Sözleşme onayı', new Date(detail.contract_accepted_at).toLocaleString('tr-TR')] as [string, React.ReactNode]] : []),
          ['Oluşturulma', new Date(detail.created_at).toLocaleString('tr-TR')],
          ...(freeNote ? [['Özel istekler', freeNote] as [string, React.ReactNode]] : []),
        ]
        return (
          <div onClick={() => setDetail(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,31,61,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', width: 'min(520px, 100%)', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{detail.code}</div>
                  <span style={{ padding: '2px 8px', background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, borderRadius: 99 }}>{cfg.label}</span>
                </div>
                <button onClick={() => setDetail(null)} aria-label="Kapat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)', lineHeight: 1 }}>✕</button>
              </div>
              <div style={{ padding: '8px 24px 20px' }}>
                {rows.map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--line-2, rgba(11,42,80,.06))', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
                    <span style={{ fontWeight: 500, color: 'var(--ink)', textAlign: 'right', wordBreak: 'break-word' }}>{val}</span>
                  </div>
                ))}
                {refundMsg && (
                  <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, fontSize: 13, background: refundMsg.startsWith('İade başarısız') || refundMsg.includes('gönderilemedi') ? '#fee2e2' : 'var(--foam)', color: refundMsg.startsWith('İade başarısız') || refundMsg.includes('gönderilemedi') ? '#991b1b' : 'var(--deep)' }}>
                    {refundMsg}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                  {detail.status === 'pending' && (
                    <button onClick={() => { updateStatus(detail.id, 'confirmed'); setDetail(null) }} className="btn btn-primary btn-sm">Onayla</button>
                  )}
                  {['confirmed', 'balance_paid'].includes(detail.status) && detail.iyzico_payment_id && (
                    <button onClick={() => handleRefund(detail)} disabled={refunding} className="btn btn-ghost btn-sm" style={{ color: '#6b21a8', borderColor: '#6b21a8', cursor: refunding ? 'wait' : 'pointer' }}>
                      {refunding ? 'İade ediliyor…' : 'İade Et'}
                    </button>
                  )}
                  {!['cancelled', 'completed', 'refunded'].includes(detail.status) && (
                    <button
                      onClick={() => {
                        const paid = ['confirmed', 'balance_paid'].includes(detail.status) && detail.iyzico_payment_id
                        if (paid && !confirm('DİKKAT: Bu rezervasyonun ödemesi alınmış. "İptal Et" parayı İADE ETMEZ, sadece rezervasyon durumunu değiştirir.\n\nParayı iade etmek için "İade Et" butonunu kullanın.\n\nYine de iade YAPMADAN iptal etmek istiyor musunuz?')) return
                        updateStatus(detail.id, 'cancelled'); setDetail(null)
                      }}
                      className="btn btn-ghost btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }}
                    >İptal Et</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
