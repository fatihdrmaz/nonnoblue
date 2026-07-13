-- Boat data corrections — July 2026
-- Run this on the live Supabase DB via SQL editor

-- Ivan Nonno: year 2021→2024, deposit 3000→4000
UPDATE boats SET
  year = 2024,
  deposit_eur = 4000,
  description_tr = 'Göcek marinasında konuşlu 2024 model Lagoon 42. Klimalı 4+2 kabin + salon, jeneratör ve watermaker ile tam donanımlı konforlu bir tatil.'
WHERE slug = 'ivan-nonno';

-- Ayza 1: year 2022→2024, deposit 3000→4000
UPDATE boats SET
  year = 2024,
  deposit_eur = 4000,
  description_tr = 'Göcek marinasında konuşlu 2024 model Lagoon 42. 4+2 kabin, elektrikli vinçler, klima ve watermaker ile lüks charter deneyimi.'
WHERE slug = 'ayza-1';

-- Rena: model Excess 11→Lagoon 42, brand Beneteau→Lagoon, year 2021→2023,
--       dimensions updated to Lagoon 42 specs, deposit 2500→4000
UPDATE boats SET
  brand = 'Lagoon',
  model = 'Lagoon 42',
  year = 2023,
  length_m = 12.78,
  beam_m = 7.37,
  deposit_eur = 4000,
  description_tr = 'Marmaris marinasında 2023 model Lagoon 42. 4+2 kabin, Bose Sound System ve karaoke ile eğlenceli bir charter deneyimi.',
  features = ARRAY['Solar panel sistemi','Bose Sound System','Karaoke','Nespresso dahil','Çift dümen','2 × Yanmar 57 HP','AIS transceiver','Lazy bag']
WHERE slug = 'rena';

-- Carmelina: year 2020→2021, deposit 2000→3000
UPDATE boats SET
  year = 2021,
  deposit_eur = 3000,
  description_tr = 'Bodrum marinasında 2021 model Excess 11. 4+2 kabin, fiyat-performans dengesiyle en uygun katamaran seçeneği.'
WHERE slug = 'carmelina';
