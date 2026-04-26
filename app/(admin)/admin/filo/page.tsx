'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BOATS, MockBoat } from '@/data/mock'

// ─── Form State Type ──────────────────────────────────────────────────────────

interface FormData {
  name: string
  model: string
  builder: string
  year: number
  type: string
  charterType: string
  cabins: string
  berths: string
  toilets: number
  maxPax: number
  marina: string
  length: string
  beam: string
  draft: string
  engines: string
  priceFrom: number
  priceHigh: number
  deposit: number
  img: string
  highlights: string
}

const EMPTY_FORM: FormData = {
  name: '',
  model: '',
  builder: '',
  year: new Date().getFullYear(),
  type: 'Katamaran',
  charterType: 'Bareboat / Skipperli',
  cabins: '',
  berths: '',
  toilets: 1,
  maxPax: 8,
  marina: '',
  length: '',
  beam: '',
  draft: '',
  engines: '',
  priceFrom: 0,
  priceHigh: 0,
  deposit: 0,
  img: '',
  highlights: '',
}

function boatToForm(b: MockBoat): FormData {
  return {
    name: b.name,
    model: b.model,
    builder: b.builder,
    year: b.year,
    type: b.type,
    charterType: b.charterType,
    cabins: b.cabins,
    berths: b.berths,
    toilets: b.toilets,
    maxPax: b.maxPax,
    marina: b.marina,
    length: b.length,
    beam: b.beam,
    draft: b.draft,
    engines: b.engines,
    priceFrom: b.priceFrom,
    priceHigh: b.priceHigh,
    deposit: b.deposit,
    img: b.img,
    highlights: b.highlights.join('\n'),
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminFiloPage() {
  const [boats, setBoats] = useState<MockBoat[]>(BOATS)
  const [selected, setSelected] = useState<MockBoat | null>(null)
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<FormData>(EMPTY_FORM)

  // ── Filtered list ──
  const filtered = boats.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()),
  )

  // ── Handlers ──
  function handleEdit(boat: MockBoat) {
    setSelected(boat)
    setForm(boatToForm(boat))
    setMode('edit')
  }

  function handleAdd() {
    setSelected(null)
    setForm(EMPTY_FORM)
    setMode('add')
  }

  function handleDelete(boat: MockBoat) {
    const ok = window.confirm(`"${boat.name}" teknesini silmek istediğinizden emin misiniz?`)
    if (ok) {
      setBoats((prev) => prev.filter((b) => b.id !== boat.id))
    }
  }

  function handleSave() {
    const highlightsArr = form.highlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    if (mode === 'add') {
      const newBoat: MockBoat = {
        id: Date.now().toString(),
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        name: form.name,
        model: form.model,
        builder: form.builder,
        year: form.year,
        type: form.type,
        charterType: form.charterType,
        cabins: form.cabins,
        berths: form.berths,
        toilets: form.toilets,
        maxPax: form.maxPax,
        marina: form.marina,
        length: form.length,
        lengthFt: '',
        beam: form.beam,
        draft: form.draft,
        engines: form.engines,
        fuelType: '',
        fuel: '',
        water: '',
        mainSail: '',
        deposit: form.deposit,
        priceFrom: form.priceFrom,
        priceHigh: form.priceHigh,
        badge: null,
        ribbon: '',
        img: form.img,
        gallery: [],
        prices: [],
        equipment: {},
        optional: [],
        services: [],
        highlights: highlightsArr,
      }
      setBoats((prev) => [...prev, newBoat])
    } else if (mode === 'edit' && selected) {
      setBoats((prev) =>
        prev.map((b) =>
          b.id === selected.id
            ? {
                ...b,
                name: form.name,
                model: form.model,
                builder: form.builder,
                year: form.year,
                type: form.type,
                charterType: form.charterType,
                cabins: form.cabins,
                berths: form.berths,
                toilets: form.toilets,
                maxPax: form.maxPax,
                marina: form.marina,
                length: form.length,
                beam: form.beam,
                draft: form.draft,
                engines: form.engines,
                priceFrom: form.priceFrom,
                priceHigh: form.priceHigh,
                deposit: form.deposit,
                img: form.img,
                highlights: highlightsArr,
                slug: form.name.toLowerCase().replace(/\s+/g, '-'),
              }
            : b,
        ),
      )
    }
    setMode('list')
    setSelected(null)
  }

  function set(field: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LIST MODE
  // ─────────────────────────────────────────────────────────────────────────────

  if (mode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink, #1e293b)', fontFamily: 'Georgia, serif' }}>
            Filo Yönetimi
          </h2>
          <button style={S.btnTeal} onClick={handleAdd}>
            + Yeni Tekne Ekle
          </button>
        </div>

        {/* Search */}
        <div style={S.card}>
          <div style={{ padding: '14px 16px' }}>
            <input
              style={{ ...S.input, maxWidth: 360 }}
              placeholder="Tekne adı veya modele göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={S.th}>Fotoğraf</th>
                  <th style={S.th}>Ad</th>
                  <th style={S.th}>Model</th>
                  <th style={S.th}>Tür</th>
                  <th style={S.th}>Kabin / Kişi</th>
                  <th style={S.th}>Fiyat (dan)</th>
                  <th style={S.th}>Marina</th>
                  <th style={S.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ ...S.td, textAlign: 'center', color: 'var(--sand, #94a3b8)', padding: 32 }}>
                      Sonuç bulunamadı.
                    </td>
                  </tr>
                )}
                {filtered.map((boat) => (
                  <tr key={boat.id} style={{ transition: 'background 0.1s' }}>
                    {/* Fotoğraf */}
                    <td style={S.td}>
                      <div style={{ position: 'relative', width: 60, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                        <Image
                          src={boat.img}
                          alt={boat.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="60px"
                        />
                      </div>
                    </td>
                    {/* Ad */}
                    <td style={{ ...S.td, fontWeight: 600 }}>{boat.name}</td>
                    {/* Model */}
                    <td style={S.td}>{boat.model}</td>
                    {/* Tür */}
                    <td style={S.td}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: 99,
                        background: 'var(--foam, #e0f2fe)',
                        color: 'var(--deep, #0b2540)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {boat.type}
                      </span>
                    </td>
                    {/* Kabin / Kişi */}
                    <td style={S.td}>{boat.cabins} kabin · {boat.maxPax} kişi</td>
                    {/* Fiyat */}
                    <td style={{ ...S.td, fontWeight: 600, color: 'var(--teal, #0d9488)' }}>
                      €{boat.priceFrom.toLocaleString()}
                    </td>
                    {/* Marina */}
                    <td style={S.td}>{boat.marina}</td>
                    {/* İşlemler */}
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={S.btnOutlineTeal} onClick={() => handleEdit(boat)}>
                          Düzenle
                        </button>
                        <button style={S.btnOutlineRed} onClick={() => handleDelete(boat)}>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line, #e5e7eb)', fontSize: 13, color: 'var(--sand, #94a3b8)' }}>
            {filtered.length} tekne gösteriliyor
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EDIT / ADD MODE
  // ─────────────────────────────────────────────────────────────────────────────

  const isEdit = mode === 'edit'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink, #1e293b)', fontFamily: 'Georgia, serif' }}>
          {isEdit ? 'Tekne Düzenle' : 'Yeni Tekne Ekle'}
        </h2>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--teal, #0d9488)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
          }}
          onClick={() => setMode('list')}
        >
          ← Listeye Dön
        </button>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Temel Bilgiler */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Temel Bilgiler</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Ad">
              <input style={S.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Tekne adı" />
            </Field>
            <Field label="Model">
              <input style={S.input} value={form.model} onChange={(e) => set('model', e.target.value)} placeholder="ör. Lagoon 42" />
            </Field>
            <Field label="Builder / Marka">
              <input style={S.input} value={form.builder} onChange={(e) => set('builder', e.target.value)} placeholder="ör. Lagoon" />
            </Field>
            <Field label="Yıl">
              <input style={S.input} type="number" value={form.year} onChange={(e) => set('year', Number(e.target.value))} />
            </Field>
            <Field label="Tür">
              <select style={S.select} value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="Katamaran">Katamaran</option>
                <option value="Yelkenli">Yelkenli</option>
                <option value="Motor">Motor</option>
              </select>
            </Field>
            <Field label="Charter Türü">
              <input style={S.input} value={form.charterType} onChange={(e) => set('charterType', e.target.value)} placeholder="ör. Bareboat / Skipperli" />
            </Field>
          </div>
        </div>

        {/* Kapasite */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Kapasite</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Kabin Sayısı">
              <input style={S.input} value={form.cabins} onChange={(e) => set('cabins', e.target.value)} placeholder="ör. 4+1" />
            </Field>
            <Field label="Yatak Sayısı">
              <input style={S.input} value={form.berths} onChange={(e) => set('berths', e.target.value)} placeholder="ör. 8+2" />
            </Field>
            <Field label="Tuvalet Sayısı">
              <input style={S.input} type="number" value={form.toilets} onChange={(e) => set('toilets', Number(e.target.value))} min={1} />
            </Field>
            <Field label="Maks. Kişi">
              <input style={S.input} type="number" value={form.maxPax} onChange={(e) => set('maxPax', Number(e.target.value))} min={1} />
            </Field>
            <Field label="Marina">
              <input style={S.input} value={form.marina} onChange={(e) => set('marina', e.target.value)} placeholder="ör. Göcek" />
            </Field>
          </div>
        </div>

        {/* Boyutlar */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Boyutlar</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Uzunluk (m)">
              <input style={S.input} value={form.length} onChange={(e) => set('length', e.target.value)} placeholder="ör. 12.78 m" />
            </Field>
            <Field label="Genişlik (Beam)">
              <input style={S.input} value={form.beam} onChange={(e) => set('beam', e.target.value)} placeholder="ör. 7.37 m" />
            </Field>
            <Field label="Su Kesimi (Draft)">
              <input style={S.input} value={form.draft} onChange={(e) => set('draft', e.target.value)} placeholder="ör. 1.20 m" />
            </Field>
            <Field label="Motor">
              <input style={S.input} value={form.engines} onChange={(e) => set('engines', e.target.value)} placeholder="ör. 2 × Yanmar 57 HP" />
            </Field>
          </div>
        </div>

        {/* Fiyatlandırma */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Fiyatlandırma</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
            <Field label="Düşük Sezon Fiyatı (€)">
              <input style={S.input} type="number" value={form.priceFrom} onChange={(e) => set('priceFrom', Number(e.target.value))} min={0} />
            </Field>
            <Field label="Yüksek Sezon Fiyatı (€)">
              <input style={S.input} type="number" value={form.priceHigh} onChange={(e) => set('priceHigh', Number(e.target.value))} min={0} />
            </Field>
            <Field label="Depozito (€)">
              <input style={S.input} type="number" value={form.deposit} onChange={(e) => set('deposit', Number(e.target.value))} min={0} />
            </Field>
          </div>
        </div>

        {/* Fotoğraf */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Fotoğraf</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', alignItems: 'start' }}>
            <Field label="Kapak Fotoğraf URL">
              <input style={S.input} value={form.img} onChange={(e) => set('img', e.target.value)} placeholder="https://images.unsplash.com/..." />
            </Field>
            {form.img && (
              <div>
                <label style={S.label}>Önizleme</label>
                <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line, #e5e7eb)' }}>
                  <Image src={form.img} alt="preview" fill style={{ objectFit: 'cover' }} sizes="120px" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Özellikler */}
        <div style={{ ...S.card, padding: 24 }}>
          <p style={S.sectionTitle}>Özellikler (Highlights)</p>
          <Field label="Her satıra bir özellik yazın">
            <textarea
              style={S.textarea}
              value={form.highlights}
              onChange={(e) => set('highlights', e.target.value)}
              placeholder={'Klimalı 4 kabin\nJeneratör + Watermaker\nNespresso dahil'}
            />
          </Field>
        </div>

        {/* Kaydet */}
        <button
          style={{ ...S.btnTeal, width: '100%', padding: '13px 20px', fontSize: 15, borderRadius: 10 }}
          onClick={handleSave}
        >
          {isEdit ? 'Değişiklikleri Kaydet' : 'Tekneyi Ekle'}
        </button>
      </div>
    </div>
  )
}
