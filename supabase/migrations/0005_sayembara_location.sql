-- The "Pasang Sayembara" form collects a location (matches src/lib/mock-sayembara.ts's
-- Sayembara.location), but the original sayembara table never got the column.
alter table sayembara add column location text;
