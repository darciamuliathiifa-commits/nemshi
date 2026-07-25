-- Track onboarding completion explicitly rather than inferring it from
-- whether whatsapp_number/location happen to be non-empty (fragile — those
-- can legitimately be cleared later without meaning onboarding is "undone").
alter table profiles add column onboarding_completed boolean not null default false;

-- The ad-photos Storage bucket was never actually provisioned, so every
-- photo upload has been failing with "Bucket not found" since the upload
-- flow was built.
insert into storage.buckets (id, name, public)
values ('ad-photos', 'ad-photos', true)
on conflict (id) do nothing;

create policy "Public can view ad photos" on storage.objects
  for select using (bucket_id = 'ad-photos');

create policy "Authenticated users can upload ad photos" on storage.objects
  for insert with check (bucket_id = 'ad-photos' and auth.role() = 'authenticated');

create policy "Owners can delete their ad photos" on storage.objects
  for delete using (bucket_id = 'ad-photos' and auth.uid() = owner);

-- One-off slot purchases (Rp 50.000 for one extra ad slot, Rp 12.000 for
-- one extra sayembara slot) alongside the existing Paket Plus bundle.
alter type plan_id add value if not exists 'extra_ad';
alter type plan_id add value if not exists 'extra_sayembara';
