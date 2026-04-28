'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const SUPABASE_STORAGE = 'https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/team-photos'

function toPublicUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${SUPABASE_STORAGE}/${path}`
}

interface Member {
  id: string
  name: string
  title: string
  bio: string | null
  title_en: string | null
  bio_en: string | null
  avatar_url: string | null
  display_order: number
  active: boolean
}

interface FormData {
  name: string
  title: string
  bio: string
  title_en: string
  bio_en: string
  avatar_url: string
  display_order: number
  active: boolean
}

const EMPTY_FORM: FormData = {
  name: '',
  title: '',
  bio: '',
  title_en: '',
  bio_en: '',
  avatar_url: '',
  display_order: 0,
  active: true,
}

const S = {
  card: { background: 'var(--card,#fff)', borderRadius: 12, border: '1px solid var(--line,#e5e7eb)', overflow: 'hidden' } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink,#1e293b)', marginBottom: 5 } as React.CSSProperties,
  input: { width: '100%', border: '1px solid var(--line,#e5e7eb)', borderRadius: 7, padding: '8px 12px', fontSize: 14, color: 'var(--ink,#1e293b)', background: 'var(--bg,#f4f6f8)', outline: 'none', boxSizing: 'border-box' as const } as React.CSSProperties,
  textarea: { width: '100%', border: '1px solid var(--line,#e5e7eb)', borderRadius: 7, padding: '8px 12px', fontSize: 14, color: 'var(--ink,#1e293b)', background: 'var(--bg,#f4f6f8)', outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 80 } as React.CSSProperties,
  select: { width: '100%', border: '1px solid var(--line,#e5e7eb)', borderRadius: 7, padding: '8px 12px', fontSize: 14, color: 'var(--ink,#1e293b)', background: 'var(--bg,#f4f6f8)', outline: 'none', boxSizing: 'border-box' as const } as React.CSSProperties,
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'var(--teal,#0d9488)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', borderBottom: '2px solid var(--teal,#0d9488)', paddingBottom: 6, marginBottom: 16, marginTop: 0 } as React.CSSProperties,
  btnTeal: { background: 'var(--teal,#0d9488)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  btnOutlineTeal: { background: 'transparent', color: 'var(--teal,#0d9488)', border: '1px solid var(--teal,#0d9488)', borderRadius: 7, padding: '6px 13px', fontSize: 13, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  btnOutlineRed: { background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 7, padding: '6px 13px', fontSize: 13, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  th: { padding: '10px 14px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: 'var(--deep,#0b2540)', background: 'var(--foam,#eef6fa)', borderBottom: '1px solid var(--line,#e5e7eb)' } as React.CSSProperties,
  td: { padding: '12px 14px', fontSize: 14, color: 'var(--ink,#1e293b)', borderBottom: '1px solid var(--line,#e5e7eb)', verticalAlign: 'middle' as const } as React.CSSProperties,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={S.label}>{label}</label>{children}</div>
}

export default function AdminEkipPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list')
  const [selected, setSelected] = useState<Member | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [langTab, setLangTab] = useState<'tr' | 'en'>('tr')

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) setError(error.message)
    else setMembers(data ?? [])
    setLoading(false)
  }

  function handleEdit(m: Member) {
    setSelected(m)
    setForm({ name: m.name, title: m.title, bio: m.bio ?? '', title_en: m.title_en ?? '', bio_en: m.bio_en ?? '', avatar_url: m.avatar_url ?? '', display_order: m.display_order, active: m.active })
    setMode('edit')
  }

  function handleAdd() {
    setSelected(null)
    setForm({ ...EMPTY_FORM, display_order: members.length + 1 })
    setMode('add')
  }

  async function handleDelete(m: Member) {
    if (!window.confirm(`"${m.name}" üyeyi silmek istediğinizden emin misiniz?`)) return
    const { error } = await supabase.from('team_members').delete().eq('id', m.id)
    if (error) { setError(error.message); return }
    setMembers(prev => prev.filter(x => x.id !== m.id))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('İsim zorunlu.'); return }
    if (!form.title.trim()) { setError('Unvan zorunlu.'); return }
    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim() || null,
      title_en: form.title_en.trim() || null,
      bio_en: form.bio_en.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      display_order: form.display_order,
      active: form.active,
    }

    if (mode === 'add') {
      const { error } = await supabase.from('team_members').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    } else if (selected) {
      const { error } = await supabase.from('team_members').update(payload).eq('id', selected.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    await fetchMembers()
    setSaving(false)
    setMode('list')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from('team-photos').upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('team-photos').getPublicUrl(path)
    setForm(prev => ({ ...prev, avatar_url: data.publicUrl }))
    setUploading(false)
  }

  function set(field: keyof FormData, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // ── LIST ──
  if (mode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Ekip Yönetimi</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Hakkımızda sayfasındaki "NonnoBlue Ailesi" bölümü</p>
          </div>
          <button style={S.btnTeal} onClick={handleAdd}>+ Yeni Üye</button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <div style={S.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={S.th}>Fotoğraf</th>
                  <th style={S.th}>İsim</th>
                  <th style={S.th}>Unvan</th>
                  <th style={S.th}>Durum</th>
                  <th style={S.th}>Sıra</th>
                  <th style={S.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Yükleniyor…</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Henüz ekip üyesi yok.</td></tr>
                ) : members.map(m => (
                  <tr key={m.id}>
                    <td style={S.td}>
                      {m.avatar_url ? (
                        <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--line)' }}>
                          <Image src={toPublicUrl(m.avatar_url)} alt={m.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                        </div>
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--foam)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid var(--line)' }}>
                          👤
                        </div>
                      )}
                    </td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{m.name}</td>
                    <td style={{ ...S.td, color: 'var(--muted)' }}>{m.title}</td>
                    <td style={S.td}>
                      <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: m.active ? '#dcfce7' : '#f1f5f9', color: m.active ? '#15803d' : '#64748b' }}>
                        {m.active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td style={S.td}>{m.display_order}</td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={S.btnOutlineTeal} onClick={() => handleEdit(m)}>Düzenle</button>
                        <button style={S.btnOutlineRed} onClick={() => handleDelete(m)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--muted)' }}>
            {members.length} üye
          </div>
        </div>
      </div>
    )
  }

  // ── EDIT / ADD ──
  const isEdit = mode === 'edit'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Georgia, serif' }}>
          {isEdit ? 'Üyeyi Düzenle' : 'Yeni Üye Ekle'}
        </h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--teal)', fontWeight: 600, padding: 0 }} onClick={() => setMode('list')}>
          ← Listeye Dön
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Fotoğraf */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Fotoğraf</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '2.5px dashed var(--line)', background: 'var(--foam)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {form.avatar_url ? (
                <Image src={toPublicUrl(form.avatar_url)} alt="preview" fill style={{ objectFit: 'cover' }} sizes="100px" />
              ) : (
                <span style={{ fontSize: 36 }}>👤</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={S.label}>Dosyadan Yükle</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: uploading ? 'wait' : 'pointer', background: 'var(--teal,#0d9488)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, opacity: uploading ? 0.7 : 1 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  {uploading ? 'Yükleniyor…' : 'Fotoğraf Seç'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </div>
              <div>
                <label style={S.label}>veya URL Gir</label>
                <input style={S.input} value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." />
              </div>
              {form.avatar_url && (
                <button style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 600 }} onClick={() => set('avatar_url', '')}>
                  Fotoğrafı Kaldır
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bilgiler */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Kişi Bilgileri</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Ad Soyad">
              <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="ör. Mehmet Sarıtaş" />
            </Field>
            <Field label={langTab === 'tr' ? 'Unvan / Görev (TR)' : 'Title / Role (EN)'}>
              <input style={S.input} value={langTab === 'tr' ? form.title : form.title_en} onChange={e => set(langTab === 'tr' ? 'title' : 'title_en', e.target.value)} placeholder={langTab === 'tr' ? 'ör. Kurucu & Operasyon' : 'e.g. Founder & Operations'} />
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
            <div style={{ gridColumn: '1 / -1' }}>
              {/* TR / EN tab */}
              <div style={{ display: 'flex', gap: 8, background: 'var(--card)', border: '1px solid var(--line,#e5e7eb)', borderRadius: 10, padding: '10px 16px', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mist,#94a3b8)', marginRight: 4 }}>İçerik dili:</span>
                {(['tr', 'en'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLangTab(lang)}
                    style={{
                      padding: '7px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      border: '2px solid', borderRadius: 8,
                      borderColor: langTab === lang ? 'var(--teal,#0d9488)' : 'var(--line,#e5e7eb)',
                      background: langTab === lang ? 'var(--teal,#0d9488)' : 'transparent',
                      color: langTab === lang ? '#fff' : 'var(--mist,#94a3b8)',
                    }}
                  >
                    {lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                  </button>
                ))}
              </div>
              <Field label={langTab === 'tr' ? 'Kısa Biyografi (opsiyonel)' : 'Short Bio (optional)'}>
                <textarea
                  style={S.textarea}
                  value={langTab === 'tr' ? form.bio : form.bio_en}
                  onChange={e => set(langTab === 'tr' ? 'bio' : 'bio_en', e.target.value)}
                  placeholder={langTab === 'tr' ? 'Kısa tanıtım metni...' : 'Short introduction...'}
                />
              </Field>
            </div>
          </div>
        </div>

        <button
          style={{ ...S.btnTeal, width: '100%', padding: '13px 20px', fontSize: 15, borderRadius: 10, opacity: saving ? 0.7 : 1 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor…' : isEdit ? 'Değişiklikleri Kaydet' : 'Üyeyi Ekle'}
        </button>
      </div>
    </div>
  )
}
