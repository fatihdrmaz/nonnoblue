'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BOATS, ROUTES } from '@/data/mock';

interface FormState {
  tekne: string;
  rota: string;
  charterTipi: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  kisiSayisi: string;
  istegeKaptan: boolean;
  adSoyad: string;
  eposta: string;
  telefon: string;
  ozelIstekler: string;
}

type Errors = Partial<Record<keyof FormState, boolean>>;

const REQUIRED_FIELDS: (keyof FormState)[] = [
  'tekne', 'charterTipi', 'baslangicTarihi', 'bitisTarihi',
  'kisiSayisi', 'adSoyad', 'eposta', 'telefon',
];

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 14px',
  border: `1.5px solid ${hasError ? '#e53e3e' : 'var(--line)'}`,
  borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'inherit',
  background: 'var(--card)', color: 'var(--ink)', outline: 'none',
  transition: 'border-color 0.15s', boxSizing: 'border-box',
});

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 6,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10,
};

const dividerStyle: React.CSSProperties = { height: 1, background: 'var(--line)', margin: '32px 0' };

export default function RezervasyonPage() {
  return (
    <Suspense>
      <RezervasyonForm />
    </Suspense>
  );
}

function RezervasyonForm() {
  const searchParams = useSearchParams();
  const boatParam = searchParams.get('boat') ?? '';
  const startParam = searchParams.get('start') ?? '';
  const endParam = searchParams.get('end') ?? '';

  const [form, setForm] = useState<FormState>({
    tekne: boatParam, rota: '', charterTipi: '', baslangicTarihi: startParam,
    bitisTarihi: endParam, kisiSayisi: '', istegeKaptan: false,
    adSoyad: '', eposta: '', telefon: '', ozelIstekler: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  const [boats, setBoats] = useState<{ id: string; slug: string; name: string; type: string }[]>([]);
  const [routes, setRoutes] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('boats').select('id,slug,name,type').eq('active', true).order('display_order')
      .then(({ data }) => {
        if (data && data.length > 0) setBoats(data);
        else setBoats(BOATS.map(b => ({ id: b.slug, slug: b.slug, name: b.name, type: b.type })));
      });
    supabase.from('routes').select('id,title').eq('active', true).order('display_order')
      .then(({ data }) => {
        if (data && data.length > 0) setRoutes(data);
        else setRoutes(ROUTES.map(r => ({ id: r.id, title: r.title })));
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
    if (errors[name as keyof FormState]) setErrors(prev => ({ ...prev, [name]: false }));
  }

  function validate(): boolean {
    const newErrors: Errors = {};
    let valid = true;
    for (const field of REQUIRED_FIELDS) {
      const val = form[field];
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        newErrors[field] = true; valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');

    const code = `NB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const selectedBoat = boats.find(b => b.id === form.tekne || b.slug === form.tekne);

    const payload: Record<string, unknown> = {
      code,
      boat_id: selectedBoat?.id ?? form.tekne,
      start_date: form.baslangicTarihi,
      end_date: form.bitisTarihi,
      guest_count: parseInt(form.kisiSayisi) || 1,
      charter_type: form.charterTipi,
      captain_requested: form.istegeKaptan,
      guest_name: form.adSoyad,
      guest_email: form.eposta,
      guest_phone: form.telefon,
      notes: form.ozelIstekler || null,
      status: 'pending',
    };

    if (form.rota) payload.route_id = form.rota;
    if (user) payload.user_id = user.id;

    const { error } = await supabase.from('bookings').insert(payload);

    if (error) {
      setSubmitError('Bir hata oluştu: ' + error.message);
      setSubmitting(false);
      return;
    }

    // Send confirmation email
    try {
      await fetch('/api/rezervasyon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          adSoyad: form.adSoyad,
          eposta: form.eposta,
          tekneAdi: selectedBoat?.name ?? form.tekne,
          baslangicTarihi: form.baslangicTarihi,
          bitisTarihi: form.bitisTarihi,
          charterTipi: form.charterTipi,
          kisiSayisi: form.kisiSayisi,
        }),
      });
    } catch {
      // Email failure is non-blocking
    }

    setBookingCode(code);
    setSubmitted(true);
    setSubmitting(false);
  }

  const selectStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle(hasError),
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7f9e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 40,
  });

  return (
    <>
      <section style={{ background: 'var(--deep)', color: '#fff', padding: '140px 0 60px' }}>
        <div className="container">
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--teal)', marginBottom: 12 }}>
            Rezervasyon
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Tekne Rezervasyonu
          </h1>
          <p style={{ fontSize: 18, color: 'var(--sky)', maxWidth: 520 }}>Size özel fiyat teklifi alın</p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '80px 0 120px' }}>
        <div className="container">
          <div style={{ maxWidth: 700, margin: '0 auto' }}>

            {submitted ? (
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 48px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--foam)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 32, color: 'var(--teal)' }}>✓</div>
                <h2 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 28, fontWeight: 700, color: 'var(--deep)', marginBottom: 16 }}>
                  Talebiniz Alındı!
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
                  Rezervasyon kodunuz: <strong style={{ fontFamily: 'monospace', color: 'var(--ink)' }}>{bookingCode}</strong>
                </p>
                <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
                  En geç 24 saat içinde <strong>{form.eposta}</strong> adresinize dönüş yapacağız.
                </p>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '13px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Ana Sayfaya Dön
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '40px 40px 48px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 24, fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>
                  Teklif Talebi Oluşturun
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>
                  Formu doldurun, uzman ekibimiz size özel bir teklif hazırlasın.
                </p>

                {submitError && (
                  <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 13, marginBottom: 24 }}>
                    {submitError}
                  </div>
                )}

                {/* Section 1 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>1</span>
                  Tekne &amp; Rota
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="tekne" style={labelStyle}>Tekne <span style={{ color: '#e53e3e' }}>*</span></label>
                    <select id="tekne" name="tekne" value={form.tekne} onChange={handleChange} style={selectStyle(!!errors.tekne)}>
                      <option value="">Tekne seçin…</option>
                      {boats.map(b => <option key={b.id} value={b.id}>{b.name} — {b.type}</option>)}
                    </select>
                    {errors.tekne && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Lütfen bir tekne seçin.</p>}
                  </div>

                  <div>
                    <label htmlFor="rota" style={labelStyle}>Rota <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none' }}>(isteğe bağlı)</span></label>
                    <select id="rota" name="rota" value={form.rota} onChange={handleChange} style={selectStyle(false)}>
                      <option value="">Rota seçin…</option>
                      {routes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <p style={labelStyle}>Charter Tipi <span style={{ color: '#e53e3e' }}>*</span></p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {[{ value: 'bareboat', label: 'Bareboat' }, { value: 'skipperli', label: 'Skipperli' }, { value: 'tam-hizmet', label: 'Tam Hizmet' }].map(opt => (
                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: `1.5px solid ${form.charterTipi === opt.value ? 'var(--teal)' : errors.charterTipi ? '#e53e3e' : 'var(--line)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: form.charterTipi === opt.value ? 'var(--foam)' : 'transparent', fontSize: 14, fontWeight: 600, color: form.charterTipi === opt.value ? 'var(--teal)' : 'var(--ink)' }}>
                          <input type="radio" name="charterTipi" value={opt.value} checked={form.charterTipi === opt.value} onChange={handleChange} style={{ accentColor: 'var(--teal)' }} />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    {errors.charterTipi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Lütfen charter tipini seçin.</p>}
                  </div>
                </div>

                <div style={dividerStyle} />

                {/* Section 2 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>2</span>
                  Tarih &amp; Kişi
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="baslangicTarihi" style={labelStyle}>Başlangıç Tarihi <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="baslangicTarihi" name="baslangicTarihi" type="date" value={form.baslangicTarihi} onChange={handleChange} style={inputStyle(!!errors.baslangicTarihi)} min={new Date().toISOString().split('T')[0]} />
                      {errors.baslangicTarihi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Tarih gerekli.</p>}
                    </div>
                    <div>
                      <label htmlFor="bitisTarihi" style={labelStyle}>Bitiş Tarihi <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="bitisTarihi" name="bitisTarihi" type="date" value={form.bitisTarihi} onChange={handleChange} style={inputStyle(!!errors.bitisTarihi)} min={form.baslangicTarihi || new Date().toISOString().split('T')[0]} />
                      {errors.bitisTarihi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Tarih gerekli.</p>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                    <div>
                      <label htmlFor="kisiSayisi" style={labelStyle}>Kişi Sayısı <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="kisiSayisi" name="kisiSayisi" type="number" min={1} max={12} value={form.kisiSayisi} onChange={handleChange} placeholder="1 – 12" style={inputStyle(!!errors.kisiSayisi)} />
                      {errors.kisiSayisi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Kişi sayısı gerekli.</p>}
                    </div>
                    <div style={{ paddingBottom: 2 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                        <input type="checkbox" name="istegeKaptan" checked={form.istegeKaptan} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--teal)', cursor: 'pointer' }} />
                        İsteğe bağlı kaptan
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, paddingLeft: 28 }}>+€160–200 / gün</p>
                    </div>
                  </div>
                </div>

                <div style={dividerStyle} />

                {/* Section 3 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>3</span>
                  İletişim
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="adSoyad" style={labelStyle}>Ad Soyad <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input id="adSoyad" name="adSoyad" type="text" value={form.adSoyad} onChange={handleChange} placeholder="Adınız ve soyadınız" style={inputStyle(!!errors.adSoyad)} />
                    {errors.adSoyad && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Ad soyad gerekli.</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="eposta" style={labelStyle}>E-posta <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="eposta" name="eposta" type="email" value={form.eposta} onChange={handleChange} placeholder="ornek@email.com" style={inputStyle(!!errors.eposta)} />
                      {errors.eposta && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>E-posta gerekli.</p>}
                    </div>
                    <div>
                      <label htmlFor="telefon" style={labelStyle}>Telefon <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="telefon" name="telefon" type="tel" value={form.telefon} onChange={handleChange} placeholder="+90 5xx xxx xx xx" style={inputStyle(!!errors.telefon)} />
                      {errors.telefon && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>Telefon gerekli.</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ozelIstekler" style={labelStyle}>Özel İstekler</label>
                    <textarea id="ozelIstekler" name="ozelIstekler" rows={4} value={form.ozelIstekler} onChange={handleChange} placeholder="Özel istekleriniz, sorularınız veya notlarınız…" style={{ ...inputStyle(false), resize: 'vertical' }} />
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <button type="submit" disabled={submitting} style={{ width: '100%', background: submitting ? 'var(--muted)' : 'var(--teal)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 28px', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
                    {submitting ? 'Gönderiliyor…' : 'Teklif İste'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                    Formunuz incelendikten sonra 24 saat içinde size dönüş yapılacaktır.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
