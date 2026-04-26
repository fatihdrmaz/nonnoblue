'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

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

const mockUser: User = {
  name: 'Elif Demir',
  email: 'elif@example.com',
  phone: '+90 532 123 4567',
  joinDate: 'Ocak 2025',
};

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

function StatusBadge({ status, size = 'sm' }: { status: Booking['status']; size?: 'sm' | 'lg' }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: cfg.bg,
      color: cfg.color,
      border: `1.5px solid ${cfg.border}`,
      borderRadius: 999,
      padding: size === 'lg' ? '6px 16px' : '3px 10px',
      fontSize: size === 'lg' ? 14 : 12,
      fontWeight: 700,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: 'var(--teal)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HesabimPage() {
  const [user] = useState<User>(mockUser);
  const [bookings] = useState<Booking[]>(mockBookings);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '48px 0 100px' }}>
      <div className="container">

        {/* ── Page Title ── */}
        <h1 style={{
          fontFamily: 'var(--font-serif, "Playfair Display", serif)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: 40,
        }}>
          Hesabım
        </h1>

        {/* ── 2-Column Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* ─── Left: Profile Card ─── */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 28px',
            position: 'sticky',
            top: 24,
          }}>
            {/* Avatar + Name */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
              <Avatar name={user.name} />
              <h2 style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--ink)',
                marginTop: 16,
                marginBottom: 4,
              }}>
                {user.name}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Üye — {user.joinDate}</p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--line)', marginBottom: 24 }} />

            {/* Info Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
              {/* Email */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 3 }}>
                  E-posta
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink)', wordBreak: 'break-all' }}>{user.email}</p>
              </div>
              {/* Phone */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 3 }}>
                  Telefon
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink)' }}>{user.phone}</p>
              </div>
              {/* Join Date */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 3 }}>
                  Üyelik Tarihi
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink)' }}>{user.joinDate}</p>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button style={{
                width: '100%',
                background: 'transparent',
                color: 'var(--teal)',
                border: '1.5px solid var(--teal)',
                borderRadius: 'var(--radius-sm)',
                padding: '11px 16px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}>
                Profil Düzenle
              </button>
              <button style={{
                width: '100%',
                background: 'transparent',
                color: '#dc2626',
                border: '1.5px solid #fca5a5',
                borderRadius: 'var(--radius-sm)',
                padding: '11px 16px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}>
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* ─── Right: Bookings ─── */}
          <div>
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--ink)',
              }}>
                Rezervasyonlarım
              </h2>
              <Link href="/rezervasyon" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--teal)',
                color: '#fff',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}>
                + Yeni Rezervasyon
              </Link>
            </div>

            {/* Booking List */}
            {bookings.length === 0 ? (
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '60px 40px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 16, color: 'var(--muted)' }}>Henüz rezervasyonunuz yok.</p>
                <Link href="/rezervasyon" style={{
                  display: 'inline-flex',
                  marginTop: 20,
                  color: 'var(--teal)',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}>
                  İlk rezervasyonunuzu oluşturun →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {bookings.map(booking => (
                  <div
                    key={booking.code}
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px 28px',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {/* Top Row: Code + Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'var(--deep)',
                        color: 'var(--sky)',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        fontFamily: 'monospace',
                      }}>
                        {booking.code}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>

                    {/* Boat + Route */}
                    <div style={{ marginBottom: 14 }}>
                      <p style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        marginBottom: 4,
                      }}>
                        {booking.boat}
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--muted)' }}>{booking.route}</p>
                    </div>

                    {/* Details Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px 20px',
                      marginBottom: 20,
                    }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 2 }}>Giriş</p>
                        <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{booking.startDate}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 2 }}>Çıkış</p>
                        <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{booking.endDate}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 2 }}>Kişi</p>
                        <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{booking.pax} kişi</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 2 }}>Toplam</p>
                        <p style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 800 }}>
                          €{booking.total.toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/hesabim/rezervasyon/${booking.code}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--teal)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Detay →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
