-- Migration 0019 already ran with the old label. Renaming the enum value
-- in place (rather than adding a new one) keeps any ads/sayembara already
-- posted under it correctly labeled, instead of orphaning them.
alter type ad_category rename value 'Komunitas & Organisasi' to 'Event & Komunitas';
