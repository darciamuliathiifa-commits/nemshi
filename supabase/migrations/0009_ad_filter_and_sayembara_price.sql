-- Replace the mandatory admin-validation gate with an automated content
-- filter (src/lib/server/ad-filter.ts): most ads go live immediately as
-- 'Aktif', only ones the filter flags land in 'Menunggu Validasi' for a
-- human to review. flag_reason gives the admin queue context on *why*.
alter table ads add column flag_reason text;

-- Sayembara price + "nego pembayaran di WA" toggle, requested alongside the
-- ad price/currency fields.
alter table sayembara add column price_label text;
alter table sayembara add column wa_nego boolean not null default false;
