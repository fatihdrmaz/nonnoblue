-- ===== Profiller =====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  phone text,
  country text,
  preferred_language text default 'tr',
  preferred_currency text default 'EUR',
  marketing_consent boolean default false,
  kvkk_consent_at timestamptz,
  role text default 'customer',
  created_at timestamptz default now()
);
create index on profiles (role);

-- ===== Tekneler =====
create table boats (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null,
  brand text,
  model text,
  year int,
  length_m numeric,
  beam_m numeric,
  cabins int,
  bathrooms int,
  max_guests int,
  marina text,
  deposit_eur int,
  description_tr text,
  description_en text,
  features text[],
  galley text[],
  electrics text[],
  deck text[],
  active boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);
create index on boats (active, display_order);

create table boat_photos (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid references boats(id) on delete cascade,
  storage_path text not null,
  variants jsonb,
  position int not null,
  alt_text text
);
create index on boat_photos (boat_id, position);

create table boat_pricing (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid references boats(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  weekly_price_eur int not null,
  unique (boat_id, start_date)
);
create index on boat_pricing (boat_id, start_date);

create table boat_availability (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid references boats(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  user_id uuid references auth.users(id),
  boat_id uuid references boats(id),
  start_date date not null,
  end_date date not null,
  guest_count int,
  service_type text,
  currency text default 'EUR',
  fx_rate numeric,
  total_amount int not null,
  deposit_amount int not null,
  balance_amount int not null,
  status text default 'pending',
  iyzico_token text,
  iyzico_payment_id text,
  iyzico_conversation_id text,
  iyzico_response jsonb,
  balance_payment_id text,
  balance_paid_at timestamptz,
  contract_accepted_at timestamptz,
  ip_address inet,
  user_agent text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on bookings (status);
create index on bookings (user_id);
create index on bookings (start_date);
create index on bookings (boat_id, start_date, end_date);

create table booking_extras (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  name text not null,
  price_amount int not null,
  qty int default 1
);

create table mail_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  template text not null,
  to_email text not null,
  subject text not null,
  resend_id text,
  status text default 'sent',
  sent_at timestamptz default now()
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  diff jsonb,
  ip inet,
  at timestamptz default now()
);

-- updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;
create trigger bookings_updated before update on bookings
  for each row execute procedure set_updated_at();

-- Müsaitlik kontrol fonksiyonu
create or replace function is_boat_available(
  p_boat_id uuid, p_start date, p_end date
) returns boolean as $$
declare
  conflict_count int;
begin
  select count(*) into conflict_count from (
    select 1 from bookings
      where boat_id = p_boat_id
        and status in ('confirmed','balance_paid','pending','awaiting_3ds')
        and daterange(start_date, end_date, '[]') && daterange(p_start, p_end, '[]')
    union all
    select 1 from boat_availability
      where boat_id = p_boat_id
        and status in ('blocked','maintenance')
        and daterange(start_date, end_date, '[]') && daterange(p_start, p_end, '[]')
  ) t;
  return conflict_count = 0;
end $$ language plpgsql security definer;

-- RLS
alter table profiles enable row level security;
create policy "own profile read" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

alter table bookings enable row level security;
create policy "own bookings read" on bookings for select using (auth.uid() = user_id);

alter table boats enable row level security;
create policy "boats public read" on boats for select using (active);

alter table boat_photos enable row level security;
create policy "photos public read" on boat_photos for select using (true);

alter table boat_pricing enable row level security;
create policy "pricing public read" on boat_pricing for select using (true);

-- Profile auto-create trigger
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, email, full_name, preferred_language)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'tr')
  );
  return new;
end $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();
