'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type BoatPhoto = { id: string; storage_path: string; position: number }
type BoatPricing = { id: string; start_date: string | null; end_date: string | null; weekly_price_eur: number }

type Boat = {
  id: string
  slug: string
  name: string
  type: string
  brand: string | null
  model: string | null
  year: number | null
  length_m: number | null
  cabins: number | null
  max_guests: number | null
  marina: string | null
  deposit_eur: number | null
  active: boolean
  display_order: number
  boat_photos: BoatPhoto[]
  boat_pricing: BoatPricing[]
}

type FormState = {
  name: string
  slug: string
  type: string
  model: string
  year: string
  length_m: string
  cabins: string
  max_guests: string
  marina: string
  deposit_eur: string
  active: boolean
}

type EditTab = 'temel' | 'fotograflar' | 'fiyat'

const EMPTY_FORM: FormState = {
  name: '', slug: '', type: 'Katamaran', model: '', year: '',
  length_m: '', cabins: '', max_guests: '', marina: 'D-Marin Göcek',
  deposit_eur: '', active: true,
}

const BUCKET = 'boat-photos'

function getPublicUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const supabase = createClient()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export default function AdminFiloPage() {
  const router = useRouter()
  const [boats, setBoats] = useState<Boat[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editTab, setEditTab] = useState<EditTab>('temel')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Photo state
  const [photos, setPhotos] = useState<BoatPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pricing state
  const [prices, setPrices] = useState<BoatPricing[]>([])
  const [savingPrice, setSavingPrice] = useState(false)

  useEffect(() => { fetchBoats() }, [])

  async function fetchBoats() {
    const supabase = createClient()
    const { data } = await supabase
      .from('boats')
      .select('id,slug,name,type,brand,model,year,length_m,cabins,max_guests,marina,deposit_eur,active,display_order,boat_photos(id,storage_path,position),boat_pricing(id,start_date,end_date,weekly_price_eur)')
      .order('display_order')
    setBoats((data ?? []) as Boat[])
    setLoading(false)
  }

  async function fetchPhotos(boatId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('boat_photos')
      .select('id,storage_path,position')
      .eq('boat_id', boatId)
      .order('position')
    setPhotos((data ?? []) as BoatPhoto[])
  }

  async function fetchPrices(boatId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('boat_pricing')
      .select('id,start_date,end_date,weekly_price_eur')
      .eq('boat_id', boatId)
      .order('start_date')
    setPrices((data ?? []) as BoatPricing[])
  }

  function startEdit(boat: Boat, tab: EditTab = 'temel') {
    setEditing(boat.id)
    setEditTab(tab)
    setForm({
      name: boat.name, slug: boat.slug, type: boat.type,
      model: boat.model ?? '', year: boat.year?.toString() ?? '',
      length_m: boat.length_m?.toString() ?? '', cabins: boat.cabins?.toString() ?? '',
      max_guests: boat.max_guests?.toString() ?? '', marina: boat.marina ?? '',
      deposit_eur: boat.deposit_eur?.toString() ?? '', active: boat.active,
    })
    setPhotos(boat.boat_photos ?? [])
    setPrices(boat.boat_pricing ?? [])
    setMsg('')
    if (tab === 'fotograflar') fetchPhotos(boat.id)
    if (tab === 'fiyat') fetchPrices(boat.id)
  }

  function startNew() {
    setEditing('new')
    setEditTab('temel')
    setForm(EMPTY_FORM)
    setPhotos([])
    setPrices([])
    setMsg('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name, slug: form.slug, type: form.type,
      model: form.model || null,
      year: form.year ? parseInt(form.year) : null,
      length_m: form.length_m ? parseFloat(form.length_m) : null,
      cabins: form.cabins ? parseInt(form.cabins) : null,
      max_guests: form.max_guests ? parseInt(form.max_guests) : null,
      marina: form.marina || null,
      deposit_eur: form.deposit_eur ? parseInt(form.deposit_eur) : null,
      active: form.active,
    }

    if (editing === 'new') {
      const { data, error } = await supabase.from('boats').insert(payload).select().single()
      if (error) { setMsg('Hata: ' + error.message); setSaving(false); return }
      setEditing(data.id)
      setEditTab('fotograflar')
      setMsg('Tekne oluşturuldu ✓ Şimdi fotoğraf ekleyebilirsiniz.')
      await fetchBoats()
      setSaving(false)
      return
    }

    const { error } = await supabase.from('boats').update(payload).eq('id', editing!)
    if (error) { setMsg('Hata: ' + error.message); setSaving(false); return }
    setMsg('Kaydedildi ✓')
    await fetchBoats()
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !editing || editing === 'new') return
    setUploading(true)
    const supabase = createClient()
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${editing}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadErr) { setMsg('Upload hatası: ' + uploadErr.message); continue }
      const nextPos = photos.length > 0 ? Math.max(...photos.map(p => p.position)) + 1 : 0
      const { data, error: dbErr } = await supabase
        .from('boat_photos')
        .insert({ boat_id: editing, storage_path: path, position: nextPos })
        .select()
        .single()
      if (!dbErr && data) setPhotos(prev => [...prev, data as BoatPhoto])
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handlePhotoDelete(photo: BoatPhoto) {
    const supabase = createClient()
    await supabase.storage.from(BUCKET).remove([photo.storage_path])
    await supabase.from('boat_photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  async function handleSetCover(photo: BoatPhoto) {
    const supabase = createClient()
    const updates = photos.map((p, i) => ({
      id: p.id,
      position: p.id === photo.id ? 0 : i + 1,
    }))
    for (const u of updates) {
      await supabase.from('boat_photos').update({ position: u.position }).eq('id', u.id)
    }
    setPhotos(prev =>
      [...prev].map(p => ({ ...p, position: p.id === photo.id ? 0 : prev.indexOf(p) + 1 }))
        .sort((a, b) => a.position - b.position)
    )
  }

  function addPriceRow() {
    setPrices(prev => [...prev, { id: `new-${Date.now()}`, start_date: '', end_date: '', weekly_price_eur: 0 }])
  }

  async function savePrices() {
    if (!editing || editing === 'new') return
    setSavingPrice(true)
    const supabase = createClient()
    for (const p of prices) {
      const payload = {
        boat_id: editing,
        start_date: p.start_date || null,
        end_date: p.end_date || null,
        weekly_price_eur: p.weekly_price_eur,
      }
      if (p.id.startsWith('new-')) {
        await supabase.from('boat_pricing').insert(payload)
      } else {
        await supabase.from('boat_pricing').update(payload).eq('id', p.id)
      }
    }
    await fetchPrices(editing)
    setSavingPrice(false)
    setMsg('Fiyatlar kaydedildi ✓')
    setTimeout(() => setMsg(''), 2000)
  }

  async function deletePrice(priceId: string) {
    if (priceId.startsWith('new-')) { setPrices(prev => prev.filter(p => p.id !== priceId)); return }
    const supabase = createClient()
    await supabase.from('boat_pricing').delete().eq('id', priceId)
    setPrices(prev => prev.filter(p => p.id !== priceId))
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('boats').update({ active: !current }).eq('id', id)
    setBoats(prev => prev.map(b => b.id === id ? { ...b, active: !current } : b))
  }

  // ── EDIT VIEW ──────────────────────────────────────────────────────────────
  if (editing) {
    const isNew = editing === 'new'
    const currentBoat = boats.find(b => b.id === editing)
    const sortedPhotos = [...photos].sort((a, b) => a.position - b.position)

    return (
      <>
        <button onClick={() => { setEditing(null); setMsg('') }} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← Filo'ya dön
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
          {isNew ? 'Yeni tekne' : form.name}
        </h1>

        {/* Tabs */}
        {!isNew && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
            {([['temel', 'Temel bilgiler'], ['fotograflar', 'Fotoğraflar'], ['fiyat', 'Fiyat tablosu']] as [EditTab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => {
                  setEditTab(tab)
                  if (tab === 'fotograflar' && editing !== 'new') fetchPhotos(editing)
                  if (tab === 'fiyat' && editing !== 'new') fetchPrices(editing)
                }}
                style={{
                  padding: '10px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  border: 'none', background: 'transparent',
                  borderBottom: editTab === tab ? '2px solid var(--teal)' : '2px solid transparent',
                  color: editTab === tab ? 'var(--teal)' : 'var(--muted)',
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {msg && (
          <div style={{ padding: '12px 16px', background: msg.startsWith('Hata') ? '#fee2e2' : 'var(--foam)', borderRadius: 8, fontSize: 13, color: msg.startsWith('Hata') ? '#991b1b' : 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>
            {msg}
          </div>
        )}

        {/* ── TAB: Temel Bilgiler ── */}
        {(isNew || editTab === 'temel') && (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                  Temel bilgiler
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label className="label">Tekne adı *</label><input required className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Örn. Ayza 2" /></div>
                  <div><label className="label">Slug *</label><input required className="input" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="ayza-2" /></div>
                  <div><label className="label">Model</label><input className="input" value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="Lagoon 42" /></div>
                  <div><label className="label">Yıl</label><input className="input" type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2024" /></div>
                  <div>
                    <label className="label">Tip</label>
                    <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      <option>Katamaran</option><option>Yelkenli</option><option>Motoryat</option>
                    </select>
                  </div>
                  <div><label className="label">Boy (m)</label><input className="input" type="number" step="0.1" value={form.length_m} onChange={e => setForm(p => ({ ...p, length_m: e.target.value }))} placeholder="12.80" /></div>
                  <div><label className="label">Kabin</label><input className="input" type="number" value={form.cabins} onChange={e => setForm(p => ({ ...p, cabins: e.target.value }))} placeholder="4" /></div>
                  <div><label className="label">Maks. kişi</label><input className="input" type="number" value={form.max_guests} onChange={e => setForm(p => ({ ...p, max_guests: e.target.value }))} placeholder="10" /></div>
                  <div>
                    <label className="label">Marina</label>
                    <select className="input" value={form.marina} onChange={e => setForm(p => ({ ...p, marina: e.target.value }))}>
                      <option>D-Marin Göcek</option><option>Göcek Marina</option><option>Marmaris</option><option>Bodrum</option>
                    </select>
                  </div>
                  <div><label className="label">Depozito (€)</label><input className="input" type="number" value={form.deposit_eur} onChange={e => setForm(p => ({ ...p, deposit_eur: e.target.value }))} /></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                    Yayın durumu
                  </h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                    Sitede yayında
                  </label>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  {saving ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost">İptal</button>
              </div>
            </div>
          </form>
        )}

        {/* ── TAB: Fotoğraflar ── */}
        {!isNew && editTab === 'fotograflar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                  Fotoğraflar ({sortedPhotos.length})
                </h4>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Yükleniyor…' : '+ Fotoğraf yükle'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </div>

              {/* Upload drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--line)', borderRadius: 8, padding: '28px 20px',
                  textAlign: 'center', cursor: 'pointer', marginBottom: 20,
                  background: 'var(--mist)', color: 'var(--muted)', fontSize: 13,
                }}
              >
                {uploading ? 'Yükleniyor…' : 'Dosya seçin veya buraya sürükleyin'}
              </div>

              {sortedPhotos.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>Henüz fotoğraf yok.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {sortedPhotos.map((photo, i) => (
                    <div key={photo.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
                      <img
                        src={getPublicUrl(photo.storage_path)}
                        alt=""
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      {i === 0 && (
                        <div style={{ position: 'absolute', top: 6, left: 6, background: 'var(--teal)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
                          KAPAK
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 4, padding: '6px 8px', background: 'var(--card)' }}>
                        {i !== 0 && (
                          <button className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => handleSetCover(photo)}>
                            Kapak yap
                          </button>
                        )}
                        <button
                          className="btn btn-sm"
                          style={{ flex: 1, fontSize: 11, background: '#fee2e2', color: '#991b1b', border: 'none' }}
                          onClick={() => handlePhotoDelete(photo)}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)', height: 'fit-content' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                Bilgi
              </h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                İlk fotoğraf kapak fotoğrafı olarak görünür. Fotoğrafları yükledikten sonra "Kapak yap" ile sıralayabilirsiniz.
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                Desteklenen: JPG, PNG, WebP<br />
                Maks. boyut: 10 MB
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: Fiyat Tablosu ── */}
        {!isNew && editTab === 'fiyat' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                Sezon fiyatları
              </h4>

              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 90px', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, padding: '0 4px' }}>
                <span>Başlangıç</span><span>Bitiş</span><span>€ / hafta</span><span></span>
              </div>

              {prices.map((p) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 90px', gap: 8, marginBottom: 8 }}>
                  <input
                    className="input"
                    type="date"
                    value={p.start_date ?? ''}
                    onChange={e => setPrices(prev => prev.map(r => r.id === p.id ? { ...r, start_date: e.target.value } : r))}
                  />
                  <input
                    className="input"
                    type="date"
                    value={p.end_date ?? ''}
                    onChange={e => setPrices(prev => prev.map(r => r.id === p.id ? { ...r, end_date: e.target.value } : r))}
                  />
                  <input
                    className="input"
                    type="number"
                    value={p.weekly_price_eur || ''}
                    placeholder="3500"
                    onChange={e => setPrices(prev => prev.map(r => r.id === p.id ? { ...r, weekly_price_eur: parseInt(e.target.value) || 0 } : r))}
                  />
                  <button
                    className="btn btn-sm"
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }}
                    onClick={() => deletePrice(p.id)}
                  >
                    Sil
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn btn-ghost btn-sm" onClick={addPriceRow}>+ Dönem ekle</button>
                <button className="btn btn-primary btn-sm" onClick={savePrices} disabled={savingPrice}>
                  {savingPrice ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--line)', height: 'fit-content' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                Bilgi
              </h4>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Her sezon için başlangıç/bitiş tarihi ve haftalık fiyat girin. Çakışan dönemler varsa en düşük fiyat uygulanır.
              </p>
            </div>
          </div>
        )}
      </>
    )
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>Filo yönetimi</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{loading ? '…' : `${boats.length} tekne`}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ Yeni tekne ekle</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', padding: 32 }}>Yükleniyor…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {boats.map(b => {
            const sortedPhotos = [...(b.boat_photos ?? [])].sort((a, c) => a.position - c.position)
            const img = sortedPhotos[0]?.storage_path ?? ''
            const imgUrl = img ? getPublicUrl(img) : ''
            const prices = (b.boat_pricing ?? []).map(p => p.weekly_price_eur)
            const priceFrom = prices.length ? Math.min(...prices) : 0
            return (
              <div key={b.id} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                {imgUrl ? (
                  <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 160 }} />
                ) : (
                  <div style={{ background: 'var(--mist)', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 12 }}>
                    Fotoğraf yok
                  </div>
                )}
                <div style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{b.name}</h3>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{b.model} · {b.year}</div>
                    </div>
                    <span
                      onClick={() => toggleActive(b.id, b.active)}
                      style={{ padding: '3px 8px', background: b.active ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.1)', color: b.active ? '#059669' : '#991b1b', fontSize: 11, fontWeight: 600, borderRadius: 99, cursor: 'pointer', flexShrink: 0 }}
                    >
                      {b.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, display: 'flex', gap: 14 }}>
                    <span>{b.cabins} kabin · {b.max_guests} kişi</span>
                    {priceFrom > 0 && <span>€{priceFrom.toLocaleString('tr-TR')}/hf</span>}
                    {b.marina && <span>{b.marina}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(b, 'temel')}>Düzenle</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(b, 'fiyat')}>Fiyat tablosu</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(b, 'fotograflar')}>Fotoğraflar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => router.push('/admin/takvim')}>Takvim</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
