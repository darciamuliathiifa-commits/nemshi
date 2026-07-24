-- Panel Admin: schema support for ad moderation, reports (already modeled
-- by ad_reports), and Paket Plus status tracking.

-- Ad moderation queue (PRD §7: every ad is validated by an admin before it
-- goes live) needs a pending state distinct from the existing lifecycle
-- statuses.
alter type ad_status add value if not exists 'Menunggu Validasi';

-- Align the Paket Plus schema with the current single-plan model (see
-- src/lib/server/quota-store.ts): one paid plan ("plus"), with separate
-- slot tracking for ads and sayembara instead of the old generic
-- extra_slots/priority_promo_days fields.
alter type plan_id add value if not exists 'plus';

alter table user_quotas rename column extra_slots to extra_ad_slots;
alter table user_quotas rename column free_slot_used to free_ad_slot_used;
alter table user_quotas add column extra_sayembara_slots integer not null default 0;
alter table user_quotas add column free_sayembara_slot_used boolean not null default false;
alter table user_quotas drop column priority_promo_days;
