'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface Route {
  id: string
  title: string
  days: number
  difficulty: string
  description: string | null
  highlights: string[] | null
  img_url: string | null
  active: boolean
  display_order: number
  created_at: string
}

interface FormData {
  id: string
  title: string
  days: number
  difficulty: string
  description: string
  highlights: string
  img_url: string
  active: boolean
  display_order: number
}

const EMPTY_FORM: FormData = {
  id: '',
  title: '',
  days: 7,
  difficulty: 'Kolay',
  description: '',
  highlights: '',
  img_url: '',
  active: true,
  display_order: 0,
}

const DIFFICULTIES = ['Kolay', 'Orta', 'Zor']

const S = {
  card: {
    background: 'var(--card, #fff)',
    borderRadius: 12,
    border: '1px solid var(--line, #e5e7eb)',
    overflow: 'hidden',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--teal, #0d9488)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    borderBottom: '2px solid var(--teal, #0d9488)',
    paddingBottom: 6,
    marginBottom: 16,
    marginTop: 0,
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--ink, #1e293b)',
    marginBottom: 5,
  } as React.CSSProperties,

  input: {
    width: '100%',
    border: '1px solid var(--line, #e5e7eb)',
    borderRadius: 7,
    padding: '8px 12px',
    fontSize: 14,
    color: 'var(--ink, #1e293b)',
    background: 'var(--bg, #f4f6f8)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  select: {
    width: '100%',
    border: '1px solid var(--line, #e5e7eb)',
    borderRadius: 7,
    padding: '8px 12px',
    fontSize: 14,
    color: 'var(--ink, #1e293b)',
    background: 'var(--bg, #f4f6f8)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    border: '1px solid var(--line, #e5e7eb)',
    borderRadius: 7,
    padding: '8px 12px',
    fontSize: 14,
    color: 'var(--ink, #1e293b)',
    background: 'var(--bg, #f4f6f8)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
    minHeight: 100,
  } as React.CSSProperties,

  btnTeal: {
    background: 'var(--teal, #0d9488)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '9px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  btnOutlineTeal: {
    background: 'transparent',
    color: 'var(--teal, #0d9488)',
    border: '1px solid var(--teal, #0d9488)',
    borderRadius: 7,
    padding: '6px 13px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  btnOutlineRed: {
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: 7,
    padding: '6px 13px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  th: {
    padding: '10px 14px',
    textAlign: 'left' as const,
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--deep, #0b2540)',
    background: 'var(--mist, #f0f4f8)',
    borderBottom: '1px solid var(--line, #e5e7eb)',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  td: {
    padding: '10px 14px',
    fontSize: 14,
    color: 'var(--ink, #1e293b)',
    borderBottom: '1px solid var(--line, #e5e7eb)',
    verticalAlign: 'middle' as const,
  } as React.CSSProperties,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

function toId(title: string) {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string }> = {
  'Kolay': { bg: '#dcfce7', color: '#15803d' },
  'Orta': { bg: '#fef9c3', color: '#854d0e' },
  'Zor': { bg: '#fee2e2', color: '#b91c1c' },
}

export default function AdminRotalarPage() {
  const supabase = createClient()
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list')
  const [selected, setSelected] = useState<Route | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)

  useEffect(() => { fetchRoutes() }, [])

  async function fetchRoutes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) setError(error.message)
    else setRoutes(data ?? [])
    setLoading(false)
  }

  function handleEdit(route: Route) {
    setSelected(route)
    setForm({
      id: route.id,
      title: route.title,
      days: route.days,
      difficulty: route.difficulty,
      description: route.description ?? '',
      highlights: (route.highlights ?? []).join('\n'),
      img_url: route.img_url ?? '',
      active: route.active,
      display_order: route.display_order,
    })
    setMode('edit')
  }

  function handleAdd() {
    setSelected(null)
    setForm({ ...EMPTY_FORM, display_order: routes.length + 1 })
    setMode('add')
  }

  async function handleDelete(route: Route) {
    if (!window.confirm(`"${route.title}" rotasını silmek istediğinizden emin misiniz?`)) return
    const { error } = await supabase.from('routes').delete().eq('id', route.id)
    if (error) { setError(error.message); return }
    setRoutes(prev => prev.filter(r => r.id !== route.id))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Başlık zorunlu.'); return }
    setSaving(true)
    setError(null)

    const highlightsArr = form.highlights
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      title: form.title.trim(),
      days: form.days,
      difficulty: form.difficulty,
      description: form.description.trim() || null,
      highlights: highlightsArr.length > 0 ? highlightsArr : null,
      img_url: form.img_url.trim() || null,
      active: form.active,
      display_order: form.display_order,
    }

    if (mode === 'add') {
      const id = form.id.trim() || toId(form.title)
      const { error } = await supabase.from('routes').insert({ id, ...payload })
      if (error) { setError(error.message); setSaving(false); return }
    } else if (selected) {
      const { error } = await supabase.from('routes').update(payload).eq('id', selected.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    await fetchRoutes()
    setSaving(false)
    setMode('list')
  }

  function set(field: keyof FormData, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // ── LIST ──
  if (mode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink, #1e293b)', fontFamily: 'Georgia, serif' }}>
            Rota Yönetimi
          </h2>
          <button style={S.btnTeal} onClick={handleAdd}>+ Yeni Rota</button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <div style={S.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={S.th}>Görsel</th>
                  <th style={S.th}>Rota Adı</th>
                  <th style={S.th}>Gün</th>
                  <th style={S.th}>Zorluk</th>
                  <th style={S.th}>Durum</th>
                  <th style={S.th}>Sıra</th>
                  <th style={S.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--sand, #94a3b8)' }}>
                      Yükleniyor...
                    </td>
                  </tr>
                ) : routes.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--sand, #94a3b8)' }}>
                      Rota bulunamadı.
                    </td>
                  </tr>
                ) : routes.map(route => {
                  const dc = DIFFICULTY_COLORS[route.difficulty] ?? { bg: '#f1f5f9', color: '#475569' }
                  return (
                    <tr key={route.id}>
                      <td style={S.td}>
                        {route.img_url ? (
                          <div style={{ position: 'relative', width: 64, height: 42, borderRadius: 6, overflow: 'hidden' }}>
                            <Image src={route.img_url} alt={route.title} fill style={{ objectFit: 'cover' }} sizes="64px" />
                          </div>
                        ) : (
                          <div style={{ width: 64, height: 42, borderRadius: 6, background: 'var(--mist, #f0f4f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            🗺️
                          </div>
                        )}
                      </td>
                      <td style={{ ...S.td, fontWeight: 600 }}>
                        <div>{route.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--sand, #94a3b8)', marginTop: 2 }}>{route.id}</div>
                      </td>
                      <td style={S.td}>{route.days} gün</td>
                      <td style={S.td}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: dc.bg, color: dc.color }}>
                          {route.difficulty}
                        </span>
                      </td>
                      <td style={S.td}>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                          background: route.active ? '#dcfce7' : '#f1f5f9',
                          color: route.active ? '#15803d' : '#64748b',
                        }}>
                          {route.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td style={S.td}>{route.display_order}</td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={S.btnOutlineTeal} onClick={() => handleEdit(route)}>Düzenle</button>
                          <button style={S.btnOutlineRed} onClick={() => handleDelete(route)}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line, #e5e7eb)', fontSize: 13, color: 'var(--sand, #94a3b8)' }}>
            {routes.length} rota
          </div>
        </div>
      </div>
    )
  }

  // ── EDIT / ADD ──
  const isEdit = mode === 'edit'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink, #1e293b)', fontFamily: 'Georgia, serif' }}>
          {isEdit ? 'Rotayı Düzenle' : 'Yeni Rota'}
        </h2>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--teal, #0d9488)', fontWeight: 600, padding: 0 }}
          onClick={() => setMode('list')}
        >
          ← Listeye Dön
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Temel Bilgiler</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Rota Adı">
              <input
                style={S.input}
                value={form.title}
                onChange={e => {
                  set('title', e.target.value)
                  if (!isEdit) set('id', toId(e.target.value))
                }}
                placeholder="ör. Göcek – Fethiye Körfezi"
              />
            </Field>
            <Field label="ID (URL)">
              <input style={S.input} value={form.id} onChange={e => set('id', e.target.value)} placeholder="gocek-fethiye" disabled={isEdit} />
            </Field>
            <Field label="Gün Sayısı">
              <input style={S.input} type="number" min={1} value={form.days} onChange={e => set('days', Number(e.target.value))} />
            </Field>
            <Field label="Zorluk">
              <select style={S.select} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Sıralama">
              <input style={S.input} type="number" min={0} value={form.display_order} onChange={e => set('display_order', Number(e.target.value))} />
            </Field>
            <Field label="Durum">
              <select style={S.select} value={form.active ? 'true' : 'false'} onChange={e => set('active', e.target.value === 'true')}>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </Field>
          </div>
        </div>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Açıklama ve Güzergah</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Açıklama">
              <textarea style={{ ...S.textarea, minHeight: 100 }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Rota açıklaması..." />
            </Field>
            <Field label="Güzergah Noktaları (her satıra bir nokta)">
              <textarea
                style={S.textarea}
                value={form.highlights}
                onChange={e => set('highlights', e.target.value)}
                placeholder={'12 Adalar\nTersane Adası\nBedri Rahmi Koyu'}
              />
            </Field>
          </div>
        </div>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Görsel</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', alignItems: 'start' }}>
            <Field label="Görsel URL">
              <input style={S.input} value={form.img_url} onChange={e => set('img_url', e.target.value)} placeholder="https://..." />
            </Field>
            {form.img_url && (
              <div>
                <label style={S.label}>Önizleme</label>
                <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line, #e5e7eb)' }}>
                  <Image src={form.img_url} alt="preview" fill style={{ objectFit: 'cover' }} sizes="120px" />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          style={{ ...S.btnTeal, width: '100%', padding: '13px 20px', fontSize: 15, borderRadius: 10, opacity: saving ? 0.7 : 1 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Rotayı Ekle'}
        </button>
      </div>
    </div>
  )
}
