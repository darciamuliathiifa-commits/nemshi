-- Listings used to go stale silently: the daily cron flipped them straight to
-- "Kedaluwarsa" with no warning, even though extending is free. The same cron
-- now sends a heads-up first, and this column is how it remembers it already
-- did — otherwise every nightly run would re-notify the same owner.
--
-- Extending a listing clears this back to null (see the extend routes), so the
-- next expiry window earns a fresh reminder.
alter table ads add column expiry_reminded_at timestamptz;
alter table sayembara add column expiry_reminded_at timestamptz;

-- The reminder sweep looks up active listings by expires_at, same access
-- pattern as the existing expiry sweep.
create index ads_expiry_reminder_idx on ads (expires_at)
  where status = 'Aktif' and expiry_reminded_at is null;
create index sayembara_expiry_reminder_idx on sayembara (expires_at)
  where status = 'Aktif' and expiry_reminded_at is null;
