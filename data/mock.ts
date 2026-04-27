// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface PriceSlot {
  from: string;
  to: string;
  price: number;
  deal?: boolean;
}

export interface MockBoat {
  id: string;
  slug: string;
  name: string;
  type: string;
  model: string;
  builder: string;
  year: number;
  charterType: string;
  cabins: string;
  berths: string;
  toilets: number;
  maxPax: number;
  length: string;
  lengthFt: string;
  beam: string;
  draft: string;
  engines: string;
  fuelType: string;
  fuel: string;
  water: string;
  mainSail: string;
  genoa?: string;
  steering?: string;
  deposit: number;
  generator?: string;
  aircon?: string;
  watermaker?: boolean;
  marina: string;
  priceFrom: number;
  priceHigh: number;
  badge: string | null;
  ribbon: string;
  img: string;
  gallery: string[];
  prices: PriceSlot[];
  equipment: Record<string, string[]>;
  optional: { name: string; price: string; note?: string }[];
  services: { name: string; price: string; required?: boolean; note?: string }[];
  highlights: string[];
}

// ─── Image URLs ───────────────────────────────────────────────────────────────

const IMG = {
  hero1: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=2400&q=80&auto=format&fit=crop",
  hero2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=80&auto=format&fit=crop",
  hero3: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=2400&q=80&auto=format&fit=crop",
  hero4: "https://images.unsplash.com/photo-1533106958148-daaeab8b83fe?w=2400&q=80&auto=format&fit=crop",
  hero5: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=2400&q=80&auto=format&fit=crop",
  cat1: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1600&q=80&auto=format&fit=crop",
  cat2: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80&auto=format&fit=crop",
  cat3: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600&q=80&auto=format&fit=crop",
  cat4: "https://images.unsplash.com/photo-1542902093-d55926049754?w=1600&q=80&auto=format&fit=crop",
  cat5: "https://images.unsplash.com/photo-1519614847476-e042d6c7a920?w=1600&q=80&auto=format&fit=crop",
  cat6: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop",
  int1: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop",
  int2: "https://images.unsplash.com/photo-1601661738030-d62f8a0e1ddc?w=1600&q=80&auto=format&fit=crop",
  swim1: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop",
  swim3: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80&auto=format&fit=crop",
};

// ─── Equipment ────────────────────────────────────────────────────────────────

const LAGOON42_EQUIPMENT: Record<string, string[]> = {
  navigation: [
    "Autopilot",
    "Binoculars",
    "Compass",
    "GPS chart plotter",
    "Echosounder",
    "Nautical charts",
    "Speedometer",
    "Anemometer",
    "VHF V60 telsiz",
  ],
  safety: [
    "Can simidi",
    "Can yeleği (yetişkin + çocuk)",
    "Can salı",
    "İlk yardım çantası",
    "Yangın battaniyesi",
    "Yangın söndürücü",
    "Acak dümeni",
    "Acil işaret fişekleri",
  ],
  electrics: [
    "Klima 48 BTU (4 kabin + salon)",
    "Jeneratör (Dempar 11 KW)",
    "Inverter 12/220V – 2000 VA",
    "USB soket",
    "Watermaker (tatlı su üreteci)",
  ],
  deck: [
    "Bimini top",
    "Banyo platformu",
    "Kıç & güverte duşu (sıcak/soğuk)",
    "Tender (dış takma motorlu)",
    "Elektrikli vinç",
    "Güverte ışığı",
    "Katlanır karbon iskele",
    "Bağlama halatı seti",
  ],
  galley: [
    "Nespresso kahve makinesi (ücretsiz)",
    "Espresso + Türk kahve makinesi",
    "Gaz ocak + fırın",
    "Sıcak su",
    "3 adet buzdolabı",
    "Tam mutfak ekipmanı",
  ],
  interior: [
    "Salonda konvertibl masa",
    "Elektrikli tuvalet",
    "Outdoor hoparlör",
    "Radio mp3 player",
  ],
};

const EXCESS11_EQUIPMENT: Record<string, string[]> = {
  navigation: [
    "Autopilot (Raymarine)",
    "GPS chart plotter – cockpit",
    "Raymarine 700 AIS transceiver",
    "Tridata",
    "Nautical charts + pilot book",
  ],
  safety: [
    "Can simidi",
    "Can yeleği",
    "Can salı",
    "VHF Ray90 telsiz",
    "Arama ışığı",
    "Alet takımı",
    "İlk yardım çantası",
  ],
  electrics: [
    "Akü + şarj cihazı",
    "Solar paneller",
    "Inverter",
    "USB soket",
  ],
  deck: [
    "Bimini top",
    "Banyo platformu",
    "Kıç dış duş",
    "Davit",
    "Tender (dış takma motorlu)",
    "Elektrikli primary winch",
    "Lazy bag",
  ],
  galley: [
    "Nespresso kahve makinesi (ücretsiz)",
    "Gaz ocak + fırın",
    "Sıcak su",
    "90L dondurucu",
    "Buzdolabı",
    "Tam mutfak ekipmanı",
  ],
  interior: ["Elektrikli fanlar"],
  entertainment: [
    "Bose Sound System (Bluetooth + şarj ünitesi)",
    "Karaoke sistemi",
    "Outdoor hoparlör",
    "Radio CD player",
  ],
};

// ─── Price Lists ──────────────────────────────────────────────────────────────

const PRICE_IVAN: PriceSlot[] = [
  { from: "18/04/2026", to: "24/04/2026", price: 5700 },
  { from: "25/04/2026", to: "01/05/2026", price: 5900 },
  { from: "02/05/2026", to: "08/05/2026", price: 5900 },
  { from: "09/05/2026", to: "15/05/2026", price: 5900 },
  { from: "16/05/2026", to: "22/05/2026", price: 5900 },
  { from: "23/05/2026", to: "29/05/2026", price: 5900 },
  { from: "30/05/2026", to: "05/06/2026", price: 6700 },
  { from: "06/06/2026", to: "12/06/2026", price: 7600 },
  { from: "13/06/2026", to: "19/06/2026", price: 7600 },
  { from: "20/06/2026", to: "26/06/2026", price: 7600 },
  { from: "27/06/2026", to: "03/07/2026", price: 7600 },
  { from: "04/07/2026", to: "10/07/2026", price: 8200 },
  { from: "11/07/2026", to: "17/07/2026", price: 5750, deal: true },
  { from: "18/07/2026", to: "24/07/2026", price: 8200 },
  { from: "25/07/2026", to: "31/07/2026", price: 8200 },
  { from: "01/08/2026", to: "07/08/2026", price: 6460, deal: true },
  { from: "08/08/2026", to: "14/08/2026", price: 8200 },
  { from: "15/08/2026", to: "21/08/2026", price: 8200 },
  { from: "22/08/2026", to: "28/08/2026", price: 8200 },
  { from: "29/08/2026", to: "04/09/2026", price: 8200 },
  { from: "05/09/2026", to: "11/09/2026", price: 8200 },
  { from: "12/09/2026", to: "18/09/2026", price: 8200 },
  { from: "19/09/2026", to: "25/09/2026", price: 8200 },
  { from: "26/09/2026", to: "02/10/2026", price: 8200 },
  { from: "03/10/2026", to: "09/10/2026", price: 8200 },
  { from: "10/10/2026", to: "16/10/2026", price: 8200 },
  { from: "17/10/2026", to: "23/10/2026", price: 8200 },
  { from: "24/10/2026", to: "30/10/2026", price: 8000 },
  { from: "31/10/2026", to: "06/11/2026", price: 7400 },
  { from: "07/11/2026", to: "13/11/2026", price: 6900 },
  { from: "14/11/2026", to: "31/12/2026", price: 6900 },
];

const PRICE_AYZA: PriceSlot[] = [
  { from: "18/04/2026", to: "24/04/2026", price: 5700 },
  { from: "25/04/2026", to: "01/05/2026", price: 5900 },
  { from: "02/05/2026", to: "08/05/2026", price: 5900 },
  { from: "09/05/2026", to: "15/05/2026", price: 5900 },
  { from: "16/05/2026", to: "22/05/2026", price: 5900 },
  { from: "23/05/2026", to: "29/05/2026", price: 5900 },
  { from: "30/05/2026", to: "05/06/2026", price: 6700 },
  { from: "06/06/2026", to: "12/06/2026", price: 7600 },
  { from: "13/06/2026", to: "19/06/2026", price: 7600 },
  { from: "20/06/2026", to: "26/06/2026", price: 7600 },
  { from: "27/06/2026", to: "03/07/2026", price: 7600 },
  { from: "04/07/2026", to: "10/07/2026", price: 8200 },
  { from: "11/07/2026", to: "17/07/2026", price: 5750, deal: true },
  { from: "18/07/2026", to: "24/07/2026", price: 8200 },
  { from: "25/07/2026", to: "31/07/2026", price: 8200 },
  { from: "01/08/2026", to: "07/08/2026", price: 6460, deal: true },
  { from: "08/08/2026", to: "14/08/2026", price: 8200 },
  { from: "15/08/2026", to: "21/08/2026", price: 8200 },
  { from: "22/08/2026", to: "28/08/2026", price: 8200 },
  { from: "29/08/2026", to: "04/09/2026", price: 8200 },
  { from: "05/09/2026", to: "11/09/2026", price: 8200 },
  { from: "12/09/2026", to: "18/09/2026", price: 8200 },
  { from: "19/09/2026", to: "25/09/2026", price: 8200 },
  { from: "26/09/2026", to: "02/10/2026", price: 8200 },
  { from: "03/10/2026", to: "09/10/2026", price: 8200 },
  { from: "10/10/2026", to: "16/10/2026", price: 8200 },
  { from: "17/10/2026", to: "23/10/2026", price: 8200 },
  { from: "24/10/2026", to: "30/10/2026", price: 8000 },
  { from: "31/10/2026", to: "06/11/2026", price: 7400 },
  { from: "07/11/2026", to: "13/11/2026", price: 6900 },
  { from: "14/11/2026", to: "31/12/2026", price: 6900 },
];

const PRICE_RENA: PriceSlot[] = [
  { from: "18/04/2026", to: "24/04/2026", price: 5500 },
  { from: "25/04/2026", to: "01/05/2026", price: 5700 },
  { from: "02/05/2026", to: "08/05/2026", price: 5700 },
  { from: "09/05/2026", to: "15/05/2026", price: 5700 },
  { from: "16/05/2026", to: "22/05/2026", price: 5700 },
  { from: "23/05/2026", to: "29/05/2026", price: 5700 },
  { from: "30/05/2026", to: "05/06/2026", price: 6400 },
  { from: "06/06/2026", to: "12/06/2026", price: 7200 },
  { from: "13/06/2026", to: "19/06/2026", price: 7200 },
  { from: "20/06/2026", to: "26/06/2026", price: 7200 },
  { from: "27/06/2026", to: "03/07/2026", price: 7200 },
  { from: "04/07/2026", to: "10/07/2026", price: 7950 },
  { from: "11/07/2026", to: "17/07/2026", price: 7950 },
  { from: "18/07/2026", to: "24/07/2026", price: 7950 },
  { from: "25/07/2026", to: "31/07/2026", price: 7950 },
  { from: "01/08/2026", to: "07/08/2026", price: 7950 },
  { from: "08/08/2026", to: "14/08/2026", price: 7950 },
  { from: "15/08/2026", to: "21/08/2026", price: 7950 },
  { from: "22/08/2026", to: "28/08/2026", price: 7950 },
  { from: "29/08/2026", to: "04/09/2026", price: 7950 },
  { from: "05/09/2026", to: "11/09/2026", price: 7950 },
  { from: "12/09/2026", to: "18/09/2026", price: 6479, deal: true },
  { from: "19/09/2026", to: "25/09/2026", price: 7200 },
  { from: "26/09/2026", to: "02/10/2026", price: 7200 },
  { from: "03/10/2026", to: "09/10/2026", price: 7200 },
  { from: "10/10/2026", to: "16/10/2026", price: 7200 },
  { from: "17/10/2026", to: "23/10/2026", price: 7200 },
  { from: "24/10/2026", to: "30/10/2026", price: 6800 },
  { from: "31/10/2026", to: "06/11/2026", price: 6400 },
  { from: "07/11/2026", to: "13/11/2026", price: 5900 },
  { from: "14/11/2026", to: "31/12/2026", price: 5700 },
];

const PRICE_CARMELINA: PriceSlot[] = [
  { from: "18/04/2026", to: "24/04/2026", price: 4000 },
  { from: "25/04/2026", to: "01/05/2026", price: 4100 },
  { from: "02/05/2026", to: "08/05/2026", price: 3700 },
  { from: "09/05/2026", to: "15/05/2026", price: 3700 },
  { from: "16/05/2026", to: "22/05/2026", price: 3700 },
  { from: "23/05/2026", to: "29/05/2026", price: 3700 },
  { from: "30/05/2026", to: "05/06/2026", price: 4300 },
  { from: "06/06/2026", to: "12/06/2026", price: 4300 },
  { from: "13/06/2026", to: "19/06/2026", price: 4300 },
  { from: "20/06/2026", to: "26/06/2026", price: 4300 },
  { from: "27/06/2026", to: "03/07/2026", price: 4500 },
  { from: "04/07/2026", to: "10/07/2026", price: 4500 },
  { from: "11/07/2026", to: "17/07/2026", price: 4500 },
  { from: "18/07/2026", to: "24/07/2026", price: 4500 },
  { from: "25/07/2026", to: "31/07/2026", price: 4500 },
  { from: "01/08/2026", to: "07/08/2026", price: 4800 },
  { from: "08/08/2026", to: "14/08/2026", price: 4800 },
  { from: "15/08/2026", to: "21/08/2026", price: 4800 },
  { from: "22/08/2026", to: "28/08/2026", price: 4800 },
  { from: "29/08/2026", to: "04/09/2026", price: 4800 },
  { from: "05/09/2026", to: "11/09/2026", price: 4900 },
  { from: "12/09/2026", to: "18/09/2026", price: 4900 },
  { from: "19/09/2026", to: "25/09/2026", price: 4900 },
  { from: "26/09/2026", to: "02/10/2026", price: 4900 },
  { from: "03/10/2026", to: "09/10/2026", price: 4900 },
  { from: "10/10/2026", to: "16/10/2026", price: 4900 },
  { from: "17/10/2026", to: "23/10/2026", price: 4900 },
  { from: "24/10/2026", to: "30/10/2026", price: 4900 },
  { from: "31/10/2026", to: "06/11/2026", price: 4800 },
  { from: "07/11/2026", to: "13/11/2026", price: 3840 },
  { from: "14/11/2026", to: "31/12/2026", price: 3840 },
];

// ─── Boats ────────────────────────────────────────────────────────────────────

export const BOATS: MockBoat[] = [
  {
    id: "ivan-nonno",
    slug: "ivan-nonno",
    name: "Ivan Nonno",
    type: "Katamaran",
    model: "Lagoon 42",
    builder: "Lagoon",
    year: 2021,
    charterType: "Bareboat / Skipperli",
    cabins: "4+1",
    berths: "8+2",
    toilets: 4,
    maxPax: 10,
    length: "12.78 m",
    lengthFt: "41.9 ft",
    beam: "7.37 m",
    draft: "1.20 m",
    engines: "2 × Yanmar 57 HP",
    fuelType: "Dizel",
    fuel: "400 L",
    water: "600 L",
    mainSail: "Lazy jack + lazy bag",
    genoa: "Rulo",
    steering: "Çift dümen",
    deposit: 3000,
    generator: "Dempar 11 KW",
    aircon: "48 BTU (4 kabin + salon)",
    watermaker: true,
    marina: "Göcek",
    priceFrom: 5700,
    priceHigh: 8200,
    badge: "Yeni Sezon",
    ribbon: "Lagoon 42 · 2021",
    img: '/images/ivan-nonno/exterior.png',
    gallery: [
      '/images/ivan-nonno/exterior.png',
      '/images/ivan-nonno/sunset.png',
      '/images/ivan-nonno/salon-day.png',
      '/images/ivan-nonno/salon-evening.png',
      '/images/ivan-nonno/cabin.png',
      '/images/ivan-nonno/bathroom.png',
      '/images/ivan-nonno/layout.png',
    ],
    prices: PRICE_IVAN,
    equipment: LAGOON42_EQUIPMENT,
    optional: [
      { name: "Skipper", price: "€200 / gün", note: "Deneyimli kaptan" },
      { name: "Hostes", price: "€150 / gün" },
      { name: "Şef / Aşçı", price: "€180 / gün" },
      { name: "Transfer (havalimanı–marina)", price: "€60 / gidiş" },
    ],
    services: [
      { name: "Check-in / check-out temizliği", price: "€200", required: true },
      { name: "Yakıt", price: "Kullanım kadar", note: "Ayrılışta fark ödenir" },
      { name: "Liman & demir ücretleri", price: "Kullanım kadar" },
      { name: "Ekstra tur ücreti", price: "Yok" },
    ],
    highlights: [
      "Klimalı 4 kabin + salon",
      "Jeneratör + Watermaker",
      "Göcek marinasında",
      "2021 model — tertemiz",
      "Bose ses sistemi",
      "Nespresso dahil",
    ],
  },
  {
    id: "ayza-1",
    slug: "ayza-1",
    name: "Ayza 1",
    type: "Katamaran",
    model: "Lagoon 42",
    builder: "Lagoon",
    year: 2022,
    charterType: "Bareboat / Skipperli",
    cabins: "4+1",
    berths: "8+2",
    toilets: 4,
    maxPax: 10,
    length: "12.78 m",
    lengthFt: "41.9 ft",
    beam: "7.37 m",
    draft: "1.20 m",
    engines: "2 × Yanmar 57 HP",
    fuelType: "Dizel",
    fuel: "400 L",
    water: "600 L",
    mainSail: "Lazy jack + lazy bag",
    genoa: "Rulo",
    steering: "Çift dümen",
    deposit: 3000,
    generator: "Dempar 11 KW",
    aircon: "48 BTU (4 kabin + salon)",
    watermaker: true,
    marina: "Göcek",
    priceFrom: 5700,
    priceHigh: 8200,
    badge: null,
    ribbon: "Lagoon 42 · 2022",
    img: '/images/ayza/exterior.png',
    gallery: [
      '/images/ayza/exterior.png',
      '/images/ayza/sunset.png',
      '/images/ayza/salon-day.png',
      '/images/ayza/salon-evening.png',
      '/images/ayza/cabin.png',
      '/images/ayza/bathroom.png',
      '/images/ayza/layout.png',
    ],
    prices: PRICE_AYZA,
    equipment: LAGOON42_EQUIPMENT,
    optional: [
      { name: "Skipper", price: "€200 / gün", note: "Deneyimli kaptan" },
      { name: "Hostes", price: "€150 / gün" },
      { name: "Şef / Aşçı", price: "€180 / gün" },
      { name: "Transfer (havalimanı–marina)", price: "€60 / gidiş" },
    ],
    services: [
      { name: "Check-in / check-out temizliği", price: "€200", required: true },
      { name: "Yakıt", price: "Kullanım kadar", note: "Ayrılışta fark ödenir" },
      { name: "Liman & demir ücretleri", price: "Kullanım kadar" },
      { name: "Ekstra tur ücreti", price: "Yok" },
    ],
    highlights: [
      "2022 model — en yeni filomuz",
      "Klimalı 4 kabin + salon",
      "Jeneratör + Watermaker",
      "Göcek marinasında",
      "Nespresso dahil",
      "Elektrikli vinçler",
    ],
  },
  {
    id: "rena",
    slug: "rena",
    name: "Rena",
    type: "Katamaran",
    model: "Excess 11",
    builder: "Beneteau Group",
    year: 2021,
    charterType: "Bareboat / Skipperli",
    cabins: "4",
    berths: "8",
    toilets: 4,
    maxPax: 8,
    length: "11.00 m",
    lengthFt: "36.1 ft",
    beam: "6.55 m",
    draft: "1.10 m",
    engines: "2 × Volvo 29 HP",
    fuelType: "Dizel",
    fuel: "200 L",
    water: "400 L",
    mainSail: "Lazy bag",
    genoa: "Rulo",
    steering: "Merkezi dümen",
    deposit: 2500,
    aircon: "Yok",
    watermaker: false,
    marina: "Marmaris",
    priceFrom: 5500,
    priceHigh: 7950,
    badge: "Fırsat",
    ribbon: "Excess 11 · 2021",
    img: '/images/rena/cockpit.jpeg',
    gallery: [
      '/images/rena/cockpit.jpeg',
      '/images/rena/salon.jpeg',
      '/images/rena/salon-dining.jpg',
      '/images/rena/salon-lounge.jpeg',
      '/images/rena/cabin-master.jpeg',
      '/images/rena/cabin-guest.jpeg',
      '/images/rena/bathroom.jpeg',
      '/images/rena/layout.jpeg',
    ],
    prices: PRICE_RENA,
    equipment: EXCESS11_EQUIPMENT,
    optional: [
      { name: "Skipper", price: "€180 / gün" },
      { name: "Hostes", price: "€140 / gün" },
      { name: "Transfer (havalimanı–marina)", price: "€55 / gidiş" },
    ],
    services: [
      { name: "Check-in / check-out temizliği", price: "€180", required: true },
      { name: "Yakıt", price: "Kullanım kadar" },
      { name: "Liman & demir ücretleri", price: "Kullanım kadar" },
    ],
    highlights: [
      "Bose Sound System + Karaoke",
      "Solar panel sistemi",
      "Merkezi kokpit tasarımı",
      "Marmaris marinasında",
      "Nespresso dahil",
      "AIS transceiver",
    ],
  },
  {
    id: "carmelina",
    slug: "carmelina",
    name: "Carmelina",
    type: "Katamaran",
    model: "Excess 11",
    builder: "Beneteau Group",
    year: 2020,
    charterType: "Bareboat / Skipperli",
    cabins: "4",
    berths: "8",
    toilets: 4,
    maxPax: 8,
    length: "11.00 m",
    lengthFt: "36.1 ft",
    beam: "6.55 m",
    draft: "1.10 m",
    engines: "2 × Volvo 29 HP",
    fuelType: "Dizel",
    fuel: "200 L",
    water: "400 L",
    mainSail: "Lazy bag",
    genoa: "Rulo",
    steering: "Merkezi dümen",
    deposit: 2000,
    aircon: "Yok",
    watermaker: false,
    marina: "Bodrum",
    priceFrom: 3700,
    priceHigh: 4900,
    badge: null,
    ribbon: "Excess 11 · 2020",
    img: '/images/carmelina/hero.jpeg',
    gallery: [
      '/images/carmelina/hero.jpeg',
      '/images/carmelina/exterior.jpeg',
      '/images/carmelina/sailing.jpeg',
      '/images/carmelina/salon-wide.jpeg',
      '/images/carmelina/salon-dining.jpeg',
      '/images/carmelina/cockpit-seating.jpeg',
      '/images/carmelina/cockpit-aft.jpeg',
      '/images/carmelina/cabin-master.jpg',
      '/images/carmelina/cabin-guest.jpeg',
      '/images/carmelina/galley.jpeg',
      '/images/carmelina/bathroom.jpeg',
      '/images/carmelina/layout.jpeg',
    ],
    prices: PRICE_CARMELINA,
    equipment: EXCESS11_EQUIPMENT,
    optional: [
      { name: "Skipper", price: "€160 / gün" },
      { name: "Hostes", price: "€130 / gün" },
      { name: "Transfer (havalimanı–marina)", price: "€50 / gidiş" },
    ],
    services: [
      { name: "Check-in / check-out temizliği", price: "€160", required: true },
      { name: "Yakıt", price: "Kullanım kadar" },
      { name: "Liman & demir ücretleri", price: "Kullanım kadar" },
    ],
    highlights: [
      "En uygun fiyatlı seçenek",
      "Bodrum marinasında",
      "Solar panel sistemi",
      "Bose Sound System",
      "Nespresso dahil",
      "Karaoke sistemi",
    ],
  },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = [
  {
    id: "gocek-fethiye",
    title: "Göcek – Fethiye Körfezi",
    days: 7,
    difficulty: "Kolay",
    highlights: ["12 Adalar", "Tersane Adası", "Bedri Rahmi Koyu", "Sarsala", "Gemiler Adası", "Ölüdeniz"],
    img: IMG.hero2,
    desc: "Göcek'in korunaklı koylarında, çam ormanlarının yansıdığı duru sularda klasik bir hafta. Filomuzun evi — her gün farklı bir koyda demirliyoruz.",
  },
  {
    id: "fethiye-kas",
    title: "Fethiye – Kaş Likya Rotası",
    days: 10,
    difficulty: "Orta",
    highlights: ["Kalkan", "Patara", "Kekova", "Simena batık şehri", "Üçağız", "Kaş"],
    img: IMG.hero5,
    desc: "Antik Likya izinde, batık şehirler ve gizli koyların bulunduğu uzun bir keşif. Tarih ve deniz iç içe.",
  },
  {
    id: "marmaris-gocek",
    title: "Marmaris – Göcek",
    days: 7,
    difficulty: "Orta",
    highlights: ["Ekincik", "Sarıgerme", "Dalyan (Caretta)", "İztuzu", "Göcek 12 Adalar"],
    img: IMG.hero4,
    desc: "Caretta Caretta'ların dünyasından Göcek'in sakin sularına uzanan eşsiz rota.",
  },
  {
    id: "gocek-gocek",
    title: "Göcek Adaları Turu",
    days: 5,
    difficulty: "Kolay",
    highlights: ["Domuz Adası", "Yassıca Adaları", "Hamam Koyu", "Manastır Koyu", "Bedri Rahmi"],
    img: IMG.hero2,
    desc: "Göcek 12 Adalar'ın tümünü kapsayan kısa ama yoğun bir rota — kısa izin için ideal.",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  { name: "Elif & Can", trip: "Ivan Nonno · 7 gün · Temmuz 2025", text: "Her şey mükemmeldi. Tekne 2024 model, yepyeni; klima ve jeneratör sayesinde sıcak temmuzda bile kokpitte çay içtik. Fatih Bey gece 23:00'te mesaj attığımızda bile anında döndü.", rating: 5, avatar: "https://i.pravatar.cc/120?u=elifcan" },
  { name: "Marco Rossi", trip: "Carmelina · 10 gün · Eylül 2025", text: "Professional crew, beautiful boat. The Bose system and the karaoke were a bonus — evenings in Gemiler bay will stay with us. Returning next summer, for sure.", rating: 5, avatar: "https://i.pravatar.cc/120?u=marco2" },
  { name: "Aylin Yılmaz", trip: "Rena · 7 gün · Haziran 2025", text: "Rena için fiyat-performans olarak piyasadaki en iyi seçenek. 4+2 kabin çift aileye bol bol yetti, watermaker da büyük artı. Teslim öncesi brifing çok detaylıydı.", rating: 5, avatar: "https://i.pravatar.cc/120?u=aylin" },
  { name: "Thomas Weber", trip: "Ayza 1 · 14 gün · Ağustos 2025", text: "Ein fantastischer Urlaub. Der Lagoon 42 ist perfekt für 8 Erwachsene — stabil, leise, gut belüftet. Die Bucht von Göcek ist ein Paradies.", rating: 5, avatar: "https://i.pravatar.cc/120?u=thomas" },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const BLOG_POSTS = [
  {
    id: "lagoon-42-inceleme",
    slug: "lagoon-42-inceleme",
    title: "Lagoon 42: Aile Tatili İçin Mükemmel mi?",
    excerpt:
      "Lagoon 42'nin geniş kokpiti, dört bağımsız kabini ve son teknoloji ekipmanıyla nasıl bir tatil sunduğunu anlattık.",
    img: IMG.cat6,
    category: "Tekne İnceleme",
    date: "15 Mart 2026",
    readTime: "5 dk",
  },
  {
    id: "gocek-koylar",
    slug: "gocek-koylar",
    title: "Göcek'in Gizli Koyları: 12 Adalar Turu",
    excerpt:
      "Göcek çevresindeki 12 adayı ziyaret eden rotamızda en güzel demirleme noktalarını, köy restoranlarını keşfedin.",
    img: IMG.hero2,
    category: "Rota Rehberi",
    date: "2 Nisan 2026",
    readTime: "7 dk",
  },
  {
    id: "skipperli-bareboat",
    slug: "skipperli-bareboat",
    title: "Skipperli mi, Bareboat mu? Hangisi Size Uygun?",
    excerpt:
      "Deneyim seviyenize ve bütçenize göre doğru charter türünü seçmek için bilmeniz gereken her şey.",
    img: IMG.cat3,
    category: "Rehber",
    date: "10 Nisan 2026",
    readTime: "4 dk",
  },
];

// ─── Charter Types ────────────────────────────────────────────────────────────

export const CHARTER_TYPES = [
  {
    id: "bareboat",
    title: "Bareboat Charter",
    description:
      "Geçerli kaptanlık belgenizle tekneyi kendiniz kullanın. Özgürlüğün tam anlamıyla tadını çıkarın.",
    img: IMG.cat1,
    highlights: ["Kendi rotanız", "Maksimum özgürlük", "En uygun fiyat"],
  },
  {
    id: "skipperli",
    title: "Skipperli Charter",
    description:
      "Deneyimli kaptanımız sizi en güzel koylarla tanıştırsın. Siz sadece keyfini çıkarın.",
    img: IMG.cat2,
    highlights: ["Profesyonel kaptan", "Yerel bilgi", "Stressiz tatil"],
  },
  {
    id: "hostes",
    title: "Tam Hizmet Charter",
    description:
      "Kaptan, hostes ve isteğe bağlı şefle tam otel konforunda bir deniz tatili.",
    img: IMG.int1,
    highlights: ["Kaptan + hostes", "Yemek servisi", "VIP deneyim"],
  },
];

// ─── Brand Info ───────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Nonno Blue",
  tagline: "Ege ve Akdeniz'in En Güzel Katamaran Filosu",
  sub: "2018'den bu yana Türk sularında kusursuz charter deneyimi",
  email: "info@nonnoblue.com",
  phone: "+90 252 612 00 00",
  whatsapp: "+905321234567",
  address: "Göcek Marina, 48310 Fethiye / Muğla",
  socials: {
    instagram: "https://instagram.com/nonnoblue",
    facebook: "https://facebook.com/nonnoblue",
    youtube: "https://youtube.com/@nonnoblue",
  },
  stats: [
    { label: "Tekne", value: "4" },
    { label: "Mutlu Misafir", value: "1200+" },
    { label: "Yıllık Deneyim", value: "7+" },
    { label: "Rota", value: "12+" },
  ],
};

// ─── Hero Images (for slideshow) ─────────────────────────────────────────────

export const HERO_IMAGES = [IMG.hero1, IMG.hero2, IMG.hero3, IMG.hero4, IMG.hero5];

// Compatibility wrapper — home page ve diğer sayfalar bunu kullanabilir
export const NB_DATA = {
  boats: BOATS,
  routes: ROUTES,
  testimonials: TESTIMONIALS,
  blog: BLOG_POSTS,
  charterTypes: CHARTER_TYPES,
  brand: BRAND,
  heroSlides: HERO_IMAGES.slice(0, 2).map((img, i) => ({
    img,
    eyebrow: i === 0 ? 'Göcek · Fethiye · D-Marin' : '2026 Sezonu Açıldı',
    title: i === 0 ? 'Lagoon 42\nile Göcek\'in\nmavi sırrı' : 'Koy koy\nTürk Rivierası',
    sub: i === 0
      ? '2024 model 4+2 kabinli katamaranlarımızla, 12 Adalar ve Ölüdeniz koylarında unutulmaz bir hafta.'
      : 'Tersane Adası, Bedri Rahmi, Sarsala, Gemiler ve Ölüdeniz — bir haftada beş hikaye.',
  })),
};
