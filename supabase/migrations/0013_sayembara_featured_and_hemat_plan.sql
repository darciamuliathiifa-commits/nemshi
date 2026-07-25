-- Sayembara posted by an active Paket Plus subscriber get featured placement
-- (shown in the "Sayembara Unggulan" carousel) for 3 days, same benefit ads
-- already have via ads.featured_until (migration 0012).
alter table sayembara add column featured_until timestamptz;

create index sayembara_featured_until_idx on sayembara (featured_until) where featured_until is not null;

-- New "Hemat" plan: Rp99.000 for 2x ad slots + 1x sayembara slot, each active
-- 2 weeks (same benefit shape as "plus", smaller quota, no priority/featured perk).
alter type plan_id add value if not exists 'hemat';
