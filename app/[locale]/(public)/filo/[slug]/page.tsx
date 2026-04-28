'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { BoatCard, BoatForCard } from '@/components/BoatCard';

const BOAT_SUPPLEMENT: Record<string, {
  charterType: string;
  berths: string;
  lengthFt: string;
  draft: string;
  engines: string;
  fuelType: string;
  fuel: string;
  water: string;
  mainSail: string;
  genoa?: string;
  steering?: string;
  generator?: string;
  aircon?: string;
  watermaker: boolean;
  badge: string | null;
  ribbon: string;
  equipment: Record<string, string[]>;
  optional: { name: string; price: string; note?: string }[];
  services: { name: string; price: string; required?: boolean; note?: string }[];
}> = {
  'ivan-nonno': {
    charterType: 'Bareboat / Skipperli',
    berths: '8+2',
    lengthFt: '41.9 ft',
    draft: '1.20 m',
    engines: '2 × Yanmar 57 HP',
    fuelType: 'Dizel',
    fuel: '400 L',
    water: '600 L',
    mainSail: 'Lazy jack + lazy bag',
    genoa: 'Rulo',
    steering: 'Çift dümen',
    generator: 'Dempar 11 KW',
    aircon: '48 BTU (4 kabin + salon)',
    watermaker: true,
    badge: 'Yeni Sezon',
    ribbon: 'Lagoon 42 · 2021',
    equipment: {
      navigation: ['Autopilot','Binoculars','Compass','GPS chart plotter','Echosounder','Nautical charts','Speedometer','Anemometer','VHF V60 telsiz'],
      safety: ['Can simidi','Can yeleği (yetişkin + çocuk)','Can salı','İlk yardım çantası','Yangın battaniyesi','Yangın söndürücü','Acak dümeni','Acil işaret fişekleri'],
      electrics: ['Klima 48 BTU (4 kabin + salon)','Jeneratör (Dempar 11 KW)','Inverter 12/220V – 2000 VA','USB soket'],
      galley: ['Gazlı ocak (3 gözlü)','Fırın','Buzdolabı (12V)','Microdalga','Nespresso','Çaydanlık'],
      deck: ['Elektrikli vinçler','Lazy bag','Bimini','Güverte duşu (sıcak)','Passerelle','BBQ ızgara'],
    },
    optional: [
      { name: 'Skipper', price: '€200 / gün', note: 'Deneyimli kaptan' },
      { name: 'Hostes', price: '€150 / gün' },
      { name: 'Şef / Aşçı', price: '€180 / gün' },
      { name: 'Transfer (havalimanı–marina)', price: '€60 / gidiş' },
    ],
    services: [
      { name: 'Check-in / check-out temizliği', price: '€200', required: true },
      { name: 'Yakıt', price: 'Kullanım kadar', note: 'Ayrılışta fark ödenir' },
      { name: 'Liman & demir ücretleri', price: 'Kullanım kadar' },
      { name: 'Ekstra tur ücreti', price: 'Yok' },
    ],
  },
  'ayza-1': {
    charterType: 'Bareboat / Skipperli',
    berths: '8+2',
    lengthFt: '41.9 ft',
    draft: '1.20 m',
    engines: '2 × Yanmar 57 HP',
    fuelType: 'Dizel',
    fuel: '400 L',
    water: '600 L',
    mainSail: 'Lazy jack + lazy bag',
    genoa: 'Rulo',
    steering: 'Çift dümen',
    generator: 'Dempar 11 KW',
    aircon: '48 BTU (4 kabin + salon)',
    watermaker: true,
    badge: null,
    ribbon: 'Lagoon 42 · 2022',
    equipment: {
      navigation: ['Autopilot','Binoculars','Compass','GPS chart plotter','Echosounder','Nautical charts','Speedometer','Anemometer','VHF V60 telsiz'],
      safety: ['Can simidi','Can yeleği (yetişkin + çocuk)','Can salı','İlk yardım çantası','Yangın battaniyesi','Yangın söndürücü','Acak dümeni','Acil işaret fişekleri'],
      electrics: ['Klima 48 BTU (4 kabin + salon)','Jeneratör (Dempar 11 KW)','Inverter 12/220V – 2000 VA','USB soket'],
      galley: ['Gazlı ocak (3 gözlü)','Fırın','Buzdolabı (12V)','Microdalga','Nespresso','Çaydanlık'],
      deck: ['Elektrikli vinçler','Lazy bag','Bimini','Güverte duşu (sıcak)','Passerelle','BBQ ızgara'],
    },
    optional: [
      { name: 'Skipper', price: '€200 / gün', note: 'Deneyimli kaptan' },
      { name: 'Hostes', price: '€150 / gün' },
      { name: 'Şef / Aşçı', price: '€180 / gün' },
      { name: 'Transfer (havalimanı–marina)', price: '€60 / gidiş' },
    ],
    services: [
      { name: 'Check-in / check-out temizliği', price: '€200', required: true },
      { name: 'Yakıt', price: 'Kullanım kadar', note: 'Ayrılışta fark ödenir' },
      { name: 'Liman & demir ücretleri', price: 'Kullanım kadar' },
      { name: 'Ekstra tur ücreti', price: 'Yok' },
    ],
  },
  'rena': {
    charterType: 'Bareboat / Skipperli',
    berths: '8',
    lengthFt: '36.1 ft',
    draft: '1.10 m',
    engines: '2 × Volvo 29 HP',
    fuelType: 'Dizel',
    fuel: '200 L',
    water: '400 L',
    mainSail: 'Lazy bag',
    genoa: 'Rulo',
    steering: 'Merkezi dümen',
    aircon: 'Yok',
    watermaker: false,
    badge: 'Fırsat',
    ribbon: 'Excess 11 · 2021',
    equipment: {
      navigation: ['Autopilot','Binoculars','Compass','GPS chart plotter','Echosounder','Nautical charts','VHF telsiz','AIS transceiver'],
      safety: ['Can simidi','Can yeleği (yetişkin + çocuk)','Can salı','İlk yardım çantası','Yangın söndürücü','Acil işaret fişekleri'],
      electrics: ['Solar panel sistemi','Inverter 12/220V','USB soket','Bose Sound System'],
      galley: ['Gazlı ocak (2 gözlü)','Buzdolabı (12V)','Nespresso','Çaydanlık','Karaoke sistemi'],
      deck: ['Lazy bag','Bimini','Güverte duşu (sıcak)'],
    },
    optional: [
      { name: 'Skipper', price: '€180 / gün' },
      { name: 'Hostes', price: '€140 / gün' },
      { name: 'Transfer (havalimanı–marina)', price: '€55 / gidiş' },
    ],
    services: [
      { name: 'Check-in / check-out temizliği', price: '€180', required: true },
      { name: 'Yakıt', price: 'Kullanım kadar' },
      { name: 'Liman & demir ücretleri', price: 'Kullanım kadar' },
    ],
  },
  'carmelina': {
    charterType: 'Bareboat / Skipperli',
    berths: '8',
    lengthFt: '36.1 ft',
    draft: '1.10 m',
    engines: '2 × Volvo 29 HP',
    fuelType: 'Dizel',
    fuel: '200 L',
    water: '400 L',
    mainSail: 'Lazy bag',
    genoa: 'Rulo',
    steering: 'Merkezi dümen',
    aircon: 'Yok',
    watermaker: false,
    badge: null,
    ribbon: 'Excess 11 · 2020',
    equipment: {
      navigation: ['Autopilot','Binoculars','Compass','GPS chart plotter','Echosounder','Nautical charts','VHF telsiz','AIS transceiver'],
      safety: ['Can simidi','Can yeleği (yetişkin + çocuk)','Can salı','İlk yardım çantası','Yangın söndürücü','Acil işaret fişekleri'],
      electrics: ['Solar panel sistemi','Inverter 12/220V','USB soket','Bose Sound System'],
      galley: ['Gazlı ocak (2 gözlü)','Buzdolabı (12V)','Nespresso','Çaydanlık','Karaoke sistemi'],
      deck: ['Lazy bag','Bimini','Güverte duşu (sıcak)'],
    },
    optional: [
      { name: 'Skipper', price: '€160 / gün' },
      { name: 'Hostes', price: '€130 / gün' },
      { name: 'Transfer (havalimanı–marina)', price: '€50 / gidiş' },
    ],
    services: [
      { name: 'Check-in / check-out temizliği', price: '€160', required: true },
      { name: 'Yakıt', price: 'Kullanım kadar' },
      { name: 'Liman & demir ücretleri', price: 'Kullanım kadar' },
    ],
  },
};

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
};

type DbPhoto = {
  id: string;
  boat_id: string;
  storage_path: string;
  variants: unknown;
  position: number;
  alt_text: string | null;
};

type DbPricing = {
  id: string;
  boat_id: string;
  start_date: string;
  end_date: string;
  weekly_price_eur: number;
};

type DbRoute = {
  id: string;
  title: string;
  days: number;
  difficulty: string;
  img_url: string;
  description: string;
};

type DbAvailability = {
  start_date: string;
  end_date: string;
  status: string;
};

type DbBookingSlot = {
  start_date: string;
  end_date: string;
  status: string;
};

type DbBoatWithPhotos = DbBoat & {
  boat_photos: { storage_path: string; position: number }[];
  boat_pricing: { weekly_price_eur: number }[];
};

function toCard(boat: DbBoatWithPhotos): BoatForCard {
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
    img: (() => { const p = sortedPhotos[0]?.storage_path ?? ''; return p.startsWith('http') ? p : p ? `https://eieshihgnevszcsaziyn.supabase.co/storage/v1/object/public/boat-photos/${p}` : ''; })(),
    priceFrom: prices.length > 0 ? Math.min(...prices) : 0,
  };
}

// Format ISO date YYYY-MM-DD → DD/MM/YYYY
function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BoatDetailPage() {
  const params = useParams<{ slug: string }>();
  const t = useTranslations('boat');

  const [boat, setBoat] = useState<DbBoat | null>(null);
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [pricing, setPricing] = useState<DbPricing[]>([]);
  const [availability, setAvailability] = useState<DbAvailability[]>([]);
  const [bookedSlots, setBookedSlots] = useState<DbBookingSlot[]>([]);
  const [otherBoats, setOtherBoats] = useState<DbBoatWithPhotos[]>([]);
  const [suggestedRoutes, setSuggestedRoutes] = useState<DbRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [extras, setExtras] = useState({ skipper: false, hostess: false, sup: false, wifi: false });
  const [charterType, setCharterType] = useState('bareboat');
  const [pax, setPax] = useState('8');

  // Month names for pricing calendar display
  const monthNames: Record<string, string> = {
    '04': t('month_april'),
    '05': t('month_may'),
    '06': t('month_june'),
    '07': t('month_july'),
    '08': t('month_august'),
    '09': t('month_september'),
    '10': t('month_october'),
    '11': t('month_november'),
    '12': t('month_december'),
  };

  // Equipment labels for display
  const equipmentLabels: Record<string, string> = {
    navigation: t('equip_navigation'),
    safety: t('equip_safety'),
    electrics: t('equip_electrics'),
    deck: t('equip_deck'),
    galley: t('equip_galley'),
    interior: t('equip_interior'),
    entertainment: t('equip_entertainment'),
  };

  useEffect(() => {
    const supabase = createClient();
    async function fetchData() {
      const { data: boatData } = await supabase
        .from('boats')
        .select('*')
        .eq('slug', params.slug)
        .eq('active', true)
        .single();

      if (!boatData) {
        setNotFoundFlag(true);
        setLoading(false);
        return;
      }

      setBoat(boatData);

      const { data: photosData } = await supabase
        .from('boat_photos')
        .select('*')
        .eq('boat_id', boatData.id)
        .order('position');

      const { data: pricingData } = await supabase
        .from('boat_pricing')
        .select('*')
        .eq('boat_id', boatData.id)
        .order('start_date');

      const { data: availData } = await supabase
        .from('boat_availability')
        .select('start_date,end_date,status')
        .eq('boat_id', boatData.id);

      const { data: bkgData } = await supabase
        .from('bookings')
        .select('start_date,end_date,status')
        .eq('boat_id', boatData.id)
        .neq('status', 'cancelled');

      const { data: othersData } = await supabase
        .from('boats')
        .select(`*, boat_photos(storage_path, position), boat_pricing(weekly_price_eur)`)
        .eq('active', true)
        .neq('slug', params.slug)
        .order('display_order')
        .limit(3);

      const { data: routesData } = await supabase
        .from('routes')
        .select('*')
        .eq('active', true)
        .order('display_order')
        .limit(2);

      const avail = (availData ?? []) as DbAvailability[];
      const bkgs = (bkgData ?? []) as DbBookingSlot[];

      setPhotos((photosData as DbPhoto[]) ?? []);
      setPricing((pricingData as DbPricing[]) ?? []);
      setAvailability(avail);
      setBookedSlots(bkgs);
      setOtherBoats((othersData as DbBoatWithPhotos[]) ?? []);
      setSuggestedRoutes((routesData as DbRoute[]) ?? []);

      const priceList = (pricingData ?? []) as DbPricing[];
      const firstAvail = priceList.findIndex(p => {
        const s = p.start_date; const e = p.end_date;
        const overlapsAvail = avail.some(a => s <= a.end_date && e >= a.start_date);
        const overlapsBooking = bkgs.some(b => s <= b.end_date && e >= b.start_date);
        return !overlapsAvail && !overlapsBooking;
      });
      setSelectedWeek(firstAvail >= 0 ? firstAvail : 0);

      setLoading(false);
    }

    fetchData();
  }, [params.slug]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !boat) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⛵</div>
        <p style={{ fontSize: 16 }}>{t('loading')}</p>
      </div>
    );
  }

  function weekStatus(p: DbPricing): 'available' | 'option' | 'unavailable' {
    const s = p.start_date; const e = p.end_date;
    if (bookedSlots.some(b => s <= b.end_date && e >= b.start_date)) return 'unavailable';
    const block = availability.find(a => s <= a.end_date && e >= a.start_date);
    if (!block) return 'available';
    if (block.status === 'option') return 'option';
    return 'unavailable';
  }

  const supplement = BOAT_SUPPLEMENT[boat.slug] ?? null;
  const curPrice = pricing[selectedWeek] ?? pricing[0];
  const extrasCost =
    (extras.skipper ? 1400 : 0) +
    (extras.hostess ? 1250 : 0) +
    (extras.sup ? 120 : 0) +
    (extras.wifi ? 75 : 0);
  const servicePack = 600;
  const total = (curPrice?.weekly_price_eur ?? 0) + servicePack + extrasCost;

  const todayIso = new Date().toISOString().slice(0, 10);

  const monthMap: Record<string, Array<DbPricing & { i: number }>> = {};
  pricing.forEach((p, i) => {
    if (p.end_date < todayIso) return;
    const [year, month] = p.start_date.split('-');
    const key = `${year}-${month}`;
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push({ ...p, i });
  });

  const SUPABASE_URL = 'https://eieshihgnevszcsaziyn.supabase.co';
  function toPublicUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/boat-photos/${path}`;
  }

  const galleryPaths = photos.map((p) => toPublicUrl(p.storage_path));
  const heroImg = galleryPaths[activeImg] ?? galleryPaths[0] ?? '';

  return (
    <>
      {/* Hero */}
      <div className="nb-boat-hero">
        {heroImg && <Image
          src={heroImg}
          alt={boat.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />}
        <div className="nb-boat-hero-info">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,.7)' }}>
            <Link href="/" style={{ color: 'inherit' }}>{t('home')}</Link>
            <span>/</span>
            <Link href="/filo" style={{ color: 'inherit' }}>{t('fleet')}</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{boat.name}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
            {boat.name}
          </h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14, color: 'rgba(255,255,255,.85)' }}>
            <span>⛵ {boat.model}</span>
            <span>📅 {boat.year}</span>
            <span>🛏 {boat.cabins} {t('cabins')}</span>
            <span>📍 {boat.marina}</span>
          </div>
        </div>
      </div>

      {/* Gallery Thumbnails */}
      <div className="container">
        <div className="nb-boat-thumbs">
          {galleryPaths.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{
                width: 80,
                height: 60,
                borderRadius: 8,
                overflow: 'hidden',
                border: i === activeImg ? '2px solid var(--teal)' : '2px solid transparent',
                flexShrink: 0,
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
              }}
            >
              <Image src={g} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Detail Grid */}
      <div className="container">
        <div className="nb-boat-detail-grid">

          {/* LEFT COLUMN */}
          <div>
            {/* About Boat */}
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{t('about_boat')}</div>
              <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
                {boat.name} — {boat.model}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted,#6b7f9e)', maxWidth: 640 }}>
                {boat.description_tr || `${boat.type} katamaran filosumuzun prestijli üyesi ${boat.name}, ${boat.year} yılına ait ${boat.model} modeli ile konfor ve performansı bir arada sunuyor. ${boat.cabins} kabin, ${boat.max_guests} kişi kapasitesi ve ${boat.marina} marinasındaki konumuyla unutulmaz bir Ege tatilinin adresi.`}
              </p>
            </div>

            {/* Technical Details */}
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t('tech_details')}</h3>
              <div className="nb-spec-grid">
                <div>
                  {([
                    [t('spec_brand'), boat.brand],
                    [t('spec_model'), boat.model],
                    [t('spec_year'), String(boat.year)],
                    [t('charter_type'), supplement?.charterType ?? '—'],
                    [t('spec_length'), `${boat.length_m} m${supplement?.lengthFt ? ` (${supplement.lengthFt})` : ''}`],
                    [t('spec_beam'), `${boat.beam_m} m`],
                    [t('spec_draft'), supplement?.draft ?? '—'],
                    [t('cabins'), String(boat.cabins)],
                  ] as [string, string][]).map(([key, val]) => (
                    <div key={key} className="nb-spec-row">
                      <span>{key}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {([
                    [t('spec_berths'), supplement?.berths ?? '—'],
                    [t('spec_bathrooms'), String(boat.bathrooms)],
                    [t('spec_max_guests'), String(boat.max_guests)],
                    [t('spec_engines'), supplement?.engines ?? '—'],
                    [t('spec_fuel'), supplement?.fuel ?? '—'],
                    [t('spec_water'), supplement?.water ?? '—'],
                    [t('spec_mainsail'), supplement?.mainSail ?? '—'],
                    [t('deposit_amount'), `€${boat.deposit_eur.toLocaleString()}`],
                  ] as [string, string][]).map(([key, val]) => (
                    <div key={key} className="nb-spec-row">
                      <span>{key}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights */}
            {(boat.features ?? []).length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('highlights')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {(boat.features ?? []).map((h) => (
                    <span
                      key={h}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        border: '1.5px solid var(--teal)',
                        color: 'var(--teal)',
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Equipment */}
            {supplement?.equipment && Object.keys(supplement.equipment).length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t('standard_equipment')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {Object.entries(supplement.equipment).map(([group, items]) => (
                    <div
                      key={group}
                      style={{
                        background: 'var(--foam,#eef6fa)',
                        borderRadius: 'var(--radius,14px)',
                        padding: '18px 20px',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 12 }}>
                        {equipmentLabels[group] ?? group}
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {items.map((item) => (
                          <li key={item} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Calendar */}
            {pricing.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{t('pricing_calendar_year')}</h3>
                {Object.entries(monthMap).map(([key, slots]) => {
                  const [year, month] = key.split('-');
                  const monthLabel = monthNames[month] ?? month;
                  return (
                    <div key={key} style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted,#6b7f9e)', marginBottom: 10 }}>
                        {monthLabel} {year}&nbsp;<span style={{ fontWeight: 400 }}>| {slots.length} {t('week')}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {slots.map((slot) => {
                          const ws = weekStatus(slot);
                          const isUnavail = ws !== 'available';
                          const isSelected = slot.i === selectedWeek && !isUnavail;
                          return (
                            <button
                              key={slot.i}
                              onClick={() => { if (!isUnavail) setSelectedWeek(slot.i); }}
                              disabled={isUnavail}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: isSelected ? '2px solid var(--teal)' : '1.5px solid var(--line-2,rgba(11,42,80,.07))',
                                background: isUnavail ? 'rgba(107,114,128,.06)' : isSelected ? 'var(--foam,#eef6fa)' : 'var(--card,#fff)',
                                cursor: isUnavail ? 'not-allowed' : 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                transition: 'all .15s',
                                opacity: isUnavail ? 0.65 : 1,
                              }}
                            >
                              <span style={{ fontSize: 13, textDecoration: isUnavail ? 'line-through' : 'none', color: isUnavail ? 'var(--muted)' : 'inherit' }}>
                                {isoToDisplay(slot.start_date)} – {isoToDisplay(slot.end_date)}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                {isUnavail ? (
                                  <span style={{ fontSize: 12, fontWeight: 700, color: ws === 'option' ? '#d97706' : '#6b7280', background: ws === 'option' ? 'rgba(245,158,11,.12)' : 'rgba(107,114,128,.1)', padding: '2px 8px', borderRadius: 6 }}>
                                    {ws === 'option' ? t('optioned') : t('full')}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--deep,#13315c)' }}>
                                    €{slot.weekly_price_eur.toLocaleString()}
                                  </span>
                                )}
                                {!isUnavail && (
                                  <span style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: '50%',
                                    border: isSelected ? '5px solid var(--teal)' : '2px solid var(--line-2,rgba(11,42,80,.12))',
                                    flexShrink: 0,
                                    display: 'inline-block',
                                  }} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Service Pack */}
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('service_pack')}</h3>
              <div style={{ background: 'var(--foam,#eef6fa)', borderRadius: 'var(--radius,14px)', padding: '20px 24px', border: '1.5px solid var(--line-2,rgba(11,42,80,.07))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{t('mandatory_service')}</span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--deep,#13315c)' }}>€600 {t('per_week')}</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                  {[
                    'Check-in hazırlık temizliği',
                    'Check-out son temizlik',
                    'Güverte & kokpit yıkama',
                    'Çarşaf & havlu seti',
                    'Mutfak seti (bardak, tabak)',
                    'Standart muhafaza bakımı',
                    'VHF lisans & evrak düzenlemesi',
                    'Güvence sigortası',
                  ].map((item) => (
                    <li key={item} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Optional Extras */}
            {supplement?.optional && supplement.optional.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('optional_extras')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {supplement.optional.map((opt) => (
                    <div key={opt.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--line-2,rgba(11,42,80,.07))', background: 'var(--card,#fff)' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.name}</div>
                        {opt.note && <div style={{ fontSize: 12, color: 'var(--muted,#6b7f9e)' }}>{opt.note}</div>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>{opt.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {supplement?.services && supplement.services.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('services')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {supplement.services.map((svc) => (
                    <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--line-2,rgba(11,42,80,.07))', background: 'var(--card,#fff)' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {svc.name}
                          {svc.required && (
                            <span style={{ background: 'var(--teal)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                              {t('mandatory')}
                            </span>
                          )}
                        </div>
                        {svc.note && <div style={{ fontSize: 12, color: 'var(--muted,#6b7f9e)' }}>{svc.note}</div>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{svc.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Routes */}
            {suggestedRoutes.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('suggested_routes')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {suggestedRoutes.map((route) => (
                    <div key={route.id} style={{ borderRadius: 'var(--radius,14px)', overflow: 'hidden', border: '1.5px solid var(--line-2,rgba(11,42,80,.07))', background: 'var(--card,#fff)' }}>
                      <div style={{ position: 'relative', height: 120 }}>
                        <Image src={route.img_url} alt={route.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 50vw, 25vw" />
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{route.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted,#6b7f9e)' }}>{route.days} {t('day')} · {route.difficulty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Card */}
          <div>
            <div className="nb-booking-card">
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted,#6b7f9e)', marginBottom: 6 }}>
                {curPrice ? `${isoToDisplay(curPrice.start_date)} – ${isoToDisplay(curPrice.end_date)}` : '—'}
              </div>

              <div className="nb-price-display" style={{ marginBottom: 20 }}>
                <span className="price">€{(curPrice?.weekly_price_eur ?? 0).toLocaleString()}</span>
                <span className="price-unit">{t('per_week')}</span>
              </div>

              {/* Selects */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div>
                  <label className="label">{t('week')}</label>
                  <select
                    className="input"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  >
                    {pricing.map((p, i) => {
                      if (p.end_date < todayIso) return null;
                      const ws = weekStatus(p);
                      const isUnavail = ws !== 'available';
                      const label = isUnavail
                        ? `${isoToDisplay(p.start_date)} – ${isoToDisplay(p.end_date)} · ${ws === 'option' ? t('optioned') : t('full')}`
                        : `${isoToDisplay(p.start_date)} – ${isoToDisplay(p.end_date)} · €${p.weekly_price_eur.toLocaleString()}`;
                      return <option key={i} value={i} disabled={isUnavail}>{label}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="label">{t('guest_count')}</label>
                  <select className="input" value={pax} onChange={(e) => setPax(e.target.value)}>
                    {[2, 4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>{n} {t('guests')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">{t('charter_type')}</label>
                  <select className="input" value={charterType} onChange={(e) => setCharterType(e.target.value)}>
                    <option value="bareboat">Bareboat</option>
                    <option value="skippered">Skippered +€1.400</option>
                    <option value="crewed">Crewed</option>
                  </select>
                </div>
              </div>

              {/* Extras */}
              <div style={{ marginBottom: 20 }}>
                <div className="label" style={{ marginBottom: 10 }}>{t('extras')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {([
                    { key: 'skipper', label: t('captain'), price: 1400 },
                    { key: 'hostess', label: t('hostess'), price: 1250 },
                    { key: 'sup', label: 'SUP', price: 120 },
                    { key: 'wifi', label: 'Wi-Fi', price: 75 },
                  ] as const).map(({ key, label, price }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={extras[key]}
                        onChange={(e) => setExtras((prev) => ({ ...prev, [key]: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: 'var(--teal)', cursor: 'pointer' }}
                      />
                      <span style={{ flex: 1 }}>{label}</span>
                      <span style={{ color: 'var(--teal)', fontWeight: 600 }}>+€{price.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div style={{ borderTop: '1px solid var(--line-2,rgba(11,42,80,.07))', paddingTop: 16, marginBottom: 20 }}>
                {([
                  [t('weekly_boat'), `€${(curPrice?.weekly_price_eur ?? 0).toLocaleString()}`],
                  [t('service_pack'), `€${servicePack.toLocaleString()}`],
                  ...(extrasCost > 0 ? [[t('extras'), `€${extrasCost.toLocaleString()}`]] : []),
                ] as [string, string][]).map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted,#6b7f9e)', marginBottom: 8 }}>
                    <span>{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: 'var(--deep,#13315c)', paddingTop: 10, borderTop: '1px solid var(--line-2,rgba(11,42,80,.07))' }}>
                  <span>{t('total')}</span>
                  <span>€{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Guarantee Notes */}
              <div className="nb-booking-features" style={{ marginBottom: 20 }}>
                {[
                  t('free_cancel'),
                  t('payment_split'),
                  `${t('deposit_amount')}: €${boat.deposit_eur.toLocaleString()}`,
                ].map((note) => (
                  <div key={note}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {note}
                  </div>
                ))}
              </div>

              {/* CTA */}
              {curPrice && weekStatus(curPrice) !== 'available' && (
                <div style={{ background: 'rgba(107,114,128,.08)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#6b7280', textAlign: 'center', fontWeight: 600 }}>
                  {weekStatus(curPrice) === 'option' ? t('option_whatsapp') : t('full_select_other')}
                </div>
              )}
              <Link
                href={curPrice && weekStatus(curPrice) === 'available' ? `/rezervasyon?boat=${boat.slug}&start=${curPrice.start_date}&end=${curPrice.end_date}` : '#'}
                className="btn btn-primary btn-lg"
                onClick={e => { if (!curPrice || weekStatus(curPrice) !== 'available') e.preventDefault(); }}
                style={{ width: '100%', justifyContent: 'center', marginBottom: 12, opacity: curPrice && weekStatus(curPrice) !== 'available' ? 0.4 : 1, pointerEvents: curPrice && weekStatus(curPrice) !== 'available' ? 'none' : 'auto' }}>
                {t('proceed_booking')}
              </Link>
              <a
                href={`https://wa.me/905321234567?text=Merhaba, ${encodeURIComponent(boat.name)} için bilgi almak istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#25d366', textDecoration: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" /></svg>
                {t('whatsapp_contact')}
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Other Boats */}
      {otherBoats.length > 0 && (
        <section className="nb-section-tight nb-section-sand">
          <div className="container">
            <div style={{ marginBottom: 40 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{t('fleet')}</div>
              <h2 style={{ fontFamily: 'var(--f-serif,"Playfair Display",serif)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {t('other_boats')}
              </h2>
              <p style={{ color: 'var(--muted,#6b7f9e)', marginTop: 8 }}>{t('other_boats_sub')}</p>
            </div>
            <div className="nb-fleet-grid">
              {otherBoats.map((b) => (
                <BoatCard key={b.slug} boat={toCard(b)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
