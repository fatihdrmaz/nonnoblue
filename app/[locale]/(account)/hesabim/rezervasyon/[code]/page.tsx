'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Booking = {
  id: string;
  code: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  guest_count: number;
  total_amount: number;
  deposit_amount: number | null;
  balance_amount: number | null;
  charter_type: string | null;
  captain_requested: boolean | null;
  notes: string | null;
  boats: { name: string; model: string | null; marina: string | null } | null;
  routes: { title: string } | null;
};

const STATUS_CONFIG = {
  pending:   { label: 'Bekliyor',     bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  confirmed: { label: 'Onaylandı',   bg: 'var(--foam)', color: 'var(--teal)', border: 'var(--mist)' },
  completed: { label: 'Tamamlandı',  bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  cancelled: { label: 'İptal',       bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

const PAYMENT_LABEL: Record<string, string> = {
  pending:   'Ödeme Bekleniyor',
  confirmed: 'Ön Ödeme Alındı',
  completed: 'Ödeme Tamamlandı',
  cancelled: 'İade Edildi',
};

function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>
      {children}
    </p>
  );
}

export default function RezervasyonDetayPage() {
  const { code } = useParams<{ code: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('bookings')
      .select('id,code,status,start_date,end_date,guest_count,total_amount,deposit_amount,balance_amount,charter_type,captain_requested,notes,boats(name,model,marina),routes(title)')
      .eq('code', code)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFoundState(true); setLoading(false); return; }
        setBooking(data as unknown as Booking);
        setLoading(false);
      });
  }, [code]);

  if (loading) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
      Yükleniyor…
    </div>
  );

  if (notFoundState || !booking) {
    notFound();
    return null;
  }

  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const total = booking.total_amount ?? 0;
  const charter = Math.round(total * 0.85);
  const servis = 600;
  const kdv = Math.round(total * 0.08);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '48px 0 100px' }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/hesabim" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>Hesabım</Link>
            <span>›</span>
            <Link href="/hesabim" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>Rezervasyonlar</Link>
            <span>›</span>
            <span style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'monospace' }}>{booking.code}</span>
          </nav>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                Rezervasyon #{booking.code}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                {booking.boats?.name ?? '—'}
                {booking.routes?.title ? ` · ${booking.routes.title}` : ''}
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', background: cfg.bg, color: cfg.color, border: `2px solid ${cfg.border}`, borderRadius: 999, padding: '7px 20px', fontSize: 15, fontWeight: 700 }}>
              {cfg.label}
            </span>
          </div>

          {/* Info Grid */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '32px 36px', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <InfoLabel>Tekne Adı</InfoLabel>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}>
                    {booking.boats?.name ?? '—'}
                  </p>
                  {booking.boats?.marina && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{booking.boats.marina}</p>}
                </div>
                {booking.routes && (
                  <div>
                    <InfoLabel>Rota</InfoLabel>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{booking.routes.title}</p>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <InfoLabel>Başlangıç Tarihi</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.start_date}</p>
                  </div>
                  <div>
                    <InfoLabel>Bitiş Tarihi</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.end_date}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <InfoLabel>Kişi Sayısı</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.guest_count} kişi</p>
                  </div>
                  {booking.charter_type && (
                    <div>
                      <InfoLabel>Charter Tipi</InfoLabel>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', textTransform: 'capitalize' }}>{booking.charter_type}</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <InfoLabel>Toplam Tutar</InfoLabel>
                  <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
                    €{total.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <InfoLabel>Ödeme Durumu</InfoLabel>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{PAYMENT_LABEL[booking.status]}</p>
                </div>
                {booking.deposit_amount != null && booking.deposit_amount > 0 && (
                  <div>
                    <InfoLabel>Ödenen Depozit</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>€{booking.deposit_amount.toLocaleString('tr-TR')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Servis Detayları */}
          {total > 0 && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '28px 36px', marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 20 }}>
                Servis Detayları
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--line)' }}>
                    <th style={{ textAlign: 'left', paddingBottom: 10, color: 'var(--muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kalem</th>
                    <th style={{ textAlign: 'right', paddingBottom: 10, color: 'var(--muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 0', color: 'var(--ink)' }}>Tekne Kiralama (7 gün)</td>
                    <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>€{charter.toLocaleString('tr-TR')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 0', color: 'var(--ink)' }}>Servis Paketi</td>
                    <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>€{servis.toLocaleString('tr-TR')}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '14px 0', color: 'var(--muted)', fontSize: 13 }}>KDV (%8)</td>
                    <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>€{kdv.toLocaleString('tr-TR')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '18px 0 4px', fontWeight: 800, color: 'var(--ink)', fontSize: 15 }}>Toplam</td>
                    <td style={{ padding: '18px 0 4px', textAlign: 'right', fontWeight: 800, color: 'var(--teal)', fontSize: 18 }}>€{total.toLocaleString('tr-TR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Notlar */}
          {booking.notes && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 24 }}>
              <InfoLabel>Notlar</InfoLabel>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>{booking.notes}</p>
            </div>
          )}

          {/* İptal notu */}
          <div style={{ background: 'var(--foam)', border: '1.5px solid var(--mist)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 36, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>İptal ve Değişiklik:</strong> Başlangıç tarihinden 30 gün önce ücretsiz iptal hakkınız bulunmaktadır. Tarih değişikliği için lütfen bizimle iletişime geçin.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/iletisim" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '13px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              İletişime Geç
            </Link>
            <Link href="/hesabim" style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              ← Hesabıma Dön
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
