-- ===== BOATS =====
-- Not: boat_photos.storage_path şimdilik Unsplash URL, gerçek fotoğraflar Supabase Storage'a yüklenince güncellenir
insert into boats (slug, name, type, brand, model, year, length_m, beam_m, cabins, bathrooms, max_guests, marina, deposit_eur, description_tr, features, active, display_order) values
(
  'ivan-nonno', 'Ivan Nonno', 'Katamaran', 'Lagoon', 'Lagoon 42', 2021,
  12.78, 7.37, 4, 4, 10, 'Göcek', 3000,
  'Göcek marinasında konuşlu 2021 model Lagoon 42. Klimalı 4 kabin + salon, jeneratör ve watermaker ile tam donanımlı konforlu bir tatil.',
  ARRAY['Klima (4 kabin + salon)','Jeneratör Dempar 11 KW','Watermaker','Bose ses sistemi','Nespresso dahil','Çift dümen','2 × Yanmar 57 HP','Lazy jack + lazy bag'],
  true, 1
),
(
  'ayza-1', 'Ayza 1', 'Katamaran', 'Lagoon', 'Lagoon 42', 2022,
  12.78, 7.37, 4, 4, 10, 'Göcek', 3000,
  'Filomuzun en yeni teknesi — 2022 model Lagoon 42. Elektrikli vinçler, klima ve watermaker ile lüks charter deneyimi.',
  ARRAY['Klima (4 kabin + salon)','Jeneratör Dempar 11 KW','Watermaker','Elektrikli vinçler','Nespresso dahil','Çift dümen','2 × Yanmar 57 HP','Lazy jack + lazy bag'],
  true, 2
),
(
  'rena', 'Rena', 'Katamaran', 'Beneteau Group', 'Excess 11', 2021,
  11.00, 6.55, 4, 4, 8, 'Marmaris', 2500,
  'Marmaris marinasında 2021 model Excess 11. Solar panel sistemi, Bose Sound System ve karaoke ile eğlenceli bir charter deneyimi.',
  ARRAY['Solar panel sistemi','Bose Sound System','Karaoke','Nespresso dahil','Merkezi dümen','2 × Volvo 29 HP','AIS transceiver','Lazy bag'],
  true, 3
),
(
  'carmelina', 'Carmelina', 'Katamaran', 'Beneteau Group', 'Excess 11', 2020,
  11.00, 6.55, 4, 4, 8, 'Bodrum', 2000,
  'Bodrum marinasında 2020 model Excess 11. Fiyat-performans dengesiyle en uygun katamaran seçeneği.',
  ARRAY['Solar panel sistemi','Bose Sound System','Karaoke','Nespresso dahil','Merkezi dümen','2 × Volvo 29 HP','Lazy bag'],
  true, 4
);

-- ===== BOAT PRICING — Ivan Nonno =====
insert into boat_pricing (boat_id, start_date, end_date, weekly_price_eur)
select b.id, s::date, e::date, p from boats b,
(values
  ('2026-04-18','2026-04-24',5700),
  ('2026-04-25','2026-05-01',5900),
  ('2026-05-02','2026-05-08',5900),
  ('2026-05-09','2026-05-15',5900),
  ('2026-05-16','2026-05-22',5900),
  ('2026-05-23','2026-05-29',5900),
  ('2026-05-30','2026-06-05',6700),
  ('2026-06-06','2026-06-12',7600),
  ('2026-06-13','2026-06-19',7600),
  ('2026-06-20','2026-06-26',7600),
  ('2026-06-27','2026-07-03',7600),
  ('2026-07-04','2026-07-10',8200),
  ('2026-07-11','2026-07-17',5750),
  ('2026-07-18','2026-07-24',8200),
  ('2026-07-25','2026-07-31',8200),
  ('2026-08-01','2026-08-07',6460),
  ('2026-08-08','2026-08-14',8200),
  ('2026-08-15','2026-08-21',8200),
  ('2026-08-22','2026-08-28',8200),
  ('2026-08-29','2026-09-04',8200),
  ('2026-09-05','2026-09-11',8200),
  ('2026-09-12','2026-09-18',8200),
  ('2026-09-19','2026-09-25',8200),
  ('2026-09-26','2026-10-02',8200),
  ('2026-10-03','2026-10-09',8200),
  ('2026-10-10','2026-10-16',8200),
  ('2026-10-17','2026-10-23',8200),
  ('2026-10-24','2026-10-30',8000),
  ('2026-10-31','2026-11-06',7400),
  ('2026-11-07','2026-11-13',6900),
  ('2026-11-14','2026-12-31',6900)
) as t(s,e,p)
where b.slug = 'ivan-nonno';

-- ===== BOAT PRICING — Ayza 1 =====
insert into boat_pricing (boat_id, start_date, end_date, weekly_price_eur)
select b.id, s::date, e::date, p from boats b,
(values
  ('2026-04-18','2026-04-24',5700),
  ('2026-04-25','2026-05-01',5900),
  ('2026-05-02','2026-05-08',5900),
  ('2026-05-09','2026-05-15',5900),
  ('2026-05-16','2026-05-22',5900),
  ('2026-05-23','2026-05-29',5900),
  ('2026-05-30','2026-06-05',6700),
  ('2026-06-06','2026-06-12',7600),
  ('2026-06-13','2026-06-19',7600),
  ('2026-06-20','2026-06-26',7600),
  ('2026-06-27','2026-07-03',7600),
  ('2026-07-04','2026-07-10',8200),
  ('2026-07-11','2026-07-17',5750),
  ('2026-07-18','2026-07-24',8200),
  ('2026-07-25','2026-07-31',8200),
  ('2026-08-01','2026-08-07',6460),
  ('2026-08-08','2026-08-14',8200),
  ('2026-08-15','2026-08-21',8200),
  ('2026-08-22','2026-08-28',8200),
  ('2026-08-29','2026-09-04',8200),
  ('2026-09-05','2026-09-11',8200),
  ('2026-09-12','2026-09-18',8200),
  ('2026-09-19','2026-09-25',8200),
  ('2026-09-26','2026-10-02',8200),
  ('2026-10-03','2026-10-09',8200),
  ('2026-10-10','2026-10-16',8200),
  ('2026-10-17','2026-10-23',8200),
  ('2026-10-24','2026-10-30',8000),
  ('2026-10-31','2026-11-06',7400),
  ('2026-11-07','2026-11-13',6900),
  ('2026-11-14','2026-12-31',6900)
) as t(s,e,p)
where b.slug = 'ayza-1';

-- ===== BOAT PRICING — Rena =====
insert into boat_pricing (boat_id, start_date, end_date, weekly_price_eur)
select b.id, s::date, e::date, p from boats b,
(values
  ('2026-04-18','2026-04-24',5500),
  ('2026-04-25','2026-05-01',5700),
  ('2026-05-02','2026-05-08',5700),
  ('2026-05-09','2026-05-15',5700),
  ('2026-05-16','2026-05-22',5700),
  ('2026-05-23','2026-05-29',5700),
  ('2026-05-30','2026-06-05',6400),
  ('2026-06-06','2026-06-12',7200),
  ('2026-06-13','2026-06-19',7200),
  ('2026-06-20','2026-06-26',7200),
  ('2026-06-27','2026-07-03',7200),
  ('2026-07-04','2026-07-10',7950),
  ('2026-07-11','2026-07-17',7950),
  ('2026-07-18','2026-07-24',7950),
  ('2026-07-25','2026-07-31',7950),
  ('2026-08-01','2026-08-07',7950),
  ('2026-08-08','2026-08-14',7950),
  ('2026-08-15','2026-08-21',7950),
  ('2026-08-22','2026-08-28',7950),
  ('2026-08-29','2026-09-04',7950),
  ('2026-09-05','2026-09-11',7950),
  ('2026-09-12','2026-09-18',6479),
  ('2026-09-19','2026-09-25',7200),
  ('2026-09-26','2026-10-02',7200),
  ('2026-10-03','2026-10-09',7200),
  ('2026-10-10','2026-10-16',7200),
  ('2026-10-17','2026-10-23',7200),
  ('2026-10-24','2026-10-30',6800),
  ('2026-10-31','2026-11-06',6400),
  ('2026-11-07','2026-11-13',5900),
  ('2026-11-14','2026-12-31',5700)
) as t(s,e,p)
where b.slug = 'rena';

-- ===== BOAT PRICING — Carmelina =====
insert into boat_pricing (boat_id, start_date, end_date, weekly_price_eur)
select b.id, s::date, e::date, p from boats b,
(values
  ('2026-04-18','2026-04-24',4000),
  ('2026-04-25','2026-05-01',4100),
  ('2026-05-02','2026-05-08',3700),
  ('2026-05-09','2026-05-15',3700),
  ('2026-05-16','2026-05-22',3700),
  ('2026-05-23','2026-05-29',3700),
  ('2026-05-30','2026-06-05',4300),
  ('2026-06-06','2026-06-12',4300),
  ('2026-06-13','2026-06-19',4300),
  ('2026-06-20','2026-06-26',4300),
  ('2026-06-27','2026-07-03',4500),
  ('2026-07-04','2026-07-10',4500),
  ('2026-07-11','2026-07-17',4500),
  ('2026-07-18','2026-07-24',4500),
  ('2026-07-25','2026-07-31',4500),
  ('2026-08-01','2026-08-07',4800),
  ('2026-08-08','2026-08-14',4800),
  ('2026-08-15','2026-08-21',4800),
  ('2026-08-22','2026-08-28',4800),
  ('2026-08-29','2026-09-04',4800),
  ('2026-09-05','2026-09-11',4900),
  ('2026-09-12','2026-09-18',4900),
  ('2026-09-19','2026-09-25',4900),
  ('2026-09-26','2026-10-02',4900),
  ('2026-10-03','2026-10-09',4900),
  ('2026-10-10','2026-10-16',4900),
  ('2026-10-17','2026-10-23',4900),
  ('2026-10-24','2026-10-30',4900),
  ('2026-10-31','2026-11-06',4800),
  ('2026-11-07','2026-11-13',3840),
  ('2026-11-14','2026-12-31',3840)
) as t(s,e,p)
where b.slug = 'carmelina';

-- ===== BOAT PHOTOS — Ivan Nonno =====
insert into boat_photos (boat_id, storage_path, position, alt_text)
select b.id, url, pos, alt from boats b,
(values
  ('https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop', 1, 'Ivan Nonno ana görsel'),
  ('https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1600&q=80&auto=format&fit=crop', 2, 'Ivan Nonno dış görünüm'),
  ('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop', 3, 'Ivan Nonno iç mekan'),
  ('https://images.unsplash.com/photo-1601661738030-d62f8a0e1ddc?w=1600&q=80&auto=format&fit=crop', 4, 'Ivan Nonno kabin'),
  ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80&auto=format&fit=crop', 5, 'Ivan Nonno kokpit'),
  ('https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600&q=80&auto=format&fit=crop', 6, 'Ivan Nonno yelken'),
  ('https://images.unsplash.com/photo-1542902093-d55926049754?w=1600&q=80&auto=format&fit=crop', 7, 'Ivan Nonno gece')
) as t(url, pos, alt)
where b.slug = 'ivan-nonno';

-- ===== BOAT PHOTOS — Ayza 1 =====
insert into boat_photos (boat_id, storage_path, position, alt_text)
select b.id, url, pos, alt from boats b,
(values
  ('https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1600&q=80&auto=format&fit=crop', 1, 'Ayza 1 ana görsel'),
  ('https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop', 2, 'Ayza 1 dış görünüm'),
  ('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop', 3, 'Ayza 1 iç mekan'),
  ('https://images.unsplash.com/photo-1601661738030-d62f8a0e1ddc?w=1600&q=80&auto=format&fit=crop', 4, 'Ayza 1 kabin'),
  ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80&auto=format&fit=crop', 5, 'Ayza 1 kokpit'),
  ('https://images.unsplash.com/photo-1519614847476-e042d6c7a920?w=1600&q=80&auto=format&fit=crop', 6, 'Ayza 1 yelken'),
  ('https://images.unsplash.com/photo-1542902093-d55926049754?w=1600&q=80&auto=format&fit=crop', 7, 'Ayza 1 gece')
) as t(url, pos, alt)
where b.slug = 'ayza-1';

-- ===== BOAT PHOTOS — Rena =====
insert into boat_photos (boat_id, storage_path, position, alt_text)
select b.id, url, pos, alt from boats b,
(values
  ('https://images.unsplash.com/photo-1542902093-d55926049754?w=1600&q=80&auto=format&fit=crop', 1, 'Rena ana görsel'),
  ('https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600&q=80&auto=format&fit=crop', 2, 'Rena dış görünüm'),
  ('https://images.unsplash.com/photo-1601661738030-d62f8a0e1ddc?w=1600&q=80&auto=format&fit=crop', 3, 'Rena iç mekan'),
  ('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop', 4, 'Rena kabin'),
  ('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80&auto=format&fit=crop', 5, 'Rena güverte'),
  ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80&auto=format&fit=crop', 6, 'Rena kokpit'),
  ('https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop', 7, 'Rena geniş görünüm')
) as t(url, pos, alt)
where b.slug = 'rena';

-- ===== BOAT PHOTOS — Carmelina =====
insert into boat_photos (boat_id, storage_path, position, alt_text)
select b.id, url, pos, alt from boats b,
(values
  ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80&auto=format&fit=crop', 1, 'Carmelina ana görsel'),
  ('https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1600&q=80&auto=format&fit=crop', 2, 'Carmelina dış görünüm'),
  ('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80&auto=format&fit=crop', 3, 'Carmelina güverte'),
  ('https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600&q=80&auto=format&fit=crop', 4, 'Carmelina yelken'),
  ('https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop', 5, 'Carmelina geniş görünüm'),
  ('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80&auto=format&fit=crop', 6, 'Carmelina iç mekan'),
  ('https://images.unsplash.com/photo-1601661738030-d62f8a0e1ddc?w=1600&q=80&auto=format&fit=crop', 7, 'Carmelina kabin')
) as t(url, pos, alt)
where b.slug = 'carmelina';
