-- Nemshi — development/test seed data
-- Mirrors src/lib/mock-ads.ts so the real database shows the same catalog
-- the frontend mock currently renders. Local/dev only: creates matching
-- auth.users rows so the profiles/ads foreign keys are satisfiable outside
-- of a real Google OAuth sign-in. Safe to re-run (ON CONFLICT DO NOTHING).

create extension if not exists pgcrypto;

-- 1. Fake auth users (one per seller in the mock catalog).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
)
values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'ahmad.fauzan@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Ahmad Fauzan"}', '2022-03-10', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'siti.nuraini@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Siti Nur Aini"}', '2023-02-14', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'dapur.rindukampung@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Dapur Rindu Kampung"}', '2021-06-01', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'kalam.studio@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Kalam Studio"}', '2023-05-20', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'rizky.pratama@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Rizky Pratama"}', '2020-01-15', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'muhammad.ridho@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Muhammad Ridho"}', '2019-09-05', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'fajar.nugraha@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Fajar Nugraha"}', '2022-08-22', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'nadia.ayu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Nadia Ayu"}', '2021-04-11', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'toko.rempahibu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Toko Rempah Ibu"}', '2020-11-30', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'bayu.kreatif@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Bayu Kreatif"}', '2023-01-08', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'hasan.albana@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Hasan Albana"}', '2018-07-19', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'barbershop.abu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Barbershop Abu"}', '2022-02-27', now(), '', '', '', '')
on conflict (id) do nothing;

-- 2. Public profiles matching those auth users.
insert into profiles (id, name, email, location, whatsapp_number, created_at)
values
  ('10000000-0000-0000-0000-000000000001', 'Ahmad Fauzan', 'ahmad.fauzan@seed.nemshi.local', 'Nasr City, Kairo', '201012345001', '2022-03-10'),
  ('10000000-0000-0000-0000-000000000002', 'Siti Nur Aini', 'siti.nuraini@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345002', '2023-02-14'),
  ('10000000-0000-0000-0000-000000000003', 'Dapur Rindu Kampung', 'dapur.rindukampung@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345003', '2021-06-01'),
  ('10000000-0000-0000-0000-000000000004', 'Kalam Studio', 'kalam.studio@seed.nemshi.local', 'Online', '201012345004', '2023-05-20'),
  ('10000000-0000-0000-0000-000000000005', 'Rizky Pratama', 'rizky.pratama@seed.nemshi.local', 'Madinat Nasr, Kairo', '201012345005', '2020-01-15'),
  ('10000000-0000-0000-0000-000000000006', 'Muhammad Ridho', 'muhammad.ridho@seed.nemshi.local', 'Hay Sabi'', Kairo', '201012345006', '2019-09-05'),
  ('10000000-0000-0000-0000-000000000007', 'Fajar Nugraha', 'fajar.nugraha@seed.nemshi.local', 'Nasr City, Kairo', '201012345007', '2022-08-22'),
  ('10000000-0000-0000-0000-000000000008', 'Nadia Ayu', 'nadia.ayu@seed.nemshi.local', 'Online', '201012345008', '2021-04-11'),
  ('10000000-0000-0000-0000-000000000009', 'Toko Rempah Ibu', 'toko.rempahibu@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345009', '2020-11-30'),
  ('10000000-0000-0000-0000-000000000010', 'Bayu Kreatif', 'bayu.kreatif@seed.nemshi.local', 'Online', '201012345010', '2023-01-08'),
  ('10000000-0000-0000-0000-000000000011', 'Hasan Albana', 'hasan.albana@seed.nemshi.local', 'Madinat Nasr, Kairo', '201012345011', '2018-07-19'),
  ('10000000-0000-0000-0000-000000000012', 'Barbershop Abu', 'barbershop.abu@seed.nemshi.local', 'Hay Sabi'', Kairo', '201012345012', '2022-02-27')
on conflict (id) do nothing;

-- 3. Sample ads (Disabled so only real published ads appear on the platform)
-- insert into ads ...

