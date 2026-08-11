-- Separate from `location` (a general kawasan like "Hay Asyir"), this is an
-- optional full street address for sellers who want to point buyers to an
-- exact spot (a restaurant, a shop) rather than just a neighborhood.
alter table ads add column address text;
