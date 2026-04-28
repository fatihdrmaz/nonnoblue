'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

export default function KayitPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
          data: { signup: true },
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback' },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google ile kayıt başarısız oldu.');
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: '44px 40px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Link href="/" style={{ display: 'inline-block' }}>
          <Logo height={32} />
        </Link>
      </div>

      <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', textAlign: 'center', marginBottom: 6, letterSpacing: '-0.01em' }}>
        {t('register_title')}
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
        {t('login_subtitle')}
      </p>

      {sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px', background: 'var(--foam)', borderRadius: 'var(--radius)', border: '1.5px solid var(--teal)', marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="rgba(56,178,172,0.15)" />
            <path d="M12 20.5l6 6 10-12" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ color: 'var(--teal)', fontWeight: 600, fontSize: 14, textAlign: 'center', margin: 0 }}>
            {t('magic_link_sent')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSignup} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" className="label">{t('login_email')}</label>
            <input
              id="email"
              type="email"
              required
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '…' : t('login_submit')}
          </button>
        </form>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        {t('or')}
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogle}
        className="btn"
        style={{ width: '100%', justifyContent: 'center', background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--line)' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Google
      </button>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
        {t('have_account')}{' '}
        <Link href="/giris" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
          {t('login_title')}
        </Link>
      </p>
    </div>
  );
}
