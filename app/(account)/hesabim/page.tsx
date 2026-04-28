'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  role: string;
  created_at: string;
};

type Booking = {
  id: string;
  code: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  status: string;
  boats: {
    name: string;
    slug: string;
    marina: string;
    boat_photos: { storage_path: string; position: number }[];
  } | null;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Ödeme bekleniyor', color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  confirmed: { label: 'Onaylı',           color: '#065f46', bg: 'rgba(16,185,129,.12)' },
  completed: { label: 'Tamamlandı',       color: 'var(--muted)', bg: 'var(--foam)' },
  cancelled: { label: 'İptal',            color: '#991b1b', bg: 'rgba(239,68,68,.12)' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? { label: status, color: 'var(--muted)', bg: 'var(--foam)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600, borderRadius: 99,
    }}>
      ● {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const NAV_ITEMS = [
  { k: 'reservations', l: 'Rezervasyonlarım' },
  { k: 'past',         l: 'Geçmiş seyahatler' },
  { k: 'profile',      l: 'Profil & güvenlik' },
  { k: 'invoices',     l: 'Fatura & belgeler' },
];

export default function HesabimPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('reservations');
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/giris'); return; }

      const [{ data: prof }, { data: bkgs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('bookings')
          .select('id,code,start_date,end_date,guest_count,total_amount,deposit_amount,balance_amount,status,boats(name,slug,marina,boat_photos(storage_path,position))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      setProfile(prof as Profile ?? { id: user.id, email: user.email ?? '', full_name: null, phone: null, country: null, role: 'customer', created_at: user.created_at });
      setBookings((bkgs ?? []) as Booking[]);
      setProfileForm({
        full_name: prof?.full_name ?? '',
        phone: prof?.phone ?? '',
        country: prof?.country ?? '',
      });
      setLoading(false);
    })();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update(profileForm).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, ...profileForm } : prev);
      setSaveMsg('Kaydedildi');
      setTimeout(() => setSaveMsg(''), 2000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 15 }}>
        Yükleniyor…
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings   = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const initials = (profile?.full_name || profile?.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <div className="nb-page-head">
        <div className="container">
          <h1>Hesabım</h1>
          <p style={{ maxWidth: 560, opacity: 0.85, fontSize: 17 }}>
            Hoş geldiniz{profile?.full_name ? `, ${profile.full_name}` : ''}. Rezervasyonlarınızı buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <section style={{ padding: '48px 0 120px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }}>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 96 }}>
              {/* Avatar Card */}
              <div style={{
                background: 'var(--card)', padding: 24, borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)', textAlign: 'center', marginBottom: 16,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'var(--teal)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, margin: '0 auto 12px',
                }}>
                  {initials}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
                  {profile?.full_name || profile?.email?.split('@')[0]}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{profile?.email}</div>
                {joinedDate && (
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>Üyelik: {joinedDate}</div>
                )}
              </div>

              {/* Nav Menu */}
              <nav style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', padding: 8 }}>
                {NAV_ITEMS.map(it => (
                  <button key={it.k} onClick={() => setTab(it.k)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', border: 'none',
                    background: tab === it.k ? 'var(--foam)' : 'transparent',
                    color: tab === it.k ? 'var(--deep)' : 'var(--ink)',
                    borderRadius: 8, fontSize: 14, fontWeight: tab === it.k ? 600 : 500,
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    {it.l}
                  </button>
                ))}
                <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }} />
                <button onClick={handleSignOut} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', border: 'none', background: 'transparent',
                  color: 'var(--muted)', borderRadius: 8, fontSize: 14, cursor: 'pointer', textAlign: 'left',
                }}>
                  Çıkış yap
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div>

              {/* Aktif Rezervasyonlar */}
              {tab === 'reservations' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>
                      Aktif rezervasyonlar
                    </h2>
                    <Link href="/filo" className="btn btn-primary btn-sm">Yeni rezervasyon</Link>
                  </div>

                  {activeBookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 20 }}>Aktif rezervasyonunuz yok.</p>
                      <Link href="/filo" className="btn btn-primary btn-sm">Tekne seç</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {activeBookings.map(r => {
                        const photos = (r.boats?.boat_photos ?? []).sort((a, b) => a.position - b.position);
                        const img = photos[0]?.storage_path ?? '';
                        return (
                          <div key={r.code} style={{
                            background: 'var(--card)', borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--line)', overflow: 'hidden',
                            display: 'grid', gridTemplateColumns: '200px 1fr',
                          }}>
                            {img ? (
                              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 160 }} />
                            ) : (
                              <div style={{ background: 'var(--mist)', minHeight: 160 }} />
                            )}
                            <div style={{ padding: 24 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.code}</div>
                                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{r.boats?.name ?? '—'}</h3>
                                </div>
                                <StatusBadge status={r.status} />
                              </div>
                              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)', marginBottom: 14, flexWrap: 'wrap' }}>
                                <span>{formatDate(r.start_date)} → {formatDate(r.end_date)}</span>
                                <span>{r.guest_count} kişi</span>
                                {r.boats?.marina && <span>{r.boats.marina}</span>}
                              </div>
                              <div style={{ padding: '12px 14px', background: 'var(--foam)', borderRadius: 10, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Toplam · Kalan</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: 'var(--ink)' }}>
                                    €{r.total_amount.toLocaleString('tr-TR')}
                                    {r.balance_amount > 0 && (
                                      <span style={{ color: 'var(--muted)', fontWeight: 500 }}> · €{r.balance_amount.toLocaleString('tr-TR')} kalan</span>
                                    )}
                                  </div>
                                </div>
                                {r.status === 'pending' && (
                                  <button className="btn btn-primary btn-sm">%50 ödemeyi yap</button>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Link href={`/hesabim/rezervasyon/${r.code}`} className="btn btn-ghost btn-sm">Detaylar</Link>
                                {r.boats?.slug && (
                                  <Link href={`/filo/${r.boats.slug}`} className="btn btn-ghost btn-sm">Tekneyi gör</Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Geçmiş Seyahatler */}
              {tab === 'past' && (
                <>
                  <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 24 }}>
                    Geçmiş seyahatler
                  </h2>
                  {pastBookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)' }}>Henüz geçmiş seyahatiniz yok.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {pastBookings.map(r => {
                        const photos = (r.boats?.boat_photos ?? []).sort((a, b) => a.position - b.position);
                        const img = photos[0]?.storage_path ?? '';
                        return (
                          <div key={r.code} style={{
                            background: 'var(--card)', borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--line)', overflow: 'hidden',
                            display: 'grid', gridTemplateColumns: '200px 1fr',
                          }}>
                            {img ? (
                              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 160 }} />
                            ) : (
                              <div style={{ background: 'var(--mist)', minHeight: 160 }} />
                            )}
                            <div style={{ padding: 24 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.code}</div>
                              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginTop: 4, marginBottom: 8 }}>{r.boats?.name ?? '—'}</h3>
                              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                                {formatDate(r.start_date)} → {formatDate(r.end_date)} · {r.guest_count} kişi · €{r.total_amount.toLocaleString('tr-TR')}
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Link href={`/hesabim/rezervasyon/${r.code}`} className="btn btn-ghost btn-sm">Detaylar</Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Profil */}
              {tab === 'profile' && (
                <>
                  <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 24 }}>
                    Profil & güvenlik
                  </h2>
                  <form onSubmit={handleSaveProfile}>
                    <div style={{ background: 'var(--card)', padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', marginBottom: 16 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Kişisel bilgiler
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <label className="label">Ad Soyad</label>
                          <input className="input" value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Adınız Soyadınız" />
                        </div>
                        <div>
                          <label className="label">E-posta</label>
                          <input className="input" value={profile?.email ?? ''} disabled style={{ opacity: 0.6 }} />
                        </div>
                        <div>
                          <label className="label">Telefon</label>
                          <input className="input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+90 ..." />
                        </div>
                        <div>
                          <label className="label">Ülke</label>
                          <input className="input" value={profileForm.country} onChange={e => setProfileForm(p => ({ ...p, country: e.target.value }))} placeholder="Türkiye" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                          {saving ? 'Kaydediliyor…' : 'Kaydet'}
                        </button>
                        {saveMsg && <span style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>{saveMsg}</span>}
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Faturalar */}
              {tab === 'invoices' && (
                <>
                  <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 24 }}>
                    Fatura & belgeler
                  </h2>
                  {bookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)' }}>Henüz fatura bulunmuyor.</p>
                    </div>
                  ) : (
                    <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', overflow: 'hidden' }}>
                      {bookings.map((r, i) => (
                        <div key={r.code} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '16px 24px',
                          borderBottom: i < bookings.length - 1 ? '1px solid var(--line)' : 'none',
                        }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{r.code} · {r.boats?.name}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{formatDate(r.start_date)}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>€{r.total_amount.toLocaleString('tr-TR')}</span>
                            <StatusBadge status={r.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
