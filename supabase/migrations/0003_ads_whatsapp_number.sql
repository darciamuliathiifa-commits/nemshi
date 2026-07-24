-- The "Hubungi Pengiklan" flow contacts a number tied to the specific ad
-- (a seller may want a different WhatsApp number per listing), not just
-- their profile default. Nullable: falls back to profiles.whatsapp_number
-- in application code when an ad doesn't set its own.
alter table ads add column whatsapp_number text;
