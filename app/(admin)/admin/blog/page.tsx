'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const BLOG_BUCKET = 'blog-images'

function getBlogImageUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const supabase = createClient()
  const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  title_en: string | null
  excerpt_en: string | null
  content_en: string | null
  img_url: string | null
  category: string | null
  read_time: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  title_en: string
  excerpt_en: string
  content_en: string
  img_url: string
  category: string
  read_time: string
  published: boolean
}

const EMPTY_FORM: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  title_en: '',
  excerpt_en: '',
  content_en: '',
  img_url: '',
  category: 'Rehber',
  read_time: '',
  published: false,
}

const CATEGORIES = ['Rehber', 'Rota Rehberi', 'Tekne İnceleme', 'Haber', 'İpuçları']

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

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list')
  const [selected, setSelected] = useState<BlogPost | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [langTab, setLangTab] = useState<'tr' | 'en'>('tr')
  const [uploading, setUploading] = useState(false)
  const imgInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPosts(data ?? [])
    setLoading(false)
  }

  function handleEdit(post: BlogPost) {
    setSelected(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      title_en: post.title_en ?? '',
      excerpt_en: post.excerpt_en ?? '',
      content_en: post.content_en ?? '',
      img_url: post.img_url ?? '',
      category: post.category ?? 'Rehber',
      read_time: post.read_time ?? '',
      published: post.published,
    })
    setMode('edit')
  }

  function handleAdd() {
    setSelected(null)
    setForm(EMPTY_FORM)
    setMode('add')
  }

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`"${post.title}" yazısını silmek istediğinizden emin misiniz?`)) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id)
    if (error) { setError(error.message); return }
    setPosts(prev => prev.filter(p => p.id !== post.id))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadErr } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, { upsert: false })
    if (uploadErr) {
      setError('Görsel yüklenemedi: ' + uploadErr.message)
    } else {
      const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path)
      set('img_url', data.publicUrl)
    }
    setUploading(false)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Başlık zorunlu.'); return }
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || toSlug(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      title_en: form.title_en.trim() || null,
      excerpt_en: form.excerpt_en.trim() || null,
      content_en: form.content_en.trim() || null,
      img_url: form.img_url.trim() || null,
      category: form.category || null,
      read_time: form.read_time.trim() || null,
      published: form.published,
      published_at: form.published ? (selected?.published_at ?? new Date().toISOString()) : null,
    }

    if (mode === 'add') {
      const { error } = await supabase.from('blog_posts').insert({ id: payload.slug, ...payload })
      if (error) { setError(error.message); setSaving(false); return }
    } else if (selected) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', selected.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    await fetchPosts()
    setSaving(false)
    setMode('list')
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // ── LIST ──
  if (mode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink, #1e293b)', fontFamily: 'Georgia, serif' }}>
            Blog Yönetimi
          </h2>
          <button style={S.btnTeal} onClick={handleAdd}>+ Yeni Yazı</button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <div style={S.card}>
          <div style={{ padding: '14px 16px' }}>
            <input
              style={{ ...S.input, maxWidth: 360 }}
              placeholder="Başlık veya kategoriye göre ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={S.th}>Görsel</th>
                  <th style={S.th}>Başlık</th>
                  <th style={S.th}>Kategori</th>
                  <th style={S.th}>Okuma</th>
                  <th style={S.th}>Durum</th>
                  <th style={S.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--sand, #94a3b8)' }}>
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: 32, color: 'var(--sand, #94a3b8)' }}>
                      Yazı bulunamadı.
                    </td>
                  </tr>
                ) : filtered.map(post => (
                  <tr key={post.id}>
                    <td style={S.td}>
                      {post.img_url ? (
                        <div style={{ position: 'relative', width: 64, height: 42, borderRadius: 6, overflow: 'hidden' }}>
                          <Image src={post.img_url} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="64px" />
                        </div>
                      ) : (
                        <div style={{ width: 64, height: 42, borderRadius: 6, background: 'var(--mist, #f0f4f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                          📝
                        </div>
                      )}
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, maxWidth: 260 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--sand, #94a3b8)', marginTop: 2 }}>{post.slug}</div>
                    </td>
                    <td style={S.td}>
                      {post.category && (
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, background: 'var(--foam, #e0f2fe)', color: 'var(--deep, #0b2540)', fontSize: 12, fontWeight: 600 }}>
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td style={S.td}>{post.read_time ?? '—'}</td>
                    <td style={S.td}>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                        background: post.published ? '#dcfce7' : '#fef9c3',
                        color: post.published ? '#15803d' : '#854d0e',
                      }}>
                        {post.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={S.btnOutlineTeal} onClick={() => handleEdit(post)}>Düzenle</button>
                        <button style={S.btnOutlineRed} onClick={() => handleDelete(post)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line, #e5e7eb)', fontSize: 13, color: 'var(--sand, #94a3b8)' }}>
            {filtered.length} yazı gösteriliyor
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
          {isEdit ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
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

      {/* TR / EN Language Tab */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 16px', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mist)', marginRight: 4 }}>İçerik dili:</span>
        {(['tr', 'en'] as const).map(lang => (
          <button
            key={lang}
            type="button"
            onClick={() => setLangTab(lang)}
            style={{
              padding: '7px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '2px solid', borderRadius: 8,
              borderColor: langTab === lang ? 'var(--teal)' : 'var(--line)',
              background: langTab === lang ? 'var(--teal)' : 'transparent',
              color: langTab === lang ? '#fff' : 'var(--mist)',
            }}
          >
            {lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Temel Bilgiler</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label={langTab === 'tr' ? 'Başlık (TR)' : 'Title (EN)'}>
              <input
                style={S.input}
                value={langTab === 'tr' ? form.title : form.title_en}
                onChange={e => {
                  if (langTab === 'tr') {
                    set('title', e.target.value)
                    if (!isEdit) set('slug', toSlug(e.target.value))
                  } else {
                    set('title_en', e.target.value)
                  }
                }}
                placeholder={langTab === 'tr' ? 'Yazı başlığı' : 'Post title'}
              />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
              <Field label="Slug (URL)">
                <input style={S.input} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="yazi-basligi" />
              </Field>
              <Field label="Kategori">
                <select style={S.select} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Okuma Süresi">
                <input style={S.input} value={form.read_time} onChange={e => set('read_time', e.target.value)} placeholder="ör. 5 dk" />
              </Field>
              <Field label="Durum">
                <select style={S.select} value={form.published ? 'true' : 'false'} onChange={e => set('published', e.target.value === 'true')}>
                  <option value="false">Taslak</option>
                  <option value="true">Yayında</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>{langTab === 'tr' ? 'İçerik (TR)' : 'Content (EN)'}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label={langTab === 'tr' ? 'Özet (Excerpt)' : 'Excerpt (EN)'}>
              <textarea
                style={{ ...S.textarea, minHeight: 72 }}
                value={langTab === 'tr' ? form.excerpt : form.excerpt_en}
                onChange={e => set(langTab === 'tr' ? 'excerpt' : 'excerpt_en', e.target.value)}
                placeholder={langTab === 'tr' ? 'Kısa özet...' : 'Short summary...'}
              />
            </Field>
            <Field label={langTab === 'tr' ? 'İçerik' : 'Content'}>
              <textarea
                style={{ ...S.textarea, minHeight: 200 }}
                value={langTab === 'tr' ? form.content : form.content_en}
                onChange={e => set(langTab === 'tr' ? 'content' : 'content_en', e.target.value)}
                placeholder={langTab === 'tr' ? 'Yazı içeriği...' : 'Post content...'}
              />
            </Field>
          </div>
        </div>

        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Görsel</p>
          <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end', marginBottom: 16 }}>
            <Field label="Kapak Görsel URL (veya aşağıdan yükle)">
              <input style={S.input} value={form.img_url} onChange={e => set('img_url', e.target.value)} placeholder="https://..." />
            </Field>
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: '2px solid var(--teal)', borderRadius: 8,
                background: 'transparent', color: 'var(--teal)', whiteSpace: 'nowrap',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              {uploading ? 'Yükleniyor…' : '📁 Dosya seç'}
            </button>
          </div>
          {form.img_url && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ position: 'relative', width: 180, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line, #e5e7eb)', flexShrink: 0 }}>
                <Image src={getBlogImageUrl(form.img_url)} alt="preview" fill style={{ objectFit: 'cover' }} sizes="180px" />
              </div>
              <button
                type="button"
                onClick={() => set('img_url', '')}
                style={{ fontSize: 12, color: '#991b1b', background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}
              >
                Görseli kaldır
              </button>
            </div>
          )}
        </div>

        <button
          style={{ ...S.btnTeal, width: '100%', padding: '13px 20px', fontSize: 15, borderRadius: 10, opacity: saving ? 0.7 : 1 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Yazıyı Ekle'}
        </button>
      </div>
    </div>
  )
}
