'use client'

import { useState } from 'react'
import { BRAND } from '@/data/mock'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    background: 'var(--card, #fff)',
    border: '1px solid var(--line, #e5e7eb)',
    borderRadius: 12,
    overflow: 'hidden',
  }}>
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--line, #e5e7eb)',
      background: 'var(--bg, #f8fafc)',
    }}>
      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--deep, #0b2540)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </h2>
    </div>
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </div>
)

const Field = ({
  label,
  defaultValue = '',
  type = 'text',
  readOnly = false,
  badge,
}: {
  label: string
  defaultValue?: string
  type?: string
  readOnly?: boolean
  badge?: React.ReactNode
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink, #1e293b)' }}>{label}</label>
      {badge}
    </div>
    <input
      type={type}
      defaultValue={defaultValue}
      readOnly={readOnly}
      style={{
        padding: '9px 12px',
        border: '1px solid var(--line, #e5e7eb)',
        borderRadius: 8,
        fontSize: 14,
        color: 'var(--ink, #1e293b)',
        background: readOnly ? 'var(--bg, #f4f6f8)' : '#fff',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
)

const Toggle = ({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) => {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--line, #e5e7eb)',
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink, #1e293b)' }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        role="switch"
        aria-checked={checked}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? 'var(--teal, #0d9488)' : '#d1d5db',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

export default function AdminAyarlarPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>

      {/* Şirket Bilgileri */}
      <Section title="Şirket Bilgileri">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Firma Adı" defaultValue={BRAND.name} />
          <Field label="E-posta" defaultValue={BRAND.email} type="email" />
          <Field label="Telefon" defaultValue={BRAND.phone} type="tel" />
          <Field label="Adres" defaultValue={BRAND.address} />
        </div>
      </Section>

      {/* Ödeme Ayarları */}
      <Section title="Ödeme Ayarları">
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#fef9c3',
            color: '#854d0e',
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            <span>⏳</span>
            iyzico Onay Bekleniyor
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field
            label="iyzico Merchant ID"
            defaultValue="••••••••••••1234"
            badge={
              <span style={{
                fontSize: 11,
                background: '#f3f4f6',
                color: '#6b7280',
                padding: '2px 7px',
                borderRadius: 4,
                fontWeight: 500,
              }}>masked</span>
            }
          />
          <Field
            label="iyzico Secret Key"
            defaultValue="sandbox_key_example"
            type="password"
          />
        </div>
      </Section>

      {/* E-posta Ayarları */}
      <Section title="E-posta Ayarları">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Resend API Key" defaultValue="re_live_xxxxxxxxxxxx" type="password" />
          <Field label="Gönderici E-posta" defaultValue={BRAND.email} type="email" />
          <div>
            <button
              style={{
                background: 'var(--deep, #0b2540)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Test E-postası Gönder
            </button>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>
              fdurmaz@gmail.com adresine test maili gönderir.
            </p>
          </div>
        </div>
      </Section>

      {/* Bildirimler */}
      <Section title="Bildirimler">
        <div>
          <Toggle
            label="Yeni Rezervasyon E-postası"
            description="Her yeni rezervasyon geldiğinde e-posta bildirim al."
            defaultChecked
          />
          <Toggle
            label="Ödeme Bildirimi"
            description="Ödeme tamamlandığında veya başarısız olduğunda bildir."
            defaultChecked
          />
          <Toggle
            label="Takvim Hatırlatıcı"
            description="Rezervasyon başlangıcından 24 saat önce hatırlatıcı gönder."
          />
        </div>
      </Section>

      {/* Kaydet */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{
            background: 'var(--teal, #0d9488)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Kaydet
        </button>
      </div>
    </div>
  )
}
