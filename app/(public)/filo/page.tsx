'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BoatCard, BoatForCard } from '@/components/BoatCard';

const ALL_MARINAS = ['Göcek', 'D-Marin Göcek', 'Marmaris', 'Bodrum'];
const ALL_EXTRAS = ['Klima', 'Jeneratör', 'SUP', 'BBQ', 'Wi-Fi'];

type DbBoat = {
  id: string;
  slug: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  length_m: number;
  beam_m: number;
  cabins: number;
  bathrooms: number;
  max_guests: number;
  marina: string;
  deposit_eur: number;
  description_tr: string;
  features: string[] | null;
  active: boolean;
  display_order: number;
  boat_photos: { storage_path: string; position: number }[];
  boat_pricing: { weekly_price_eur: number }[];
};

const EXTRAS_MAP: Record<string, (b: DbBoat) => boolean> = {
  Klima: (b) => (b.features ?? []).some((f) => f.toLowerCase().includes('klima')),
  Jeneratör: (b) => (b.features ?? []).some((f) => f.toLowerCase().includes('jeneratör')),
  SUP: () => false,
  BBQ: () => false,
  'Wi-Fi': () => false,
};

function toCard(boat: DbBoat): BoatForCard {
  const sortedPhotos = (boat.boat_photos ?? []).slice().sort((a, b) => a.position - b.position);
  const prices = (boat.boat_pricing ?? []).map((p) => p.weekly_price_eur);
  return {
    id: boat.slug,
    name: boat.name,
    type: boat.type,
    ribbon: `${boat.model} · ${boat.year}`,
    cabins: boat.cabins,
    maxPax: boat.max_guests,
    marina: boat.marina,
    badge: null,
    img: sortedPhotos[0]?.storage_path ?? '',
    priceFrom: prices.length > 0 ? Math.min(...prices) : 0,
  };
}

function formatPrice(n: number) {
  return `€${n.toLocaleString('tr-TR')}`;
}

export default function FiloPage() {
  const [dbBoats, setDbBoats] = useState<DbBoat[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<'all' | string>('all');
  const [pax, setPax] = useState(0);
  const [priceMax, setPriceMax] = useState(15000);
  const [marinas, setMarinas] = useState<Set<string>>(new Set());
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'year'>('price-asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('boats')
      .select(`
        *,
        boat_photos(storage_path, position),
        boat_pricing(weekly_price_eur)
      `)
      .eq('active', true)
      .order('display_order')
      .then(({ data }) => {
        setDbBoats((data as DbBoat[]) ?? []);
        setLoading(false);
      });
  }, []);

  function toggleMarina(m: string) {
    setMarinas((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  }

  function toggleExtra(e: string) {
    setExtras((prev) => {
      const next = new Set(prev);
      next.has(e) ? next.delete(e) : next.add(e);
      return next;
    });
  }

  function resetFilters() {
    setType('all');
    setPax(0);
    setPriceMax(15000);
    setMarinas(new Set());
    setExtras(new Set());
    setSort('price-asc');
  }

  const filtered = useMemo(() => {
    let list = dbBoats.filter((b) => {
      const card = toCard(b);
      if (type !== 'all' && b.type !== type) return false;
      if (pax > 0 && card.maxPax < pax) return false;
      if (card.priceFrom > priceMax) return false;
      if (marinas.size > 0 && b.marina && !marinas.has(b.marina)) return false;
      if (extras.size > 0) {
        for (const ex of extras) {
          if (EXTRAS_MAP[ex] && !EXTRAS_MAP[ex](b)) return false;
        }
      }
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => toCard(a).priceFrom - toCard(b).priceFrom);
    if (sort === 'price-desc') list = [...list].sort((a, b) => toCard(b).priceFrom - toCard(a).priceFrom);
    if (sort === 'year') list = [...list].sort((a, b) => b.year - a.year);
    return list.map(toCard);
  }, [dbBoats, type, pax, sort, priceMax, marinas, extras]);

  const sidebar = (
    <aside className="nb-filter">
      {/* Tekne Tipi */}
      <div className="nb-filter-section">
        <h4>Tekne Tipi</h4>
        <div>
          {['all', 'Katamaran'].map((t) => (
            <button
              key={t}
              className="nb-filter-chip"
              data-active={type === t}
              onClick={() => setType(t)}
            >
              {t === 'all' ? 'Tümü' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Kişi Sayısı */}
      <div className="nb-filter-section">
        <h4>Kişi Sayısı</h4>
        <div>
          {[
            { label: 'Tümü', val: 0 },
            { label: '4+', val: 4 },
            { label: '6+', val: 6 },
            { label: '8+', val: 8 },
          ].map(({ label, val }) => (
            <button
              key={val}
              className="nb-filter-chip"
              data-active={pax === val}
              onClick={() => setPax(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Haftalık Fiyat */}
      <div className="nb-filter-section">
        <h4>Haftalık Fiyat</h4>
        <input
          type="range"
          min={1000}
          max={15000}
          step={500}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--teal)' }}
        />
        <div className="nb-filter-range">
          <span>€1.000</span>
          <span>{formatPrice(priceMax)}</span>
        </div>
      </div>

      {/* Marina */}
      <div className="nb-filter-section">
        <h4>Marina</h4>
        {ALL_MARINAS.map((m) => (
          <label
            key={m}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              marginBottom: 8,
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
          >
            <input
              type="checkbox"
              checked={marinas.has(m)}
              onChange={() => toggleMarina(m)}
              style={{ accentColor: 'var(--teal)', width: 15, height: 15 }}
            />
            {m}
          </label>
        ))}
      </div>

      {/* Ekstra Özellikler */}
      <div className="nb-filter-section">
        <h4>Ekstra Özellikler</h4>
        {ALL_EXTRAS.map((ex) => (
          <label
            key={ex}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              marginBottom: 8,
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
          >
            <input
              type="checkbox"
              checked={extras.has(ex)}
              onChange={() => toggleExtra(ex)}
              style={{ accentColor: 'var(--teal)', width: 15, height: 15 }}
            />
            {ex}
          </label>
        ))}
      </div>

      {/* Reset */}
      <button className="btn btn-ghost" style={{ width: '100%' }} onClick={resetFilters}>
        Filtreleri Sıfırla
      </button>
    </aside>
  );

  return (
    <>
      {/* Page Head */}
      <div className="nb-page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <span>Filo</span>
          </div>
          <h1>Filomuz</h1>
          <p style={{ opacity: 0.8, fontSize: 17, maxWidth: 480 }}>
            4 katamaran · Göcek &amp; D-Marin. Her biri aile özeniyle hazırlanıyor.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ padding: '60px 0 120px' }}>
        <div className="container">

          {/* Mobile filter toggle */}
          <div className="nb-filter-mobile-toggle">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setMobileFilterOpen((v) => !v)}
              style={{ marginBottom: 20 }}
            >
              {mobileFilterOpen ? 'Filtreleri Gizle ▲' : 'Filtreleri Göster ▼'}
            </button>
          </div>

          <div className="nb-fleet-layout">
            {/* Sidebar — hidden on mobile unless toggled */}
            <div className={`nb-filter-wrapper${mobileFilterOpen ? ' nb-filter-open' : ''}`}>
              {sidebar}
            </div>

            {/* Right column */}
            <main>
              {/* Sort bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 28,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
                  <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>{loading ? '…' : filtered.length}</strong>{' '}
                  tekne bulundu
                </p>
                <select
                  className="input"
                  style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                >
                  <option value="price-asc">Fiyat: düşükten yükseğe</option>
                  <option value="price-desc">Fiyat: yüksekten düşüğe</option>
                  <option value="year">Yeni → eski</option>
                </select>
              </div>

              {/* Loading */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>⛵</div>
                  <p style={{ fontSize: 15 }}>Tekneler yükleniyor…</p>
                </div>
              ) : filtered.length > 0 ? (
                <div className="nb-fleet-grid">
                  {filtered.map((boat) => (
                    <BoatCard key={boat.id} boat={boat} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    color: 'var(--muted)',
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>⛵</div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: 8,
                    }}
                  >
                    Filtreye uyan tekne yok
                  </h3>
                  <p style={{ fontSize: 14, marginBottom: 24 }}>
                    Filtre kriterlerinizi genişletmeyi deneyin.
                  </p>
                  <button className="btn btn-ghost" onClick={resetFilters}>
                    Filtreleri Sıfırla
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
