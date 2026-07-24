'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
  const t = useTranslations('reservation');
  const locale = useLocale();
  const tr = locale !== 'en';
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
  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [bookedBoatName, setBookedBoatName] = useState('');
  const [quote, setQuote] = useState<{ weekly: number | null; weeks: number; total: number | null }>({ weekly: null, weeks: 1, total: null });

  // Payment step state (UI only — card data is never transmitted; POS activation pending)
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvv: '' });
  const [agree, setAgree] = useState({ contract: false, cancel: false });
  const [payError, setPayError] = useState('');
  const [payNotice, setPayNotice] = useState(false);

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

    // Fetch weekly price for the selected boat/dates → payment summary
    let weekly: number | null = null;
    if (selectedBoat?.id) {
      const { data: priceRows } = await supabase
        .from('boat_pricing')
        .select('weekly_price_eur,start_date,end_date')
        .eq('boat_id', selectedBoat.id)
        .lte('start_date', form.baslangicTarihi)
        .gte('end_date', form.baslangicTarihi)
        .limit(1);
      weekly = priceRows?.[0]?.weekly_price_eur ?? null;
    }
    const days = Math.max(1, Math.round(
      (new Date(form.bitisTarihi).getTime() - new Date(form.baslangicTarihi).getTime()) / 86400000
    ));
    const weeks = Math.max(1, Math.ceil(days / 7));
    setQuote({ weekly, weeks, total: weekly !== null ? weekly * weeks : null });

    setBookingCode(code);
    setBookedBoatName(selectedBoat?.name ?? form.tekne);
    setStep('payment');
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {t('page_eyebrow')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            {t('page_title')}
          </h1>
          <p style={{ fontSize: 18, color: 'var(--sky)', maxWidth: 520 }}>{t('page_sub')}</p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)', padding: '80px 0 120px' }}>
        <div className="container">
          <div style={{ maxWidth: 700, margin: '0 auto' }}>

            {step === 'done' ? (
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '60px 48px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--foam)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 32, color: 'var(--teal)' }}>✓</div>
                <h2 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 28, fontWeight: 700, color: 'var(--deep)', marginBottom: 16 }}>
                  {t('success_title')}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
                  {t('success_code')} <strong style={{ fontFamily: 'monospace', color: 'var(--ink)' }}>{bookingCode}</strong>
                </p>
                <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
                  {t('success_text')}
                </p>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '13px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  {t('home_btn')}
                </Link>
              </div>
            ) : step === 'payment' ? (
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '40px 40px 48px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 24, fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>
                  {tr ? 'Ödeme' : 'Payment'}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
                  {tr ? 'Rezervasyon kodunuz:' : 'Your booking code:'}{' '}
                  <strong style={{ fontFamily: 'monospace', color: 'var(--ink)' }}>{bookingCode}</strong>
                </p>

                {/* Booking summary */}
                <div style={{ background: 'var(--foam)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '20px 24px', marginBottom: 24 }}>
                  <p style={{ ...sectionTitleStyle, marginBottom: 14 }}>{tr ? 'Rezervasyon Özeti' : 'Booking Summary'}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: 14 }}>
                    <div><span style={{ color: 'var(--muted)' }}>{tr ? 'Tekne' : 'Boat'}:</span> <strong>{bookedBoatName}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>{tr ? 'Kişi' : 'Guests'}:</span> <strong>{form.kisiSayisi}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>{tr ? 'Başlangıç' : 'Start'}:</span> <strong>{form.baslangicTarihi}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>{tr ? 'Bitiş' : 'End'}:</span> <strong>{form.bitisTarihi}</strong></div>
                    <div><span style={{ color: 'var(--muted)' }}>Charter:</span> <strong>{form.charterTipi}</strong></div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '20px 24px', marginBottom: 28 }}>
                  <p style={{ ...sectionTitleStyle, marginBottom: 14 }}>{tr ? 'Tutar Dökümü' : 'Price Breakdown'}</p>
                  {quote.total !== null ? (
                    <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{tr ? 'Haftalık kiralama bedeli' : 'Weekly charter fee'}{quote.weeks > 1 ? ` × ${quote.weeks}` : ''}</span>
                        <span>€{(quote.weekly ?? 0).toLocaleString()}{quote.weeks > 1 ? ` × ${quote.weeks}` : ''}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                        <span>{tr ? 'Toplam' : 'Total'}</span>
                        <span>€{quote.total.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--teal)', fontWeight: 700 }}>
                        <span>{tr ? 'Şimdi ödenecek ön ödeme (%50)' : 'Deposit due now (50%)'}</span>
                        <span>€{Math.round(quote.total / 2).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 13 }}>
                        <span>{tr ? 'Kalan bakiye (teslimden 30 gün önce)' : 'Balance (30 days before check-in)'}</span>
                        <span>€{(quote.total - Math.round(quote.total / 2)).toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                      {tr
                        ? 'Seçilen tarihler için fiyat bilgisi e-posta ile iletilecektir.'
                        : 'Pricing for the selected dates will be sent by e-mail.'}
                    </p>
                  )}
                </div>

                {payNotice ? (
                  <div style={{ background: 'var(--foam)', border: '1.5px solid var(--teal)', borderRadius: 'var(--radius-sm)', padding: '24px 28px', textAlign: 'center' }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--deep)', marginBottom: 8 }}>
                      {tr ? 'Kredi kartı ödeme altyapımız banka aktivasyon sürecindedir.' : 'Our credit card payment infrastructure is pending bank activation.'}
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
                      {tr
                        ? 'Rezervasyonunuz kaydedildi. Ödeme bilgileri (havale/EFT) e-posta ile iletilecektir.'
                        : 'Your booking has been recorded. Payment details (bank transfer) will be sent by e-mail.'}
                    </p>
                    <button onClick={() => setStep('done')} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '13px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                      {tr ? 'Tamam' : 'OK'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Card form */}
                    <p style={sectionTitleStyle}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>€</span>
                      {tr ? 'Kart Bilgileri' : 'Card Details'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
                      <div>
                        <label htmlFor="cardName" style={labelStyle}>{tr ? 'Kart Üzerindeki İsim' : 'Cardholder Name'}</label>
                        <input id="cardName" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder={tr ? 'Ad Soyad' : 'Full name'} style={inputStyle(false)} autoComplete="cc-name" />
                      </div>
                      <div>
                        <label htmlFor="cardNumber" style={labelStyle}>{tr ? 'Kart Numarası' : 'Card Number'}</label>
                        <input
                          id="cardNumber" inputMode="numeric" value={card.number}
                          onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') }))}
                          placeholder="0000 0000 0000 0000" style={inputStyle(false)} autoComplete="cc-number"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label htmlFor="cardExp" style={labelStyle}>{tr ? 'Son Kullanma' : 'Expiry'}</label>
                          <input
                            id="cardExp" inputMode="numeric" value={card.exp}
                            onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setCard(c => ({ ...c, exp: v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v })); }}
                            placeholder="AA/YY" style={inputStyle(false)} autoComplete="cc-exp"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvv" style={labelStyle}>CVV</label>
                          <input id="cardCvv" inputMode="numeric" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" style={inputStyle(false)} autoComplete="cc-csc" />
                        </div>
                      </div>
                    </div>

                    {/* Agreements */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, cursor: 'pointer', color: 'var(--ink)' }}>
                        <input type="checkbox" checked={agree.contract} onChange={e => setAgree(a => ({ ...a, contract: e.target.checked }))} style={{ marginTop: 2, accentColor: 'var(--teal)' }} />
                        <span>
                          {tr ? <><Link href="/sozlesme" target="_blank" style={{ color: 'var(--teal)', fontWeight: 600 }}>Mesafeli Satış Sözleşmesi</Link>&apos;ni okudum, kabul ediyorum.</>
                            : <>I have read and accept the <Link href="/sozlesme" target="_blank" style={{ color: 'var(--teal)', fontWeight: 600 }}>Distance Sales Agreement</Link>.</>}
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, cursor: 'pointer', color: 'var(--ink)' }}>
                        <input type="checkbox" checked={agree.cancel} onChange={e => setAgree(a => ({ ...a, cancel: e.target.checked }))} style={{ marginTop: 2, accentColor: 'var(--teal)' }} />
                        <span>
                          {tr ? <><Link href="/iptal-politikasi" target="_blank" style={{ color: 'var(--teal)', fontWeight: 600 }}>İptal &amp; İade Koşulları</Link>&apos;nı okudum, kabul ediyorum.</>
                            : <>I have read and accept the <Link href="/iptal-politikasi" target="_blank" style={{ color: 'var(--teal)', fontWeight: 600 }}>Cancellation &amp; Refund Policy</Link>.</>}
                        </span>
                      </label>
                    </div>

                    {payError && (
                      <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 13, marginBottom: 16 }}>
                        {payError}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (!agree.contract || !agree.cancel) {
                          setPayError(tr ? 'Devam etmek için sözleşmeleri onaylamanız gerekir.' : 'Please accept the agreements to continue.');
                          return;
                        }
                        setPayError('');
                        setPayNotice(true);
                      }}
                      style={{ width: '100%', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                    >
                      {quote.total !== null
                        ? (tr ? `€${Math.round(quote.total / 2).toLocaleString()} Öde` : `Pay €${Math.round(quote.total / 2).toLocaleString()}`)
                        : (tr ? 'Ödemeye Devam Et' : 'Continue to Payment')}
                    </button>
                    <button
                      onClick={() => setStep('done')}
                      style={{ width: '100%', marginTop: 10, background: 'transparent', color: 'var(--muted)', border: '1.5px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '13px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {tr ? 'Havale / EFT ile ödeyeceğim' : 'I will pay by bank transfer'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      {tr ? '256-bit SSL ile şifrelenir · 3D Secure ile doğrulanır' : 'Encrypted with 256-bit SSL · Verified by 3D Secure'}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '40px 40px 48px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)', fontSize: 24, fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>
                  {t('form_title')}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>
                  {t('form_sub')}
                </p>

                {submitError && (
                  <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 13, marginBottom: 24 }}>
                    {submitError}
                  </div>
                )}

                {/* Section 1 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>1</span>
                  {t('section_boat_route')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="tekne" style={labelStyle}>{t('boat')} <span style={{ color: '#e53e3e' }}>*</span></label>
                    <select id="tekne" name="tekne" value={form.tekne} onChange={handleChange} style={selectStyle(!!errors.tekne)}>
                      <option value="">{t('select_boat_opt')}</option>
                      {boats.map(b => <option key={b.id} value={b.id}>{b.name} — {b.type}</option>)}
                    </select>
                    {errors.tekne && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_boat')}</p>}
                  </div>

                  <div>
                    <label htmlFor="rota" style={labelStyle}>{t('route')} <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none' }}>{t('route_optional')}</span></label>
                    <select id="rota" name="rota" value={form.rota} onChange={handleChange} style={selectStyle(false)}>
                      <option value="">{t('select_route_opt')}</option>
                      {routes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <p style={labelStyle}>{t('charter_type')} <span style={{ color: '#e53e3e' }}>*</span></p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {[{ value: 'bareboat', label: 'Bareboat' }, { value: 'skipperli', label: 'Skipperli' }, { value: 'tam-hizmet', label: 'Tam Hizmet' }].map(opt => (
                        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: `1.5px solid ${form.charterTipi === opt.value ? 'var(--teal)' : errors.charterTipi ? '#e53e3e' : 'var(--line)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: form.charterTipi === opt.value ? 'var(--foam)' : 'transparent', fontSize: 14, fontWeight: 600, color: form.charterTipi === opt.value ? 'var(--teal)' : 'var(--ink)' }}>
                          <input type="radio" name="charterTipi" value={opt.value} checked={form.charterTipi === opt.value} onChange={handleChange} style={{ accentColor: 'var(--teal)' }} />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    {errors.charterTipi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_charter')}</p>}
                  </div>
                </div>

                <div style={dividerStyle} />

                {/* Section 2 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>2</span>
                  {t('section_date_guests')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="baslangicTarihi" style={labelStyle}>{t('start_date')} <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="baslangicTarihi" name="baslangicTarihi" type="date" value={form.baslangicTarihi} onChange={handleChange} style={inputStyle(!!errors.baslangicTarihi)} min={new Date().toISOString().split('T')[0]} />
                      {errors.baslangicTarihi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_date')}</p>}
                    </div>
                    <div>
                      <label htmlFor="bitisTarihi" style={labelStyle}>{t('end_date')} <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="bitisTarihi" name="bitisTarihi" type="date" value={form.bitisTarihi} onChange={handleChange} style={inputStyle(!!errors.bitisTarihi)} min={form.baslangicTarihi || new Date().toISOString().split('T')[0]} />
                      {errors.bitisTarihi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_date')}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                    <div>
                      <label htmlFor="kisiSayisi" style={labelStyle}>{t('guests')} <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="kisiSayisi" name="kisiSayisi" type="number" min={1} max={12} value={form.kisiSayisi} onChange={handleChange} placeholder="1 – 12" style={inputStyle(!!errors.kisiSayisi)} />
                      {errors.kisiSayisi && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_guests')}</p>}
                    </div>
                    <div style={{ paddingBottom: 2 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                        <input type="checkbox" name="istegeKaptan" checked={form.istegeKaptan} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--teal)', cursor: 'pointer' }} />
                        {t('captain_optional')}
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, paddingLeft: 28 }}>+€160–200 / gün</p>
                    </div>
                  </div>
                </div>

                <div style={dividerStyle} />

                {/* Section 3 */}
                <p style={sectionTitleStyle}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 12, fontWeight: 800 }}>3</span>
                  {t('section_contact')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="adSoyad" style={labelStyle}>{t('name')} <span style={{ color: '#e53e3e' }}>*</span></label>
                    <input id="adSoyad" name="adSoyad" type="text" value={form.adSoyad} onChange={handleChange} placeholder={t('placeholder_name')} style={inputStyle(!!errors.adSoyad)} />
                    {errors.adSoyad && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_name')}</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="eposta" style={labelStyle}>{t('email')} <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="eposta" name="eposta" type="email" value={form.eposta} onChange={handleChange} placeholder="ornek@email.com" style={inputStyle(!!errors.eposta)} />
                      {errors.eposta && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_email')}</p>}
                    </div>
                    <div>
                      <label htmlFor="telefon" style={labelStyle}>{t('phone')} <span style={{ color: '#e53e3e' }}>*</span></label>
                      <input id="telefon" name="telefon" type="tel" value={form.telefon} onChange={handleChange} placeholder="+90 5xx xxx xx xx" style={inputStyle(!!errors.telefon)} />
                      {errors.telefon && <p style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>{t('error_phone')}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ozelIstekler" style={labelStyle}>{t('special_requests')}</label>
                    <textarea id="ozelIstekler" name="ozelIstekler" rows={4} value={form.ozelIstekler} onChange={handleChange} placeholder={t('placeholder_notes')} style={{ ...inputStyle(false), resize: 'vertical' }} />
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <button type="submit" disabled={submitting} style={{ width: '100%', background: submitting ? 'var(--muted)' : 'var(--teal)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px 28px', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
                    {submitting ? t('sending') : t('submit_btn')}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                    {t('form_note')}
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
