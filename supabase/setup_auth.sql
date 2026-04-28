-- ============================================================
-- 1. profiles tablosu — her kullanıcı için rol tutulur
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',  -- 'user' | 'admin'
  created_at timestamptz default now()
);

-- Sadece kendi profilini okuyabilir
alter table public.profiles enable row level security;

create policy "Kendi profilini görebilir"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Kendi profilini güncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

-- Adminler herkesi görebilir (middleware zaten guard ediyor)
create policy "Admin herkesi görebilir"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- 2. Yeni kayıt olunca otomatik profil oluştur (trigger)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 3. KENDİNİZİ ADMIN YAPIN
-- (Giriş yaptıktan sonra user ID'nizi auth.users tablosundan
--  bulup aşağıdaki komutu çalıştırın — ya da e-postanızı yazın)
-- ============================================================

-- E-posta ile admin yapma:
update public.profiles
set role = 'admin'
where email = 'fdurmaz@gmail.com';

-- Eğer profil henüz yoksa (trigger çalışmadıysa) manuel ekle:
-- insert into public.profiles (id, email, role)
-- select id, email, 'admin'
-- from auth.users
-- where email = 'fdurmaz@gmail.com'
-- on conflict (id) do update set role = 'admin';
