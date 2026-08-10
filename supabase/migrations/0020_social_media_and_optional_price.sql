-- Optional social media link/handle shown on the ad detail page next to the
-- WhatsApp button.
alter table ads add column social_media text;

-- price_label was always required text; it can now be an empty string for
-- listings where a price genuinely doesn't apply (e.g. a community/event
-- posted under "Event & Komunitas") — the UI simply omits the price line
-- when it's empty instead of forcing a placeholder value.
alter table ads alter column price_label drop not null;
alter table ads alter column price_label set default '';
