-- Nemshi — initial schema
-- Mirrors the TypeScript contracts in src/lib/types.ts, src/lib/upload.ts,
-- and src/lib/server/quota-store.ts. Auth is handled by Supabase Auth
-- (Google OAuth); auth.users.id is the canonical user id referenced below.

create type ad_kind as enum ('produk', 'jasa');

create type ad_category as enum (
  'Pendidikan',
  'Makanan & Minuman',
  'Kreatif & Digital',
  'Bantuan & Layanan Harian',
  'Barang Baru & Bekas',
  'Lainnya'
);

create type ad_status as enum ('Aktif', 'Terjual', 'Selesai', 'Kedaluwarsa', 'Ditutup');
create type ad_condition as enum ('Baru', 'Bekas');
create type plan_id as enum ('bulanan', 'tahunan');
create type report_status as enum ('Baru', 'Ditinjau', 'Selesai');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text,
  location text,
  whatsapp_number text,
  created_at timestamptz not null default now()
);

create table ads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  kind ad_kind not null,
  title text not null,
  description text not null,
  category ad_category not null,
  price_label text not null,
  location text not null,
  status ad_status not null default 'Aktif',
  condition ad_condition,
  delivery_method text,
  scope text,
  estimated_duration text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ads_owner_id_idx on ads (owner_id);
create index ads_category_idx on ads (category);
create index ads_status_idx on ads (status);

create table ad_photos (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references ads (id) on delete cascade,
  url text not null,
  position smallint not null default 0
);

create index ad_photos_ad_id_idx on ad_photos (ad_id);

create table saved_ads (
  user_id uuid not null references profiles (id) on delete cascade,
  ad_id uuid not null references ads (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, ad_id)
);

create table ad_reports (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references ads (id) on delete cascade,
  reporter_id uuid not null references profiles (id) on delete cascade,
  reason text not null,
  status report_status not null default 'Baru',
  created_at timestamptz not null default now()
);

create index ad_reports_ad_id_idx on ad_reports (ad_id);

-- Freemium quota + Paket Plus subscription state, activated by the Mayar
-- webhook handler (src/app/api/mayar/webhook/route.ts).
create table user_quotas (
  user_id uuid primary key references profiles (id) on delete cascade,
  free_slot_used boolean not null default false,
  extra_slots integer not null default 0,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  plan_expires_at timestamptz,
  priority_promo_days integer not null default 0
);

create table mayar_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  plan_id plan_id not null,
  amount integer not null,
  status text not null default 'success',
  created_at timestamptz not null default now()
);

-- Sayembara Jasa: service requests posted by users, with a registration
-- form for prospective providers (name + contact required).
create table sayembara (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  description text not null,
  category ad_category not null,
  status ad_status not null default 'Aktif',
  created_at timestamptz not null default now()
);

create table sayembara_applicants (
  id uuid primary key default gen_random_uuid(),
  sayembara_id uuid not null references sayembara (id) on delete cascade,
  applicant_name text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

create index sayembara_applicants_sayembara_id_idx on sayembara_applicants (sayembara_id);

-- Row Level Security
alter table profiles enable row level security;
alter table ads enable row level security;
alter table ad_photos enable row level security;
alter table saved_ads enable row level security;
alter table ad_reports enable row level security;
alter table user_quotas enable row level security;
alter table mayar_transactions enable row level security;
alter table sayembara enable row level security;
alter table sayembara_applicants enable row level security;

create policy "Profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Ads are viewable by everyone" on ads
  for select using (true);
create policy "Users can insert own ads" on ads
  for insert with check (auth.uid() = owner_id);
create policy "Users can update own ads" on ads
  for update using (auth.uid() = owner_id);
create policy "Users can delete own ads" on ads
  for delete using (auth.uid() = owner_id);

create policy "Ad photos are viewable by everyone" on ad_photos
  for select using (true);
create policy "Owners can manage own ad photos" on ad_photos
  for all using (
    auth.uid() = (select owner_id from ads where ads.id = ad_photos.ad_id)
  );

create policy "Users can view own saved ads" on saved_ads
  for select using (auth.uid() = user_id);
create policy "Users can manage own saved ads" on saved_ads
  for all using (auth.uid() = user_id);

create policy "Users can insert reports" on ad_reports
  for insert with check (auth.uid() = reporter_id);
create policy "Users can view own reports" on ad_reports
  for select using (auth.uid() = reporter_id);

create policy "Users can view own quota" on user_quotas
  for select using (auth.uid() = user_id);

create policy "Users can view own transactions" on mayar_transactions
  for select using (auth.uid() = user_id);

create policy "Sayembara are viewable by everyone" on sayembara
  for select using (true);
create policy "Users can manage own sayembara" on sayembara
  for all using (auth.uid() = owner_id);

create policy "Sayembara owners can view applicants" on sayembara_applicants
  for select using (
    auth.uid() = (select owner_id from sayembara where sayembara.id = sayembara_applicants.sayembara_id)
  );
create policy "Anyone can register as an applicant" on sayembara_applicants
  for insert with check (true);
