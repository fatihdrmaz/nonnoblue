'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  code: string;
  boat: string;
  route: string;
  startDate: string;
  endDate: string;
  pax: number;
  status: 'tamamlandı' | 'onaylandı' | 'bekliyor' | 'iptal';
  total: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockBookings: Booking[] = [
  {
    code: 'NB-2025-001',
    boat: 'Ivan Nonno',
    route: 'Göcek – Fethiye',
    startDate: '12 Tem 2025',
    endDate: '19 Tem 2025',
    pax: 4,
    status: 'tamamlandı',
    total: 8400,
  },
  {
    code: 'NB-2025-002',
    boat: 'Carmelina',
    route: 'Bodrum – Datça',
    startDate: '5 Ağu 2025',
    endDate: '12 Ağu 2025',
    pax: 6,
    status: 'onaylandı',
    total: 11200,
  },
  {
    code: 'NB-2026-001',
    boat: 'Rena',
    route: 'Marmaris Turu',
    startDate: '14 Haz 2026',
    endDate: '21 Haz 2026',
    pax: 4,
    status: 'bekliyor',
    total: 7800,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Booking['status'], { label: string; bg: string; color: string; border: string }> = {
  tamamlandı: { label: 'Tamamlandı', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  onaylandı:  { label: 'Onaylandı',  bg: 'var(--foam)', color: 'var(--teal)', border: 'var(--mist)' },
  bekliyor:   { label: 'Bekliyor',   bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  iptal:      { label: 'İptal',      bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

function StatusBadge({ status }: { status: Booking['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: cfg.bg,
      color: cfg.color,
      border: `2px solid ${cfg.border}`,
      borderRadius: 999,
      padding: '7px 20px',
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      {cfg.label}
    </span>
  );
}

function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--muted)',
      marginBottom: 4,
    }}>
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RezervasyonDetayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const booking = mockBookings.find(b => b.code === code);

  if (!booking) {
    notFound();
  }

  const charter = Math.round(booking.total * 0.85);
  const servis  = 600;
  const kdvBase = booking.total - charter - servis;
  const kdv     = Math.round(booking.total * 0.08);

  const PAYMENT_LABEL: Record<Booking['status'], string> = {
    tamamlandı: 'Ödeme Tamamlandı',
    onaylandı:  'Ön Ödeme Alındı',
    bekliyor:   'Ödeme Bekleniyor',
    iptal:      'İade Edildi',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '48px 0 100px' }}>
      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/hesabim" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
              Hesabım
            </Link>
            <span>›</span>
            <Link href="/hesabim" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
              Rezervasyonlar
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'monospace' }}>{booking.code}</span>
          </nav>

          {/* ── Page Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}>
                Rezervasyon #{booking.code}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>{booking.boat} · {booking.route}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* ── Info Grid ── */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 36px',
            marginBottom: 24,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px' }}>

              {/* Sol: Seyahat Bilgileri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <InfoLabel>Tekne Adı</InfoLabel>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}>
                    {booking.boat}
                  </p>
                </div>
                <div>
                  <InfoLabel>Rota</InfoLabel>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{booking.route}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <InfoLabel>Başlangıç Tarihi</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.startDate}</p>
                  </div>
                  <div>
                    <InfoLabel>Bitiş Tarihi</InfoLabel>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.endDate}</p>
                  </div>
                </div>
                <div>
                  <InfoLabel>Kişi Sayısı</InfoLabel>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{booking.pax} kişi</p>
                </div>
              </div>

              {/* Sağ: Ödeme Bilgileri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <InfoLabel>Toplam Tutar</InfoLabel>
                  <p style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: 'var(--teal)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}>
                    €{booking.total.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <InfoLabel>Ödeme Durumu</InfoLabel>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                    {PAYMENT_LABEL[booking.status]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Servis Detayları ── */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 36px',
            marginBottom: 24,
          }}>
            <h3 style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--teal)',
              marginBottom: 20,
            }}>
              Servis Detayları
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--line)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: 10, color: 'var(--muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Kalem
                  </th>
                  <th style={{ textAlign: 'right', paddingBottom: 10, color: 'var(--muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 0', color: 'var(--ink)' }}>Tekne Kiralama (7 gün)</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>
                    €{charter.toLocaleString('tr-TR')}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 0', color: 'var(--ink)' }}>Servis Paketi</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>
                    €{servis.toLocaleString('tr-TR')}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 0', color: 'var(--muted)', fontSize: 13 }}>KDV (%8)</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>
                    €{kdv.toLocaleString('tr-TR')}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 0 4px', fontWeight: 800, color: 'var(--ink)', fontSize: 15 }}>
                    Toplam
                  </td>
                  <td style={{ padding: '18px 0 4px', textAlign: 'right', fontWeight: 800, color: 'var(--teal)', fontSize: 18 }}>
                    €{booking.total.toLocaleString('tr-TR')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── İptal / Değişiklik Notu ── */}
          <div style={{
            background: 'var(--foam)',
            border: '1.5px solid var(--mist)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            marginBottom: 36,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>İptal ve Değişiklik:</strong> Başlangıç tarihinden 30 gün önce ücretsiz iptal hakkınız bulunmaktadır.
              Tarih değişikliği veya diğer talepler için lütfen bizimle iletişime geçin.
            </p>
          </div>

          {/* ── Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href="/iletisim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--teal)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                padding: '13px 28px',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'opacity 0.2s',
              }}
            >
              İletişime Geç
            </Link>
            <Link
              href="/hesabim"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'color 0.15s',
              }}
            >
              ← Hesabıma Dön
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
