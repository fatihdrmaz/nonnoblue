'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const BRAND = {
  email: 'ahoy@nonnoblue.com',
  phone: '+90 539 440 34 29',
  whatsapp: 'https://wa.me/905394403429',
  address: 'D-Marin Göcek, 48310 Fethiye / Muğla',
  socials: {
    instagram: 'https://instagram.com/nonnoblue',
    facebook: 'https://facebook.com/nonnoblue',
    youtube: 'https://youtube.com/@nonnoblue',
  },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconMapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88a16 16 0 0 0 7.21 7.21l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.41v-.49z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  adSoyad: string;
  eposta: string;
  telefon: string;
  konu: string;
  mesaj: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IletisimPage() {
  const [form, setForm] = useState<FormState>({
    adSoyad: '',
    eposta: '',
    telefon: '',
    konu: '',
    mesaj: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const supabase = createClient();
    const { error } = await supabase.from('contact_forms').insert({
      full_name: form.adSoyad,
      email: form.eposta,
      phone: form.telefon || null,
      subject: form.konu || null,
      message: form.mesaj,
    });
    if (error) {
      setSubmitError('Bir hata oluştu, lütfen tekrar deneyin.');
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>İletişim</div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.15 }}>
            Bizimle İletişime Geçin
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 520, lineHeight: 1.7 }}>
            Rezervasyon, fiyat talebi veya aklınızdaki her soruyu bizimle paylaşın. En kısa sürede dönüş yapacağız.
          </p>
        </div>
      </div>

      {/* Main content */}
      <section className="nb-section">
        <div className="container">
          <div className="nb-contact-grid">

            {/* ── Contact Form ── */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '40px 36px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Mesaj Gönderin</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
                Tüm alanları doldurun, ekibimiz en geç 24 saat içinde size ulaşsın.
              </p>

              {submitted ? (
                <div style={{
                  background: 'var(--foam)',
                  border: '1.5px solid var(--teal)',
                  borderRadius: 'var(--radius)',
                  padding: '24px 28px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>✓</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>Mesajınız alındı!</p>
                    <p style={{ fontSize: 14, color: 'var(--ink)' }}>
                      Mesajınız alındı, en kısa sürede dönüş yapacağız.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ adSoyad: '', eposta: '', telefon: '', konu: '', mesaj: '' }); }}
                      style={{ marginTop: 16, fontSize: 13, color: 'var(--teal)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Yeni mesaj gönder →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Ad Soyad */}
                  <div>
                    <label htmlFor="adSoyad" className="label">Ad Soyad</label>
                    <input
                      id="adSoyad"
                      name="adSoyad"
                      type="text"
                      className="input"
                      placeholder="Adınız ve soyadınız"
                      value={form.adSoyad}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* E-posta & Telefon */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="eposta" className="label">E-posta</label>
                      <input
                        id="eposta"
                        name="eposta"
                        type="email"
                        className="input"
                        placeholder="ornek@email.com"
                        value={form.eposta}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="telefon" className="label">Telefon</label>
                      <input
                        id="telefon"
                        name="telefon"
                        type="tel"
                        className="input"
                        placeholder="+90 5xx xxx xx xx"
                        value={form.telefon}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Konu */}
                  <div>
                    <label htmlFor="konu" className="label">Konu</label>
                    <select
                      id="konu"
                      name="konu"
                      className="input"
                      value={form.konu}
                      onChange={handleChange}
                      required
                      style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7f9e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 40 }}
                    >
                      <option value="">Konu seçin…</option>
                      <option value="rezervasyon">Rezervasyon</option>
                      <option value="fiyat">Fiyat Talebi</option>
                      <option value="genel">Genel Soru</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  {/* Mesaj */}
                  <div>
                    <label htmlFor="mesaj" className="label">Mesaj</label>
                    <textarea
                      id="mesaj"
                      name="mesaj"
                      className="input"
                      rows={5}
                      placeholder="Mesajınızı buraya yazın…"
                      value={form.mesaj}
                      onChange={handleChange}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {submitError && (
                    <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 13 }}>
                      {submitError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: submitting ? 'var(--muted)' : 'var(--teal)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 28px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {submitting ? 'Gönderiliyor…' : 'Gönder'}
                  </button>
                </form>
              )}
            </div>

            {/* ── Info Card ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '36px 32px' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 28 }}>İletişim Bilgileri</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Address */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }}><IconMapPin /></span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>Adres</p>
                      <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>{BRAND.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }}><IconPhone /></span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>Telefon</p>
                      <a href={`tel:${BRAND.phone}`} style={{ fontSize: 14, color: 'var(--ink)', textDecoration: 'none', fontWeight: 600 }}>{BRAND.phone}</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }}><IconMail /></span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>E-posta</p>
                      <a href={`mailto:${BRAND.email}`} style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>{BRAND.email}</a>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--line)', margin: '28px 0' }} />

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#25D366',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 18px',
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    marginBottom: 20,
                  }}
                >
                  <IconWhatsApp />
                  WhatsApp ile Yazın
                </a>

                {/* Social links */}
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 12 }}>Sosyal Medya</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href={BRAND.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--line)', color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.2s' }}
                    title="Instagram"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href={BRAND.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--line)', color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.2s' }}
                    title="Facebook"
                  >
                    <IconFacebook />
                  </a>
                  <a
                    href={BRAND.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--line)', color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.2s' }}
                    title="YouTube"
                  >
                    <IconYouTube />
                  </a>
                </div>
              </div>

              {/* Office hours */}
              <div style={{ background: 'var(--foam)', border: '1px solid var(--mist)', borderRadius: 'var(--radius)', padding: '24px 28px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>Ofis Saatleri</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pazartesi – Cuma</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>09:00 – 18:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cumartesi</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>10:00 – 16:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pazar</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Kapalı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Google Maps ── */}
      <section style={{ background: 'var(--sand)' }}>
        <div style={{ width: '100%' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.5!2d28.9333!3d36.7506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sG%C3%B6cek%20Marina!5e0!3m2!1str!2str!4v1"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Göcek Marina Haritası"
          />
        </div>
      </section>
    </>
  );
}
