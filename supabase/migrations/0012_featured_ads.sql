-- Ads posted by an active Paket Plus subscriber get featured placement
-- (shown in the "Iklan Unggulan" carousel) for 3 days before dropping into
-- the regular listing — a real Plus benefit, previously just a hardcoded
-- `featured: false` with no underlying data.
alter table ads add column featured_until timestamptz;

create index ads_featured_until_idx on ads (featured_until) where featured_until is not null;
