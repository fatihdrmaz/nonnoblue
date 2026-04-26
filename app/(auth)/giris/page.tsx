'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function GirisPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
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
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google ile giriş başarısız oldu.');
    }
  }

  return (
    <div
      style={{
        maxWidth: 440,
        width: '100%',
        margin: '0 auto',
        background: 'var(--card)',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'serif',
            fontSize: 24,
            fontWeight: 400,
            textDecoration: 'none',
            color: 'var(--ink)',
            letterSpacing: '-0.5px',
          }}
        >
          Nonno<span style={{ color: 'var(--teal)', fontWeight: 700 }}>Blue</span>
        </Link>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'var(--ink)',
          textAlign: 'center',
          margin: '0 0 0.5rem',
        }}
      >
        Hoş Geldiniz
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: 'var(--deep)',
          fontSize: '0.9375rem',
          margin: '0 0 1.75rem',
        }}
      >
        E-posta adresinize giriş bağlantısı göndereceğiz
      </p>

      {/* Magic Link Form or Sent State */}
      {sent ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.25rem',
            background: 'rgba(16,185,129,0.08)',
            borderRadius: 12,
            marginBottom: '1.5rem',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="20" fill="rgba(16,185,129,0.15)" />
            <path
              d="M12 20.5l6 6 10-12"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            style={{
              color: '#059669',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Bağlantı gönderildi! E-postanızı kontrol edin.
          </p>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--ink)',
              marginBottom: '0.375rem',
            }}
          >
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 8,
              border: '1.5px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              fontSize: '0.9375rem',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '0.875rem',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--teal)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
          />

          {error && (
            <p
              style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                margin: '0 0 0.75rem',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.6875rem',
              borderRadius: 8,
              border: 'none',
              background: loading ? 'var(--mist)' : 'var(--teal)',
              color: '#fff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Gönderiliyor…' : 'Giriş Bağlantısı Gönder'}
          </button>
        </form>
      )}

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1.25rem 0',
          color: 'var(--deep)',
          fontSize: '0.8125rem',
        }}
      >
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        veya
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogle}
        style={{
          width: '100%',
          padding: '0.6875rem',
          borderRadius: 8,
          border: '1.5px solid var(--line)',
          background: '#fff',
          color: 'var(--ink)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--foam)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
      >
        {/* Google G SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        Google ile Giriş Yap
      </button>

      {/* Footer Link */}
      <p
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--deep)',
        }}
      >
        Hesabınız yok mu?{' '}
        <Link
          href="/kayit"
          style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
