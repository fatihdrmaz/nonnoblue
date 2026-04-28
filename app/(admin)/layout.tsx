'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/Logo'

const NAV_ITEMS = [
  { k: 'dashboard',      l: 'Dashboard',          href: '/admin' },
  { k: 'calendar',       l: 'Takvim & müsaitlik', href: '/admin/takvim' },
  { k: 'reservations',   l: 'Rezervasyonlar',     href: '/admin/rezervasyonlar' },
  { k: 'fleet',          l: 'Filo yönetimi',      href: '/admin/filo' },
  { k: 'customers',      l: 'Müşteriler',         href: '/admin/musteriler' },
  { k: 'routes',         l: 'Rotalar',            href: '/admin/rotalar' },
  { k: 'team',           l: 'Ekip',               href: '/admin/ekip' },
  { k: 'blog',           l: 'Blog',               href: '/admin/blog' },
  { k: 'mail',           l: 'Mail şablonları',    href: '/admin/mail' },
  { k: 'settings',       l: 'Ayarlar',            href: '/admin/ayarlar' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setAdminEmail(user.email ?? '')
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => setAdminName(data?.full_name || user.email?.split('@')[0] || 'Admin'))
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <aside style={{
        background: 'var(--deep-2)',
        color: '#fff',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 4 }}>
          <Logo invert height={28} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(it => {
            const isActive = it.href === '/admin' ? pathname === '/admin' : pathname.startsWith(it.href)
            return (
              <Link key={it.href} href={it.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 8, textDecoration: 'none',
                background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
                fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                marginBottom: 2, transition: 'background 0.15s',
              }}>
                {it.l}
              </Link>
            )
          })}
        </nav>

        {/* User + Signout */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {(adminName || 'A')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adminName}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Operasyon yöneticisi
              </div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '8px 0', border: '1px solid rgba(255,255,255,.15)',
            background: 'transparent', color: 'rgba(255,255,255,.7)',
            borderRadius: 8, fontSize: 12, cursor: 'pointer',
          }}>
            Çıkış yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: '32px 40px', overflowX: 'hidden', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
