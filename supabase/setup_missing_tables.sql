-- ===================================================
-- ADIM 1: Eksik tablolar
-- Supabase SQL Editor'da çalıştır
-- ===================================================

-- Routes tablosu
create table if not exists routes (
  id text primary key,
  title text not null,
  days int not null default 7,
  difficulty text not null default 'Kolay',
  description text,
  highlights text[],
  img_url text,
  active boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);
create index if not exists routes_active_order on routes (active, display_order);

-- Blog posts tablosu
create table if not exists blog_posts (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  img_url text,
  category text default 'Rehber',
  read_time text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists blog_posts_published on blog_posts (published, published_at desc);

-- Contact forms tablosu
create table if not exists contact_forms (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  replied boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table routes enable row level security;
create policy "routes public read" on routes for select using (active = true);

alter table blog_posts enable row level security;
create policy "blog public read" on blog_posts for select using (published = true);
create policy "blog admin all" on blog_posts for all using (public.is_admin());

alter table contact_forms enable row level security;
create policy "contact insert" on contact_forms for insert with check (true);
create policy "contact admin read" on contact_forms for select using (public.is_admin());

-- Routes admin policy
create policy "routes admin all" on routes for all using (public.is_admin());

-- ===================================================
-- ADIM 2: Rotalar
-- ===================================================

insert into routes (id, title, days, difficulty, description, highlights, img_url, active, display_order)
values
(
  'gocek-fethiye',
  'Göcek – Fethiye Körfezi',
  7,
  'Kolay',
  'Göcek''in korunaklı koylarında, çam ormanlarının yansıdığı duru sularda klasik bir hafta. Filomuzun evi — her gün farklı bir koyda demirliyoruz.',
  ARRAY['12 Adalar','Tersane Adası','Bedri Rahmi Koyu','Sarsala','Gemiler Adası','Ölüdeniz'],
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop',
  true, 1
),
(
  'fethiye-kas',
  'Fethiye – Kaş Likya Rotası',
  10,
  'Orta',
  'Antik Likya izinde, batık şehirler ve gizli koyların bulunduğu uzun bir keşif. Tarih ve deniz iç içe.',
  ARRAY['Kalkan','Patara','Kekova','Simena batık şehri','Üçağız','Kaş'],
  'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1600&q=80&auto=format&fit=crop',
  true, 2
),
(
  'marmaris-gocek',
  'Marmaris – Göcek',
  7,
  'Orta',
  'Caretta Caretta''ların dünyasından Göcek''in sakin sularına uzanan eşsiz rota.',
  ARRAY['Ekincik','Sarıgerme','Dalyan (Caretta)','İztuzu','Göcek 12 Adalar'],
  'https://images.unsplash.com/photo-1533106958148-daaeab8b83fe?w=1600&q=80&auto=format&fit=crop',
  true, 3
),
(
  'gocek-gocek',
  'Göcek Adaları Turu',
  5,
  'Kolay',
  'Göcek 12 Adalar''ın tümünü kapsayan kısa ama yoğun bir rota — kısa izin için ideal.',
  ARRAY['Domuz Adası','Yassıca Adaları','Hamam Koyu','Manastır Koyu','Bedri Rahmi'],
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop',
  true, 4
)
on conflict (id) do update set
  title = excluded.title,
  days = excluded.days,
  difficulty = excluded.difficulty,
  description = excluded.description,
  highlights = excluded.highlights,
  img_url = excluded.img_url;

-- ===================================================
-- ADIM 3: Blog yazıları
-- ===================================================

insert into blog_posts (id, slug, title, excerpt, content, img_url, category, read_time, published, published_at)
values
(
  'lagoon-42-inceleme',
  'lagoon-42-inceleme',
  'Lagoon 42: Aile Tatili İçin Mükemmel mi?',
  'Lagoon 42''nin geniş kokpiti, dört bağımsız kabini ve son teknoloji ekipmanıyla nasıl bir tatil sunduğunu anlattık.',
  '## Lagoon 42 Neden Bu Kadar Popüler?

Lagoon 42, 2020 yılından bu yana dünya charter pazarının en çok tercih edilen katamaranlarından biri. Bunun arkasında birkaç somut neden var.

### Geniş Kokpit ve Yaşam Alanları

Lagoon 42''nin en belirgin özelliği geniş aft kokpiti. 10 kişiye kadar rahatça oturabildiğiniz bu alan, akşam yemeklerini ve sosyalleşmeyi dışarıda yaşamanızı sağlıyor. Üstündeki flybridge ise sabah kahvesi için mükemmel.

### 4 Bağımsız Kabin

Her kabin kendi banyosuna sahip ve gerçek anlamda özerk. İki aile veya dört çift için harika bir düzenleme. Kabin kapıları kilitlenebiliyor — özel konaklamada bu detay küçük görünse de büyük fark yaratıyor.

### Teknik Ekipman

Filomuzun Lagoon 42 tekneleri; tam klima sistemi (4 kabin + salon), 11 kW Dempar jeneratör ve watermaker ile donatılmış. Sıcak yaz günlerinde klima ve tatlı su üreteci, tatili çok daha konforlu kılıyor.

### Sonuç

Eğer 2-4 çift ya da iki aile olarak bir haftalık Göcek veya Fethiye turunu düşünüyorsanız, Lagoon 42 en dengeli seçenek. Fiyat-konfor-güvenlik üçgeninde rakipsiz.',
  'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop',
  'Tekne İnceleme',
  '5 dk',
  true,
  '2026-03-15T09:00:00Z'
),
(
  'gocek-koylar',
  'gocek-koylar',
  'Göcek''in Gizli Koyları: 12 Adalar Turu',
  'Göcek çevresindeki 12 adayı ziyaret eden rotamızda en güzel demirleme noktalarını, köy restoranlarını keşfedin.',
  '## 12 Adalar Neden Bu Kadar Özel?

Göcek''in güneyinde yer alan 12 Adalar (Onikiadalr) bölgesi, Türkiye''nin en korunaklı ve el değmemiş koylarından bazılarına ev sahipliği yapıyor. Göcek''ten saatler içinde ulaşabildiğiniz bu adalar, çoğunlukla yalnızca tekneyle erişilebilir durumda.

### Tersane Adası

Osmanlı döneminden kalma tarihi tersane kalıntılarının bulunduğu bu ada, hem tarih hem doğa tutkunları için ideal. Sığ ve duru sularında yüzmek, adanın kuzeyindeki orman yolunda yürüyüş yapmak mümkün.

### Bedri Rahmi Koyu

Ressam Bedri Rahmi Eyüboğlu''nun kayalara oyduğu freskolarla ünlü bu koy, Göcek''in en fotojenik noktalarından biri. Koyun arka tarafında küçük bir restoran var — akşam yemeği için harika.

### Sarsala Koyu

Daha az bilinen ama filomuzun favorisi. Derin ve sakin suları, kumlu tabanı ve etrafını saran çam ormanıyla gerçek bir cennet köşesi.

### Pratik Bilgiler

- Tersane ve Bedri Rahmi gündüz yoğun olabilir; sabah erken ya da akşam üstü tercih edin
- Demir atma ücretleri genellikle 150-300 TL arasında
- Koyların çoğunda telefon çekmiyor — bunu özgürlük olarak görün',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop',
  'Rota Rehberi',
  '7 dk',
  true,
  '2026-04-02T09:00:00Z'
),
(
  'skipperli-bareboat',
  'skipperli-bareboat',
  'Skipperli mi, Bareboat mu? Hangisi Size Uygun?',
  'Deneyim seviyenize ve bütçenize göre doğru charter türünü seçmek için bilmeniz gereken her şey.',
  '## İki Temel Charter Tipi

Tekne kiralama dünyasında iki temel seçenek var: kendi kullandığınız bareboat ve profesyonel kaptan eşliğindeki skipperli charter. Her ikisinin de net avantajları ve uygun olduğu profil var.

### Bareboat Charter Kimler İçin?

Bareboat charter, geçerli bir ICC veya TYHS belgesi olan, açık sularda dümen tutma deneyimi bulunan kişiler için uygundur.

**Avantajları:**
- Kendi programınızı yaparsınız
- Kaptan ücreti yok (~€200/gün tasarruf)
- Dilediğiniz koya, dilediğiniz saatte gidersiniz

**Dikkat edilmesi gerekenler:**
- Geçerli uluslararası yeterlilik belgesi zorunlu
- Filomuz ICC, TYHS veya eşdeğerini kabul ediyor
- Depozito belge doğrulandıktan sonra belirleniyor

### Skipperli Charter Kimler İçin?

Tekne kullanmak istemeyenler, yeni bölgede yerel bilgiye ihtiyaç duyanlar ya da tam anlamıyla "tatil" yapmak isteyenler için ideal.

**Avantajları:**
- Yöreyi bilen, gizli koyları tanıyan bir kaptan
- Siz sadece güneşin, denizin ve yemeğin tadını çıkarırsınız
- Akşam limanlarda bağlama işlemi ve bürokratik süreçler kaptandan

**Fiyat farkı:**
Skipperli charter genellikle tekne fiyatına €150-200/gün eklenir.

### Karar Vermekte Zorlanıyorsanız

Göcek ve Fethiye koylarını ilk kez ziyaret ediyorsanız skipperli öneririz. Yerel bilgi, özellikle demir yerleri ve akıntılar konusunda çok değerli. Bölgeyi bir kez gördükten sonra ikinci seferde bareboat çok daha keyifli.',
  'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600&q=80&auto=format&fit=crop',
  'Rehber',
  '4 dk',
  true,
  '2026-04-10T09:00:00Z'
)
on conflict (id) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  img_url = excluded.img_url,
  category = excluded.category,
  read_time = excluded.read_time,
  published = excluded.published,
  published_at = excluded.published_at;

-- ===================================================
-- ADIM 4: seed.sql'deki tekneleri çalıştırmadıysan
-- Boats tablosunda veri var mı kontrol et:
-- SELECT count(*) FROM boats;
-- 0 dönüyorsa seed.sql'i de çalıştır
-- ===================================================
