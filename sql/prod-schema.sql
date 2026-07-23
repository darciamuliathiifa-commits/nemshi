-- =====================================================================
-- Nemshi — skema lengkap (idempotent) untuk Supabase produksi.
-- Aman dijalankan berulang & pada database yang sudah sebagian termigrasi:
-- hanya membuat enum/tabel/kolom yang belum ada.
--
-- Cara pakai: Supabase Dashboard -> SQL Editor -> tempel semua -> Run.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- ENUMS ----------------------------------------------------
do $$ begin create type "verification_status" as enum ('Unverified','Identity_Verified','Skill_Verified'); exception when duplicate_object then null; end $$;
do $$ begin create type "user_role" as enum ('Pelanggan','Penyedia_Jasa'); exception when duplicate_object then null; end $$;
do $$ begin create type "listing_status" as enum ('Pending_Moderation','Active','Expired','Rejected','Suspended'); exception when duplicate_object then null; end $$;
do $$ begin create type "listing_type" as enum ('Offers_Service','Needs_Service'); exception when duplicate_object then null; end $$;
do $$ begin create type "quota_type" as enum ('Listing_Slot','Priority_Slot'); exception when duplicate_object then null; end $$;
do $$ begin create type "price_type" as enum ('Range','Contact'); exception when duplicate_object then null; end $$;
do $$ begin create type "order_product_type" as enum ('Iklan_Tawarkan_Jasa','Cari_Jasa_Prioritas','Paket_Plus','Traktir_Platform'); exception when duplicate_object then null; end $$;
do $$ begin create type "payment_status" as enum ('Menunggu_Pembayaran','Sukses','Gagal'); exception when duplicate_object then null; end $$;
do $$ begin create type "fund_status" as enum ('Ditahan','Dirilis','Dikembalikan'); exception when duplicate_object then null; end $$;
do $$ begin create type "report_reason" as enum ('Penipuan','Informasi_Palsu','Spam','Konten_Tidak_Pantas','Lainnya'); exception when duplicate_object then null; end $$;
do $$ begin create type "report_status" as enum ('Belum_Ditinjau','Ditinjau'); exception when duplicate_object then null; end $$;

-- ---------- TABLES ---------------------------------------------------
create table if not exists "users" (
  "id" uuid primary key default gen_random_uuid(),
  "full_name" text not null,
  "email" text not null unique,
  "avatar_url" text,
  "whatsapp_link" text,
  "phone_number" text,
  "role" "user_role" not null default 'Pelanggan',
  "verification_status" "verification_status" not null default 'Unverified',
  "is_admin" boolean not null default false,
  "is_suspended" boolean not null default false,
  "suspended_reason" text,
  "created_at" timestamptz not null default now()
);

create table if not exists "categories" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "slug" text not null unique,
  "icon" text not null,
  "is_active" boolean not null default true
);

create table if not exists "areas" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null,
  "slug" text not null unique
);

create table if not exists "listings" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "category_id" uuid not null references "categories"("id") on delete restrict,
  "area_id" uuid not null references "areas"("id") on delete restrict,
  "title" text not null,
  "description" text not null,
  "whatsapp_link" text not null,
  "price_type" "price_type" not null default 'Contact',
  "price_min" integer,
  "price_max" integer,
  "status" "listing_status" not null default 'Pending_Moderation',
  "type" "listing_type" not null,
  "created_at" timestamptz not null default now(),
  "published_at" timestamptz,
  "expires_at" timestamptz,
  "is_priority" boolean not null default false,
  "moderation_reason" text,
  "paid_with_quota" boolean not null default false
);

create table if not exists "listing_photos" (
  "id" uuid primary key default gen_random_uuid(),
  "listing_id" uuid not null references "listings"("id") on delete cascade,
  "url" text not null,
  "sort_order" integer not null default 0
);

create table if not exists "user_quotas" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "quota_type" "quota_type" not null,
  "remaining_amount" integer not null default 0,
  "validity_end" timestamptz not null
);

create table if not exists "testimonials" (
  "id" uuid primary key default gen_random_uuid(),
  "reviewee_user_id" uuid not null references "users"("id") on delete cascade,
  "reviewer_name" text not null,
  "rating" integer not null,
  "comment" text not null,
  "is_hidden" boolean not null default false,
  "created_at" timestamptz not null default now()
);

create table if not exists "saved_listings" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "listing_id" uuid not null references "listings"("id") on delete cascade,
  "created_at" timestamptz not null default now(),
  constraint "saved_listings_user_id_listing_id_unique" unique ("user_id","listing_id")
);

create table if not exists "orders" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "listing_id" uuid references "listings"("id") on delete set null,
  "product_type" "order_product_type" not null,
  "amount" integer not null,
  "payment_status" "payment_status" not null default 'Menunggu_Pembayaran',
  "payment_method" text,
  "fund_status" "fund_status",
  "mayar_invoice_id" text,
  "mayar_transaction_id" text,
  "created_at" timestamptz not null default now(),
  "paid_at" timestamptz
);

create table if not exists "admin_activity_logs" (
  "id" uuid primary key default gen_random_uuid(),
  "admin_user_id" uuid not null references "users"("id") on delete cascade,
  "action" text not null,
  "target_type" text not null,
  "target_id" text not null,
  "reason" text,
  "created_at" timestamptz not null default now()
);

create table if not exists "click_analytics" (
  "id" uuid primary key default gen_random_uuid(),
  "listing_id" uuid not null references "listings"("id") on delete cascade,
  "clicked_at" timestamptz not null default now(),
  "user_agent" text
);

create table if not exists "listing_impressions" (
  "id" uuid primary key default gen_random_uuid(),
  "listing_id" uuid not null references "listings"("id") on delete cascade,
  "viewed_at" timestamptz not null default now()
);

create table if not exists "reports" (
  "id" uuid primary key default gen_random_uuid(),
  "listing_id" uuid not null references "listings"("id") on delete cascade,
  "reporter_user_id" uuid not null references "users"("id") on delete cascade,
  "reason" "report_reason" not null,
  "description" text,
  "status" "report_status" not null default 'Belum_Ditinjau',
  "created_at" timestamptz not null default now(),
  "reviewed_at" timestamptz
);

create table if not exists "emergency_contacts" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "full_name" text not null,
  "phone_number" text not null,
  "created_at" timestamptz not null default now()
);

-- ---------- KOLOM SUSULAN (untuk DB yang tabelnya sudah ada tapi versi lama) --
alter table "users"        add column if not exists "avatar_url" text;
alter table "users"        add column if not exists "whatsapp_link" text;
alter table "users"        add column if not exists "phone_number" text;
alter table "users"        add column if not exists "is_admin" boolean not null default false;
alter table "users"        add column if not exists "is_suspended" boolean not null default false;
alter table "users"        add column if not exists "suspended_reason" text;

alter table "listings"     add column if not exists "is_priority" boolean not null default false;
alter table "listings"     add column if not exists "moderation_reason" text;
alter table "listings"     add column if not exists "paid_with_quota" boolean not null default false;
alter table "listings"     add column if not exists "published_at" timestamptz;
alter table "listings"     add column if not exists "expires_at" timestamptz;

alter table "testimonials" add column if not exists "is_hidden" boolean not null default false;

alter table "orders"       add column if not exists "payment_method" text;
alter table "orders"       add column if not exists "fund_status" "fund_status";
alter table "orders"       add column if not exists "mayar_invoice_id" text;
alter table "orders"       add column if not exists "mayar_transaction_id" text;
alter table "orders"       add column if not exists "paid_at" timestamptz;

-- ---------- DATA REFERENSI (kategori & area) -------------------------
-- Wajib ada agar user bisa memasang iklan / membuat permintaan.
-- Aman diulang: ON CONFLICT (slug) DO NOTHING.
insert into "categories" ("name","slug","icon") values
  ('Jasa Titip/Antar','jasa-titip-antar','📦'),
  ('Pindahan','pindahan','🚚'),
  ('Jasa Akademik/Penerjemahan','jasa-akademik-penerjemahan','📚')
on conflict ("slug") do nothing;

insert into "areas" ("name","slug") values
  ('Kairo','kairo'),
  ('Alexandria','alexandria'),
  ('Mansoura','mansoura'),
  ('Tanta','tanta')
on conflict ("slug") do nothing;
