'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
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

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  pending:   { color: '#92400e', bg: 'rgba(245,158,11,.12)' },
  confirmed: { color: '#065f46', bg: 'rgba(16,185,129,.12)' },
  completed: { color: 'var(--muted)', bg: 'var(--foam)' },
  cancelled: { color: '#991b1b', bg: 'rgba(239,68,68,.12)' },
};

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cfg = STATUS_STYLE[status] ?? { color: 'var(--muted)', bg: 'var(--foam)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600, borderRadius: 99,
    }}>
      ● {label}
    </span>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function HesabimPage() {
  const t = useTranslations('account');
  const ts = useTranslations('status');
  const tc = useTranslations('common');
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('reservations');
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', country: '' });
  const NAV_ITEMS = [
    { k: 'reservations', l: t('tab_reservations') },
    { k: 'past',         l: t('past_trips') },
    { k: 'profile',      l: t('profile_security') },
    { k: 'invoices',     l: t('invoices') },
  ];
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
      setBookings((bkgs ?? []) as unknown as Booking[]);
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
      setSaveMsg(t('saved'));
      setTimeout(() => setSaveMsg(''), 2000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 15 }}>
        {tc('loading')}
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
          <h1>{t('title')}</h1>
          <p style={{ maxWidth: 560, opacity: 0.85, fontSize: 17 }}>
            {t('welcome')}{profile?.full_name ? `, ${profile.full_name}` : ''}. {t('manage_sub')}
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
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>{t('membership')}: {joinedDate}</div>
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
                  {t('sign_out')}
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
                      {t('active_reservations')}
                    </h2>
                    <Link href="/filo" className="btn btn-primary btn-sm">{t('new_reservation')}</Link>
                  </div>

                  {activeBookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 20 }}>{t('no_active')}</p>
                      <Link href="/filo" className="btn btn-primary btn-sm">{t('select_boat')}</Link>
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
                                <StatusBadge status={r.status} label={ts(r.status as 'pending' | 'confirmed' | 'completed' | 'cancelled')} />
                              </div>
                              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)', marginBottom: 14, flexWrap: 'wrap' }}>
                                <span>{formatDate(r.start_date)} → {formatDate(r.end_date)}</span>
                                <span>{r.guest_count} {tc('person')}</span>
                                {r.boats?.marina && <span>{r.boats.marina}</span>}
                              </div>
                              <div style={{ padding: '12px 14px', background: 'var(--foam)', borderRadius: 10, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                <div>
                                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('total_remaining')}</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: 'var(--ink)' }}>
                                    €{r.total_amount.toLocaleString('tr-TR')}
                                    {r.balance_amount > 0 && (
                                      <span style={{ color: 'var(--muted)', fontWeight: 500 }}> · €{r.balance_amount.toLocaleString('tr-TR')} {t('remaining')}</span>
                                    )}
                                  </div>
                                </div>
                                {r.status === 'pending' && (
                                  <button className="btn btn-primary btn-sm">{t('pay_deposit')}</button>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Link href={`/hesabim/rezervasyon/${r.code}`} className="btn btn-ghost btn-sm">{t('details')}</Link>
                                {r.boats?.slug && (
                                  <Link href={`/filo/${r.boats.slug}`} className="btn btn-ghost btn-sm">{t('view_boat')}</Link>
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
                    {t('past_trips')}
                  </h2>
                  {pastBookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)' }}>{t('no_past')}</p>
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
                                {formatDate(r.start_date)} → {formatDate(r.end_date)} · {r.guest_count} {tc('person')} · €{r.total_amount.toLocaleString('tr-TR')}
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Link href={`/hesabim/rezervasyon/${r.code}`} className="btn btn-ghost btn-sm">{t('details')}</Link>
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
                    {t('profile_security')}
                  </h2>
                  <form onSubmit={handleSaveProfile}>
                    <div style={{ background: 'var(--card)', padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', marginBottom: 16 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        {t('personal_info')}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <label className="label">{t('full_name')}</label>
                          <input className="input" value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} />
                        </div>
                        <div>
                          <label className="label">{t('email')}</label>
                          <input className="input" value={profile?.email ?? ''} disabled style={{ opacity: 0.6 }} />
                        </div>
                        <div>
                          <label className="label">{t('phone')}</label>
                          <input className="input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+90 ..." />
                        </div>
                        <div>
                          <label className="label">{t('country')}</label>
                          <input className="input" value={profileForm.country} onChange={e => setProfileForm(p => ({ ...p, country: e.target.value }))} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                          {saving ? t('saving') : t('save')}
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
                    {t('invoices')}
                  </h2>
                  {bookings.length === 0 ? (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center' }}>
                      <p style={{ fontSize: 15, color: 'var(--muted)' }}>{t('no_invoices')}</p>
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
                            <StatusBadge status={r.status} label={ts(r.status as 'pending' | 'confirmed' | 'completed' | 'cancelled')} />
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
