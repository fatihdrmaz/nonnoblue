'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🚢', label: 'Filo', href: '/admin/filo' },
  { icon: '📅', label: 'Takvim', href: '/admin/takvim' },
  { icon: '📋', label: 'Rezervasyonlar', href: '/admin/rezervasyonlar' },
  { icon: '👥', label: 'Müşteriler', href: '/admin/musteriler' },
  { icon: '🗺️', label: 'Rotalar', href: '/admin/rotalar' },
  { icon: '📝', label: 'Blog', href: '/admin/blog' },
  { icon: '⚙️', label: 'Ayarlar', href: '/admin/ayarlar' },
]

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/filo': 'Filo Yönetimi',
  '/admin/takvim': 'Rezervasyon Takvimi',
  '/admin/rezervasyonlar': 'Rezervasyonlar',
  '/admin/musteriler': 'Müşteriler',
  '/admin/rotalar': 'Rota Yönetimi',
  '/admin/blog': 'Blog Yönetimi',
  '/admin/ayarlar': 'Ayarlar',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pageTitle = PAGE_TITLES[pathname] ?? 'Admin'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40,
            display: 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 0,
          minWidth: sidebarOpen ? 240 : 0,
          background: 'var(--deep, #0b2540)',
          color: '#fff',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.2s, min-width 0.2s',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--teal, #0d9488)',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
          }}>
            NB Admin
          </span>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'var(--teal, #0d9488)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            <span>←</span>
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg, #f4f6f8)',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Top bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 60,
          background: 'var(--card, #fff)',
          borderBottom: '1px solid var(--line, #e5e7eb)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: '1px solid var(--line, #e5e7eb)',
                borderRadius: 6,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
              aria-label="Sidebar toggle"
            >
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--ink, #1e293b)', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--ink, #1e293b)', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--ink, #1e293b)', borderRadius: 2 }} />
            </button>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--ink, #1e293b)' }}>
              {pageTitle}
            </h1>
          </div>

          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--teal, #0d9488)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}>
            A
          </div>
        </header>

        <main style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
